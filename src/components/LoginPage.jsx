import { useState } from "react";

const LoginPage = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { handleLogin } = useContext(AuthContext);

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
          console.log("Login error ", res);
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
        <label htmlFor="email">Email: </label>
        <input
          type="text"
          placeholder="Email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button disabled={loading}>
          {loading ? "Logging in ..." : "Login"}
        </button>
      </form>
      {error && <div>{error}</div>}
    </>
  );
};

export default LoginPage;
