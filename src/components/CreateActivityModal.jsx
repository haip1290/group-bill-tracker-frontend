import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import ParticipantSearchInput from "./ParticipantSearchInput";

const CreateActivityModal = ({ isOpen, onClose, onCreateActivity }) => {
  const { user } = useContext(AuthContext);
  const [activityName, setActivityName] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState([]);

  // handle adding user to participant list
  useEffect(() => {
    // check participants length
    if (isOpen && user && participants.length === 0) {
      const currentUserParticipant = {
        id: user.id,
        email: user.email,
        amount: 0,
      };
      setParticipants([currentUserParticipant]);
    }
  }, [isOpen, user]);

  const resetFormState = () => {
    setActivityName("");
    setTotalCost(0);
    setDate("");
    setSearchTerm("");
    setParticipants([]);
    setSearchResults([]);
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

  const handleRemoveParticipant = (participantToRemove) => {
    setParticipants(
      participants.filter(
        (participant) => participant.id !== participantToRemove.id
      )
    );
  };

  const handleAmountChange = (participantId, newAmount) => {
    const amountToUpdate = newAmount === "" ? "" : Number(newAmount);
    setParticipants(
      participants.map((participant) =>
        participant.id === participantId
          ? { ...participant, amount: amountToUpdate }
          : participant
      )
    );
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
    resetFormState();
    onClose();
  };

  if (!isOpen) return null;

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
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            handleAddParticipant={handleAddParticipant}
          ></ParticipantSearchInput>
          {participants.length > 0 && (
            <div className="added-participants">
              {participants.map((participant) => (
                <span key={participant.id} className="participant-tag">
                  {participant.email} Amount:
                  <input
                    type="number"
                    id={`amount-${participant.id}`}
                    value={participant.amount}
                    min={0}
                    onChange={(e) =>
                      handleAmountChange(participant.id, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(participant)}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
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

export default CreateActivityModal;
