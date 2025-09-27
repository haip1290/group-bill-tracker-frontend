import ActivityItem from "./ActivityItem";

const ActivitiesList = ({ activities }) => {
  return (
    <>
      {activities.length > 0 && (
        <div>
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity}></ActivityItem>
          ))}
        </div>
      )}
    </>
  );
};

export default ActivitiesList;
