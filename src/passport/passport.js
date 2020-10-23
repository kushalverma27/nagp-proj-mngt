const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use('signup-local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    

    const user = await User.findOne({email: email});
    if(user) {
        return done(null, false, req.flash('signupMessage', 'The email is already taken'));
    } else {
        if(req.body.roles == 'Default') {
            return done(null, false, req.flash('signupMessage', 'Please select a valid role'));
        } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.role = req.body.roles;
        newUser.notification1 = '';
        newUser.notification2 = '';
        newUser.notification3 = '';
        await newUser.save();
        done(null, newUser);
    }
}
}));

passport.use('signin-local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true    
}, async (req, email, password, done) => {
    
    const user = await User.findOne({email:email});
    if(!user) {
        return done(null, false, req.flash('signinMessage', 'No User found'));
    }
    if(!user.comparePassword(password)) {
        return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
    }
    done(null, user);
}));