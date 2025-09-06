import { useState, useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);
  /**
   * @description this function handle user's login
   * it call /login endpoint then pass data to @see handleLogin
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = { email, password };
    const URL = "http://localhost:5000/login";

    fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Login error ", res);
          setError(res.message);
          return res.json().then((data) => {
            throw new Error(data.message || "Login failed");
          });
        }
        return res.json();
      })
      .then((res) => {
        setLoading(false);
        const { accessToken, user } = res.data;
        handleLogin(accessToken, user);
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log("Fetch Error: ", err);
        setError(err.message || "Something went wrong");
        setLoading(false);
      });
  };
  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <button disabled={loading}>
            {loading ? "Logging in ..." : "Login"}
          </button>
        </div>
      </form>
      <Link to="/signup">Don't have an account yet? Sign Up here</Link>
      {error && <div>{error}</div>}
    </>
  );
};

export default LoginPage;
