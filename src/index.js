import HomePage from "./pages/HomePage.js";
import ProfilePage from "./pages/ProfilePage.js"; // Example for another page
import LandingPage from "./pages/LandingPage.js";
import LeaderboardPage from "./pages/LeaderboardPage.js"
import LoginPage from "./pages/LoginPage.js";


function loadComponent(component) {
    const instance = new component();
}

function handleRouting(path) {
    let component;
    console.log(path);
    switch (path) {
        case 'profile':
            component = ProfilePage;
            break;
        case 'leaderboard':
            component = LeaderboardPage;
            break;
        case 'home':
            component = LoginPage;
            break;
        case 'login':
            component = LoginPage;
            break;
        default:
            component = HomePage;
    }
    loadComponent(component);
}

function addGlobalEventListeners()
{
    document.addEventListener('click', event => {
        // Ensure you are targeting an anchor element inside the sidebar
        const link = event.target.closest('a');
        
        if (link) {
            event.preventDefault(); // Prevent default anchor behavior
            const path = link.getAttribute('href');
            console.log("Navigating to path:", path);
            handleRouting(path);
            window.history.pushState(null, '', path); // Update the URL
        }
    });
}

window.addEventListener('load', () =>
{
    document.body.innerHTML = ''
    addGlobalEventListeners();
    const request = new XMLHttpRequest();

    handleRouting(window.location.pathname); // Initial page load
});

