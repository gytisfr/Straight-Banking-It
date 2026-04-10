import { useState } from "react";

const navItems = ["Overview", "Payments"];

export default function Home() {
  const [activeNav, setActiveNav] = useState("Overview");

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">

      {/* Header */}

      <div className="flex flex-1">

        {/* Sidebar */}
        <aside className="w-52 bg-white border-r border-slate-200 px-3 pt-8 shrink-0">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border-none
                  ${activeNav === item
                    ? "bg-blue-50 text-slate-900"
                    : "bg-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                  }`}
              >
                <span>{item}</span>
                {activeNav === item && <span className="text-blue-500"></span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-12 py-10 overflow-y-auto">

          {/* Balance */}
          <div className="mb-8">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">Total available amount</p>
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">£1,900.23</h1>
              {/* <span className="text-slate-400 text-lg cursor-pointer">▾</span> */}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 mb-10">
            <button className="flex-1 flex items-center gap-3 px-5 py-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group">
              <span className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-bold shrink-0 group-hover:bg-blue-600 transition-colors">↑</span>
              <span className="font-semibold text-sm text-slate-800">Withdraw</span>
            </button>
            <button className="flex-1 flex items-center gap-3 px-5 py-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group">
              <span className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-bold shrink-0 group-hover:bg-blue-600 transition-colors">↓</span>
              <span className="font-semibold text-sm text-slate-800">Deposit</span>
            </button>
            <button className="flex-1 flex items-center gap-3 px-5 py-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group">
              <span className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-bold shrink-0 group-hover:bg-blue-600 transition-colors">$</span>
              <span className="font-semibold text-sm text-slate-800">Make Payment</span>
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
