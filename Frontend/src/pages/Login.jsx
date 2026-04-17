import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const url = `http://127.0.0.1:5089/auth/login?email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`;

      const res = await fetch(url, {
        method: "POST",
      });

      const data = await res.json();

      console.log("Login response:", data);

      if (data.code === 200) {

        localStorage.setItem("token", data.token);


        navigate("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      <main className="flex-1 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 w-[400px] flex flex-col gap-6">

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h1>
          </div>


          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-2">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">

   
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Email
              </label>
              <input
                className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>


            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Password
              </label>
              <input
                className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all"
            >
              Log In
            </button>
          </form>

          <p className="text-sm text-center text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-500 font-semibold hover:text-blue-600 hover:underline transition-colors"
            >
              Sign up
            </Link>
          </p>

        </div>
      </main>

    </div>
  );
};

export default Login;