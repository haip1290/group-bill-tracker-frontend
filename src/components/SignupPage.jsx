import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "./FormField";

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
        const errorMsg = data.errors ? data.errors[0] : commonErrMsg;
        console.error("Failed to sign up", errorMsg);
        setError(errorMsg);
        throw new Error(errorMsg);
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
      <form onSubmit={handleSignup}>
        <FormField label={"Email: "} id={"email"}>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
        </FormField>
        <FormField label={"Password: "} id={"password"}>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </FormField>
        <div>
          <button type="submit" disabled={loading}>
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
