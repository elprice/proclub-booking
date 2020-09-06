/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

const request = require('request').defaults({jar: true});
const credentials = require('./credentials.json');
const classes = require('./data/classes.json');
const schedule = require('./schedule.json');
const ApiHelper = require('./ApiHelper').ApiHelper;

const MAX_DAYS_TO_TRY = 3;
const NUM_USERS = credentials.logins.filter((login) => login.username && login.password).length;
let successfulRequests = 0;

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

const classesToSchedule = [];
for (const target of timesToCheck) {
    for (const slot of classes) {
        if (slot.start == target) {
            classesToSchedule.push(slot);
        }
    }
}

console.log('Will attempt to schedule these dates: \n' + [...new Set(classesToSchedule.map((slot) => slot.from_to))].join('\n'));

for (const user of credentials.logins) {
    if (user.username && user.password) {
        for (const slot of classesToSchedule) {
            if (slot.title == 'Free Weight Center Access') {
                const cookies = request.jar();
                const apiHelper = new ApiHelper(user.username, user.password, slot.id);
                request.post({url: apiHelper.API.SIGNIN.URL, jar: cookies, form: apiHelper.API.SIGNIN.FORM},
                    function(err, res, body) {
                        if ( !res.headers['location']) {
                            console.log('Login failed. Check credentials or blame the programmer.');
                            process.exit(1);
                        } else {
                            request.post({url: apiHelper.API.CHECK_AVAILABILITY.URL, jar: cookies, form: apiHelper.API.CHECK_AVAILABILITY.FORM},
                                function(err, res, body) {
                                    if (body == '1') {
                                        request.post({url: apiHelper.API.BOOK_MULTIPLE_CLASS.URL, jar: cookies, form: apiHelper.API.BOOK_MULTIPLE_CLASS.FORM},
                                            function(err, res, body) {
                                                console.log(successMaybeMessage(slot));
                                                successfulRequests++;
                                            });
                                    } else {
                                        console.log(fallbackMessage(slot));
                                        const index = classesToSchedule.indexOf(slot);
                                        // because of sorting the next slot in the list should be the free weights 2 slot.. so try it now
                                        if (index+1 < classesToSchedule.length && classesToSchedule[index+1].title == 'Free Weights 2 (Previously Cardio Theatre)') {
                                            const fallbackApiHelper = new ApiHelper(user.username, user.password, classesToSchedule[index+1].id);
                                            request.post({url: fallbackApiHelper.API.CHECK_AVAILABILITY.URL, jar: cookies, form: fallbackApiHelper.API.CHECK_AVAILABILITY.FORM},
                                                function(err, res, body) {
                                                    if (body == '1') {
                                                        request.post({url: fallbackApiHelper.API.BOOK_MULTIPLE_CLASS.URL, jar: cookies, form: fallbackApiHelper.API.BOOK_MULTIPLE_CLASS.FORM},
                                                            function(err, res, body) {
                                                                console.log(successMaybeMessage(classesToSchedule[index+1]));
                                                                successfulRequests++;
                                                            });
                                                    } else {
                                                        console.log(failureMessage(classesToSchedule[index+1]));
                                                    }
                                                }
                                            );
                                        }
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    }
}

function successMaybeMessage(slot) {
    return 'Booking should have succeeded for classid ' + slot.id + ' at ' + slot.from_to + '.';
}

function fallbackMessage(slot) {
    return 'Free Weight Center Access was unavailable for ' + slot.from_to + '. Will fallback to second slot now.';
}

function failureMessage(slot) {
    return 'Failed for ' + slot.id + ' at ' + slot.from_to + '. Check your email to confirm. Check the website to be sure.';
}

// block the script from exiting
(function wait() {
    if (successfulRequests < ((classesToSchedule.length/2) * NUM_USERS)) setTimeout(wait, 5000);
})();
