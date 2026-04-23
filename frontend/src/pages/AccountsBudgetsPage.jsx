import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { usePlaidLink } from "react-plaid-link";
import { FiPlus, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { getAllAccounts, createLinkToken, exchangePublicToken, syncTransactions, deleteAccount } from "../services/accountService";
import { getAllBudgets, createBudget, updateBudget, deleteBudget } from "../services/budgetService";
import { formatCurrency, formatDate } from "../utils/formatters";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Input from "../components/common/Input";
import Loader from "../components/common/Loader";

const AccountsBudgetsPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [linkToken, setLinkToken] = useState(null);
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [budgetForm, setBudgetForm] = useState({ category: "", monthlyLimit: "", month: new Date().getMonth() + 1, year: new Date().getFullYear() });

    useEffect(() => {
        fetchData();
        fetchLinkToken();
    }, []);

    const fetchData = async () => {
        try {
            const [accountsData, budgetsData] = await Promise.all([getAllAccounts(), getAllBudgets()]);
            setAccounts(accountsData);
            setBudgets(budgetsData);
        } catch (error) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const fetchLinkToken = async () => {
        try {
            const data = await createLinkToken();
            setLinkToken(data.link_token);
        } catch (error) {
            console.error("Failed to create link token");
        }
    };

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: async (public_token) => {
            try {
                await exchangePublicToken(public_token);
                toast.success("Account connected successfully!");
                fetchData();
            } catch (error) {
                toast.error("Failed to connect account");
            }
        },
    });

    const handleSync = async () => {
        setSyncing(true);
        try {
            await syncTransactions();
            toast.success("Transactions synced successfully!");
            fetchData();
        } catch (error) {
            toast.error("Failed to sync transactions");
        } finally {
            setSyncing(false);
        }
    };

    const handleDeleteAccount = async (id) => {
        if (!window.confirm("Are you sure you want to remove this account?")) return;
        try {
            await deleteAccount(id);
            toast.success("Account removed successfully");
            fetchData();
        } catch (error) {
            toast.error("Failed to remove account");
        }
    };

    const handleBudgetSubmit = async (e) => {
        e.preventDefault();
        try {
            await createBudget(budgetForm);
            toast.success("Budget created successfully!");
            setShowBudgetModal(false);
            setBudgetForm({ category: "", monthlyLimit: "", month: new Date().getMonth() + 1, year: new Date().getFullYear() });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create budget");
        }
    };

    const handleDeleteBudget = async (id) => {
        if (!window.confirm("Are you sure you want to delete this budget?")) return;
        try {
            await deleteBudget(id);
            toast.success("Budget deleted successfully");
            fetchData();
        } catch (error) {
            toast.error("Failed to delete budget");
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Accounts & Budgets</h1>

            {/* Accounts Section */}
            <Card
                title="Connected Accounts"
                action={
                    <div className="flex gap-2 flex-wrap">
                        <Button onClick={handleSync} variant="secondary" size="md" icon={FiRefreshCw} disabled={syncing}>
                            {syncing ? "Syncing..." : "Sync"}
                        </Button>
                        <Button onClick={() => open()} variant="primary" size="md" icon={FiPlus} disabled={!ready}>
                            Connect Account
                        </Button>
                    </div>
                }
            >
                {accounts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {accounts.map((account) => (
                            <div key={account._id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{account.bankName}</h3>
                                        <p className="text-sm text-gray-600">{account.accountType} •••• {account.mask}</p>
                                    </div>
                                    <button onClick={() => handleDeleteAccount(account._id)} className="text-red-500 hover:text-red-700">
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">{formatCurrency(account.balance, account.currency)}</p>
                                {account.lastSynced && (
                                    <p className="text-xs text-gray-500 mt-2">Last synced: {formatDate(account.lastSynced)}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-10">No accounts connected yet. Click "Connect Account" to get started.</p>
                )}
            </Card>

            {/* Budgets Section */}
            <Card
                title="Budgets"
                action={
                    <Button onClick={() => setShowBudgetModal(true)} variant="primary" size="md" icon={FiPlus}>
                        Create Budget
                    </Button>
                }
            >
                {budgets.length > 0 ? (
                    <div className="space-y-4">
                        {budgets.map((budget) => {
                            const percentage = (budget.currentSpent / budget.monthlyLimit) * 100;
                            return (
                                <div key={budget._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{budget.category}</h3>
                                            <p className="text-sm text-gray-600">
                                                {budget.month}/{budget.year}
                                            </p>
                                        </div>
                                        <button onClick={() => handleDeleteBudget(budget._id)} className="text-red-500 hover:text-red-700">
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{formatCurrency(budget.currentSpent)} spent</span>
                                        <span>{formatCurrency(budget.monthlyLimit)} limit</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${percentage > 100 ? "bg-red-500" : percentage >= budget.alertThreshold ? "bg-yellow-500" : "bg-green-500"}`}
                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-10">No budgets created yet. Click "Create Budget" to get started.</p>
                )}
            </Card>

            {/* Budget Modal */}
            <Modal isOpen={showBudgetModal} onClose={() => setShowBudgetModal(false)} title="Create Budget">
                <form onSubmit={handleBudgetSubmit} className="space-y-4">
                    <Input
                        label="Category"
                        type="text"
                        name="category"
                        value={budgetForm.category}
                        onChange={(e) => setBudgetForm(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Food & Dining"
                        required
                    />
                    <Input
                        label="Monthly Limit"
                        type="number"
                        name="monthlyLimit"
                        value={budgetForm.monthlyLimit}
                        onChange={(e) => setBudgetForm(prev => ({ ...prev, monthlyLimit: e.target.value }))}
                        placeholder="e.g., 500"
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Month"
                            type="number"
                            name="month"
                            value={budgetForm.month}
                            onChange={(e) => setBudgetForm(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                            min="1"
                            max="12"
                            required
                        />
                        <Input
                            label="Year"
                            type="number"
                            name="year"
                            value={budgetForm.year}
                            onChange={(e) => setBudgetForm(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                            min="2020"
                            max="2030"
                            required
                        />
                    </div>
                    <Button type="submit" variant="primary" className="w-full">
                        Create Budget
                    </Button>
                </form>
            </Modal>
        </div>
    );
};

export default AccountsBudgetsPage;
