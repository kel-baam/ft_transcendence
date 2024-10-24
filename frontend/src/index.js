import HomePage from "./pages/HomePage.js";
import ProfilePage from "./pages/ProfilePage.js"; // Example for another page
import LandingPage from "./pages/LandingPage.js";
import LeaderboardPage from "./pages/LeaderboardPage.js"
import { handleRouting } from "./framework/routing.js";

function addGlobalEventListeners()
{
    document.addEventListener('click', event => {
        // Ensure you are targeting an anchor element inside the sidebar
        const link = event.target.closest('.side-bar a');
        console.log(">>>>>>>>>>>>>>>>>> link ", link)
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

