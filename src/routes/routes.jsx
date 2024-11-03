import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginPage from "../pages/LoginPage";
import SetteBet from "../pages/Dashboard/Settlement/SetteBet";
import UnsettleBet from "../pages/Dashboard/Settlement/UnsettleBet";
import ResetPassowrdPage from "../pages/ResetPassowrdPage";
import SetNewPasswordPage from "../pages/SetNewPasswordPage";
import PrivateRoute from "./PrivateRoute";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard/settlement/settle-bet",
    element: (
      <PrivateRoute>
        <SetteBet />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/settlement/unsettle-bet",
    element: (
      <PrivateRoute>
        <UnsettleBet />
      </PrivateRoute>
    ),
  },
  {
    path: "/reset-password",
    element: <ResetPassowrdPage />,
  },
  {
    path: "/admin/password-recovery",
    element: <SetNewPasswordPage />,
  },
]);
