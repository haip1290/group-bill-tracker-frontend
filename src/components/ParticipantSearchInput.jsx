import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";

const ParticipantSearchInput = ({ handleAddParticipant }) => {
  const { fetchWithAuth } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // handle searching for participant
  useEffect(() => {
    // only search if there is at lest 3 chars
    if (searchTerm.length > 2) {
      const fetchParticipants = async () => {
        console.log("Searching for participants");
        try {
          const URL = `http://localhost:5000/users/search?q=${searchTerm}`;
          const res = await fetchWithAuth(URL);

          if (!res.ok) {
            console.error("Error fetching for participant");
          }
          const data = await res.json();
          setSearchResults(data.data.users);
          console.log("Finished searching for participants");
        } catch (error) {
          console.error("Error fetching for participants ", error);
          setSearchResults([]);
        }
      };
      fetchParticipants();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const onParticipantSelect = (participant) => {
    handleAddParticipant(participant);
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <>
      <div>
        <label htmlFor="participants">Participants (seach by email):</label>
        <input
          type="text"
          id="participants"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </div>
      {searchResults.length > 0 && (
        <div className="search-results-dropdown">
          {searchResults.map((participant) => (
            <div
              key={participant.id}
              onClick={() => onParticipantSelect(participant)}
            >
              {participant.email}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ParticipantSearchInput;
