import { useState } from "react";
import Payments from "@/components/Payments";
import Accounts from "@/components/Accounts";

const navItems = ["Overview", "Accounts", "Payments"];


const accounts = [
  { id: 1, balance: "£670.54", name: "Main Account" },
  { id: 2, balance: "£1,892.02", name: "Savings Account" },
  { id: 3, balance: "£726.45", name: "Bills Account" },
  { id: 4, balance: "£480.44", name: "Spending Account" },
  { id: 5, balance: "£5,234.48", name: "Business Account" },
  { id: 6, balance: "£30,356.86", name: "Investment Account" },
];

const companies = [
  { id: 1, name: "BrewDog", icon: "🍺" },
  { id: 2, name: "Foodstory", icon: "🥗" },
  { id: 3, name: "Tippling House", icon: "🍸" },
  { id: 4, name: "Books & Beans", icon: "☕" },
  { id: 5, name: "Union Square", icon: "🛍️" },
];

export default function Home() {
  const [activeNav, setActiveNav] = useState("Overview");

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // "deposit" | "withdraw"

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <div className="flex flex-1">

        {/* Sidebar */}
        <aside className="w-52 bg-white border-r border-slate-200 px-3 pt-8 shrink-0 flex flex-col">

  {/* Navigation */}
  <nav className="flex flex-col gap-1">
    {navItems.map((item) => (
      <button
        key={item}
        onClick={() => setActiveNav(item)}
        className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer
          ${
            activeNav === item
              ? "bg-blue-50 text-slate-900"
              : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
          }`}
      >
        {item}
      </button>
    ))}
  </nav>

  {/* Divider */}
  <div className="my-6 border-t border-slate-200"></div>

  {/* Local Rewards */}
  <div>
    <p className="text-xs text-slate-800 font-semibold uppercase tracking-wide px-4 mb-2">
      Local Rewards
    </p>

    <div className="flex flex-col gap-1">
      {companies.map((company) => (
        <button
          key={company.id}
          className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all cursor-pointer"
        >
          {company.name}
        </button>
      ))}
    </div>
  </div>

</aside>

        {/* Main */}
        <main className="flex-1 px-12 py-10 overflow-y-auto">

          {/* ================= OVERVIEW ================= */}
          {activeNav === "Overview" && (
            <>
              {/* Balance */}
              <div className="mb-6">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">
                  Total available amount
                </p>
                <h1 className="text-4xl font-extrabold text-slate-900">
                  £1,900.23
                </h1>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-16">
                {["Withdraw", "Deposit", "Make Payment"].map((action, i) => (
  <button
    key={i}
    onClick={() => {
      if (action === "Make Payment") {
        setModalType("payment");
      } else {
        setModalType(action.toLowerCase());
      }
      setShowModal(true);
    }}
    className="flex-1 flex items-center gap-3 px-5 py-4 bg-white border border-slate-200 rounded-2xl hover:shadow-md hover:border-blue-200 hover:scale-[1.02] transition-all duration-200 group cursor-pointer"
  >
    <span className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold group-hover:bg-blue-600 transition-colors">
      {i === 0 ? "↑" : i === 1 ? "↓" : "$"}
    </span>
    <span className="font-semibold text-sm text-slate-800">
      {action}
    </span>
  </button>
))}
              </div>

              {/* Accounts preview */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Accounts
                </h2>

                <button
                  onClick={() => setActiveNav("Accounts")}
                  className="flex items-center gap-1 text-sm font-semibold text-blue-500 hover:text-blue-600 transition-all duration-200 group cursor-pointer"
                >
                  All accounts
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-16">
                {accounts.slice(0, 3).map((acc) => (
                  <div
                    key={acc.id}
                    className="flex gap-3 items-center bg-blue-100 px-5 py-4 rounded-2xl border border-blue-200 hover:shadow-md hover:scale-[1.01] transition-all duration-200"
                  >
                    <span className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      $
                    </span>
                    <div>
                      <p className="font-bold">{acc.balance}</p>
                      <p className="text-sm text-slate-500">{acc.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ================= POINTS & REWARDS ================= */}
              <div className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Points & Rewards
                  </h2>

                  <button className="flex items-center gap-1 text-sm font-semibold text-blue-500 hover:text-blue-600 transition-all duration-200 group cursor-pointer">
                    View rewards
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-5">

                  {/* Points balance */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Available Points
                      </p>
                      <h2 className="text-3xl font-bold text-slate-900">
                        12,450 pts
                      </h2>
                    </div>

                    <button className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 hover:scale-[1.03] transition-all duration-200 cursor-pointer">
                      Use Points
                    </button>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500">
                        Next reward: £20 voucher
                      </span>
                      <span className="text-slate-400">15,000 pts</span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: "83%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-sm text-slate-500">
                    Earn{" "}
                    <span className="font-semibold text-slate-700">
                      1 point per £1
                    </span>{" "}
                    spent. You’re{" "}
                    <span className="font-semibold text-slate-700">
                      2,550 pts
                    </span>{" "}
                    away from your next reward 🎉
                  </div>

                </div>
              </div>
            </>
          )}

          {/* ================= ACCOUNTS ================= */}
          {activeNav === "Accounts" && (
            <Accounts accounts={accounts} />
          )}

          {/* ================= PAYMENTS ================= */}
          {activeNav === "Payments" && <Payments />}

{showModal && (
  <div
    onClick={() => {
      setShowModal(false);
      setModalType(null);
    }}
    className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg"
    >

      {/* Title */}
      <h2 className="text-xl font-bold mb-4">
        {modalType === "payment"
          ? "Make Payment"
          : modalType === "deposit"
          ? "Deposit Funds"
          : "Withdraw Funds"}
      </h2>

      {/* ================= PAYMENT FORM ================= */}
      {modalType === "payment" && (
        <>
          {/* From account */}
          <div className="mb-4">
            <label className="text-sm text-slate-500">From Account</label>
            <select className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl">
              {accounts.map((acc) => (
                <option key={acc.id}>
                  {acc.name} ({acc.balance})
                </option>
              ))}
            </select>
          </div>

          {/* Payee name */}
          <div className="mb-4">
            <label className="text-sm text-slate-500">Payee Name</label>
            <input
              type="text"
              placeholder="e.g. John Smith"
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Sort code */}
          <div className="mb-4">
            <label className="text-sm text-slate-500">Sort Code</label>
            <input
              type="text"
              placeholder="12-34-56"
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Account number */}
          <div className="mb-4">
            <label className="text-sm text-slate-500">Account Number</label>
            <input
              type="text"
              placeholder="12345678"
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Reference */}
          <div className="mb-4">
            <label className="text-sm text-slate-500">Reference</label>
            <input
              type="text"
              placeholder="e.g. Rent April"
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Amount */}
          <div className="mb-6">
            <label className="text-sm text-slate-500">Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>
        </>
      )}

      {/* ================= DEPOSIT / WITHDRAW ================= */}
      {modalType !== "payment" && (
        <>
          <div className="mb-4">
            <label className="text-sm text-slate-500">Select Account</label>
            <select className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl">
              {accounts.map((acc) => (
                <option key={acc.id}>
                  {acc.name} ({acc.balance})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="text-sm text-slate-500">Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setShowModal(false);
            setModalType(null);
          }}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            setShowModal(false);
            setModalType(null);
          }}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600"
        >
          Confirm
        </button>
      </div>

    </div>
  </div>
)}

        </main>
      </div>
    </div>
  );
}