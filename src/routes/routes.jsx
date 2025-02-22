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
import ClientList from "../pages/Dashboard/ClientList";
import CreateClient from "../pages/Dashboard/CreateClient";
import UpdateClient from "../pages/Dashboard/UpdateClient";
import TrashList from "../pages/Dashboard/Trashlist";
import OfficeShiftList from "../pages/Dashboard/OfficeShiftList";
import UsersAttendance from "../pages/Dashboard/UsersAttendance";
import MyAttendance from "../pages/Dashboard/MyAttendance";
import AssignShift from "../pages/Dashboard/AssignShift";
import UsersShifts from "../pages/Dashboard/UsersShifts";
import RacingResults from "../pages/Dashboard/RacingResult";

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
    path: "/dashboard/racing-results",
    element: (
      <PrivateRoute>
        <RacingResults />
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
    path: "/dashboard/office-shift",
    element: (
      <PrivateRoute>
        <OfficeShiftList />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/users-shifts",
    element: (
      <PrivateRoute>
        <UsersShifts />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/assign-shift",
    element: (
      <PrivateRoute>
        <AssignShift />
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
    path: "/dashboard/client-list",
    element: (
      <PrivateRoute>
        <ClientList />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/create-client",
    element: (
      <PrivateRoute>
        <CreateClient />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/client/update/:id",
    element: (
      <PrivateRoute>
        <UpdateClient />
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
    path: "/dashboard/users-attendance",
    element: (
      <PrivateRoute>
        <UsersAttendance />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard/my-attendance",
    element: (
      <PrivateRoute>
        <MyAttendance />
      </PrivateRoute>
    ),
  },

  {
    path: "/dashboard/trash-list",
    element: (
      <PrivateRoute>
        <TrashList />
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
