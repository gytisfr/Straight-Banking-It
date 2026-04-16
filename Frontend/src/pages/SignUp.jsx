import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }
    const url = `http://127.0.0.1:5089/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    console.log("Signup URL:", url);
    try {
      const res = await fetch(url, { method: "POST" });
      const data = await res.json();
      console.log("Signup response:", data);
      if (res.ok) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error during signup:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 w-[400px] flex flex-col gap-6">

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create an account</h1>
          </div>

          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Username</label>
              <input
                className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Password</label>
              <input
                className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Confirm Password</label>
              <input
                className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Create Account
            </button>
          </form>

          <p className="text-sm text-center text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 font-semibold hover:text-blue-600 hover:underline transition-colors">
              Log In
            </Link>
          </p>

        </div>
      </main>
    </div>
  );
};

export default SignUp;
