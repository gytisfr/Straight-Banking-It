import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");


    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {

      const url = `http://127.0.0.1:5089/users?name=${encodeURIComponent(
        name
      )}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(
        password
      )}&securityQ=1&securityA=test`;

      const res = await fetch(url, {
        method: "POST",
      });

      const data = await res.json();

      console.log("Signup response:", data);

      if (data.code === 201) {
        navigate("/login");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 w-[400px] flex flex-col gap-6">

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create an account
            </h1>
          </div>


          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Name
              </label>
              <input
                className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>


            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Email
              </label>
              <input
                className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm"
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
                className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>


            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Confirm Password
              </label>
              <input
                className="border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl"
            >
              Create Account
            </button>
          </form>

          <p className="text-sm text-center text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 font-semibold hover:underline"
            >
              Log In
            </Link>
          </p>

        </div>
      </main>
    </div>
  );
};

export default SignUp;