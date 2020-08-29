var express = require("express");
var app = express();
var mongoose = require("mongoose");
var path = require("path");
var bcrypt = require("bcrypt");
var bodyParaser = require("body-parser");
var passport = require("passport");
var data = require("./models/user.js");
var flash = require("express-flash");
var session = require("express-session");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
//var initializePassport=require("./passport-config") ;
var methodOverride = require("method-override");

var er = "";
// initializePassport(
//   passport,
//   email=>users.find(user=>user.email===email),
//   id=>users.find(user=>user.id===id)
// ) ;

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/quizeeks", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(bodyParaser.urlencoded({ extended: true }));

app.use(flash());

app.use(
    session({
        secret: "Quizeeks will be the best",
        resave: false,
        saveUnitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

passport.use(new LocalStrategy(data.authenticate()));
passport.serializeUser(data.serializeUser());
passport.deserializeUser(data.deserializeUser());

var userSchema = new mongoose.Schema(
    {
        username: String,
        score: String,
    },
    { retainKeyOrder: true }
);
var usc = mongoose.model("uscore", userSchema);

// const users=data.find({},function(err,uscore){
//   if(err)
//       console.log(err) ;
// });
// console.log(users);

// passport.serializeUser(user.serializeUser() ) ;
// passport.deserializeUser(user.deserializeUser()) ;

// app.get("/highscores", function (req, res) {
//     usc.find({}, function (err, uscore) {
//         if (err) console.log(err);
//         else res.render("highscores", { uscore: uscore });
//     });
// });
app.get("/highscores", function (req, res) {
    usc.find({}, function (err, uscore) {
        if (err) console.log(err);
        else res.render("highscores", { uscore: uscore } );
    }).sort({score:-1});
});
app.get("/", function (req, res) {
    res.render("index", { user: req.user });
});
app.get("/game", checkAuthenticated, function (req, res) {
    res.render("game");
});
app.get("/end", checkAuthenticated, function (req, res) {
    res.render("end", { user: req.user });
});
// app.get("/highscores", checkAuthenticated, function (req, res) {
//     // const mysort = { username: -1 };

//     user.find({}, function (err, result) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.render("highscores", { uscore: uscore });
//         }
//     }).sort(mysort);
// });

app.get("/login", checkNotAuthenticated, function (req, res) {
    res.render("login");
});

app.get("/register", checkNotAuthenticated, function (req, res) {
    res.render("register");
});

app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    }),
    function (req, res) {}
);

app.post("/end", checkAuthenticated, function (req, res) {
    var obj = {
        username: req.body.username,
        score: req.body.score,
    };
    usc.create(obj, function (err, user) {
        if (err) console.log(err);
        else console.log("Added sucesfully ", user);
    });
    res.render("index", { user: req.user });
});

app.post("/register", function (req, res) {
    data.register(
        new data({ username: req.body.username, name: req.body.name }),
        req.body.password,
        function (err, user) {
            if (err) {
                var errors = err;
                console.log(err);
                return res.render("register", { error: err });
            }
            res.render("login");
        }
    );
});

// app.get("/highscores",function(req,res){
//     user.find({},null,{sort: {score: 1}},function(err,uscore){
//         if(err)
//             console.log(err) ;
//         else
//         res.render("highscores",{uscore:uscore}) ;

//     }).sort({score:-1})

// });

app.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
}

app.listen(5500, function () {
    console.log("Server Started");
});
