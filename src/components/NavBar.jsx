import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./AuthProvider";

const NavBar = () => {
  const { user, handleLogout } = useAuthContext();
  const navigate = useNavigate();
  return (
    <nav>
      <span>Group Bill Tracker</span>
      <div>
        <span>Welcome, {user?.email}</span>
        <button
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          Dashboard
        </button>
        <button
          onClick={() => {
            navigate("/activities/new");
          }}
        >
          Create Activity
        </button>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
};

export default NavBar;
