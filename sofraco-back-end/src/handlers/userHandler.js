const User = require('../models/user');
const fs = require('fs');

class UserHandler {

    constructor() { }

    createUser(data) {      // signup
        let user = new User();
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.email = data.email;
        user.login = data.login;
        user.password = data.password;
        user.create_date = Date.now();
        user.role = data.role;
        user.is_enabled = true;
        user.save();
        return user;
    }

    getUserById(id) {
        return User.findById(id);
    }

    getOneUser(login) {
        return User.findOne({
            $or: [
                { email: login },
                { login: login }
            ]
        })
    }

    getUsers() {
        return User.find();
    }

    getUserById(id) {
        return User.findOne({ _id: id });
    }

    updateUser(id, data) {
        return User.findByIdAndUpdate(id, data);
    }

    deleteUser() {

    }

}

module.exports = new UserHandler();