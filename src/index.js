import "./pages/HomePage.js"; // Assuming this imports the custom components
import "./pages/ProfilePage.js"
import landingPage from"./pages/landingPage.js"
import Leaderboard from "./pages/Leaderboard.js";

function loadComponent(component) {
    const element = document.createElement(component);
}

function handleRouting(path)
{
    console.log(path)
    if (path === '/assets/')
    {
        new Leaderboard()
        // loadComponent('my-landing')
    }
    // else
    // {
    //     loadComponent('profile-element');
    // }
}

// Load the correct component on initial load
window.addEventListener('load', () =>
{
    handleRouting(window.location.pathname);
});
