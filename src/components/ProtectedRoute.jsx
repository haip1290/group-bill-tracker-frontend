import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./DashboardPage";

const ProtectedRoute = () => {
  const { accessToken } = useContext(AuthContext);
  if (!accessToken) {
    return <Navigate to="/login" replace></Navigate>; // replace to prevent pushing to history/user return to page
  }
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />}></Route>
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace></Navigate>}
      ></Route>
    </Routes>
  );
};

export default ProtectedRoute;
