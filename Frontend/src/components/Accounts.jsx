import { useState } from "react";

export default function Accounts({
  accounts,
  setShowModal,
  setModalType,
  setSelectedAccount, // comes from Home (for modal)
}) {
  // ✅ LOCAL state (renamed to avoid conflict)
  const [selectedAccountDetails, setSelectedAccountDetails] = useState(null);

  // 🧠 Optional naming
  const getAccountName = (acc, index) => {
    if (index === 0) return "Main Account";
    if (index === 1) return "Savings Account";
    return `Account ${acc.accountNumber}`;
  };

  // 💰 Format money
  const formatMoney = (amount) => {
    return Number(amount).toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // 🔒 Mask account number
  const maskAccountNumber = (num) => {
    const str = String(num);
    return `**** ${str.slice(-4)}`;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Accounts</h1>

      {/* ================= ACCOUNT GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {accounts.map((acc, index) => (
          <div
            key={acc.accountNumber}
            onClick={() => setSelectedAccountDetails(acc)}
            className="bg-white border border-slate-200 rounded-2xl p-5 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all"
          >
            {/* TOP */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-slate-400">
                {getAccountName(acc, index)}
              </div>

              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 font-semibold">
                Active
              </span>
            </div>

            {/* BALANCE */}
            <div className="mb-4">
              <p className="text-2xl font-bold text-slate-900">
                £{formatMoney(acc.balance)}
              </p>
              <p className="text-xs text-slate-400">
                {maskAccountNumber(acc.accountNumber)}
              </p>
            </div>

            {/* ACTIONS */}
            <div
              className="flex gap-2"
              onClick={(e) => e.stopPropagation()} // prevent card click
            >
              <button
                onClick={() => {
                  setSelectedAccount(acc.accountNumber); // 👈 goes to Home
                  setModalType("deposit");
                  setShowModal(true);
                }}
                className="flex-1 text-xs bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Deposit
              </button>

              <button
                onClick={() => {
                  setSelectedAccount(acc.accountNumber); // 👈 goes to Home
                  setModalType("withdraw");
                  setShowModal(true);
                }}
                className="flex-1 text-xs bg-slate-100 py-2 rounded-lg hover:bg-slate-200"
              >
                Withdraw
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= ACCOUNT DETAILS ================= */}
      {selectedAccountDetails && (
        <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Account Details</h2>

            <button
              onClick={() => setSelectedAccountDetails(null)}
              className="text-sm text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Account Number</p>
              <p className="font-semibold">
                {selectedAccountDetails.accountNumber}
              </p>
            </div>

            <div>
              <p className="text-slate-400">Balance</p>
              <p className="font-semibold">
                £{formatMoney(selectedAccountDetails.balance)}
              </p>
            </div>

            <div>
              <p className="text-slate-400">Sort Code</p>
              <p className="font-semibold">
                {selectedAccountDetails.sortCode}
              </p>
            </div>

            <div>
              <p className="text-slate-400">Card Number</p>
              <p className="font-semibold">
                **** **** ****{" "}
                {String(selectedAccountDetails.cardNumber).slice(-4)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}