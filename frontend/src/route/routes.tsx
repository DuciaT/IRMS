import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../common/layouts/RootLayout";
import ManagerDashboard from "../pages/ManagerDashboard";
import ServerDashboard from "../pages/ServerDashboard";
import ChefDashboard from "../pages/ChefDashboard";
import CashierDashboard from "../pages/CashierDashboard";
// import HostDashboard from "./pages/HostDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import LoginPage from "../pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "manager",
        element: <ManagerDashboard />,
      },
      {
        path: "manager/:page",
        element: <ManagerDashboard />,
      },
      {
        path: "server",
        element: <ServerDashboard />,
      },
      {
        path: "server/:page",
        element: <ServerDashboard />,
      },
      {
        path: "chef",
        element: <ChefDashboard />,
      },
      {
        path: "chef/:page",
        element: <ChefDashboard />,
      },
      {
        path: "cashier",
        element: <CashierDashboard />,
      },
      {
        path: "cashier/:page",
        element: <CashierDashboard />,
      },
      //   {
      //     path: "host",
      //     element: <HostDashboard />,
      //   },
      //   {
      //     path: "host/:page",
      //     element: <HostDashboard />,
      //   },
      {
        path: "admin",
        element: <AdminDashboard />,
      },
      {
        path: "admin/:page",
        element: <AdminDashboard />,
      },
    ],
  },
]);
