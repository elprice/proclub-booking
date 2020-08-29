const request = require('request').defaults({jar: true});
const cookies = request.jar();
const credentials = require('./credentials.json');
const classes = require('./data/classes.json');
const schedule = require('./schedule.json');
// https://studiobookingsonline.com/proclub-belfitness/clientclasscalendar/index/id/37647/id/81


// 6 PM unsupervised workout is 40 for weekdays and 98 for weekends ?

// 20078_40 8/25
// 20079_40 8/26
// 20080_40 8/27
// 20081_40 8/28

// weekend (sat/sun slots) look like this
// 43883_98 8/29
// 43884_98 8/30
// 43885_98 9/05

// 3 chars ? -> incremented value -> recurrclassid
// classid

// proclub-belfitness/clientclasscalendar/index/id/20078/id/40

/* const API = {
    SIGNIN : {
        URL: 'https://studiobookingsonline.com/proclub-belfitness/login/signin',
        FORM: {
            'username': credentials.username,
            'password': credentials.password,
            'actioninfo': 'Log In',
            'referer': null,
            'workshop_id':  null,
            'submit': null
        }
    },
    CHECK_AVAILABILITY: {
        URL: 'https://studiobookingsonline.com/proclub-belfitness/clientclasscalendar/checkavailable',
        FORM: {
            classids: classid
        }
    },
    BOOK_MULTIPLE_CLASS: {
        URL: 'https://studiobookingsonline.com/proclub-belfitness/clientclasscalendar/bookmutipleclass',
        FORM: {
            'bookclass[]': classid,
            'hdwaitinglist': null,
            'booknow': 'Book Now'
        }
    }
}*/


// all this date logic will probably break if your computer doing weird things
// maybe one day it will get fixed to unix time
const MAX_DAYS_TO_TRY = 3;
const DAY_IN_MS = 86400000;
const now = Date.now();

// ours is 1598662800000
//1598637600000 is their 6pm 8/28

// use military hours in the schedule.json file (18 -> 6pm)
const timesToCheck = [];
for (let i = 0; i < MAX_DAYS_TO_TRY; i++) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + i);
    const dayOfWeek = targetDate.toLocaleString('en-us', {weekday: 'long'});
    const scheduleHour = schedule[dayOfWeek];
    const offsetInMS = targetDate.getTimezoneOffset() * 60 * 1000;
    if (scheduleHour) {
        targetDate.setHours(scheduleHour, 0, 0, 0);
        timesToCheck.push(targetDate.getTime() - offsetInMS);
    }
}

// now we have classes to find and schedule

for (const target of timesToCheck) {
    for (const slot of classes) {
        if (slot.start == target) {
            console.log('found this shit');
        }
    }
}

console.log(today);
/* request.post({url: API.SIGNIN.URL, jar: cookies, form:API.SIGNIN.FORM},
    function(err, res, body){
        request.post({url: API.CHECK_AVAILABILITY.URL, jar: cookies, form: API.CHECK_AVAILABILITY.FORM},
            function(err, res, body){
                if(body == '1'){
                    request.post({url: API.BOOK_MULTIPLE_CLASS.URL, jar:cookies, form: API.BOOK_MULTIPLE_CLASS.FORM},
                        function(err, res, body){
                            console.log('Booking should have succeeded. Please check your email for confirmation. Please note that if a class is more than 3 days away it will not be booked and will not send an email but will not display an error.')
                        }
                    )
                }else{
                    console.log(body)
                }
            }
        )
    }
)*/

