var mongoose=require("mongoose") ;
var passportLocalMongoose=require("passport-local-mongoose") ;


var customQuizSchema= new mongoose.Schema({
    userEmail:String,
    quizName:String,
}) ;

customQuizSchema.set('timestamps', true);
module.exports=mongoose.model("quizlog",customQuizSchema) ;