import ActivityItem from "./ActivityItem";

const ActivitiesList = ({ activities, onActivityStatusChange }) => {
  return (
    <>
      {activities.length > 0 && (
        <div>
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              onActivityStatusChange={onActivityStatusChange}
            ></ActivityItem>
          ))}
        </div>
      )}
    </>
  );
};

export default ActivitiesList;
