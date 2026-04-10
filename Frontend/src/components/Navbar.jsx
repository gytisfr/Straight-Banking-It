import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Send token to logout endpoint
      const url = `http://127.0.0.1:5089/auth/logout?token=${encodeURIComponent(token)}`;
      console.log("Logging out via URL:", url);

      await fetch(url, { method: "POST" });

      // Clear token
      localStorage.removeItem("token");

      // Redirect to login
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
        <span className="text-xl font-extrabold tracking-tight text-slate-900">Team4 Banking</span>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 cursor-pointer">
            <span className="text-sm font-semibold text-slate-800">Dwight A Schrute</span>
            {/* <span className="text-xs text-slate-400">▾</span> */}
          </div>

          <div className='relative'>
          <svg onClick={() => {setLogoutOpen((prev) => !prev)}} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="cursor-pointer hover:stroke-blue-500 transition-colors">
            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
          </svg>
          {
            logoutOpen &&  
            <div className='p-2 bg-white rounded-md top-8 right-4 absolute border-slate-200 border'>
              <button onClick={() => {handleLogout()}} className='bg-red-500 text-white rounded-sm px-3 py-2 cursor-pointer hover:shadow-md transition-all font-semibold'>Logout</button>
            </div>
          }
          </div>

        </div>
      </header>
  );
};

export default Navbar;
