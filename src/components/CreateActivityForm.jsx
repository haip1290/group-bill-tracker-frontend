import { useEffect, useState } from "react";
import { useAuthContext } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import ParticipantSearchInput from "./ParticipantSearchInput";
import ParticipantsList from "./ParticipantsList";
import FormField from "./FormField";
import ErrorMessage from "./ErrorMessage";

const CreateActivityForm = () => {
  const { user, fetchWithAuth } = useAuthContext();
  const [activityName, setActivityName] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // handle adding user to participant list
  useEffect(() => {
    // check participants length
    if (user && participants.length === 0) {
      const currentUserParticipant = {
        accountId: user.id,
        email: user.email,
        amount: 0,
      };
      setParticipants([currentUserParticipant]);
    }
  }, [user, participants]);

  const navigate = useNavigate();

  const fetchActivitySubmition = async (activityData) => {
    try {
      setLoading(true);
      setErrorMsg("");
      // call backend to create activity
      const URL = "http://localhost:5000/activities";
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData),
      };
      const res = await fetchWithAuth(URL, options);
      // check if res from fetch return error
      if (!res.ok) {
        const data = await res.json();
        console.error("Failed to create activity", data.message);
        throw new Error(data.message);
      }
      // navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating activity ", error);
      setErrorMsg("Failed to create activity");
    } finally {
      setLoading(false);
    }
  };

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
    setParticipants(
      participants.map((participant) =>
        participant.accountId === participantAccountId
          ? { ...participant, amount: amountToUpdate }
          : participant
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionUsers = participants.map((participant) => ({
      accountId: participant.accountId,
      amount: participant.amount === "" ? 0 : Number(participant.amount),
    }));
    fetchActivitySubmition({
      name: activityName,
      totalCost: Number(totalCost),
      date,
      users: submissionUsers,
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div>
      <h2>Create New Activity</h2>
      <ErrorMessage message={errorMsg}></ErrorMessage>
      <form onSubmit={handleSubmit}>
        <FormField label={"Activity Name: "} id={"activity-name"}>
          <input
            type="text"
            id="activity-name"
            value={activityName}
            onChange={(e) => {
              setActivityName(e.target.value);
            }}
          ></input>
        </FormField>
        <FormField label={"Total Cost: "} id={"total-cost"}>
          <input
            type="number"
            id="total-cost"
            value={totalCost}
            onChange={(e) => {
              setTotalCost(e.target.value);
            }}
          ></input>
        </FormField>
        <FormField label={"Date: "} id={"date"}>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
        </FormField>
        <FormField
          label={"Participants (search by email):"}
          id={"participants"}
        >
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
            {loading ? "Loading" : "Create"}
          </button>
          <button type="cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateActivityForm;
