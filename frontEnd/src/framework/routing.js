import HomePage from "../pages/HomePage.js";
import ProfilePage from "../pages/ProfilePage.js"; // Example for another page
import LandingPage from "../pages/LandingPage.js";
import LeaderboardPage from "../pages/LeaderboardPage.js"
import LoginPage from "../pages/LoginPage.js"
import ChatPage from "../pages/ChatPage.js"
import TwoFactor from "../pages/TwoFactor.js";
import Settings from "../pages/SettingsPage.js";


function loadComponent(component) {
    const instance = new component();
}

export function handleRouting(path)
{
    let component;
    console.log("----> " ,path);
    switch (path) {
        case '/profile':
            component = ProfilePage;
            break;
        case '/chat':
            component = ChatPage;
            break;
        case '/leaderboard':
            component = LeaderboardPage;
            break;
        case '/home':
            component = HomePage;
            break;
        case '/login':
            component = LoginPage;
            break;
        case '/twoFactor':
            component = TwoFactor
            break;
        case '/laningPage':
            component =LandingPage
            break;
        case '/settings':
            component = Settings
            break;
        default:
            component = LoginPage;
            // component = LandingPage;
    }
    loadComponent(component);
}
