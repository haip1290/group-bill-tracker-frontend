const ParticipantTableRow = ({ participant, formatCurrency, averageCost }) => {
  const paid = participant.amount;
  const balance = paid - averageCost;
  const owes = balance < 0 ? Math.abs(balance) : 0;
  const owedBack = balance > 0 ? balance : 0;
  const balanceText =
    balance < 0
      ? `Owes: ${formatCurrency(owes)}`
      : balance > 0
        ? `Gets Back: ${formatCurrency(owedBack)}`
        : `Settle`;
  return (
    <tr>
      <td>{participant.email}</td>
      <td>{formatCurrency(paid)}</td>
      <td>{balanceText}</td>
    </tr>
  );
};

export default ParticipantTableRow;
