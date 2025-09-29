import { useState } from "react";
import ParticipantSearchInput from "./ParticipantSearchInput";
import ParticipantsList from "./ParticipantsList";

const UpdateActivityForm = () => {
  const [activityName, setActivityName] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState([]);

  const handleAddParticipant = (participantToAdd) => {
    if (
      !participants.find(
        (participant) => participant.id === participantToAdd.id
      )
    ) {
      setParticipants([...participants, { ...participantToAdd, amount: 0 }]);
    }
  };
  return (
    <div>
      <h2>Update Activity</h2>
      <form>
        <div>
          <label htmlFor="activity-name">Activity Name: </label>
          <input
            type="text"
            name="activityName"
            id="activity-name"
            value={activityName}
            onChange={(e) => {
              setActivityName(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="total-cost">Total Cost: </label>
          <input
            type="number"
            name="totalCost"
            id="total-cost"
            value={totalCost}
            onChange={(e) => {
              setTotalCost(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="date">Date: </label>
          <input
            type="date"
            name="date"
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
          <button type="submit">Update</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateActivityForm;
