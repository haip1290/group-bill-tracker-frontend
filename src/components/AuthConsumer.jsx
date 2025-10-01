import DashboardPage from "./DashboardPage";
import LoginPage from "./LoginPage";
import { useAuthContext } from "./AuthProvider";

const AuthConsumer = () => {
  const { accessToken } = useAuthContext();

  return (
    <>
      {accessToken ? <DashboardPage></DashboardPage> : <LoginPage></LoginPage>}
    </>
  );
};

export default AuthConsumer;
