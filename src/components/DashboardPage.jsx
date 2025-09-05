import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";

const DashboardPage = () => {
  const { user, handleLogout, fetchWithAuth } = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * @description this method fetch dashboard info from backend
   * used in useEffect hook
   */
  const fetchDashboard = async () => {
    try {
      const URL = "http://localhost:5000/users/dashboard";
      const res = await fetchWithAuth(URL);
      if (!res.ok) {
        throw new Error("Faid to fetch dashboard data");
      }
      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error " + error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboard();
  }, []);
  return (
    <>
      <h1>Dashboard</h1>
      <h2>Welcome {user?.email}</h2>
      <div>{loading ? "Loading..." : message}</div>
      <button onClick={handleLogout}>Log out</button>
    </>
  );
};

export default DashboardPage;
