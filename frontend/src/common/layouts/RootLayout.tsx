import { useStore } from "../../store/useStore";
import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import LoginScreen from "../../pages/LoginPage";

export default function RootLayout() {
  const currentUser = useStore((state) => state.currentUser);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle routing based on authentication and role
  useEffect(() => {
    if (currentUser) {
      // If user is logged in but on login page, redirect to their dashboard
      if (location.pathname === "/" || location.pathname === "/login") {
        navigate(`/${currentUser.role}`, { replace: true });
      }
    } else {
      // If not logged in and not on login page, redirect to login
      if (location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
    }
  }, [currentUser, location.pathname, navigate]);

  return <Outlet />;
}
