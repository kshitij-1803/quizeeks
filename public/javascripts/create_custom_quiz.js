var add=document.getElementById("add") ;
var submit=document.getElementById("submit") ;
var creator=document.getElementById("creator") ;
var subject= document.getElementById("subject") ;
var ques=document.getElementById("question");
var ans=document.getElementById("correctchoice") ;
var choice1=document.getElementById("choice1") ;
var choice2=document.getElementById("choice2") ;
var choice3=document.getElementById("choice3") ;
var quesdiv=document.getElementById("questions") ;

quesdiv.style.visibility = 'hidden';

console.log("in js");


var obj={
        name:String,
        topic:String,
        results:[]
      }; 


add.addEventListener("click", function(){ 

	quesdiv.style.visibility = 'visible';
	obj.name=creator.value ;
  obj.topic=subject.value ;

creator.readOnly = true;
subject.readOnly=true ;

  obj.results.push(
    {  question:ques.value,
     correct_answer:ans.value,
     incorrect_answers:[
      choice1.value,
      choice2.value,
      choice3.value
      ] }) ;



//  console.log("Added ",message.value);
   
      ques.value="" ;
      ans.value="";
      choice1.value="";
      choice2.value="" ;
      choice3.value="";

});


submit.addEventListener("click", function(){ 



    var xhr = new XMLHttpRequest();
    // var data = {
    //     name: handle,
    //     sub: message
    // };
    // console.log(message);
     xhr.open('POST', '/custom-quiz/submit');
     xhr.setRequestHeader("Content-type", "application/json");
    xhr.onload = function(obj) {
      console.log('loaded', this.responseText);
    };
    xhr.send(JSON.stringify(obj));
    console.log(JSON.stringify(obj));

});	

	
   // $("#send").on("click", function() {
   //  var message = $("#message").val();
   //  var handle = $("#handle").val();

//   obj.push({
//       name: handle,
//         sub: message
//     }) ;
//   $("#message").val=""  ;
//   $("#message").val="";
// }


// }

