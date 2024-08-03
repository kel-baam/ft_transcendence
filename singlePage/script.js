// document.addEventListener('DOMContentLoaded', (event) => {

// var hidden = document.querySelector('.hidden');
// var icon = document.querySelector('.fa-ellipsis-vertical');

// console.log(icon);
// var chatContent = document.getElementsByClassName('chat-content');

// if (chatContent[0]){
//     var msg_list = chatContent[0].getElementsByClassName('message-list');
//     var msg_list_content = msg_list[0].getElementsByClassName('content');
//     var msg_list_header = msg_list[0].getElementsByClassName('header');
//     var sender = msg_list_content[0].getElementsByClassName('sender');
//     // var sender_msg = sender[0].getElementsByClassName('msg');
//     var typing_box = msg_list[0].getElementsByClassName('typing'); 
//     var settings_friend = chatContent[0].getElementsByClassName('about-friend');
// }


// var func = function(){
//     if (chatContent && hidden && typing_box)
//     {
//         console.log("Custom logic executed");
//         if (msg_list && settings_friend) {
//             settings_friend[0].style.borderRadius = '0px 56px 56px 0px'; 
//             msg_list[0].style.borderRadius = '56px 0px 0px 56px'; 
//             msg_list_header[0].style.gap = '1em';

//             hidden.style.display = "initial";
//             chatContent[0].style.gap = '0em';
//             chatContent[0].style.gridTemplateColumns = '25% 1% 53% 21%';
//             settings_friend[0].style.display = "grid";
//             console.log("Custom logic executed");
//             icon.style.display = "none";

//             typing_box[0].style.borderRadius = '0px 0px 0px 56px';

//             var i = 0;
//             while (sender[i])
//             {
//                 sender[i].style.gap = '1em';
//                 i++;
//             }   
//         }
//     }
// };


// if (icon)
//     {
//         icon.addEventListener('click', func);
//         console.log("-----> ");
//     }

// var cancel_icon = document.querySelector('.fa-xmark');

// if (cancel_icon) {
//     var rollback = function(){

//         chatContent[0].style.gap = '1em';
//         chatContent[0].style.gridTemplateColumns = '25% 74%';
//         settings_friend[0].style.display = "none";
//         icon.classList.replace('fa-arrow-right', 'fa-ellipsis-vertical');   
//         icon.style.display = "initial";
//         hidden.style.display = "none";

//         settings_friend[0].style.borderRadius = '';
//         msg_list[0].style.borderRadius = ''; 
//         typing_box[0].style.borderRadius = '';
//         msg_list_header[0].style.gap = '';

//         var i = 0;
//             while (sender[i])
//             {
//                 sender[i].style.gap = '';
//                 i++;
//             } 

//     };

//     cancel_icon.addEventListener('click', rollback);
//     console.log("Custom logic executed");
// }
// });



// const icons = document.querySelectorAll('.icon');

// icons.forEach(icon => {
// icon.addEventListener('click', function() {
//     this.classList.toggle('clicked');
// });
// });


// document.addEventListener('DOMContentLoaded', () => {
// const hoverButton = document.getElementById('hoverButton');
// if (hoverButton){
//     hoverButton.addEventListener('mouseover', () => {
//     hoverButton.style.backgroundColor = '#D44444';
//     hoverButton.style.color = '#FFEEBF';
//     });

//     hoverButton.addEventListener('mouseout', () => {
//     hoverButton.style.backgroundColor = '#FFEEBF';
//     hoverButton.style.color = '#D44444';
//     });
// }

// });

// document.addEventListener('DOMContentLoaded', () => {
// const clickableDivs = document.querySelectorAll('.chat-item');

// clickableDivs.forEach(div => {
// div.addEventListener('click', () => {
// clickableDivs.forEach(d => d.classList.remove('clicked-chat'));
// div.classList.add('clicked-chat');
// });
// });
// });



// ------------------------single page----------------


const urlRoute = {
    "/":{template: "/pages/homePage/home.html"},

    "chat":{template: "/pages/chat/chat.html"},

    "home":{template: "/pages/homePage/home.html"},

    "acheivement":{template: "/pages/homePage/acheivement.html"},

    "loginPage":{template: "/pages/homePage/loginPage.html"},

    "playerVSplayer":{template: "/pages/homePage/playerVSplayer.html"},

    404:{template: "/pages/homePage/404.html"},

    "tournament":{ template: "/pages/homePage/tournament.html"}
}

function loadPage(path)
{
    const url = urlRoute[path].template;
    const container = document.getElementById("global-content");
    const request = new XMLHttpRequest();

    request.open("GET", url);
    request.send();

    request.onload = function()
    {
        if (request.status === 200)
        {
            container.innerHTML = request.responseText;
            document.title = url;
        }
        else
        {
            container.innerHTML = "<p>Page not found.</p>";
        }
        clickButton();
    }
}

const clickIcon = function()
{
    document.querySelectorAll(".icon").forEach((item)=>
    {
        item.addEventListener("click", function(event)
        {
            event.preventDefault();
            const anchor = event.target.closest('a');
            const path = anchor.getAttribute("href");
            console.log(path);
            loadPage(path);
            if (path === "") {
                window.history.pushState({ path: path }, "", "/");
            } else {
                window.history.pushState({ path: path }, "", `/${path}`);
            }
        })
    })
}

const goBack = function()
{
    window.addEventListener("popstate", function(event)
    {
        const path = event.state ? event.state.path : "/";
        console.log(event.state, " | ", path);
        loadPage(path);
    })    
}


const   clickButton = function()
{
    document.querySelectorAll(".btn").forEach((item)=>
    {
        item.addEventListener("click", function(event)
        {
            event.preventDefault();
            const anchor = event.target.closest('a');
            const path = anchor.getAttribute("href");
            console.log(path);
            loadPage(path);
            if (path === "") {
                window.history.pushState({ path: path }, "", "/");
            } else {
                window.history.pushState({ path: path }, "", `/${path}`);
            }
        })
    })
}


window.onload = function(){
    

    const path = window.location.pathname;
    
    loadPage(path);
    
    clickIcon();
    goBack();
}


