import "./pages/HomePage.js"; // Assuming this imports the custom components
// import "./pages/ProfilePage.js"
import Profile from "./pages/ProfilePage.js";
const oldv = null;
function loadComponent() {
    // const element = document.createElement(component);
    const profile = new Profile()
    // const bdy = document.getElementById('global')
    console.log("---------> bdy = ", document.body.__vdom)
    // profile.render
}

function handleRouting(path)
{
    if (path === '/profile')
    {
        loadComponent();
    }
    else
    {
        loadComponent();
    }
}

// Load the correct component on initial load
window.addEventListener('load', () =>
{
    handleRouting(window.location.pathname);
});
