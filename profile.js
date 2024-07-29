document.addEventListener('DOMContentLoaded', (event) => {

const viewFriends=document.querySelector(".view-all-link-fr");
var fun = function()
{
    document.querySelector(".friends-scop").style.display= "initial";
    console.log("99999999999999999fkkfkfkfkf");
}

if(viewFriends)
{
    console.log("fkkfkfkfkf");
    viewFriends.addEventListener("click", fun);

}

// -------close icon---------------------

const closeFriendsScop=document.querySelector(".close-click");

if(closeFriendsScop)
{
    closeFriendsScop.addEventListener("click",()=>
    {
        document.querySelector(".friends-scop").style.display="none"; 
        console.log("WIIIIIIIIII ")

    });
}

// -------YOur FRiends button-----------

const friendsButton=document.querySelector(".friends-button");
console.log(friendsButton)

if(friendsButton)
{
    friendsButton.addEventListener("click",()=>
    {
        document.querySelector(".friends-button").style.backgroundColor="rgba(95, 114, 125, 0.08)";
        document.querySelector(".request-button").style.backgroundColor="#FFEEBF";
        // document.querySelector(".list-freinds-item").style.display="initial";
        // document.querySelector(".list-freinds-item").style.backgroundColor="#000";
    });
}

// -------Your requests list ------

const requestButton =document.querySelector(".request-button");


if(requestButton)
{
    requestButton.addEventListener("click",()=>
    {
        document.querySelector(".request-button").style.backgroundColor="rgba(95, 114, 125, 0.08)";
        document.querySelector(".friends-button").style.backgroundColor="#FFEEBF";
        // document.querySelectorAll(".list-freinds-item").style.backgroundColor="#000";
        // document.querySelectorAll(".list-freinds-item").style.display="none";
    })
   
}



/*------------------------view-all-match-histor------------------------*/
 
var viewAll = document.getElementsByClassName('view-all-match');
var match_history = document.getElementsByClassName('view-all-match-history');

var allMatchs = function matchs(){

    
    if (match_history)
    {
        match_history[0].style.display = 'grid';
        console.log(match_history[0]);
    }
}

if (viewAll)
    viewAll[0].addEventListener('click', allMatchs);

/*---------------rollback----------*/

var close_match_history = document.getElementById("close-match");

var closeMatchs = function close_matchs(){
    
    if (match_history)
    {
        match_history[0].style.display = 'none';
        console.log("karima11111");
    }
}

if (close_match_history)
{
    close_match_history.addEventListener('click', closeMatchs);
    console.log("123");
}

});

