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
   });
   var user = mongoose.model("uscore",userSchema);



app.get("/",function(req,res){ 
        res.render("index") ;

});
app.get("/game",function(req,res){ 
        res.render("game") ;
});
app.get("/end",function(req,res){ 
        res.render("end") ;

});
app.get("/highscores",function(req,res){ 
        res.render("highscores") ;

});


app.post("/end",function(req,res){ 
      var obj={
      username:  req.body.username,
      score: req.body.score 
    }
console.log("Score is     :?" ,req.body);
console.log("Score is     :?" ,req.body.score);

    user.create(obj,function(err,user){
            if(err)
                console.log(err) ;
            else    
                console.log("Added sucesfully ",user) ;
            }) ;
 res.render("index") ;
});
// app.post("/end",function(req,res){ 
// 	res.render("index") ;
// }) ;
app.listen(5500,function(){
    console.log("Server Started" );              
});