import { useState } from "react";

const URL = "http://localhost:5000";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit");
    fetch(URL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Error in login");
        }
        return res.json();
      })
      .then((data) => console.log(data))
      .catch((err) => console.log("Fetch Error: ", err));
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
        <button>Login</button>
      </form>
    </>
  );
};

export default LoginPage;
