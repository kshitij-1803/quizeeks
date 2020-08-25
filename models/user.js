var mongoose=require("mongoose") ;
var passportLocalMongoose=require("passport-local-mongoose") ;


var loginSchema= new mongoose.Schema({
    username:String,
    password:String,
    name:String
}) ;
loginSchema.plugin(passportLocalMongoose) ;
module.exports=mongoose.model("data",loginSchema) ;