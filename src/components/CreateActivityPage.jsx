import CreateActivityForm from "./CreateActivityForm";
import NavBar from "./NavBar";
import { AuthContext } from "./AuthProvider";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateActivityPage = () => {
  const { fetchWithAuth } = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleCreateActivitySubmition = async (activityData) => {
    try {
      // call backend to create activity
      const URL = "http://localhost:5000/activities";
      const res = await fetchWithAuth(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData),
      });
      // check if res from fetch return error
      if (!res.ok) {
        console.log("Failed to create activity");
      }
      // navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating activity ", error);
      setErrorMsg(error.message);
    }
  };

  return (
    <>
      <NavBar></NavBar>
      <CreateActivityForm
        onCreateActivity={handleCreateActivitySubmition}
        errorMsg={errorMsg}
      ></CreateActivityForm>
    </>
  );
};

export default CreateActivityPage;
