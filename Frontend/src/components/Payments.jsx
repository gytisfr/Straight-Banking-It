export default function Payments() {
  const transactions = [
    {
      id: 1,
      type: "payment",
      name: "John Smith",
      reference: "Rent April",
      amount: -750,
      date: "2026-04-01",
    },
    {
      id: 2,
      type: "deposit",
      name: "Main Account",
      reference: "Cash Deposit",
      amount: +500,
      date: "2026-04-03",
    },
    {
      id: 3,
      type: "withdraw",
      name: "Savings Account",
      reference: "Transfer Out",
      amount: -200,
      date: "2026-04-05",
    },
    {
      id: 4,
      type: "payment",
      name: "Tesco",
      reference: "Groceries",
      amount: -54.2,
      date: "2026-04-06",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">
        Recent Activity
      </h1>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between px-5 py-4 border-b border-slate-100 last:border-none hover:bg-slate-50 transition"
          >

            {/* Left */}
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800">
                {tx.name}
              </span>
              <span className="text-sm text-slate-500">
                {tx.reference}
              </span>
            </div>

            {/* Right */}
            <div className="flex flex-col items-end">
              <span
                className={`font-semibold ${
                  tx.amount > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {tx.amount > 0 ? "+" : ""}£{Math.abs(tx.amount)}
              </span>
              <span className="text-sm text-slate-400">
                {tx.date}
              </span>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}