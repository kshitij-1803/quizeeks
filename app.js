var express =require('express');
var app=express() ;
var mongoose= require("mongoose") ;
var path= require('path') ;
var bodyParaser= require("body-parser") ;

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/quizeeks",({ useNewUrlParser: true,useUnifiedTopology: true  }));

app.use(bodyParaser.urlencoded({extended:true})) ;

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine","ejs") ;


var userSchema= new mongoose.Schema({
    username: String,
    score: String
   }, { retainKeyOrder: true });
   var user = mongoose.model("uscore",userSchema);


app.get("/highscores",function(req,res){ 
    user.find({},function(err,uscore){
        if(err)
            console.log(err) ;
        else    
        res.render("highscores",{uscore:uscore}) ;

    })
    
});
app.get("/",function(req,res){ 
        res.render("index") ;

});
app.get("/game",function(req,res){ 
        res.render("game") ;
});
app.get("/end",function(req,res){ 
        res.render("end") ;

});


app.post("/end",function(req,res){ 
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

 app.get("/highscores",function(req,res){

var mysort = {score: -1};

    user.find({}, function (err, result) {

        if (err) {

            console.log(err);

        } else {

              res.render("highscores",{uscore:uscore}) ;

        }

    }).sort(mysort);

 }) ;





app.listen(5500,function(){
    console.log("Server Started" );              
});


// var mysort = {name: 1};

//     user.find({}, function (err, result) {

//         if (err) {

//             console.log("error query");

//         } else {

//               res.render("highscores",{uscore:uscore}) ;

//         }

//     }).sort(mysort);