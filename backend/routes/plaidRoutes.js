const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

const router = express.Router();

const configuration = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || "sandbox"],
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
            "PLAID-SECRET": process.env.PLAID_SECRET,
        },
    },
});

const plaidClient = new PlaidApi(configuration);

// Create Link Token
router.post("/create-link-token", protect, async (req, res) => {
    try {
        const response = await plaidClient.linkTokenCreate({
            user: { client_user_id: req.user.id.toString() },
            client_name: "PFM Dashboard",
            products: ["transactions"],
            country_codes: ["US"],
            language: "en",
        });
        
        res.json({ link_token: response.data.link_token });
    } catch (error) {
        console.error("Error creating link token:", error);
        res.status(500).json({ message: "Failed to create link token", error: error.message });
    }
});

// Exchange Public Token
router.post("/exchange-public-token", protect, async (req, res) => {
    try {
        const { public_token } = req.body;
        
        if (!public_token) {
            return res.status(400).json({ message: "Public token is required" });
        }
        
        const response = await plaidClient.itemPublicTokenExchange({ public_token });
        const access_token = response.data.access_token;
        
        // Get account information
        const accountsResponse = await plaidClient.accountsGet({ access_token });
        const accounts = accountsResponse.data.accounts;
        
        // Store accounts in database
        const Account = require("../models/Account");
        const savedAccounts = [];
        
        // Helper function to map Plaid account types to our enum
        const mapAccountType = (type, subtype) => {
            const typeMap = {
                'depository': subtype || 'checking',
                'credit': 'credit',
                'loan': 'loan',
                'investment': 'investment',
                'brokerage': 'investment',
            };
            
            const validTypes = ["checking", "savings", "credit", "investment", "loan", "cd", "money market", "paypal", "prepaid", "other"];
            const mappedType = typeMap[type] || subtype || type || 'other';
            
            // If the mapped type is in our valid types, use it, otherwise use 'other'
            return validTypes.includes(mappedType) ? mappedType : 'other';
        };
        
        for (const account of accounts) {
            const newAccount = await Account.create({
                userId: req.user.id,
                plaidAccountId: account.account_id,
                plaidAccessToken: access_token,
                bankName: accountsResponse.data.item.institution_id || "Unknown Bank",
                accountName: account.name,
                accountType: mapAccountType(account.type, account.subtype),
                balance: account.balances.current || 0,
                currency: account.balances.iso_currency_code || "USD",
                mask: account.mask || "",
                lastSynced: new Date(),
            });
            
            savedAccounts.push(newAccount);
        }
        
        // Fetch initial transactions
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        
        const transactionsResponse = await plaidClient.transactionsGet({
            access_token,
            start_date: startDate.toISOString().split('T')[0],
            end_date: new Date().toISOString().split('T')[0],
        });
        
        // Store transactions
        const Transaction = require("../models/Transaction");
        
        for (const transaction of transactionsResponse.data.transactions) {
            const account = savedAccounts.find(acc => acc.plaidAccountId === transaction.account_id);
            
            if (account) {
                await Transaction.create({
                    userId: req.user.id,
                    accountId: account._id,
                    plaidTransactionId: transaction.transaction_id,
                    amount: Math.abs(transaction.amount),
                    currency: transaction.iso_currency_code || "USD",
                    description: transaction.name,
                    merchant: transaction.merchant_name || transaction.name,
                    category: transaction.category?.[0] || "Other",
                    type: transaction.amount < 0 ? "expense" : "income",
                    date: new Date(transaction.date),
                    pending: transaction.pending,
                });
            }
        }
        
        res.json({ 
            message: "Accounts connected successfully", 
            accounts: savedAccounts,
            transactionsCount: transactionsResponse.data.transactions.length 
        });
    } catch (error) {
        console.error("Error exchanging public token:", error);
        res.status(500).json({ message: "Failed to exchange token", error: error.message });
    }
});

// Sync transactions for all accounts
router.post("/sync-transactions", protect, async (req, res) => {
    try {
        const Account = require("../models/Account");
        const Transaction = require("../models/Transaction");
        
        const accounts = await Account.find({ userId: req.user.id, isActive: true }).select("+plaidAccessToken");
        
        let totalNewTransactions = 0;
        
        for (const account of accounts) {
            if (!account.plaidAccessToken) continue;
            
            const startDate = account.lastSynced || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            
            const transactionsResponse = await plaidClient.transactionsGet({
                access_token: account.plaidAccessToken,
                start_date: startDate.toISOString().split('T')[0],
                end_date: new Date().toISOString().split('T')[0],
            });
            
            for (const transaction of transactionsResponse.data.transactions) {
                const exists = await Transaction.findOne({ plaidTransactionId: transaction.transaction_id });
                
                if (!exists) {
                    await Transaction.create({
                        userId: req.user.id,
                        accountId: account._id,
                        plaidTransactionId: transaction.transaction_id,
                        amount: Math.abs(transaction.amount),
                        currency: transaction.iso_currency_code || "USD",
                        description: transaction.name,
                        merchant: transaction.merchant_name || transaction.name,
                        category: transaction.category?.[0] || "Other",
                        type: transaction.amount < 0 ? "expense" : "income",
                        date: new Date(transaction.date),
                        pending: transaction.pending,
                    });
                    
                    totalNewTransactions++;
                }
            }
            
            // Update account balance and last synced
            const accountsResponse = await plaidClient.accountsGet({ access_token: account.plaidAccessToken });
            const updatedAccount = accountsResponse.data.accounts.find(acc => acc.account_id === account.plaidAccountId);
            
            if (updatedAccount) {
                account.balance = updatedAccount.balances.current || 0;
            }
            
            account.lastSynced = new Date();
            await account.save();
        }
        
        res.json({ 
            message: "Transactions synced successfully", 
            newTransactions: totalNewTransactions 
        });
    } catch (error) {
        console.error("Error syncing transactions:", error);
        res.status(500).json({ message: "Failed to sync transactions", error: error.message });
    }
});

module.exports = router;
