// import DashBoardHome from "./pages/Dashboard/DashBoardHome";
// import UnsettleBet from "./pages/Dashboard/Settlement/UnsettleBet";
import UnsettleBet from "./pages/Dashboard/Settlement/UnsettleBet";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <PrivateRoute>
      <UnsettleBet />
    </PrivateRoute>
  );
}

export default App;
