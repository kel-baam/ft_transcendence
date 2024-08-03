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

// --------------------single page---------------



window.onload = function() {
    const path = window.location.hash.slice(1);
    console.log("Initial path:", path);
    loadInitialPage(path);

    document.querySelectorAll(".icon").forEach((item) => {
        item.addEventListener("click", function(event) {

            event.preventDefault();
            
            const path = this.parentElement.getAttribute("href").slice(1);
            console.log("Clicked path:", path);
            loadPage(path);
            window.location.hash = path;
        });
    });

    window.onhashchange = function() {
        const path = window.location.hash.slice(1);
        console.log("Hash change path:", path);
        loadPage(path);
    };
};

function loadInitialPage(path) {
    console.log("nisrin");
    switch(path) {
        case "":
        case "home":
            loadPage("home");
            break;
        case "playerVSplayer":
            loadPage("playerVSplayer");
            break;
        case "tournament":
            loadPage("tournament");
            break;
        case "profile":
            loadPage("profile");
            break;
        case "chat":
            loadPage("chat");
            break;
        case "achievement":
            loadPage("achievement");
            break;
        default:
            loadPage("home");
            break;
    }
}

function loadPage(path) {
    if (!path) return;

    console.log("Loading page:", path);

    const container = document.getElementById("cont");
    const request = new XMLHttpRequest();

    request.open("GET", "pages/" + path + ".html");
    request.send();
    request.onload = function() {
        if (request.status === 200) {
            container.innerHTML = request.responseText;
        } else {
            container.innerHTML = "<p>Page not found.</p>";
        }
    };
}

//onload 	Defines a function to be called when the request is received (loaded)
