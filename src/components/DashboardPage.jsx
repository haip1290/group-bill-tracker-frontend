import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import NavBar from "./NavBar";
import CreateActivityModal from "./CreateActivityModal";

const DashboardPage = () => {
  const { user, handleLogout, fetchWithAuth } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * @description this method fetch dashboard info from backend
   * used in useEffect hook
   */
  const fetchUserActivities = async () => {
    try {
      const URL = "http://localhost:5000/activities";
      const res = await fetchWithAuth(URL);
      if (!res.ok) {
        throw new Error("Faid to fetch dashboard data");
      }
      const data = await res.json();
      setActivities(data.data.activities);
    } catch (error) {
      setMessage("Error " + error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserActivities();
  }, []);

  const handleCreateActivitySubmit = async (activityData) => {
    try {
      // call backend to create activity
      const URL = "http://localhost:5000/activities";
      const res = await fetchWithAuth(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData),
      });
      // check if res from fetch return error
      if (!res.ok) {
        console.log("Failed to create activity");
      }
      // close modal
      onModelClose();
      // fetch user activity again
      fetchUserActivities();
    } catch (error) {
      console.error("Error creating activity ", error);
    }
  };

  const handleCreateActivity = () => {
    setIsModalOpen(true);
  };

  const onModelClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <NavBar user={user} handleLogout={handleLogout}></NavBar>
      <div>
        <h1>Dashboard</h1>
        <h2>Welcome {user?.email}</h2>
        <div>{loading ? "Loading..." : message}</div>
        <button onClick={handleCreateActivity}>Create Activity</button>
        <button onClick={handleLogout}>Log out</button>
      </div>

      {activities.length > 0 && (
        <div>
          {activities.map((activity) => (
            <div>{activity.name}</div>
          ))}
        </div>
      )}

      <CreateActivityModal
        isOpen={isModalOpen}
        onClose={onModelClose}
        onCreateActivity={handleCreateActivitySubmit}
      ></CreateActivityModal>
    </>
  );
};

export default DashboardPage;
