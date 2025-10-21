import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "./AuthProvider";
import ParticipantSearchInput from "./ParticipantSearchInput";
import ParticipantsList from "./ParticipantsList";
import FormField from "./FormField";
import ErrorMessage from "./ErrorMessage";

const UpdateActivityForm = () => {
  const { fetchWithAuth } = useAuthContext();
  const [activityName, setActivityName] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const params = useParams();
  const activityId = params.id;

  useEffect(() => {
    // fetch activity from DB
    const fetchActivity = async () => {
      try {
        console.log(`Fetching activity ${activityId} from DB`);
        const URL = `http://localhost:5000/activities/${activityId}`;
        const res = await fetchWithAuth(URL);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        const activity = data.data;
        setActivityName(activity.name);
        setTotalCost(activity.totalCost);
        setDate(activity.date ? activity.date.substring(0, 10) : "");
        setParticipants(activity.participants);
        setLoading(false);
      } catch (error) {
        console.error("Error while fetching activity by id ", activityId);
        setErrMsg(error.message);
      }
    };
    fetchActivity();
  }, [activityId]);

  const handleAddParticipant = (participantToAdd) => {
    if (
      !participants.find(
        (participant) => participant.accountId === participantToAdd.accountId
      )
    ) {
      setParticipants([...participants, { ...participantToAdd, amount: 0 }]);
    }
  };

  const handleRemoveParticipant = (participantToRemove) => {
    setParticipants(
      participants.filter(
        (participant) => participant.accountId !== participantToRemove.accountId
      )
    );
  };

  const handleAmountChange = (participantAccountId, amountToUpdate) => {
    if (
      participants.find(
        (participant) => participant.accountId === participantAccountId
      )
    ) {
      setParticipants(
        participants.map((participant) =>
          participant.accountId === participantAccountId
            ? { ...participant, amount: amountToUpdate }
            : participant
        )
      );
    }
  };

  const fetchActivityUpdate = async (activityData) => {
    setLoading(true);
    setErrMsg("");
    try {
      // fetch to update acitivity from backend
      const URL = `http://localhost:5000/activities/${activityId}`;
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData),
      };
      const res = await fetchWithAuth(URL, options);
      const data = await res.json();
      // log and show error message if response status not ok
      if (!res.ok) {
        const errorMessage =
          data.message ||
          "Unknown error occurred on server while updating activity";
        console.error("Server-side error updating acitivy ", errorMessage);
        throw new Error(errorMessage);
      }
      // if ok go back to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Fetch/Network error updating activity ", error.message);
      setErrMsg("Failed to update activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionParticipants = participants.map((participant) => ({
      id: participant.id,
      accountId: participant.accountId,
      amount: participant.amount === "" ? 0 : Number(participant.amount),
    }));
    const activityData = {
      participants: submissionParticipants,
      name: activityName,
      totalCost: Number(totalCost),
      date,
    };
    fetchActivityUpdate(activityData);
  };

  const handleCancel = () => {
    navigate(-1);
  };
  return (
    <div>
      <h2>Update Activity</h2>
      <ErrorMessage message={errMsg}></ErrorMessage>
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
            handleRemoveParticipant={handleRemoveParticipant}
            handleAmountChange={handleAmountChange}
          ></ParticipantsList>
        </FormField>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Update"}
          </button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateActivityForm;
