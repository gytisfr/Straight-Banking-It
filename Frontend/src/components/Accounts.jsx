export default function Accounts({ accounts }) {
  return (
    <>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">
        Accounts
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <button
            key={acc.id}
            className="flex gap-3 items-center bg-blue-100 px-5 py-4 rounded-2xl border border-blue-200 hover:shadow-md hover:scale-[1.02] transition-all group"
          >
            <span className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold group-hover:bg-blue-600">
              $
            </span>

            <div className="flex flex-col text-left">
              <span className="font-bold text-slate-800">
                {acc.balance}
              </span>
              <span className="text-sm text-slate-500">
                {acc.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}