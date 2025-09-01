import "./styles/App.css";
import LoginPage from "./components/login/LoginPage.jsx";
import DashboardPage from "./components/dashboard/DashboardPage.jsx";
import { createContext, useState } from "react";

const AuthContext = createContext({ token: null });

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  return (
    <AuthContext.Provider value={{ token }}>
      {isLoggedIn ? <DashboardPage></DashboardPage> : <LoginPage></LoginPage>}
    </AuthContext.Provider>
  );
}

export default App;
