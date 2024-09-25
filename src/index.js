import { handleRouting } from "./framework/routing.js";

const goBack = function()
{
    window.addEventListener("popstate", function(event)
    {
        const path = event.state ? event.state.path : "/";
        console.log(path, event.state);
        handleRouting(path);
    })
}


window.addEventListener('load', () =>
{
    document.body.innerHTML = ''
    const request = new XMLHttpRequest();

    handleRouting(window.location.pathname);
});

