import HomePage from "./pages/HomePage.js";

function loadComponent(component) {
    const ins = new HomePage();
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
