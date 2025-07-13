import { Polyline } from 'react-leaflet';
import { mockActivities } from '../mock-data';
import { activityColor } from '../config';

function ActivityPolylines() {
  return (
    <>
      {mockActivities.map((activity, index) => (
        <Polyline
          key={index}
          positions={activity.coordinates}
          color={activityColor[activity.type]}
        />
      ))}
    </>
  );
}

export default ActivityPolylines;