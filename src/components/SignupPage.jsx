import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      setError(null);

      const commonErrMsg = "Failed to sign up";
      const URL = "http://localhost:5000/register";
      const payload = { email, password };

      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        const errMsg = data.errors[0];
        console.error("Failed to sign up", errMsg);
        throw new Error(errMsg);
      }
      navigate("/login");
    } catch (error) {
      console.error("Faled to sign up ", error);
      setError(error.message || commonErrMsg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <h1>Signup</h1>
      <form>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div>
          <button onClick={handleSignup}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </form>
      <div>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      {error && <div>{error}</div>}
    </>
  );
};

export default SignupPage;
