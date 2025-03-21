// App.tsx
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "./Context/useContext";
import { Analytics } from '@vercel/analytics/react';

function App() {
  const navigate = useNavigate();
  const { isAuthenticated, isVerified } = useAuth();
  
  useEffect(() => {
    const lastRoute = sessionStorage.getItem("lastRoute");
    if (isAuthenticated && isVerified && lastRoute) {
      navigate(lastRoute, { replace: true });
    }
  }, [isAuthenticated, isVerified, navigate]);

  return (
    <div>
      <Outlet />
      <ToastContainer />
      <Analytics />
    </div>
  );
}

export default App;
