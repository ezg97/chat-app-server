const bcrypt = require('bcryptjs');
const xss = require('xss');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UserService = {
    //checking to see if a user with the user_id exists in the database.
    hasUserWithUserId(db, user_id) {
        return db
            .from('users')
            .where('user_id', user_id)
            .first()
            .then(user => user)
    },
    addUser(db, newUser) {
        return db
          .insert(newUser)
          .into('users')
          .returning('*')
          .then(([user]) => user)
      },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    
};

module.exports = UserService;
