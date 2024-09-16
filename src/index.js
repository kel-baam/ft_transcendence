import "./pages/HomePage.js"; // Assuming this imports the custom components
import "./pages/ProfilePage.js"

function loadComponent(component) {
    const element = document.createElement(component);
}

function handleRouting(path)
{
    if (path === '/profile')
    {
        loadComponent('profile-element');
    }
    else
    {
        loadComponent('profile-element');
    }
}

// Load the correct component on initial load
window.addEventListener('load', () =>
{
    handleRouting(window.location.pathname);
});
