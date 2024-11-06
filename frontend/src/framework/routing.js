import HomePage from "../pages/HomePage.js";
import ProfilePage from "../pages/ProfilePage.js"; // Example for another page
import LandingPage from "../pages/LandingPage.js";
import LeaderboardPage from "../pages/LeaderboardPage.js"
import LoginPage from "../pages/LoginPage.js"
import ChatPage from "../pages/ChatPage.js"
import PlayerVSplayerPage from "../pages/PlayerVSplayerPage.js";
import TournamentPage from "../pages/TournamentPage.js";
import WaitPlayerJoinPage from "../pages/WaitPlayerJoinPage.js";
import Local_tournament_form from "../pages/Local_tournament_form.js";
import Hierarchy from "../pages/Hierarchy.js";
import Online_tournament from "../pages/Online_tournament.js";

function loadComponent(component) {
    const instance = new component();
}

export function handleRouting(path)
{
    let component;
    console.log("---->" ,path);
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
        case '/playerVSplayer':
            component = PlayerVSplayerPage;
            break;
        case '/tournament':
            component = TournamentPage;
            break;
        case '/Local_tournament_form':
            component = Local_tournament_form;
            break;
        case '/Online_tournament':
            component = Online_tournament;
            break;
        case '/hierarchy':
            component = Hierarchy;
            break;
            
        default:
            component = HomePage;
    }
    loadComponent(component);
}
