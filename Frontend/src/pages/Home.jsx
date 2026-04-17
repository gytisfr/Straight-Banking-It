import { useState, useEffect } from "react";
import Payments from "@/components/Payments";
import Accounts from "@/components/Accounts";
import Loans from "@/components/Loans";

const navItems = ["Overview", "Accounts", "Payments", "Loans"];

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
  const [modalType, setModalType] = useState(null); 

  const [accounts, setAccounts] = useState([]);

  
  const [transferType, setTransferType] = useState("internal");

  const [payeeName, setPayeeName] = useState("");
  const [sortCode, setSortCode] = useState("");


  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [reference, setReference] = useState("");

  const [loanAmount, setLoanAmount] = useState("");
  const [loanPeriod, setLoanPeriod] = useState("");
  const [loanExclusion, setLoanExclusion] = useState("0");
  const [loanInterest, setLoanInterest] = useState(0);

const fetchAccounts = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://127.0.0.1:5089/account/fetch", {
      method: "GET",
      headers: { token }
    });

    const data = await res.json();

    if (data.code === 200) {
      setAccounts(data.data);
    } else {
      console.error("Failed to fetch accounts");
    }
  } catch (err) {
    console.error("Error fetching accounts:", err);
  }
};

useEffect(() => {
  fetchAccounts();
}, []);

useEffect(() => {
  const fetchLoanInterest = async () => {
    if (modalType !== "loan" || !loanAmount || !loanPeriod) {
      setLoanInterest(0);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://127.0.0.1:5089/loan/interest?amount=${Number(loanAmount)}&months=${Number(loanPeriod)}&exclusion=${Number(loanExclusion || 0)}`,
        {
          method: "GET",
          headers: { token },
        }
      );

      const data = await res.json();
      setLoanInterest(data.code === 200 ? Number(data.interest) : 0);
    } catch (err) {
      console.error("Error fetching interest estimate:", err);
      setLoanInterest(0);
    }
  };

  fetchLoanInterest();
}, [loanAmount, loanPeriod, loanExclusion, modalType]);

const totalBalance = accounts.reduce((sum, acc) => {
  return sum + Number(acc.balance || 0);
}, 0);

