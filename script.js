

let lastClickedIcon = null;
const icons = document.querySelectorAll('.icon');

if (icons)
{
    icons.forEach(icon => {
        icon.addEventListener('click', function() {
            if (lastClickedIcon && lastClickedIcon !== this) {
                lastClickedIcon.classList.remove('clicked');
            }
            this.classList.toggle('clicked');
            lastClickedIcon = this.classList.contains('clicked') ? this : null;
        });
    });
}

const logo = document.querySelectorAll('.logo');
if (logo){
    logo.forEach(logo => {
        logo.addEventListener('click', function() {
            if (lastClickedIcon && lastClickedIcon !== this) {
                lastClickedIcon.classList.remove('clicked');
            }
            this.classList.toggle('clicked');
            lastClickedIcon = this.classList.contains('clicked') ? this : null;
        });
    });
}





// const urlRoute = {
//     "/":{template: "/pages/homePage/home.html"},

//     "chat":{template: "/pages/chat/chat.html"},

//     "home":{template: "/pages/homePage/home.html"},

//     "acheivement":{template: "/pages/homePage/acheivement.html"},

//     "loginPage":{template: "/pages/homePage/loginPage.html"},

//     "playerVSplayer":{template: "/pages/homePage/playerVSplayer.html"},

//     404:{template: "/pages/homePage/404.html"},

//     "tournament":{ template: "/pages/homePage/tournament.html"}
// }


const urlRoute = {
    "/":
    {
        template: "/pages/landingPage/landingPage.html"
    },
    
    "loginPage":
    {
        template: "/pages/homePage/loginPage.html"
    },
    "leaderboard":
    {
        template: "/pages/leaderboard/leaderboard.html"
    },
 
    "home":
    {
        template: "/pages/homePage/home.html"
        
    },

    "playerVSplayer":
    {
        template: "/pages/homePage/playerVSplayer.html"
        
    },

    404:
    {
        template: "/pages/homePage/404.html"
    },

    "tournament":
    {
        template: "/pages/homePage/40d4.html"

    }
};
function loadPage(path)
{
    const url = urlRoute[path].template;
    var div;
    if(url=="/pages/landingPage/landingPage.html" || url=="/pages/homePage/loginPage.html")
    {

        div = "landing-login";
        document.querySelector("#all #container").style.display ="none";
        document.querySelector("#all .content").style.display ="none";
        document.querySelector("#all #landing-login").style.display ="initial";
    }
    else
    {
        document.querySelector("#all #container").style.display ="initial";
        document.querySelector("#all .content").style.display ="grid";
        document.querySelector("#all #landing-login").style.display ="none";
        div="global-content"
    }
 
    const container = document.getElementById(div);
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



























// --------here------

// ------------------------single page----------------

// const urlRoute = {
//     "/":
//     {
//         template: "/pages/landingPage/landingPage.html"
//     },
    
//     "loginPage":
//     {
//         template: "/pages/homePage/loginPage.html"
//     },
//     // "profil":
//     // {
//     //     loadPage("profil");
//     //     break;
//     // }

//     // "chat":
//     // {
//     //     loadPage("chat");
//     //     break;
//     // }

//     "home":
//     {
//         template: "/pages/homePage/home.html"
        
//     },

//     // "acheivement":
//     // {
//     //     loadPage("acheivement");
//     //     break;
//     // }

//     "playerVSplayer":
//     {
//         template: "/pages/homePage/playerVSplayer.html"
        
//     },

//     404:
//     {
//         template: "/pages/homePage/404.html"
//     },

//     "tournament":
//     {
//         template: "/pages/homePage/40d4.html"

//     }
// };

// function kawtar()
// {
//     // document.querySelector("")
// }
// window.onload = function(){

//     const path = window.location.pathname;
//     console.log("--------path")
//     console.log(path);
//     console.log("--------");

    
//     loadPage(path);

//     const globalClass = document.querySelector('#all');

//     globalClass.addEventListener("click", function(event)
//     {
//         event.preventDefault();
        
//         const anchor = event.target.closest('a');
//         const path = anchor.getAttribute("href");
//         loadPage(path);
//         if (path == "")
//             {
//                 window.history.pushState({}, "", "/");
                
//             }
//             else
//             window.history.pushState({}, "", path);
//     })
    
    
//     function loadPage(path)
//     {
//         const url = urlRoute[path].template || urlRoute[404];
//         var div;
//         if(url=="/pages/landingPage/landingPage.html" || url=="/pages/homePage/loginPage.html")
//             div = "landing-login";
//         else
//         {
//             document.querySelector("#all #container").style.display ="initial";
//             document.querySelector("#all .content").style.display ="grid";
//             div="global-content"
//         }
//         console.log(div);
//         const container = document.getElementById(div);
//         const request = new XMLHttpRequest();

//         request.open("GET", url);
//         request.send();
//         request.onload = function()
//         {
//             if (request.status === 200)
//             {
//                 container.innerHTML = request.responseText;
//                 document.title = url;
//             }
//             else
//             {
//                 container.innerHTML = "<p>Page not found.</p>";
//             }
//         }
//     }
// }



// window.onload = function(){
    

//     console.log("js")
//     const path = window.location.pathname;
    
//     loadPage(path);
    
//     document.querySelectorAll(".icon").forEach((item)=>
//     {
//         console.log("heeer")
//         item.addEventListener("click", function(event)
//         {
//             event.preventDefault();
//             const anchor = event.target.closest('a');
//             const path = anchor.getAttribute("href");
//             loadPage(path);
//             if (path === "") {
//                 window.history.pushState({ path: path }, "", "/");
//             } else {
//                 window.history.pushState({ path: path }, "", `/${path}`);
//             }
//         })
//     })

//     window.addEventListener("popstate", function(event) {
//         const path = event.state ? event.state.path : "/";
//         console.log(event.state, " | ", path);
//         loadPage(path);
//     })


//     function loadPage(path)
//     {
//         const url = urlRoute[path].template;
//         var div;
//                 if(url=="/pages/landingPage/landingPage.html" || url=="/pages/homePage/loginPage.html")
//                     div = "landing-login";
//                 else
//                 {
//                     document.querySelector("#all #container").style.display ="initial";
//                     document.querySelector("#all .content").style.display ="grid";
//                     div="global-content"
//                 }
//         console.log(url)
//         const container = document.getElementById(div);
//         const request = new XMLHttpRequest();

//         request.open("GET", url);
//         request.send();
    
//         request.onload = function()
//         {
//             if (request.status === 200)
//             {
//                 container.innerHTML = request.responseText;
//                 document.title = url;
//             }
//             else
//             {
//                 container.innerHTML = "<p>Page not found.</p>";
//             }
//         }
//     }
// }