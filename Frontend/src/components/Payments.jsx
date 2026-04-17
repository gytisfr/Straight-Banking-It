import { useEffect, useState } from "react";

export default function Payments() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    try {
      const [accountsRes, transactionsRes] = await Promise.all([
        fetch("http://127.0.0.1:5089/account/fetch", {
          headers: { token },
        }),
        fetch("http://127.0.0.1:5089/transactions", {
          headers: { token },
        }),
      ]);

      const accountsData = await accountsRes.json();
      const transactionsData = await transactionsRes.json();

      if (accountsData.code !== 200 || transactionsData.code !== 200) {
        console.error("Failed to fetch accounts or transactions");
        return;
      }

      const userAccounts = accountsData.data || [];
      setAccounts(userAccounts);

      const accountIds = userAccounts.map((acc) => Number(acc.accountNumber));
      const accountNameMap = Object.fromEntries(
        userAccounts.map((acc, index) => [
          Number(acc.accountNumber),
          index === 0
            ? "Main Account"
            : index === 1
            ? "Savings"
            : `Account ${acc.accountNumber}`,
        ])
      );

      const mapped = (transactionsData.data || []).map((tx) => {
        const id = tx.id;
        const from = Number(tx.parentAccountId);
        const to = Number(tx.toAccountId);
        const timestamp = Math.floor(Number(tx.date || 0));
        const rawAmount = Number(tx.amount || 0);
        const reference = tx.reference || "Transaction";
        const lowerReference = reference.toLowerCase();

        const isFromMine = accountIds.includes(from);
        const isToMine = accountIds.includes(to);

        let type = "payment";
        let name = reference;
        let subtitle = reference;
        let displayAmount = rawAmount;
        let tone = rawAmount >= 0 ? "income" : "spending";

        if (lowerReference.includes("deposit")) {
          type = "deposit";
          name = "Deposit";
          subtitle = "Money added";
          displayAmount = Math.abs(rawAmount);
          tone = "income";
        } else if (lowerReference.includes("withdraw")) {
          type = "withdraw";
          name = "Withdrawal";
          subtitle = "Money taken out";
          displayAmount = -Math.abs(rawAmount);
          tone = "spending";
        } else if (from !== to) {
          type = "transfer";

          if (isFromMine && !isToMine) {
            name = `Transfer to ${accountNameMap[to] || `Account ${to}`}`;
            subtitle = "Outgoing transfer";
            displayAmount = -Math.abs(rawAmount);
            tone = "spending";
          } else if (!isFromMine && isToMine) {
            name = `Transfer from ${accountNameMap[from] || `Account ${from}`}`;
            subtitle = "Incoming transfer";
            displayAmount = Math.abs(rawAmount);
            tone = "income";
          } else if (isFromMine && isToMine) {
            name = `Transfer from ${accountNameMap[from] || `Account ${from}`} to ${accountNameMap[to] || `Account ${to}`}`;
            subtitle = "Between your accounts";
            displayAmount = -Math.abs(rawAmount);
            tone = "spending";
          } else {
            name = reference;
            subtitle = "Transfer";
            displayAmount = rawAmount;
            tone = rawAmount >= 0 ? "income" : "spending";
          }
        } else if (lowerReference.includes("loan")) {
          type = "loan";
          name = "Loan";
          subtitle = "Loan credited";
          displayAmount = Math.abs(rawAmount);
          tone = "income";
        }

        return {
          id,
          type,
          name,
          subtitle,
          reference,
          amount: displayAmount,
          timestamp,
          tone,
        };
      });

      setTransactions(mapped);
    } catch (err) {
      console.error("Error fetching payments data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp * 1000);

    return `${date.toLocaleDateString("en-GB")} • ${date.toLocaleTimeString(
      "en-GB",
      { hour: "2-digit", minute: "2-digit" }
    )}`;
  };

  const spending = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const avgSpend =
    transactions.filter((t) => t.amount < 0).length > 0
      ? Math.abs(
          spending / transactions.filter((t) => t.amount < 0).length
        ).toFixed(2)
      : "0.00";

  const total = income + Math.abs(spending);

  const getIcon = (tx) => {
    const base = "w-5 h-5";

    if (tx.type === "deposit" || (tx.type === "transfer" && tx.tone === "income") || tx.type === "loan") {
      return (
        <svg className={base} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 5v14" />
          <path d="M19 12l-7 7-7-7" />
        </svg>
      );
    }

    if (tx.type === "withdraw" || (tx.type === "transfer" && tx.tone === "spending")) {
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-6">Recent Activity</h1>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {transactions.length === 0 && (
            <p className="p-5 text-slate-400 text-sm">No transactions yet</p>
          )}

          {transactions
            .slice()
            .reverse()
            .map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between px-5 py-4 border-b last:border-none hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    {getIcon(tx)}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">{tx.name}</p>
                    <p className="text-sm text-slate-500">{tx.subtitle}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      tx.amount > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : "-"}£{Math.abs(tx.amount).toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-400">
                    {formatDateTime(tx.timestamp)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-6">Insights</h1>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <div>
            <p className="text-sm text-slate-400">Total Spending</p>
            <h2 className="text-2xl font-bold text-red-500">
              £{Math.abs(spending).toFixed(2)}
            </h2>
          </div>

          <div>
            <p className="text-sm text-slate-400">Total Income</p>
            <h2 className="text-2xl font-bold text-green-500">
              £{income.toFixed(2)}
            </h2>
          </div>

          <div>
            <p className="text-sm text-slate-400">Avg Transaction Spend</p>
            <h2 className="text-2xl font-bold">£{avgSpend}</h2>
          </div>

          <div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className="bg-red-400"
                style={{
                  width: `${(Math.abs(spending) / total) * 100 || 0}%`,
                }}
              />

              <div
                className="bg-green-400"
                style={{
                  width: `${(income / total) * 100 || 0}%`,
                }}
              />
            </div>

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
