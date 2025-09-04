import DashboardPage from "./DashboardPage";
import LoginPage from "./LoginPage";

const AuthConsumer = () => {
  const { accessToken } = useContext(AuthContext);

  return (
    <>
      {accessToken ? <DashboardPage></DashboardPage> : <LoginPage></LoginPage>}
    </>
  );
};

export default AuthConsumer;
