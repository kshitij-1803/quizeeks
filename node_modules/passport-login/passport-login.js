var router = require('express').Router();
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

function createLogin(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    var UserSchema = new Schema ({
        username: String,
        password: String
    });

    UserSchema.plugin(passportLocalMongoose);
    var User = mongoose.model('User', UserSchema);

    passport.use(new LocalStrategy(User.authenticate()));

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    router.post('/register', function(req, res, next) {
        console.log('registering user');
        User.register(new User({ username: req.body.username }), req.body.password, function(err) {
            if (err) { console.log('error while user register!', err); return next(err); }

            console.log('user registered!');

            res.status(200).json({message: 'User registered'})
        });
    });

    router.post('/login', passport.authenticate('local'), function(req, res) {
        res.status(200).json({message: 'Log in Complete', user: {name: req.user.username}});
    });

    router.get('/logout', function(req, res) {
        req.logout();
        res.status(200).json({message: 'Log out complete'});
    });

    app.use('/', router);
};

module.exports = createLogin;