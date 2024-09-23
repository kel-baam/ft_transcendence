import HomePage from "../pages/HomePage.js";
import ProfilePage from "../pages/ProfilePage.js"; // Example for another page
import LandingPage from "../pages/LandingPage.js";
import LeaderboardPage from "../pages/LeaderboardPage.js"

function loadComponent(component) {
    const instance = new component();
}

export function handleRouting(path) {
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
            component = HomePage;
            break;
        default:
            component = HomePage;
    }
    loadComponent(component);
}
