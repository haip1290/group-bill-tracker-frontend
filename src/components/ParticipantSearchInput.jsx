import { useEffect, useState } from "react";
import { useAuthContext } from "./AuthProvider";

const ParticipantSearchInput = ({ handleAddParticipant }) => {
  const { fetchWithAuth } = useAuthContext();
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
          const users = data.data.users;
          const participants = users.map((user) => ({
            accountId: user.id,
            email: user.email,
          }));
          setSearchResults(participants);
          console.log("Finished searching for participants");
        } catch (error) {
          console.error("Error fetching for participants ", error);
          setSearchResults([]);
        }
      };
      fetchParticipants();
      // console.log("Participants ", searchResults);
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
      <input
        type="text"
        id="participants"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />
      {searchResults.length > 0 && (
        <div className="search-results-dropdown">
          {searchResults.map((participant) => (
            <div
              key={participant.accountId}
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
