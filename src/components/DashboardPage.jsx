import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import NavBar from "./NavBar";
import DashboardContent from "./DashboardContent";
const DashboardPage = () => {
  const { user, handleLogout, fetchWithAuth } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
      console.error("Error fetching activities ", error.message);
      setMessage("Error loading activities");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserActivities();
  }, []);

  const handleFormSubmition = async (activityData) => {
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
      // close form
      handleCloseForm();
      // fetch user activity again
      fetchUserActivities();
    } catch (error) {
      console.error("Error creating activity ", error);
    }
  };

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <>
      <NavBar user={user} handleLogout={handleLogout}></NavBar>
      <div>
        <h1>Dashboard</h1>
        <h2>Welcome {user?.email}</h2>
        {!isFormOpen && (
          <button onClick={handleOpenForm}>Create Activity</button>
        )}
      </div>

      <DashboardContent
        isFormOpen={isFormOpen}
        loading={loading}
        activities={activities}
        message={message}
        handleCloseForm={handleCloseForm}
        handleFormSubmition={handleFormSubmition}
      ></DashboardContent>
    </>
  );
};

export default DashboardPage;
