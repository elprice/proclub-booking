/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */

class ApiHelper {
    constructor(username, password, classid) {
        this.username = username;
        this.password = password;
        this.classid = classid;
        this.API = {
            SIGNIN: {
                URL: 'https://studiobookingsonline.com/proclub-belfitness/login/signin',
                FORM: {
                    'username': this.username,
                    'password': this.password,
                    'actioninfo': 'Log In',
                    'referer': null,
                    'workshop_id': null,
                    'submit': null
                }
            },
            CHECK_AVAILABILITY: {
                URL: 'https://studiobookingsonline.com/proclub-belfitness/clientclasscalendar/checkavailable',
                FORM: {
                    classids: this.classid
                }
            },
            BOOK_MULTIPLE_CLASS: {
                URL: 'https://studiobookingsonline.com/proclub-belfitness/clientclasscalendar/bookmutipleclass',
                FORM: {
                    'bookclass[]': this.classid,
                    'hdwaitinglist': null,
                    'booknow': 'Book Now'
                }
            }
        };
    };
};

module.exports = {
    ApiHelper
};
