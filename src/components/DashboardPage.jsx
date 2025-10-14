import { useEffect, useState } from "react";
import { useAuthContext } from "./AuthProvider";
import NavBar from "./NavBar";
import ActivitiesList from "./ActivitiesList";

const DashboardPage = () => {
  const { user, fetchWithAuth } = useAuthContext();
  const [activities, setActivities] = useState([]);
  const [activitiesStatus, setActivitiesStatus] = useState("unpaid");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const statusOptions = ["unpaid", "achieved"];
  /**
   * @description this method fetch dashboard info from backend
   * used in useEffect hook
   * @param {string} status of activiies (unpaid, achieved, etc...)
   */
  const fetchUserActivities = async (status) => {
    try {
      console.log(`Fetching ${status} activities`);
      const URL = `http://localhost:5000/activities?status=${status}`;
      const res = await fetchWithAuth(URL);
      const data = await res.json();
      if (!res.ok) {
        console.error(data.message);
        throw new Error("Faid to fetch dashboard data", data.message);
      }
      setActivities(data.data.activities);
      console.log(`Done fetching ${status} activites`);
    } catch (error) {
      console.error("Error fetching activities ", error.message);
      setMessage("Error loading activities");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserActivities(activitiesStatus);
  }, [activitiesStatus]);

  const onStatusSelect = (status) => {
    console.log(`select ${status} activities`);
    setActivitiesStatus(status);
  };

  return (
    <>
      <NavBar></NavBar>
      <div>
        <h1>Dashboard</h1>
        <h2>Welcome {user?.email}</h2>
      </div>
      <select
        value={activitiesStatus}
        onChange={(e) => {
          onStatusSelect(e.target.value);
        }}
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      {loading && <div>Loading...</div>}
      {message && <div>Error: {message}</div>}
      {!loading && <ActivitiesList activities={activities}></ActivitiesList>}
    </>
  );
};

export default DashboardPage;
