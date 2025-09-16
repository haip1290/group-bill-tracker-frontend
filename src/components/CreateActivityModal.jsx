const CreateActivityModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Activity</h2>
        <form>
          <div>
            <label htmlFor="">Activity Name: </label>
            <input type="text" id="activity-name" />
          </div>
          <div>
            <button type="submit" onClick={onClose}>
              Create
            </button>
          </div>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CreateActivityModal;
