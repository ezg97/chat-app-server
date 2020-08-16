const router = require('express').Router();
//const jsonBodyParser = require('express').json();

const UserService = require('./user-service');

console.log('in the userRoutes');
// localhost:8000/users/links
router
    .route('/links/:data')
        .get((req,res,next) => {
            console.log('in links router');
            console.log(req.params);
            //grabbing the database and storing in a variable to pass to service object
            const knexInstance = req.app.get('db');
            //grab user id from the parameters of the url passed from client

            const userId = req.params.data;

            console.log({userId});
            if (userId == undefined) {
                console.log('not defined');
                res.send({});
            }
            
            if(userId.length > 0) {
                UserService.getUsersLinks(knexInstance, userId)
                    .then(links => {
                        console.log('returned from service request');
                        //serizlize and THEN return to user
                        console.log({links});
                        res.send(JSON.stringify(links))
                });
            }
        });

    //searched (get)
    //add
    //delete

    // endpoint for the search suggestions
router
.route('/search/:data')
    .get((req,res,next) => {
        console.log('in search router');
        console.log(req.params);
        //grabbing the database and storing in a variable to pass to service object
        const knexInstance = req.app.get('db');
        //grab user id from the parameters of the url passed from client

        const userName = req.params.data;

        console.log({userName});
        if (userName == undefined) {
            console.log('not defined');
            res.send({});
        }
        
        if(userName.length > 0) {
            UserService.getSuggestedUsers(knexInstance, userName)
                .then(users => {
                    console.log('returned from service request');
                    //serizlize and THEN return to user
                    const userArray = users.map(({user_name}) => user_name);

                    console.log({userArray});
                    res.send(JSON.stringify(userArray))
            });
        }
    });

        // localhost:8000/users/links
router
.route('/searched/:data')
    .get((req,res,next) => {
        console.log('in searchED router');
        console.log(req.params);
        //grabbing the database and storing in a variable to pass to service object
        const knexInstance = req.app.get('db');
        //grab user id from the parameters of the url passed from client

        const userName = req.params.data;

        console.log({userName});
        if (userName == undefined) {
            console.log('not defined');
            res.send({});
        }
        
        if(userName.length > 0) {
            UserService.getSearchedUsers(knexInstance, userName)
                .then(user => {
                    console.log('returned from service request');
                    //serizlize and THEN return to user
                    console.log({user});
                    res.send(JSON.stringify(user))
            });
        }
    });


module.exports = router;