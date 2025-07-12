# Garmin 1km Bucket Pace Chart

This project fetches your latest running activity from Garmin Connect, calculates the pace for each kilometer, and generates a bar chart visualizing the pace for each 1km segment.

## Prerequisites

- Python 3.x
- A Garmin Connect account with MFA enabled or disabled.

## Setup

Follow these steps to set up the project for the first time.

### 1. Clone the repository

If you haven't already, clone this repository to your local machine.

### 2. Create a Virtual Environment

It's highly recommended to use a virtual environment to manage project dependencies. This keeps your global Python installation clean.

From the project root, run:
```bash
python -m venv venv
```
This will create a `venv` directory in your project folder.

### 3. Install Dependencies

Install the required Python libraries into your virtual environment.

**On Windows (PowerShell/CMD):**
```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

**On macOS/Linux:**
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Configure Your Credentials

The script uses a `.env` file to securely store your Garmin Connect credentials.

- Create a file named `.env` in the root of the project.
- Add your credentials to the file like this:

```
GARMIN_USERNAME="your-garmin-email@example.com"
GARMIN_PASSWORD="your-garmin-password"
```

## How to Run the Script

Once the setup is complete, you can run the script.

**On Windows (PowerShell/CMD):**
```powershell
.\venv\Scripts\python.exe main.py
```

**On macOS/Linux:**
(Ensure your virtual environment is activated first: `source venv/bin/activate`)
```bash
python main.py
```

### Multi-Factor Authentication (MFA)

The **first time** you run this script, you will be prompted to enter your MFA code in the terminal. After a successful login, your session will be saved locally (in a `.garth` directory in your home folder), and you will not need to enter your MFA code on subsequent runs.

## Output

The script will generate a `.png` file for each new running activity it finds. The files are named using the activity ID, for example: `activity_1234567890.png`.

When you run the script again, it will only generate charts for runs that do not already have a corresponding PNG file, making it safe to run on a schedule. 