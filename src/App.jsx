import "./styles/App.css";
import LoginPage from "./components/LoginPage.jsx";
import DashboardPage from "./components/DashboardPage.jsx";
import { useState } from "react";

function App() {
  const storedUser = localStorage.getItem("user");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [jwtToken, setJwtToken] = useState(localStorage.getItem("jwt"));

  const handleLogin = (data) => {
    const { token, user } = data;
    setJwtToken((preToken) => token);
    setUser(user);

    localStorage.setItem("jwt", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setJwtToken(null);
    setUser(null);

    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
  };

  return (
    <>
      {jwtToken ? (
        <DashboardPage user={user} handleLogout={handleLogout}></DashboardPage>
      ) : (
        <LoginPage handleLogin={handleLogin}></LoginPage>
      )}
    </>
  );
}

export default App;
