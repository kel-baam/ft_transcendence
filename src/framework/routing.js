import HomePage from "../pages/HomePage.js";
import ProfilePage from "../pages/ProfilePage.js"; // Example for another page
import LandingPage from "../pages/LandingPage.js";
import LeaderboardPage from "../pages/LeaderboardPage.js"
import LoginPage from "../pages/LoginPage.js"
import ChatPage from "../pages/ChatPage.js"

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
        default:
            component = HomePage;
            // component = LandingPage;
    }
    loadComponent(component);
}
