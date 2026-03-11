const Dashboard = () => {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-gray-600">
          Your financial overview will appear here once accounts are connected.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase text-gray-500">Net Worth</p>
          <p className="mt-2 text-xl font-semibold">$0.00</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase text-gray-500">Monthly Spend</p>
          <p className="mt-2 text-xl font-semibold">$0.00</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase text-gray-500">Budgets</p>
          <p className="mt-2 text-xl font-semibold">0 active</p>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
