import { activityColor } from '../config';

const Legend = () => {
  const activityTypes = [
    { name: 'Run', type: 'run' },
    { name: 'Hike', type: 'hike' },
    { name: 'Cycle', type: 'cycle' },
  ];

  return (
    <div className="absolute top-5 right-5 z-[1000] bg-white p-2 border-2 border-gray-400 rounded-md shadow-lg">
      <h3 className="text-lg font-bold mb-2">Activity Legend</h3>
      <ul>
        {activityTypes.map((activity) => (
          <li key={activity.name} className="flex items-center mb-1 font-bold">
            <span style={{ color: activityColor[activity.type] }}>
              {activity.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Legend;