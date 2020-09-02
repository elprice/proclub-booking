# proclub-booking
a script for bypassing the studiobookingsonline page to reserve your free weights workout slot at pro club

# usage
1. clone the repo
2. install node js [https://nodejs.org/en/](https://nodejs.org/en/)
3. navigate to the repo directory `npm install`
4. set your credentials in the `credentials.json` file. This supports multiple users.
5. set the hour your workout start hour for each day in MILITARY time within `schedule.json`
6. `node start` to run the app. You may set it to run daily with a scheduled task if you have a set schedule.

## notes: 
* hard coded for 'Free Weight Center Access' and 'Free Weights 2 (Previously Cardio Theatre)' slots
* hard coded to only check 3 days into the future at this time (per the booking websites reservation rules)
* meant to be a very quick and time saving solution to avoid the painful website booking website
* at this time I did not find a great way to verify that the booking succeeded. please confirm via email that the booking succeeded after running the script
