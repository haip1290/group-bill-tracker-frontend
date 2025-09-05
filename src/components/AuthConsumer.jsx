import DashboardPage from "./DashboardPage";
import LoginPage from "./LoginPage";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

const AuthConsumer = () => {
  const { accessToken } = useContext(AuthContext);

  return (
    <>
      {accessToken ? <DashboardPage></DashboardPage> : <LoginPage></LoginPage>}
    </>
  );
};

export default AuthConsumer;
