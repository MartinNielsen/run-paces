import garth
import os
import json
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
load_dotenv()

def format_activity_for_ts(activity_details, activity_summary):
    """Formats a single activity into a TypeScript-ready dictionary."""
    
    metric_descriptors = {descriptor["key"]: descriptor["metricsIndex"] for descriptor in activity_details.get("metricDescriptors", [])}
    
    # Check if we have the required keys for coordinates and time
    if not all(k in metric_descriptors for k in ["directLatitude", "directLongitude", "directTimestamp"]):
        return None

    lat_idx = metric_descriptors["directLatitude"]
    lon_idx = metric_descriptors["directLongitude"]
    time_idx = metric_descriptors["directTimestamp"]

    coordinates = []
    timestamps = []

    for item in activity_details.get("activityDetailMetrics", []):
        metrics = item.get("metrics", [])
        # Ensure the metrics list is long enough and contains non-null lat/lon
        if len(metrics) > max(lat_idx, lon_idx, time_idx) and metrics[lat_idx] is not None and metrics[lon_idx] is not None:
            coordinates.append([metrics[lat_idx], metrics[lon_idx]])
            timestamps.append(metrics[time_idx])

    if not coordinates:
        return None

    activity_type = activity_summary.get("activityType", {}).get("typeKey", "unknown")
    formatted_type = activity_type.capitalize()

    return {
        "type": formatted_type,
        "coordinates": coordinates,
        "timestamps": timestamps,
    }

def main():
    """Main function to fetch data and generate the TypeScript data file."""

    token_file = Path.home() / ".garth"

    try:
        garth.resume(str(token_file))
        print(f"Successfully resumed session for {garth.client.username}")
    except Exception:
        print("No valid session found. Logging in...")
        email = os.getenv('GARMIN_USERNAME')
        password = os.getenv('GARMIN_PASSWORD')

        if not email or not password:
            print("GARMIN_USERNAME and GARMIN_PASSWORD must be set in the .env file.")
            return

        try:
            garth.login(email, password)
            garth.save(str(token_file))
            print(f"Successfully logged in as {garth.client.username}")
        except Exception as e:
            print(f"Login failed: {e}")
            return

    print("Fetching recent activities...")
    from datetime import date, timedelta
    today = date.today()
    ninety_days_ago = today - timedelta(days=90)

    activities = garth.connectapi(
        "/activitylist-service/activities/search/activities",
        params={"limit": 20, "startDate": str(ninety_days_ago)}
    )

    if not activities:
        print("No activities found in the last 90 days.")
        return

    print(f"Found {len(activities)} activities. Fetching details...")

    all_formatted_activities = []
    for activity in activities:
        activity_id = activity['activityId']
        print(f"Processing activity {activity_id}...")

        try:
            details = garth.connectapi(
                f"/activity-service/activity/{activity_id}/details"
            )

            formatted_activity = format_activity_for_ts(details, activity)
            
            if formatted_activity:
                all_formatted_activities.append(formatted_activity)
                print(f"  -> Successfully processed activity {activity_id}.")
            else:
                print(f"  -> Skipping activity {activity_id} due to missing or invalid GPS data.")

        except Exception as e:
            print(f"  -> ERROR processing activity {activity_id}: {e}")

    output_path = Path(__file__).parent.parent / "private-site" / "src" / "data" / "garminData.ts"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w") as f:
        f.write("import { Activity } from '../types/activity';\n")
        f.write("export const garminActivities: Activity[] = ")
        f.write(json.dumps(all_formatted_activities, indent=2))
        f.write(";\n")

    print(f"\nSuccessfully wrote {len(all_formatted_activities)} activities to {output_path}")

if __name__ == "__main__":
    main()

 