
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

// ------------------------single page----------------

const urlRoute = {
    "/":
    {
        template: "/pages/homePage/home.html"
    },

    // "profil":
    // {
    //     loadPage("profil");
    //     break;
    // }

    // "chat":
    // {
    //     loadPage("chat");
    //     break;
    // }

    "home":
    {
        template: "/pages/homePage/home.html"
        
    },

    // "acheivement":
    // {
    //     loadPage("acheivement");
    //     break;
    // }

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
}

window.onload = function(){

    const path = window.location.pathname;
    
    loadPage(path);

    const globalClass = document.querySelector('#all');

    globalClass.addEventListener("click", function(event)
    {
        event.preventDefault();

        const anchor = event.target.closest('a');
        const path = anchor.getAttribute("href");
        loadPage(path);
        if (path == "")
        {
            window.history.pushState("", "", "/");
            return;
        }
        window.history.pushState("", "", path);
    })

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
        }
    }
}


