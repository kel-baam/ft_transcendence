import HomePage from "./pages/HomePage.js";
import ProfilePage from "./pages/ProfilePage.js"; // Example for another page

function loadComponent(component) {
    const instance = new component();
}

function handleRouting(path) {
    let component;
    console.log(path);
    switch (path) {
        case '/profile':
            component = ProfilePage;
            break;
        default:
            component = HomePage;
    }
    loadComponent(component);
}

// function addGlobalEventListeners() {
//     document.addEventListener('click', event => {
//         console.log("-----------------------------------------")
//         if (event.target.matches('.side-bar a')) {
//             event.preventDefault(); // Prevent default anchor behavior
//             const path = event.target.getAttribute('href');
//             console.log(path);
//             handleRouting(path);
//             window.history.pushState(null, '', path); // Update the URL
//         }
//     });
// }

window.addEventListener('load', () => {
    // addGlobalEventListeners();
    handleRouting(window.location.pathname); // Initial page load
});

// Handle browser navigation (e.g., back and forward)
// window.addEventListener('popstate', () => {
//     handleRouting(window.location.pathname);
// });
