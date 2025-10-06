import { useAuthContext } from "./AuthProvider";

const ParticipantsList = ({
  participants,
  handleAmountChange,
  handleRemoveParticipant,
}) => {
  const { user } = useAuthContext();

  const isUser = (participant) => {
    return user.email === participant.email;
  };
  const oneAmountChange = (participantAccountId, newAmount) => {
    const amountToUpdate = newAmount === "" ? "" : Number(newAmount);
    handleAmountChange(participantAccountId, amountToUpdate);
  };

  return (
    <>
      {participants.length > 0 && (
        <div>
          {participants.map((participant) => (
            <span key={participant.accountId}>
              {participant.email} Amount:
              <input
                type="number"
                id={`amount-${participant.accountId}`}
                value={participant.amount}
                min={0}
                onChange={(e) =>
                  oneAmountChange(participant.accountId, e.target.value)
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
