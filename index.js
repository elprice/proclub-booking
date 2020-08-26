var request = require('request')
var request = request.defaults({jar:true})
var cookies = request.jar()
var credspluscalendar = require('./credsplusdates.json')


//https://studiobookingsonline.com/proclub-belfitness/clientclasscalendar/index/id/37647/id/81


//6 PM unsupervised workout is 40 for weekdays and 98 for weekends ?

//20078_40 8/25
//20079_40 8/26
//20080_40 8/27
//20081_40 8/28 

//weekend (sat/sun slots) look like this
//43883_98 8/29
//43884_98 8/30
//43885_98 9/05

// 3 chars ? -> incremented value -> recurrclassid
// classid

///proclub-belfitness/clientclasscalendar/index/id/20078/id/40

var classid = '20081_40'

const API = {
    SIGNIN : {
        URL: 'https://studiobookingsonline.com/proclub-belfitness/login/signin',
        
        FORM: {
            'username': credspluscalendar.username,
            'password': credspluscalendar.password,
            'actioninfo': 'Log In',
            'referer': null,
            'workshop_id':  null,
            'submit': null
        }
    },
    CHECK_AVAILABILITY: {
        URL: 'https://studiobookingsonline.com/proclub-belfitness/clientclasscalendar/checkavailable',
        HEADERS: {},
        FORM: {
            classids: classid 
        }
    },
    BOOK_MULTIPLE_CLASS: {
        URL: 'https://studiobookingsonline.com/proclub-belfitness/clientclasscalendar/bookmutipleclass',
        HEADERS: {},
        FORM: {
            'bookclass[]': classid,
            'hdwaitinglist': null,
            'booknow': 'Book Now'
        }
    }
}



request.post({url: API.SIGNIN.URL, jar: cookies, form:API.SIGNIN.FORM}, 
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
)


