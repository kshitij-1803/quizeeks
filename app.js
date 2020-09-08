var express = require("express");
var app = express();
var mongoose = require("mongoose");
var path = require("path");
var bcrypt = require("bcrypt");
var bodyParaser = require("body-parser");
var passport = require("passport");
var data = require("./models/user.js");
var quizlog = require("./models/custom-quiz.js");
var flash = require("express-flash");
var session = require("express-session");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
//var initializePassport=require("./passport-config") ;
var methodOverride = require("method-override");
const fs = require("fs");

let obj = {
    name: String,
    subject: String,
    results: [],
};
var file_name="";
var er = "";
// initializePassport(
//   passport,
//   email=>users.find(user=>user.email===email),
//   id=>users.find(user=>user.id===id)
// ) ;

mongoose.Promise = global.Promise;

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://chirag12:quizeeks12@cluster0.l1ezv.mongodb.net/quizeeks?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

mongoose.connect("mongodb://localhost/quizeeks", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
//mongodb://localhost/quizeeks

// mongoose.connect("mongodb+srv://chirag12:quizeeks12@cluster0.l1ezv.mongodb.net/quizeeks?retryWrites=true&w=majority", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
// "mongodb+srv://chirag12:quizeeks12@cluster0.l1ezv.mongodb.net/quizeeks?retryWrites=true&w=majority";
app.use(bodyParaser.urlencoded({ extended: true }));
app.use(bodyParaser.json());

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

app.get("/highscores", checkAuthenticated, function (req, res) {
   
    usc.find({}, function (err, uscore) {
        if (err) console.log(err);
        else res.render("highscores", { uscore: uscore });
    }).sort({ score: -1 });
});



app.get("/", function (req, res) {
    var us="" ;
   // console.log(req.user._id);
        if(req.user == undefined)
           us="" ;
        else 
        us=req.user.username ;

    quizlog.find({'userEmail':us},function(err,log)   {
        if(err)
           console.log(err);
       res.render("index", { user:req.user, log:log});
   }) ;
  //  res.render("index", { user: req.user });
});
app.get("/game", checkAuthenticated, function (req, res) {
    res.render("game");
});

app.get("/custom-quiz", checkAuthenticated, function (req, res) {
    res.render("custom-quiz");
});
app.get("/changepass", checkAuthenticated, function (req, res) {
    res.render("password-change");
});
app.post('/changepassword', function (req, res) {
    

    //userSchema.findOne({ 'username': req.user.username },(err, user) => {
      // Check if error connecting
      data.findOne({'username':req.user.username}, function(err,returneduser){
       
        console.log(req.body.oldpass);
        console.log(req.body.newpass);
        console.log(returneduser);


              returneduser.setPassword(req.body.newpass, function(err) {
                  returneduser.save(function(err){
                      console.log(err);
                  });
              });
              req.logOut();
              req.flash("Password changed Sucessfully, Please Login again") ;
              res.redirect("/login") ;      
  });
 

});
// app.get("/custom-quiz/submit", checkAuthenticated, function (req, res) {
//     res.redirect("custom-quiz");


app.post("/custom-quiz/submit", (req, res) => {

    // //file_name=req.body.name+req.body.sub+ Math.random().toString(36).substring(7);


    // fs.exists("myjsonfile.json", (exists) => {
    //     if (exists) {
    //         console.log("yes file exists");

    //         fs.readFile(file_name, (err, data) => {
    //             if (err) {
    //                 console.log(err);
    //             } else {
    //                 obj = JSON.parse(data);

    //                 obj.name = req.body.name;
    //                 obj.subject = req.body.sub;

    //                 obj.results.push({
    //                     question: req.body.question,
    //                     correct_answer: req.body.correct_answer,
    //                     incorrect_answer: [
    //                         req.body.incorrect_answer1,
    //                         req.body.incorrect_answer2,
    //                         req.body.incorrect_answer3,
    //                     ],
    //                 });

    //                 let json = JSON.stringify(obj);
    //                 fs.writeFileSync(file_name, json);
    //             }
    //         });
    //     } else {
            console.log("file not exists");
             console.log(req.body);
            var file=JSON.stringify(req.body).replace(/\\/g,'') ;


            var obj = JSON.parse(JSON.stringify(req.body).replace(/\\/g,''));
              // alert(obj.jobtitel);
               var file_name=obj.name.replace(" ","")+obj.topic+Math.random().toString(36).substring(7);
                   
               fs.writeFile(`${__dirname}/quizes/${file_name}.json`,JSON.stringify(req.body),(err) => {
                           if (err) throw err;
                           console.log('The file has been saved!');
                         });
                         var obj = {
                            userEmail: req.user.username,
                            quizName: file_name,
                        };
                        console.log("Current user    :",req.user.username);

                        quizlog.create(obj, function (err, user) {
                            if (err) console.log(err);
                            else console.log("Added sucesfully ", user);
                        });
               
               console.log(req.body) ;
   
        
  
    res.redirect("/custom-quiz");
});
app.get("/end", checkAuthenticated, function (req, res) {
    res.render("end", { user: req.user });
});
// app.get("/highscores", checkAuthenticated, function (req, res) {

//     const mysort = { username: -1 };

//     usc.find({}, function (err, result) {

//     // const mysort = { username: -1 };

//     user.find({}, function (err, result) {

//         if (err) {
//             console.log(err);
//         } else {
//             res.render("highscores", { uscore: uscore });
//         }

//     }).sort({score: 1});

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
        failureFlash: "Invalid username or password.",
    }),
    function (req, res) {}
);

// app.post('/login', (req, res, next) => {
//     passport.authenticate('local',
//     (err, user, info) => {
//       if (err) {
//         return next(err);
//       }

//       if (!user) {
//         return res.redirect('/login?info=' + info);

//       }

//       req.logIn(user, function(err) {
//         if (err) {
//           return next(err);
//         }

//         return res.redirect('/');
//       });

//     })(req, res, next);
//   });

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
            res.render("login",{sucess:""});
        }
    );
});


app.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});

app.get("/game/quizeeks/ugfue/jefhife/:id",function(req,res){
   
    fs.readFile("quizes/"+req.params.id+".json", (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        obj = JSON.parse(data);
                        res.json(obj);

                    }

})

    });


app.get("/view/:id",checkAuthenticated,function(req,res){

    var x=req.params.id;
    quizlog.find({'quizName':x},function(err,log){
        if(err)
            console.log(err) ;
        
        if(req.user.username === log[0].userEmail) 
        {
            fs.readFile("./quizes/"+req.params.id.replace('%'," ")+".json", (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                   obj = JSON.parse(data);
                  return  res.render("display-custom-quiz",{datas:obj});
        }   
           

})
}
else
res.redirect("/") ;
    });

}) ;

app.get("/play/custom/:id",(req,res)=>{
    res.render("custom-quiz-game") ;
}) ;

// app.get("*", function (req, res) {
//     res.redirect("/");
// });





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
