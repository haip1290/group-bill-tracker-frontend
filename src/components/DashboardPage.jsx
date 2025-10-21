import { useAuthContext } from "./AuthProvider";
import NavBar from "./NavBar";
import ActivityBoard from "./ActivityBoard";

const DashboardPage = () => {
  const { user } = useAuthContext();
  

  return (
    <>
      <NavBar></NavBar>
      <div>
        <h1>Dashboard</h1>
        <h2>Welcome {user?.email}</h2>
      </div>
      <ActivityBoard></ActivityBoard>
    </>
  );
};

export default DashboardPage;
