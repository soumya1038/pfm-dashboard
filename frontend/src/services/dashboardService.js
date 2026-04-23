import api from "./api";

export const getDashboardSummary = async () => {
    const response = await api.get("/dashboard/summary");
    return response.data;
};

export const getSpendingByCategory = async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await api.get("/dashboard/spending-by-category", { params });
    return response.data;
};

export const getIncomeVsExpense = async () => {
    const response = await api.get("/dashboard/income-vs-expense");
    return response.data;
};

export const getRecentTransactions = async (limit = 5) => {
    const response = await api.get("/dashboard/recent-transactions", { params: { limit } });
    return response.data;
};

export const getBudgetOverview = async () => {
    const response = await api.get("/dashboard/budget-overview");
    return response.data;
};
