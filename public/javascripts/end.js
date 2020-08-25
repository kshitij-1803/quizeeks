const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const score2 = document.getElementById("score");
const usrname = document.getElementById("username");
const mostRecentScore = localStorage.getItem("mostRecentScore");
 var sc=document.getElementById("Score");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;
//finalScore.innerText = mostRecentScore;
score2.value=mostRecentScore ;
score2.readOnly = true;
usrname.readonly=true ;

sc.innerText=mostRecentScore ;
username.addEventListener("keyup", () => {
    saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
    console.log("clicked the save button");
    e.preventDefault();

    const score = {
        score: mostRecentScore,
        name: username.value,
    };



// console.log("Score is     :?" ,req.body.Score) ;

//     user.create(score,function(err,user){
//             if(err)
//                 console.log(err) ;
//             else    
//                 console.log("Added sucesfully") ;
//             }) ;
//  //res.render("index") ;
// });
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(MAX_HIGH_SCORES);
    localStorage.setItem("highScores", JSON.stringify(highScores));
    window.location.assign("/end");

    console.log(highScores);
};
