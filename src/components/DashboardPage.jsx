import { useContext } from "react";

const DashboardPage = ({ user, handleLogout }) => {
  const { user, handleLogout } = useContext(AuthContext);
  return (
    <>
      <h1>Dashboard</h1>
      <h2>Hello {user?.email}</h2>
      <button onClick={handleLogout}>Log out</button>
    </>
  );
};

export default DashboardPage;
