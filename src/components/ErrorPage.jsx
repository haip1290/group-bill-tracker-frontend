import { useLocation } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";

const ErrorPage = () => {
  const location = useLocation();
  const message = location.state?.message || "Unexpected error occurred.";
  return (
    <div>
      <h1>Internal Server Error</h1>
      <ErrorMessage message={message}></ErrorMessage>
      <p>Please try again.</p>
      <Link to="/login">Login</Link>
    </div>
  );
};

export default ErrorPage;
