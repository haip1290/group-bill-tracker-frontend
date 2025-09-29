import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import NavBar from "./NavBar";
import ActivitiesList from "./ActivitiesList";

const DashboardPage = () => {
  const { user, fetchWithAuth } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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

  return (
    <>
      <NavBar></NavBar>
      <div>
        <h1>Dashboard</h1>
        <h2>Welcome {user?.email}</h2>
      </div>

      {loading && <div>Loading...</div>}
      {message && <div>Error: {message}</div>}
      {!loading && <ActivitiesList activities={activities}></ActivitiesList>}
    </>
  );
};

export default DashboardPage;
