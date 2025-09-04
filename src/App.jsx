import "./styles/App.css";
import AuthProvider from "./components/AuthProvider";
import AuthConsumer from "./components/AuthConsumer"

function App() {
  return (
    <AuthProvider>
      <AuthConsumer></AuthConsumer>
    </AuthProvider>
  );
}

export default App;
