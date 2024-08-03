
// ------------------------single page----------------


const urlRoute = {
    "/":{template: "/pages/homePage/home.html"},

    "chat":{template: "/pages/chat/chat.html"},

    "home":{template: "/pages/homePage/home.html"},

    "acheivement":{template: "/pages/homePage/acheivement.html"},

    "loginPage":{template: "/pages/homePage/loginPage.html"},

    "playerVSplayer":{template: "/pages/homePage/playerVSplayer.html"},

    404:{template: "/pages/homePage/404.html"},

    "tournament":{ template: "/pages/homePage/tournament.html"},
    "profile":{ template: "/pages/profile/profile.html"},
    "settings":{ template: "/pages/settings/settings.html"}
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
            // console.log(path);
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
            // console.log("=====> ", path);
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


