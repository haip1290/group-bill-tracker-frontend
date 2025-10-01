const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div>
      <strong>Error:</strong> {message}
    </div>
  );
};

export default ErrorMessage;
