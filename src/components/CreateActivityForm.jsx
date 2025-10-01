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
  const [errorMsg, setErrorMsg] = useState("");

  // handle adding user to participant list
  useEffect(() => {
    // check participants length
    if (user && participants.length === 0) {
      const currentUserParticipant = {
        id: user.id,
        email: user.email,
        amount: 0,
      };
      setParticipants([currentUserParticipant]);
    }
  }, [user, participants]);

  const navigate = useNavigate();

  const fetchActivitySubmition = async (activityData) => {
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
        const data = await res.json();
        console.error("Failed to create activity", data.data.errors[0]);
        const message = data.message || "Failed to create activity";
        setErrorMsg(message);
        throw new Error(message);
      }
      //clear error on success
      setErrorMsg("");
      // navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating activity ", error);
      setErrorMsg(error.message);
    }
  };

  const handleAddParticipant = (participantToAdd) => {
    if (
      !participants.find(
        (participant) => participant.id === participantToAdd.id
      )
    ) {
      setParticipants([...participants, { ...participantToAdd, amount: 0 }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionUsers = participants.map((participant) => ({
      userId: participant.id,
      amount: participant.amount === "" ? 0 : participant.amount,
    }));
    fetchActivitySubmition({
      name: activityName,
      totalCost,
      date,
      users: submissionUsers,
    });
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
              setTotalCost(Number(e.target.value));
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
            setParticipants={setParticipants}
          ></ParticipantsList>
        </FormField>

        <div>
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  );
};

export default CreateActivityForm;
