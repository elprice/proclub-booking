const fs = require('fs');
const calendar = require('./calendar.json');

/* var sample = {
    "title":"VXBzdGFpcnMgTm9ydGggJiBTb3V0aCBGaXRuZXNzIENlbnRlcg==",
    "text_class":"",
    "start":1597039200000,
    "end":1597042500000,
    "className":"#cd74e6",
    "id":"1_1",
    "instructor":"RkMgVGVhbSA=",
    "classimage":"",
    "operation_type":"1",
    "class_location":null,
    "from_to":" - 2020-08-10 06:00 AM 06:55 AM",
    "booked_slot":"44\/46"
}*/

simplifyWorkout = (workout) => {
    return {
        'title': Buffer.from(workout.title, 'base64').toString(),
        'start': workout.start,
        'end': workout.end,
        'id': workout.id,
        'from_to': workout.from_to.substring(3, workout.from_to.length),
        'booked_slot': workout.booked_slot,
    };
};

const workouts = [];

for (const workout of calendar) {
    const title = Buffer.from(workout.title, 'base64').toString();
    if (title.includes('Free Weight')) {
        workouts.push(simplifyWorkout(workout));
    }
}

workouts.sort((a, b) => a.start - b.start );

const outputPath = './data/classes.json';
fs.writeFile(outputPath,
    JSON.stringify(workouts),
    (err) => {
        if (!err) return;
        console.log(err);
    }
);

