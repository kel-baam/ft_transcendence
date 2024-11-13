import { handleRouting } from "./framework/routing.js";

window.addEventListener('load', () =>
{
    document.body.innerHTML = ''
    // const request = new XMLHttpRequest();

    handleRouting(window.location.pathname);
});

