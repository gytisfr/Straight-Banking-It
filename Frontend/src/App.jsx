import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function AppWrapper() {
  const location = useLocation();
  const hideNavFooter = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!hideNavFooter && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route
          path='/login'
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path='/signup'
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path='/routes'
          element={
            <ProtectedRoute>
              <RoutesPage />
            </ProtectedRoute>
          }
        /> */}

        {/* Fallback route */}
        <Route path='*' element={<div className='w-full h-full flex justify-center items-center'><h1>Page Not Found 404</h1></div>} />
      </Routes>

      {!hideNavFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
