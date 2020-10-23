const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const {Schema} = mongoose;

const userSchema = new Schema ({
    email: String,
    password: String,
    role: String,
    notification1:String,
    notification2:String,
    notification3:String
});

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
} 

module.exports = mongoose.model('users', userSchema);