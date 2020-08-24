var express =require('express');
var app=express() ;
var mongoose= require("mongoose") ;
var path= require('path') ;
var bcrypt= require('bcrypt') ;
var bodyParaser= require("body-parser") ;
var passport=require("passport") ;
var flash=require('express-flash') ;
var session=require('express-session') ;
var localStrategy=require('passport-local') ;
var passportLocalMongoose=require('passport-local-mongoose') ;
var initializePassport=require("./passport-config") ;
var methodOverride = require('method-override') ;
initializePassport(
  passport,
  email=>users.find(user=>user.email===email),
  id=>users.find(user=>user.id===id)
) ;

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/quizeeks",({ useNewUrlParser: true,useUnifiedTopology: true  }));
const users=[] ;
app.use(bodyParaser.urlencoded({extended:true})) ;

app.use(flash()) ;

app.use(session({
  secret:"Quizeeks will be the best" ,
  resave:false,
  saveUnitialized:false 
}));

app.use(passport.initialize()) ;
app.use(passport.session()) ;


app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine","ejs") ;
app.use(methodOverride('_method')) ;
// app.use(passport.initialize() ) ;
// app.use(passport.session());

var userSchema= new mongoose.Schema({
    username: String,
    score: String
   }, { retainKeyOrder: true });
   var usc = mongoose.model("uscore",userSchema);

userSchema.plugin(passportLocalMongoose) ;


// passport.serializeUser(user.serializeUser() ) ;
// passport.deserializeUser(user.deserializeUser()) ;



app.get("/highscores",function(req,res){ 
    usc.find({},function(err,uscore){
        if(err)
            console.log(err) ;
        else    
        res.render("highscores",{uscore:uscore}) ;
  })
});


app.get("/",checkAuthenticated,function(req,res){ 
        res.render("index") ;

});
app.get("/game",checkAuthenticated,function(req,res){ 
        res.render("game") ;
});
app.get("/end",checkAuthenticated,function(req,res){ 
        res.render("end") ;
});
app.get("/highscores",checkAuthenticated,function(req,res){

const mysort = {username: -1};

    user.find({}, function (err, result) {

        if (err) {

            console.log(err);

        } else {
              res.render("highscores",{uscore:uscore}) ;
     }
    }).sort(mysort);

 }) ;

app.get("/login",checkNotAuthenticated,function(req,res){ 
        res.render("login") ;
});


app.get("/register",checkNotAuthenticated,function(req,res){ 
        res.render("register") ;
});




app.post("/register",checkNotAuthenticated,async function(req,res){ 
    
    try{
      const hashedPassword= await bcrypt.hash(req.body.password,10) ;
      users.push({
        id:Date.now().toString(),
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword 
      })
      
      res.render('\login') ;
    }
    catch{
        res.redirect('register') ;
    }

    console.log(users) ;
});

app.post("/login",checkNotAuthenticated,passport.authenticate('local',{
  sucessRedirect:'/',
  failureRedirect: '/login',
  failureFlash:true
 } ));


app.post("/end",checkAuthenticated,function(req,res){ 
      var obj={
      username:  req.body.username,
      score: req.body.score 
     }
    user.create(obj,function(err,user){
            if(err)
                console.log(err) ;
            else    
                console.log("Added sucesfully ",user) ;
            }) ;
 res.render("index") ;
});

// app.get("/highscores",function(req,res){ 
//     user.find({},null,{sort: {score: 1}},function(err,uscore){
//         if(err)
//             console.log(err) ;
//         else    
//         res.render("highscores",{uscore:uscore}) ;

//     })
    
// });

 app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})
 

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}




app.listen(5500,function(){
    console.log("Server Started" );              
});
