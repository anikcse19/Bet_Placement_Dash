import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SetteBet from "../pages/Dashboard/Settlement/SetteBet";
import UnsettleBet from "../pages/Dashboard/Settlement/UnsettleBet";
import ResetPassowrdPage from "../pages/ResetPassowrdPage";
import SetNewPasswordPage from "../pages/SetNewPasswordPage";
import PrivateRoute from "./PrivateRoute";
import BetResults from "../pages/Dashboard/BetResults";
import CreateUser from "../pages/Dashboard/CreateUser";
import UsersList from "../pages/Dashboard/UsersList";
import UpdateUser from "../pages/Dashboard/UpdateUser";
import BetList from "../pages/Dashboard/Bets/BetList";
import LiveBet from "../pages/Dashboard/Bets/LiveBet";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <UnsettleBet />
      </PrivateRoute>
    ),
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
    path: "/dashboard/bets/bet-list",
    element: (
      <PrivateRoute>
        <BetList />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/bets/live-bet",
    element: (
      <PrivateRoute>
        <LiveBet />
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
    path: "/dashboard/match-results",
    element: (
      <PrivateRoute>
        <BetResults />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/create-user",
    element: (
      <PrivateRoute>
        <CreateUser />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/users-list",
    element: (
      <PrivateRoute>
        <UsersList />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/user/:id",
    element: (
      <PrivateRoute>
        <UpdateUser />
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
