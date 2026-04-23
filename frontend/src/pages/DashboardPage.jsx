import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPieChart } from "react-icons/fi";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getDashboardSummary, getSpendingByCategory, getIncomeVsExpense, getRecentTransactions, getBudgetOverview } from "../services/dashboardService";
import { formatCurrency, formatDate } from "../utils/formatters";
import { CHART_COLORS } from "../utils/constants";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";

const DashboardPage = () => {
    const [summary, setSummary] = useState(null);
    const [spending, setSpending] = useState([]);
    const [incomeExpense, setIncomeExpense] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [summaryData, spendingData, incomeExpenseData, transactionsData, budgetsData] = await Promise.all([
                getDashboardSummary(),
                getSpendingByCategory(),
                getIncomeVsExpense(),
                getRecentTransactions(5),
                getBudgetOverview(),
            ]);
            
            setSummary(summaryData);
            setSpending(spendingData);
            setIncomeExpense(incomeExpenseData);
            setRecentTransactions(transactionsData);
            setBudgets(budgetsData);
        } catch (error) {
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Balance</p>
                            <p className="text-2xl font-bold text-gray-800">{formatCurrency(summary?.totalBalance || 0)}</p>
                        </div>
                        <FiDollarSign className="w-10 h-10 text-primary-500" />
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Income (This Month)</p>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(summary?.totalIncome || 0)}</p>
                        </div>
                        <FiTrendingUp className="w-10 h-10 text-green-500" />
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Expenses (This Month)</p>
                            <p className="text-2xl font-bold text-red-600">{formatCurrency(summary?.totalExpense || 0)}</p>
                        </div>
                        <FiTrendingDown className="w-10 h-10 text-red-500" />
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Net Savings</p>
                            <p className="text-2xl font-bold text-blue-600">{formatCurrency(summary?.netSavings || 0)}</p>
                        </div>
                        <FiPieChart className="w-10 h-10 text-blue-500" />
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Spending by Category">
                    {spending.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={spending} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={100} label>
                                    {spending.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500 py-10">No spending data available</p>
                    )}
                </Card>

                <Card title="Income vs Expense">
                    {incomeExpense.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={incomeExpense}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="income" fill="#10B981" />
                                <Bar dataKey="expense" fill="#EF4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500 py-10">No data available</p>
                    )}
                </Card>
            </div>

            {/* Budget Overview */}
            {budgets.length > 0 && (
                <Card title="Budget Overview">
                    <div className="space-y-4">
                        {budgets.map((budget) => (
                            <div key={budget._id}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">{budget.category}</span>
                                    <span className={budget.isOverBudget ? "text-red-600" : "text-gray-600"}>
                                        {formatCurrency(budget.currentSpent)} / {formatCurrency(budget.monthlyLimit)}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${budget.isOverBudget ? "bg-red-500" : budget.isNearLimit ? "bg-yellow-500" : "bg-green-500"}`}
                                        style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Recent Transactions */}
            <Card title="Recent Transactions">
                {recentTransactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">Date</th>
                                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">Merchant</th>
                                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">Category</th>
                                    <th className="text-right py-2 px-4 text-sm font-medium text-gray-600">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTransactions.map((transaction) => (
                                    <tr key={transaction._id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm">{formatDate(transaction.date)}</td>
                                        <td className="py-3 px-4 text-sm">{transaction.merchant || transaction.description}</td>
                                        <td className="py-3 px-4 text-sm">{transaction.category}</td>
                                        <td className={`py-3 px-4 text-sm text-right font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                                            {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-10">No transactions yet</p>
                )}
            </Card>
        </div>
    );
};

export default DashboardPage;
