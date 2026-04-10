export default function Payments() {

  const transactions = [
    {
      id: 1,
      type: "payment",
      name: "John Smith",
      reference: "Rent April",
      amount: -750,
      timestamp: 1712678400,
    },
    {
      id: 2,
      type: "deposit",
      name: "Main Account",
      reference: "Cash Deposit",
      amount: +500,
      timestamp: 1712851200,
    },
    {
      id: 3,
      type: "withdraw",
      name: "Savings Account",
      reference: "Transfer Out",
      amount: -200,
      timestamp: 1712937600,
    },
    {
      id: 4,
      type: "payment",
      name: "Tesco",
      reference: "Groceries",
      amount: -54.2,
      timestamp: 1713024000,
    },
  ];

  // ✅ Format Unix timestamp
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp * 1000);

    const formattedDate = date.toLocaleDateString("en-GB");
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formattedDate} • ${formattedTime}`;
  };

  // ✅ Icons
  const getIcon = (tx) => {
    const base = "w-5 h-5";
    const ref = tx.reference.toLowerCase();
    const name = tx.name.toLowerCase();

    if (ref.includes("grocer") || name.includes("tesco")) {
      return (
        <svg className={base} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
          <circle cx="7" cy="21" r="1" />
          <circle cx="17" cy="21" r="1" />
        </svg>
      );
    }

    if (ref.includes("rent")) {
      return (
        <svg className={base} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 12l9-9 9 9" />
          <path d="M9 21V9h6v12" />
        </svg>
      );
    }

    if (tx.type === "deposit") {
      return (
        <svg className={base} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 5v14" />
          <path d="M19 12l-7 7-7-7" />
        </svg>
      );
    }

    if (tx.type === "withdraw") {
      return (
        <svg className={base} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      );
    }

    return (
      <svg className={base} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    );
  };

  // 📊 Stats
  const spending = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const avgSpend = Math.abs(spending / transactions.length).toFixed(2);

  const total = income + Math.abs(spending);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {/* ================= TRANSACTIONS ================= */}
      <div>
        <h1 className="text-3xl font-bold mb-6">Recent Activity</h1>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between px-5 py-4 border-b last:border-none hover:bg-slate-50 transition"
            >

              {/* LEFT */}
              <div className="flex items-center gap-3">

                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  {getIcon(tx)}
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    {tx.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {tx.reference}
                  </p>
                </div>

              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p className={`font-semibold ${tx.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                  {tx.amount > 0 ? "+" : ""}£{Math.abs(tx.amount)}
                </p>
                <p className="text-sm text-slate-400">
                  {formatDateTime(tx.timestamp)}
                </p>
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* ================= INSIGHTS ================= */}
      <div>
        <h1 className="text-3xl font-bold mb-6">Insights</h1>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">

          {/* Total Spending */}
          <div>
            <p className="text-sm text-slate-400">Total Spending</p>
            <h2 className="text-2xl font-bold text-red-500">
              £{Math.abs(spending).toFixed(2)}
            </h2>
          </div>

          {/* Total Income */}
          <div>
            <p className="text-sm text-slate-400">Total Income</p>
            <h2 className="text-2xl font-bold text-green-500">
              £{income.toFixed(2)}
            </h2>
          </div>

          {/* Average */}
          <div>
            <p className="text-sm text-slate-400">Avg Transaction Spend</p>
            <h2 className="text-2xl font-bold">
              £{avgSpend}
            </h2>
          </div>

          {/* ================= BAR ================= */}
          <div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">

              {/* Spending */}
              <div
                className="bg-red-400 transition-all duration-500"
                style={{
                  width: `${(Math.abs(spending) / total) * 100 || 0}%`,
                }}
              ></div>

              {/* Income */}
              <div
                className="bg-green-400 transition-all duration-500"
                style={{
                  width: `${(income / total) * 100 || 0}%`,
                }}
              ></div>

            </div>

            {/* Labels */}
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Spending</span>
              <span>Income</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}