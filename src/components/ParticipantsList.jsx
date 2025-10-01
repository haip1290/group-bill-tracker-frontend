import { useAuthContext } from "./AuthProvider";

const ParticipantsList = ({ participants, setParticipants }) => {
  const { user } = useAuthContext();
  const isUser = (participant) => {
    return user.email === participant.email;
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
  const handleRemoveParticipant = (participantToRemove) => {
    setParticipants(
      participants.filter(
        (participant) => participant.id !== participantToRemove.id
      )
    );
  };
  return (
    <>
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
              {!isUser(participant) && (
                <button
                  type="button"
                  onClick={() => handleRemoveParticipant(participant)}
                >
                  &times;
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </>
  );
};

export default ParticipantsList;
