import { useEffect, useState } from "react";

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5089/loans", {
      method: "GET",
      headers: {
        token: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("LOANS RESPONSE:", data);

        if (data.code === 200) {
          setLoans(data.data);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching loans:", err);
        setLoading(false);
      });
  }, []);

  // 💸 Interest logic (5%)
  const INTEREST_RATE = 0.05;

  const calculateTotalWithInterest = (amount) => {
    return amount * (1 + INTEREST_RATE);
  };

  const calculateMonthly = (amount, months) => {
    return (amount / months).toFixed(2);
  };

  const calculateMonthlyWithInterest = (amount, months) => {
    const total = calculateTotalWithInterest(amount);
    return (total / months).toFixed(2);
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
          const total = calculateTotalWithInterest(loan.amount);
          const interest = total - loan.amount;

          return (
            <div
              key={loan.id}
              className="bg-white shadow rounded-xl p-5 border hover:shadow-lg transition"
            >
              <div className="mb-2 text-sm text-gray-500">
                Loan ID: {loan.id}
              </div>

              <div className="text-lg font-semibold mb-2">
                £{loan.amount}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><strong>Period:</strong> {loan.period} months</p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(loan.dateTaken * 1000).toLocaleDateString()}
                </p>

                <p>
                  <strong>Monthly (no interest):</strong> £
                  {calculateMonthly(loan.amount, loan.period)}
                </p>

                <p>
                  <strong>Monthly (with interest):</strong> £
                  {calculateMonthlyWithInterest(loan.amount, loan.period)}
                </p>

                <p>
                  <strong>Total repay:</strong> £{total.toFixed(2)}
                </p>

                <p className="text-red-500">
                  <strong>Interest:</strong> £{interest.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}