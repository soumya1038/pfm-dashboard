import api from "./api";

export const getAllAccounts = async () => {
    const response = await api.get("/accounts");
    return response.data;
};

export const getAccount = async (id) => {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
};

export const createLinkToken = async () => {
    const response = await api.post("/plaid/create-link-token");
    return response.data;
};

export const exchangePublicToken = async (publicToken) => {
    const response = await api.post("/plaid/exchange-public-token", { public_token: publicToken });
    return response.data;
};

export const syncTransactions = async () => {
    const response = await api.post("/plaid/sync-transactions");
    return response.data;
};

export const deleteAccount = async (id) => {
    const response = await api.delete(`/accounts/${id}`);
    return response.data;
};
