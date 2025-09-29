import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./DashboardPage";
import CreateActivityPage from "./CreateActivityPage";
import UpdateActivityPage from "./UpdateActivityPage";

const ProtectedRoute = () => {
  const { accessToken, isAuthFetching } = useContext(AuthContext);
  if (isAuthFetching) {
    return <div>Loading ...</div>;
  }
  if (!accessToken) {
    return <Navigate to="/login" replace></Navigate>; // replace to prevent pushing to history/user return to page
  }
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />}></Route>
      <Route path="/activities/new" element={<CreateActivityPage />}></Route>
      <Route
        path="/activities/:id/update"
        element={<UpdateActivityPage />}
      ></Route>
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace></Navigate>}
      ></Route>
    </Routes>
  );
};

export default ProtectedRoute;
