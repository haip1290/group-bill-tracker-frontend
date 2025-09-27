const ActivityItem = ({ activity }) => {
  const totalPaid = activity.participants.reduce(
    (sum, participant) => sum + Number(participant.amount),
    0
  );
  const totalCost = activity.totalCost;
  const numberOfParticipants = activity.participants.length;
  const averageCost =
    numberOfParticipants > 0 ? totalCost / numberOfParticipants : 0;
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  return (
    <div>
      <h3>{activity.name}</h3>
      <p>Date: {activity.date.split("T")[0]}</p>
      <div>
        <h4>Summary: </h4>
        <span>Total Cost: {formatCurrency(totalCost)}</span>
        <span>Participants: {numberOfParticipants}</span>
        <span>Cost per person: {formatCurrency(averageCost)}</span>
        <span>Total Paid: {formatCurrency(totalPaid)}</span>
      </div>
      <div>
        <h4>Detail Breakdown:</h4>
        <table>
          <thead>
            <th>Participant</th>
            <th>Paid</th>
            <th>Owes</th>
          </thead>
          <tbody>
            {activity.participants.map((participant) => {
              const paid = participant.amount;
              const balance = paid - averageCost;
              const owes = balance < 0 ? Math.abs(balance) : 0;
              const owedBack = balance > 0 ? balance : 0;

              return (
                <tr key={participant.id}>
                  <td>{participant.email}</td>
                  <td>{formatCurrency(paid)}</td>
                  <td>
                    {balance < 0
                      ? `Owes: ${formatCurrency(owes)}`
                      : balance > 0
                        ? `Gets Back: ${formatCurrency(owedBack)}`
                        : `Settle`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityItem;
