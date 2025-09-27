import ActivitiesList from "./ActivitiesList";
import CreateActivityForm from "./CreateActivityForm";

const DashboardContent = ({
  isFormOpen,
  loading,
  activities,
  message,
  handleCloseForm,
  handleFormSubmition,
}) => {
  if (loading) {
    return <div>Loading...</div>;
  }
  if (message) {
    return <div>Error: {message}</div>;
  }
  if (isFormOpen) {
    return (
      <CreateActivityForm
        onClose={handleCloseForm}
        onCreateActivity={handleFormSubmition}
      ></CreateActivityForm>
    );
  }

  return <ActivitiesList activities={activities}></ActivitiesList>;
};

export default DashboardContent;
