function toggleChatSettings(){        
    var icon = document.querySelector('.fa-ellipsis-vertical');
    if (icon)
    {
        var hidden = document.querySelector('.hidden');
        var chatContent = document.querySelector('.chat-content');
        var msg_list = chatContent.querySelector('.message-list');
        var msg_list_content = msg_list.querySelector('.content-msg-list');
        var msg_list_header = msg_list.querySelector('.header');
        var sender = msg_list_content.querySelector('.sender');
        var typing_box = msg_list.querySelector('.typing'); 
        var settings_friend = chatContent.querySelector('.about-friend');
        
        var toggleChatSettingsOn = function(){
            
            icon.style.display = "none";
            hidden.style.display = "initial";
            msg_list.style.borderRadius = '56px 0px 0px 56px'; 
            msg_list_header.style.gap = '1em';
            
            settings_friend.style.borderRadius = '0px 56px 56px 0px'; 
            chatContent.style.gap = '0em';
            chatContent.style.gridTemplateColumns = '25% 1% 53% 21%';
            settings_friend.style.display = "grid";
    
            typing_box.style.borderRadius = '0px 0px 0px 56px';
    
            var i = 0;
            while (sender[i])
            {
                sender[i].style.gap = '1em';
                i++;
            }   
        };
    
        var cancel_icon = document.querySelector('.fa-xmark');
        
        if (cancel_icon) 
        {
            var toggleChatSettingsOff = function(){
                hidden.style.display = "none";
                chatContent.style.gap = '1em';
                chatContent.style.gridTemplateColumns = '25% 74%';
                
                msg_list.style.borderRadius = ''; 
                msg_list_header.style.gap = '';

                icon.classList.replace('fa-arrow-right', 'fa-ellipsis-vertical');   
                icon.style.display = "initial";
                
                settings_friend.style.display = "none";
                settings_friend.style.borderRadius = '';
                typing_box.style.borderRadius = '';
        
                var i = 0;
                while (sender[i])
                {
                    sender[i].style.gap = '';
                    i++;
                } 
            };
            cancel_icon.addEventListener('click', toggleChatSettingsOff);
        }
        icon.addEventListener('click', toggleChatSettingsOn);
    }
}



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
        toggleChatSettings();
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


