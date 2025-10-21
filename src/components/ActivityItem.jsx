import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./AuthProvider";
import ParticipantTableRow from "./ParticipantTableRow";
import { useState } from "react";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const ActivityItem = ({ activity, onActivityStatusChange }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { fetchWithAuth } = useAuthContext();
  const navigate = useNavigate();
  // calculate summary info (total cost, total amount paid, etc...) from activity
  const totalPaid = activity.participants.reduce(
    (sum, participant) => sum + Number(participant.amount),
    0
  );
  const totalCost = activity.totalCost;
  const numberOfParticipants = activity.participants.length;
  const averageCost =
    numberOfParticipants > 0 ? totalCost / numberOfParticipants : 0;

  // get label and buttun text from activity status
  const statusText = ["unpaid", "paid"];
  const statusLabel = statusText[Number(activity.isFullyPaid)];
  const buttonText = statusText[Number(!activity.isFullyPaid)];

  const flipActivitiStatus = async () => {
    console.log(`Flip activity status`);
    // call BE API to change status
    const URL = `http://localhost:5000/activities/${activity.id}/paid`;
    const options = {
      method: "PATCH",
    };
    const res = await fetchWithAuth(URL, options);
    const data = await res.json();
    if (!res.ok) {
      const errorMessage =
        data.message || `Server return with status ${data.status}`;
      throw new Error(`Fail to flip activity status. ${errorMessage}`);
    }
    return data.data;
  };

  const onFlipStatus = () => {
    console.log("Flipping activity status");
    setLoading(true);
    setError("");
    flipActivitiStatus()
      .then((data) => {
        onActivityStatusChange();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError("Failed to flip status");
      });
  };
  return (
    <div>
      <h3>
        {activity.name} <span>{statusLabel}</span>
      </h3>
      <button onClick={onFlipStatus}>
        {loading ? "Flipping..." : buttonText}
      </button>
      <p>{error}</p>
      <p>Date: {activity.date.split("T")[0]}</p>
      <div>
        <h4>Summary: </h4>
        <span>Participants: {numberOfParticipants}</span>
        <span>Total Cost: {formatCurrency(totalCost)}</span>
        <span>Cost per person: {formatCurrency(averageCost)}</span>
        <span>Total Paid: {formatCurrency(totalPaid)}</span>
      </div>
      <div>
        <h4>Detail Breakdown:</h4>
        <table>
          <thead>
            <tr>
              <th>Participant</th>
              <th>Paid</th>
              <th>Owes</th>
            </tr>
          </thead>
          <tbody>
            {activity.participants.map((participant) => (
              <ParticipantTableRow
                key={participant.id}
                participant={participant}
                averageCost={averageCost}
                formatCurrency={formatCurrency}
              ></ParticipantTableRow>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => {
            navigate(`/activities/${activity.id}/update`);
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ActivityItem;
