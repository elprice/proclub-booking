# proclub-booking
A script for bypassing the studiobookingsonline page to reserve your free weights workout slot at pro club

# Usage
1. Clone the repo
2. Install [nodejs](https://nodejs.org/en/)
3. `npm install` in the repo directory
4. Set your credentials in `credentials.json`. This supports multiple logins
5. Set your workout start hour for each day in local MILITARY time in `schedule.json` (E.g. 14 = 2pm)
6. `npm start` to run the app. Feel free to set it to run daily using a scheduled task/cron job
7. A looping condition check prevents the script from closing until all requests succeed (terrible I know). Crash with Ctrl+C if stuck. This may cause issues with scheduled task/cron job automation

## Notes: 
* I am not responsible for any issues resulting from the use of this script regarding your account(s) or relationship with proclub or studiobookingsonline
* This project is:
  * hard coded for 'Free Weight Center Access' and 'Free Weights 2 (Previously Cardio Theatre)' slots
  * hard coded to only check 3 days into the future at this time (per the booking websites reservation rules)
  * meant to be a very quick and time saving solution to avoid the painful website booking website
* At this time I did not find a great way to verify that the booking succeeded. Please confirm via email that the booking succeeded after running the script (takes 30s or more sometimes to receive email)
