import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "./AuthProvider";
import ActivitiesList from "./ActivitiesList";

const ActivityBoard = () => {
  const { fetchWithAuth } = useAuthContext();
  const [activities, setActivities] = useState([]);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [activitiesStatus, setActivitiesStatus] = useState("unpaid");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const statusOptions = ["paid", "unpaid"];
  /**
   * @description this method fetch dashboard info from backend
   * used in useEffect hook
   * @param {string} status of activiies (unpaid, achieved, etc...)
   */
  const fetchUserActivities = async (status, signal) => {
    console.log(`Fetching ${status} activities`);
    const URL = `http://localhost:5000/activities?status=${status}`;
    const res = await fetchWithAuth(URL, signal);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Faid to fetch dashboard data: ${data.message}`);
    }
    return data.data;
  };
  // function to refetch activities
  const refetchActivities = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);
  // load activities on page start or when trigger
  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    setLoading(true);
    setMessage("");
    fetchUserActivities(activitiesStatus, signal)
      .then((data) => {
        setActivities(data.activities);
        setLoading(false);
      })
      .catch((error) => {
        // if error due to abort
        if (error.name === "AbortError") {
          console.error("Fetch aborted for ", error);
          return;
        }
        console.error("Error loading activities ", error);
        setMessage("Error loading activities");
        setLoading(false);
      });
    return () => {
      abortController.abort();
    };
  }, [activitiesStatus, fetchWithAuth, refetchTrigger]);

  const onStatusSelect = (status) => {
    console.log(`select ${status} activities`);
    setMessage("");
    setActivitiesStatus(status);
  };
  return (
    <>
      {message && <div>Error: {message}</div>}
      {!message && loading && <div>Loading...</div>}
      {!message && !loading && (
        <div>
          {" "}
          <select
            value={activitiesStatus}
            onChange={(e) => {
              onStatusSelect(e.target.value);
            }}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          {activities.length > 0 ? (
            <ActivitiesList
              activities={activities}
              onActivityStatusChange={refetchActivities}
            ></ActivitiesList>
          ) : (
            <div>No {activitiesStatus} activities found</div>
          )}
        </div>
      )}
    </>
  );
};

export default ActivityBoard;
