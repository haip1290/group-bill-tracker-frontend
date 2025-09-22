import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";

const CreateActivityModal = ({ isOpen, onClose, onCreateActivity }) => {
  const { fetchWithAuth } = useContext(AuthContext);
  const [activityName, setActivityName] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [date, setDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [participants, setParticipants] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // handle searching for participant
  useEffect(() => {
    // only search if there is at lest 3 chars
    if (searchTerm.length > 2) {
      const fetchParticipants = async () => {
        console.log("Searching for participants");
        try {
          const URL = `http://localhost:5000/users/search?q=${searchTerm}`;
          const res = await fetchWithAuth(URL);

          if (!res.ok) {
            console.error("Error fetching for participant");
          }
          const data = await res.json();
          setSearchResults(data.data.users);
          console.log("Finished searching for participants");
        } catch (error) {
          console.error("Error fetching for participants ", error);
          setSearchResults([]);
        }
      };
      fetchParticipants();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleAddParticipant = (participantToAdd) => {
    if (
      !participants.find(
        (participant) => participant.id === participantToAdd.id
      )
    ) {
      setParticipants([...participants, { ...participantToAdd, amount: 0 }]);
      setSearchTerm("");
      setSearchResults([]);
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
    onCreateActivity({
      name: activityName,
      totalCost,
      date,
      users: participants.map((participant) => ({
        userId: participant.id,
        amount: participant.amount,
      })),
    });
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
          <div>
            <label htmlFor="participants">Participants (seach by email):</label>
            <input
              type="text"
              id="participants"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
          {searchResults.length > 0 && (
            <div className="search-results-dropdown">
              {searchResults.map((participant) => (
                <div
                  key={participant.id}
                  onClick={() => handleAddParticipant(participant)}
                >
                  {participant.email}
                </div>
              ))}
            </div>
          )}
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
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CreateActivityModal;
