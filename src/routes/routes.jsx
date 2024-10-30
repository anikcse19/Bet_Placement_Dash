import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginPage from "../pages/LoginPage";
import SetteBet from "../pages/Dashboard/Settlement/SetteBet";
import UnsettleBet from "../pages/Dashboard/Settlement/UnsettleBet";

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
    element: <SetteBet />,
  },
  {
    path: "/dashboard/settlement/unsettle-bet",
    element: <UnsettleBet />,
  },
]);
