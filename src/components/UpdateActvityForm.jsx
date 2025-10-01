import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "./AuthProvider";
import ParticipantSearchInput from "./ParticipantSearchInput";
import ParticipantsList from "./ParticipantsList";
import FormField from "./FormField";

const UpdateActivityForm = () => {
  const { fetchWithAuth } = useAuthContext();
  const [activityName, setActivityName] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const activityId = params.id;

  useEffect(() => {
    // fetch activity from DB
    const fetchActivity = async () => {
      console.log(`Fetching activity ${activityId} from DB`);
      const URL = `http://localhost:5000/activities/${activityId}`;
      const activity = await fetchWithAuth(URL);
      try {
      } catch (error) {}
    };
  }, []);

  const handleAddParticipant = (participantToAdd) => {
    if (
      !participants.find(
        (participant) => participant.id === participantToAdd.id
      )
    ) {
      setParticipants([...participants, { ...participantToAdd, amount: 0 }]);
    }
  };

  const handleSubmit = () => {};
  return (
    <div>
      <h2>Update Activity</h2>
      <form onSubmit={handleSubmit}>
        <FormField label={"Activity Name: "} id={"activity-name"}>
          <input
            type="text"
            name="activityName"
            id="activity-name"
            value={activityName}
            onChange={(e) => {
              setActivityName(e.target.value);
            }}
          />
        </FormField>
        <FormField label={"Total Cost: "} id={"total-cost"}>
          <input
            type="number"
            name="totalCost"
            id="total-cost"
            value={totalCost}
            onChange={(e) => {
              setTotalCost(e.target.value);
            }}
          />
        </FormField>
        <FormField label={"Date: "} id={"date"}>
          <input
            type="date"
            name="date"
            id="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
        </FormField>
        <FormField label={"Participants: "} id={"participants"}>
          <ParticipantSearchInput
            handleAddParticipant={handleAddParticipant}
          ></ParticipantSearchInput>
          <ParticipantsList
            participants={participants}
            setParticipants={setParticipants}
          ></ParticipantsList>
        </FormField>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateActivityForm;
