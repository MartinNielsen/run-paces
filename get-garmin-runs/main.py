import garth
import os
from dotenv import load_dotenv
import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path

# Load environment variables from .env file
load_dotenv()

def get_pace_per_km(laps):
    """Calculate pace in minutes per kilometer for each lap."""
    pace_per_km = []
    for lap in laps:
        # Assuming each lap is roughly 1km
        if 950 < lap['distance'] < 1050:
            duration_min = lap['duration'] / 60.0
            pace_per_km.append(duration_min)
    return pace_per_km

def generate_chart(pace_data, filename, activity):
    """Generate and save a bar chart of the pace data."""
    if not pace_data:
        print("No 1km lap data found to generate a chart.")
        return

    labels = [f"{i+1} km" for i in range(len(pace_data))]

    plt.style.use('ggplot')
    fig, ax = plt.subplots(figsize=(10, 6))

    ax.bar(labels, pace_data, color='skyblue')

    ax.set_ylabel('Pace (min/km)')
    ax.set_xlabel('Distance (km)')
    start_time = activity.get("startTimeLocal", "Unknown Time")
    ax.set_title(f'Pace per Kilometer for Run on {start_time}')

    # Add pace values on top of bars
    for i, pace in enumerate(pace_data):
        ax.text(i, pace + 0.05, f'{pace:.2f}', ha='center', color='black')

    plt.tight_layout()
    plt.savefig(filename)
    plt.close(fig)  # Close the figure to free up memory
    print(f"Saved chart as {filename}")

def main():
    """Main function to fetch data and generate chart."""

    token_file = Path.home() / ".garth"

    try:
        # Try to resume a session
        garth.resume(str(token_file))
        print(f"Successfully resumed session for {garth.client.username}")
    except Exception:
        # If resume fails, login
        print("No valid session found. Logging in...")
        email = os.getenv('GARMIN_USERNAME')
        password = os.getenv('GARMIN_PASSWORD')

        if not email or not password:
            print("GARMIN_USERNAME and GARMIN_PASSWORD must be set in the .env file.")
            return

        try:
            # This will prompt for MFA if it's enabled and not already handled
            garth.login(email, password)
            garth.save(str(token_file))
            print(f"Successfully logged in as {garth.client.username}")
        except Exception as e:
            print(f"Login failed: {e}")
            return

    # Fetch recent running activities
    print("Fetching recent running activities...")
    from datetime import date, timedelta
    today = date.today()
    ninety_days_ago = today - timedelta(days=90)

    activities = garth.connectapi(
        "/activitylist-service/activities/search/activities",
        params={
            "limit": 20,
            "startDate": str(ninety_days_ago),
            "activityType": "running"
        }
    )
    if not activities:
        print("No activities found in the last 90 days.")
        return
        
    running_activities = [
        act for act in activities
        if act.get("activityType", {}).get("typeKey") == "running"
    ]

    if not running_activities:
        print("No running activities found in the last 90 days.")
        return

    print(f"Found {len(running_activities)} running activities in the last 90 days.")

    # Process each running activity
    for activity in running_activities:
        activity_id = activity['activityId']
        filename = f"activity_{activity_id}.png"

        if Path(filename).exists():
            print(f"Chart '{filename}' already exists. Skipping.")
            continue

        print(f"Processing new activity: {activity_id} from {activity.get('startTimeLocal', 'N/A')}")

        # Fetch detailed data (laps) for the activity
        laps = garth.connectapi(
            f"/activity-service/activity/{activity_id}/splits"
        )

        if not laps or 'lapDTOs' not in laps:
            print(f"Could not retrieve laps for activity {activity_id}.")
            continue

        pace_data = get_pace_per_km(laps['lapDTOs'])

        if not pace_data:
            print(f"No 1km lap data found for activity {activity_id}.")
            continue

        generate_chart(pace_data, filename, activity)


if __name__ == "__main__":
    main() 