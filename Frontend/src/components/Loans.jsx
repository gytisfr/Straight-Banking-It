import { useEffect, useState } from "react";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function Loans({ accounts = [] }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5089/loans", {
          method: "GET",
          headers: { token },
        });

        const data = await res.json();

        if (data.code !== 200) {
          setLoans([]);
          setLoading(false);
          return;
        }

        const userAccountNumbers = accounts.map((acc) => acc.accountNumber);
        const filteredLoans =
          userAccountNumbers.length > 0
            ? data.data.filter((loan) =>
                userAccountNumbers.includes(loan.parentAccountId)
              )
            : data.data;

        const loansWithInterest = await Promise.all(
          filteredLoans.map(async (loan) => {
            try {
              const interestRes = await fetch(
                `http://127.0.0.1:5089/loan/interest?amount=${loan.amount}&months=${loan.period}&exclusion=${loan.exclusion ?? 0}`,
                {
                  method: "GET",
                  headers: { token },
                }
              );

              const interestData = await interestRes.json();

              return {
                ...loan,
                interestRate:
                  interestData.code === 200 ? Number(interestData.interest) : 0,
              };
            } catch (error) {
              console.error("Error fetching loan interest:", error);
              return { ...loan, interestRate: 0 };
            }
          })
        );

        setLoans(loansWithInterest);
      } catch (err) {
        console.error("Error fetching loans:", err);
        setLoans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [accounts, token]);

  const getAccountName = (accountId) => {
    const index = accounts.findIndex((acc) => acc.accountNumber === accountId);
    if (index === 0) return "Main Account";
    if (index === 1) return "Savings Account";
    if (index > 1) return `Account ${accountId}`;
    return `Account ${accountId}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Loans</h1>

      {loading && <p>Loading...</p>}

      {!loading && loans.length === 0 && (
        <p className="text-gray-500">No loans yet</p>
      )}

      <div className="space-y-4">
        {loans.map((loan) => {
          const principal = Number(loan.amount || 0);
          const period = Number(loan.period || 1);
          const interestRate = Number(loan.interestRate || 0);
          const total = principal * (1 + interestRate / 100);
          const interestAmount = total - principal;
          const monthlyWithoutInterest = principal / period;
          const monthlyWithInterest = total / period;

          return (
            <div
              key={loan.id}
              className="bg-white shadow rounded-xl p-5 border hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm text-gray-500">Loan ID: {loan.id}</div>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 font-semibold">
                  {getAccountName(loan.parentAccountId)}
                </span>
              </div>

              <div className="text-lg font-semibold mb-3">
                £{formatCurrency(principal)}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>
                  <strong>Period:</strong> {period} months
                </p>
                <p>
                  <strong>Exclusion:</strong> {Number(loan.exclusion || 0)} months
                </p>
                <p>
                  <strong>Date taken:</strong>{" "}
                  {new Date(Number(loan.dateTaken) * 1000).toLocaleDateString("en-GB")}
                </p>

                <p>
                  <strong>Monthly (no interest):</strong> £
                  {formatCurrency(monthlyWithoutInterest)}
                </p>

                <p>
                  <strong>Monthly (with {interestRate}% interest):</strong> £
                  {formatCurrency(monthlyWithInterest)}
                </p>

                <p>
                  <strong>Total repay:</strong> £{formatCurrency(total)}
                </p>

                <p className="text-red-500">
                  <strong>Interest ({interestRate}%):</strong> £
                  {formatCurrency(interestAmount)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
