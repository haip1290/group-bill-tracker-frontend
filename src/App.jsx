import "./styles/App.css";
import AuthProvider from "./components/AuthProvider";
import AuthConsumer from "./components/AuthConsumer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="*" element={<ProtectedRoute />}></Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
