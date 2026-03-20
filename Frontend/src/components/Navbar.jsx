import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

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
    <nav className="w-full bg-slate-200 text-slate-900 px-5">
      <div className="mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between py-2 items-center h-16">
          <Link to={'/'} >
          <h1 className='font-bold text-xl'>Team4 Banking</h1>
          </Link>

          {/* Nav links */}
          <div className="flex space-x-6 items-center">
            <h1 className="text-slate-900 cursor-pointer">
              Dwight A. Schrute
            </h1>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="hover:text-slate-500 ease-in-out duration-300 text-slate-900 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
