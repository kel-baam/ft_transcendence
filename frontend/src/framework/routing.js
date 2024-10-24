import HomePage from "../pages/HomePage.js";
import ProfilePage from "../pages/ProfilePage.js"; // Example for another page
import LandingPage from "../pages/LandingPage.js";
import LeaderboardPage from "../pages/LeaderboardPage.js"
import Settings from "../pages/SettingsPage.js";

function loadComponent(component) {
    const instance = new component();
}

export function handleRouting(path) {
    console.log("------------------> path : ", path)
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
        case 'settings':
            component = Settings
        default:
            component = HomePage;
    }
    loadComponent(component);
}
