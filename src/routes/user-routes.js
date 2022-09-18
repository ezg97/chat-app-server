const router = require('express').Router();
const express = require('express');
const jsonParser = express.json();

//const jsonBodyParser = require('express').json();

const UserService = require('./user-service');

////console.log('in the userRoutes');
// localhost:8000/users

//  /LINKS/:DATA   ->   GET
router
    .route('/links/:data')
        // GET
        .get((req,res,next) => {
            ////console.log('in links router');
            ////console.log(req.params);
            //grabbing the database and storing in a variable to pass to service object
            const knexInstance = req.app.get('db');
            //grab user id from the parameters of the url passed from client

            const userId = req.params.data;

            ////console.log({userId});
            if (userId == undefined) {
                ////console.log('not defined');
                res.send({});
            }
            
            if(userId.length > 0) {
                UserService.getUsersLinks(knexInstance, userId)
                    .then(links => {
                        ////console.log('returned from service request');
                        //serizlize and THEN return to user
                        const linkArray = links.map(({toid}) => toid)
                        ////console.log({linkArray});
                        res.send(JSON.stringify(linkArray))
                }).catch((error) => {
                    console.log('Error - ur-GUL: ', error);
                });
            }
        });
        

    //searched (get)
    //add
    //delete

    // endpoint for the search suggestions
router
//   /SEARCH/:DATA   ->   GET
.route('/search/:data')
    // GET
    .get((req,res,next) => {
        ////console.log('in search router');
        ////console.log(req.params);
        //grabbing the database and storing in a variable to pass to service object
        const knexInstance = req.app.get('db');
        //grab user id from the parameters of the url passed from client

        const userName = req.params.data;

        ////console.log({userName});
        if (userName == undefined) {
            ////console.log('not defined');
            res.send({});
        }
        
        if(userName.length > 0) {
            UserService.getSuggestedUsers(knexInstance, userName)
                .then(users => {
                    ////console.log('returned from service request');
                    //serizlize and THEN return to user
                    const userArray = users.map(({user_name}) => user_name);

                    ////console.log({userArray});
                    res.send(JSON.stringify(userArray))
            }).catch((error) => {
                console.log('Error - ur-GSU: ', error);
            });
        }
    });

        // localhost:8000/users/links
router
//   /SEARCHED/:DATA   ->   GET
.route('/searched/:data')
    // GET
    .get((req,res,next) => {
        ////console.log('in searchED router');
        ////console.log(req.params);
        //grabbing the database and storing in a variable to pass to service object
        const knexInstance = req.app.get('db');
        //grab user id from the parameters of the url passed from client

        const userName = req.params.data;

        ////console.log({userName});
        if (userName == undefined) {
            ////console.log('not defined');
            res.send({});
        }
        
        if(userName.length > 0) {
            UserService.getSearchedUsers(knexInstance, userName)
                .then(user => {
                    ////console.log('returned from service request');
                    //serizlize and THEN return to user
                    //cleaning up info from server, don't want to send any private info of users to the client side
                    const userArray = user.map(({user_name,id,user_thumbnail}) => {
                        return {user_name,id,user_thumbnail}
                    });
                    ////console.log({userArray});
                    res.send(JSON.stringify(userArray))
            }).catch((error) => {
                console.log('Error - ur-GSU2: ', error);
            });
        }
    });

router
//   /ADDLINK   ->   POST
.route('/addLink')
    // POST
    .post(jsonParser, (req,res,next) => {
        ////console.log('in links router');
        ////console.log(req.body); //object sent via body
        //grabbing the database and storing in a variable to pass to service object
        const knexInstance = req.app.get('db');
        //grab user id from the parameters of the url passed from client

        const linkObj = req.body;

        ////console.log({linkObj});
        if (linkObj == undefined) {
            ////console.log('not defined');
            res.send({});
        }
        
        if(Object.keys(linkObj).length > 1) {
            UserService.addLink(knexInstance, linkObj)
                .then(links => {
                    ////console.log('returned from service request');
                    //serizlize and THEN return to user
                    ////console.log({links});
                    res.send(JSON.stringify(links))
            }).catch((error) => {
                console.log('Error - ur-AL: ', error);
            });
        }
    });

router
//   /DELETELINK   ->   DELETE
.route('/deleteLink')
    // DELETE
    .delete(jsonParser, (req,res,next) => {
        ////console.log('in DELETE router');
        ////console.log(req.body); //object sent via body
        //grabbing the database and storing in a variable to pass to service object
        const knexInstance = req.app.get('db');
        //grab user id from the parameters of the url passed from client

        const linkObj = req.body;

        ////console.log({linkObj});
        if (linkObj == undefined) {
            ////console.log('not defined');
            res.send({});
        }
        
        if(Object.keys(linkObj).length > 1) {
            UserService.deleteLink(knexInstance, linkObj.fromid, linkObj.toid)
                .then(links => {
                    ////console.log('returned from service request');
                    //serizlize and THEN return to user
                    ////console.log({links});
                    res.send(JSON.stringify(links))
            }).catch((error) => {
                console.log('Error - ur-DL: ', error);
            });
        }
    });

    //this is GET, but I marked as post because I need to send an array through the body and GET doesn't allow the body to be sent
router
//   /ALLLINKS   ->   POST
.route('/allLinks')
    .post(jsonParser, (req,res,next) => {
        ////console.log('in links router');
        ////console.log(req.body); //object sent via body
        //grabbing the database and storing in a variable to pass to service object
        const knexInstance = req.app.get('db');
        //grab user id from the parameters of the url passed from client

        //ARRAY
        const linkArray = req.body;

        if (linkArray == undefined) {
            ////console.log('not defined');
            res.send({});
        }
        if(linkArray.length > 0) {
            UserService.getUsersFromLinks(knexInstance, linkArray)
                .then(links => {
                    ////console.log('returned from get all links service request');
                    //serizlize and THEN return to user
                    ////console.log({links});
                    res.send(JSON.stringify(links))
            }).catch((error) => {
                console.log('Error - ur-GUFL: ', error);
            });
        }
    });

    

module.exports = router;