import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import NavBar from "./NavBar";
import CreateActivityModal from "./CreateActivityModal";

const DashboardPage = () => {
  const { user, handleLogout, fetchWithAuth } = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <NavBar user={user} handleLogout={handleLogout}></NavBar>
      <div>
        <h1>Dashboard</h1>
        <h2>Welcome {user?.email}</h2>
        <div>{loading ? "Loading..." : message}</div>
        <button onClick={handleLogout}>Log out</button>
      </div>
      <CreateActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      ></CreateActivityModal>
    </>
  );
};

export default DashboardPage;
