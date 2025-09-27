import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import ParticipantSearchInput from "./ParticipantSearchInput";
import ParticipantsList from "./ParticipantsList";

const CreateActivityForm = ({ onClose, onCreateActivity }) => {
  const { user } = useContext(AuthContext);
  const [activityName, setActivityName] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState([]);

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
  }, [user]);

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
    onCreateActivity({
      name: activityName,
      totalCost,
      date,
      users: submissionUsers,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Activity</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="activity-name">Activity Name: </label>
            <input
              type="text"
              id="activity-name"
              value={activityName}
              onChange={(e) => {
                setActivityName(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="total-cost">Total Cost:</label>
            <input
              type="number"
              id="total-cost"
              value={totalCost}
              onChange={(e) => {
                setTotalCost(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </div>
          <ParticipantSearchInput
            handleAddParticipant={handleAddParticipant}
          ></ParticipantSearchInput>
          <ParticipantsList
            participants={participants}
            setParticipants={setParticipants}
          ></ParticipantsList>
          <div>
            <button type="submit">Create</button>
          </div>
        </form>
        <button
          onClick={() => {
            onClose();
            resetFormState();
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CreateActivityForm;
