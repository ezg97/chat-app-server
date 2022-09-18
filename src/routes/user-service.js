const bcrypt = require('bcryptjs');
const xss = require('xss');

const UserService = {
    //checking to see if a user with the user_id exists in the database.
    getSuggestedUsers(db, searched_name) {
        return db
            .from('users')
            .where('user_name', 'ILIKE', `%${searched_name}%`)
            .limit(3)//HOW MANY suggestions to the user returns, 2 for testing maybe 5 or 7 in production
            .then(users => users).catch((error) => {
                console.log('Error - us-GSU: ', error);
            });
    },
    getSearchedUsers(db, searched_name) {
        return db
            .from('users')
            // .returning('user_name') returning only works for inserting and updating...
            .where('user_name', 'ILIKE', `%${searched_name}%`)
            .limit(10)//HOW MANY suggestions to the user returns, 2 for testing maybe 5 or 7 in production
            .then(users => users).catch((error) => {
                console.log('Error - us-GUS2: ', error);
            });
    },
    addLink(db, createdLink) {
        return db
          .insert(createdLink)
          .into('friends')
          .returning(['id']) //should return the id of this connection in friends, that way we know it was successful
          .then((linkId) => linkId).catch((error) => {
            console.log('Error - us-AL: ', error);
        });
    },
    deleteLink(db, fromId, toId) {
        return db('friends')
            .where({
                'fromid': fromId,
                'toid': toId
            })
            .del()      
    },
    getUsersLinks(db, userId) {
        return db
            .from('friends')
            .where('fromid', userId)
            .returning('*')
            .then(userLinks => userLinks).catch((error) => {
                console.log('Error - us-GUL: ', error);
            });
    },
    getUsersFromLinks(db, userArray) {
        return db('users')
            .where((builder) =>
                builder.whereIn('id', userArray)
            )
            .then(users => users).catch((error) => {
                console.log('Error - us-GUFL: ', error);
            });

    },
    // --------------------------------------------------
    //          Below might be deleted later or moved to a different file
    //---------------------------------------------------
    //checking to see if a link is already made.. might be pointless bc I can check on the server.
    verifyLink(db, fromId, toId) {
        return db
            .from('friends')
            .where({
                'fromid': fromId,
                'toid': toId})
            .first()
            .then(linked => linked).catch((error) => {
                console.log('Error - us-VL: ', error);
            });
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash);
      },
    serializeUser(user) {
        return {
          id: user.id,
          business_name: xss(user.business_name),
          business_password: xss(user.business_password),
          //nickname: xss(user.nick_name),
         // date_created: new Date(user.date_created),
        }
      },
    
};

module.exports = UserService;