const createAccount = async () => {

  console.log("clicked button");
  const token = localStorage.getItem("token");

  try {

    const userRes = await fetch("http://127.0.0.1:5089/auth/validate", {
      method: "POST",
      headers: {
        token: token
      }
    });

    const userData = await userRes.json();

    if (userData.code !== 200) {
      console.error("Invalid user");
      return;
    }

    const userId = userData.requestedUser.id;

 
    const res = await fetch(
      `http://127.0.0.1:5089/account?parentUserId=${userId}`,
      {
        method: "POST",
        headers: {
          token: token
        }
      }
    );

    const data = await res.json();

    if (data.code === 200) {
      console.log("Account created");

  
    fetchAccounts();
    } else {
      console.error("Failed to create account", data);
    }
  } catch (err) {
    console.error("Error creating account:", err);
  }
};

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <div className="flex flex-1">


        <aside className="w-52 bg-white border-r border-slate-200 px-3 pt-8 shrink-0 flex flex-col">


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


  <div className="my-6 border-t border-slate-200"></div>


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


        <main className="flex-1 px-12 py-10 overflow-y-auto">


          {activeNav === "Overview" && (
            <>

              <div className="mb-6">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">
                  Total available amount
                </p>
              <h1 className="text-4xl font-extrabold text-slate-900">
  £{totalBalance.toFixed(2)}
</h1>
              </div>


              <div className="flex gap-4 mb-16">
                {["Withdraw", "Deposit", "Make Payment", "Loan"].map((action, i) => (
  <button
    key={i}
    onClick={() => {
      if (action === "Make Payment") {
  setModalType("payment");
} else if (action === "Loan") {
  setModalType("loan");
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


<div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold text-slate-900">
    Accounts
  </h2>

  <div className="flex gap-3">
    <button
      onClick={createAccount}
      className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition cursor-pointer"
    >+ New Account</button>

    <button
      onClick={() => setActiveNav("Accounts")}
      className="flex items-center gap-1 text-sm font-semibold text-blue-500 hover:text-blue-600 transition-all duration-200 group cursor-pointer"
    >
      All accounts →
    </button>
  </div>
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
                    <p className="font-bold">£{acc.balance}</p>
<p className="text-sm text-slate-500">
  Account {acc.accountNumber}
</p>
                    </div>
                  </div>
                ))}
              </div>


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


          {activeNav === "Loans" && <Loans accounts={accounts} />}


          {activeNav === "Accounts" && (
          <Accounts
  accounts={accounts}
  setShowModal={setShowModal}
  setModalType={setModalType}
  setSelectedAccount={setSelectedAccount}
/>
          )}


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


      <h2 className="text-xl font-bold mb-4">
      {modalType === "payment"
  ? "Make Payment"
  : modalType === "deposit"
  ? "Deposit Funds"
  : modalType === "withdraw"
  ? "Withdraw Funds"
  : "Apply for Loan"}
      </h2>

{modalType === "payment" && (
  <div className="flex gap-2 mb-4">
    <button
      onClick={() => setTransferType("internal")}
      className={`px-3 py-1 rounded-lg ${
        transferType === "internal" ? "bg-blue-500 text-white" : "bg-slate-100"
      }`}
    >
      My Accounts
    </button>

    <button
      onClick={() => setTransferType("external")}
      className={`px-3 py-1 rounded-lg ${
        transferType === "external" ? "bg-blue-500 text-white" : "bg-slate-100"
      }`}
    >
      External
    </button>
  </div>
)}


      {modalType === "payment" && (
        <>

          <div className="mb-4">
          <label className="text-sm text-slate-500">From Account</label>
<select
  value={selectedAccount}
  onChange={(e) => setSelectedAccount(e.target.value)}
  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
>
  <option value="">Select account</option>
  {accounts.map((acc) => (
    <option key={acc.accountNumber} value={acc.accountNumber}>
      Account {acc.accountNumber} (£{acc.balance})
    </option>
  ))}
</select>
          </div>

{transferType === "internal" && (
      <div className="mb-4">
        <label className="text-sm text-slate-500">To Account</label>
        <select
          value={toAccount}
          onChange={(e) => setToAccount(e.target.value)}
          className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
        >
          <option value="">Select destination account</option>
          {accounts
            .filter(acc => acc.accountNumber !== selectedAccount)
            .map((acc) => (
              <option key={acc.accountNumber} value={acc.accountNumber}>
                Account {acc.accountNumber} (£{acc.balance})
              </option>
            ))}
        </select>
      </div>
    )}


{transferType === "external" && (
  <div className="mb-4">
    <label className="text-sm text-slate-500">Payee Name</label>
  <input
  type="text"
  value={payeeName}
  onChange={(e) => setPayeeName(e.target.value)}
  placeholder="e.g. John Smith"
  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
/>
  </div>
)}

{transferType === "external" && (
  <>

    <div className="mb-4">
      <label className="text-sm text-slate-500">Sort Code</label>
    <input
  type="text"
  value={sortCode}
  onChange={(e) => setSortCode(e.target.value)}
  placeholder="12-34-56"
  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
/>
    </div>


    <div className="mb-4">
      <label className="text-sm text-slate-500">Account Number</label>
      <input
        type="number"
        value={toAccount}
        onChange={(e) => setToAccount(e.target.value)}
        placeholder="12345678"
        className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
      />
    </div>
  </>
)}


          <div className="mb-4">
            <label className="text-sm text-slate-500">Reference</label>
          <input
  type="text"
  value={reference}
  onChange={(e) => setReference(e.target.value)}
  placeholder="e.g. Rent April"
  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
/>
          </div>


          <div className="mb-6">
            <label className="text-sm text-slate-500">Amount</label>
          <input
  type="number"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  placeholder="Enter amount"
  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
/>
          </div>
        </>
      )}


        {modalType !== "payment" && modalType !== "loan" && (
        <>
          <div className="mb-4">
            <label className="text-sm text-slate-500">Select Account</label>
          <select
  value={selectedAccount}
  onChange={(e) => setSelectedAccount(e.target.value)}
  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
>
  <option value="">Select account</option>
  {accounts.map((acc) => (
    <option key={acc.accountNumber} value={acc.accountNumber}>
      Account {acc.accountNumber} (£{acc.balance})
    </option>
  ))}
</select>
          </div>

          <div className="mb-6">
            <label className="text-sm text-slate-500">Amount</label>
          <input
  type="number"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  placeholder="Enter amount"
  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
/>
          </div>
        </>
      )}

      {modalType === "loan" && (
  <>
    <div className="mb-4">
      <label className="text-sm text-slate-500">Select Account</label>
    <select
  value={selectedAccount}
  onChange={(e) => setSelectedAccount(e.target.value)}
  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
>
  <option value="">Select account</option>
  {accounts.map((acc) => (
    <option key={acc.accountNumber} value={acc.accountNumber}>
      Account {acc.accountNumber} (£{acc.balance})
    </option>
  ))}
</select>
    </div>

    <div className="mb-4">
      <label className="text-sm text-slate-500">Loan Amount</label>
    <input
  type="number"
  value={loanAmount}
  onChange={(e) => setLoanAmount(e.target.value)}
  placeholder="Enter amount"
  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
/>
    </div>

    <div className="mb-4">
      <label className="text-sm text-slate-500">Repayment Period (months)</label>
    <input
  type="number"
  value={loanPeriod}
  onChange={(e) => setLoanPeriod(e.target.value)}
  placeholder="Enter amount"
  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl"
/>
    </div>

    <div className="mb-6 text-sm text-slate-500">
      Estimated interest: <span className="font-semibold">{loanInterest}%</span>
    </div>
  </>
)}

  
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
onClick={async () => {
if (modalType === "loan") {
  if (!selectedAccount || !loanAmount || !loanPeriod) {
    alert("Please fill all fields");
    return;
  }
} else {
  if (!selectedAccount || !amount) {
    alert("Please fill all fields");
    return;
  }
}

if (modalType === "payment") {
  if (transferType === "internal" && selectedAccount === toAccount) {
    alert("Cannot transfer to same account");
    return;
  }

  if (transferType === "internal" && !toAccount) {
    alert("Select destination account");
    return;
  }

if (transferType === "external" && (!toAccount || !sortCode || !payeeName)) {
  alert("Fill all external transfer details");
  return;
}

  if (!reference) {
    alert("Enter reference");
    return;
  }
}

  const token = localStorage.getItem("token");

try {
  let url = "";
  const amountNum = Number(amount);

  if (modalType === "deposit") {
    url = `http://127.0.0.1:5089/account/deposit?accountNumber=${selectedAccount}&amount=${amountNum}`;

  } else if (modalType === "withdraw") {
    url = `http://127.0.0.1:5089/account/withdraw?accountNumber=${selectedAccount}&amount=${amountNum}`;

  } else if (modalType === "payment") {
    if (transferType === "internal") {
      url = `http://127.0.0.1:5089/account/transfer?fromAccount=${selectedAccount}&toAccount=${toAccount}&amount=${amountNum}&reference=${reference}`;
    } else {
      url = `http://127.0.0.1:5089/account/transfer?fromAccount=${selectedAccount}&toAccount=${toAccount}&amount=${amountNum}&reference=${reference}`;
    }

  } else if (modalType === "loan") {
    url = `http://127.0.0.1:5089/loan?accountNumber=${selectedAccount}&amount=${loanAmount}&months=${loanPeriod}&exclusion=${Number(loanExclusion || 0)}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { token }
  });

  const data = await res.json();

      if (res.status >= 200 && res.status < 300) {
        console.log("REAL STATUS:", res.status);
      fetchAccounts();


  setSelectedAccount("");
  setToAccount("");
  setAmount("");
  setReference("");
  setPayeeName("");
setSortCode("");
setLoanAmount("");
setLoanPeriod("");
setLoanExclusion("0");
  setTransferType("internal");

    setShowModal(false);
    setModalType(null);
      } else {
        console.error(data);
      }

    } catch (err) {
      console.error(err);
    }

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