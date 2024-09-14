import  "./pages/Profile.js";
import "./pages/settings.js"

document.addEventListener('DOMContentLoaded', () =>
{
    const profile = document.createElement('profile-element');
    const icons = document.querySelectorAll('informations');
    icons.forEach((item) =>
    {
        item.addEventListener('click',  (event) =>
        {
            // console.log("======> heeeere ");

            // event.preventDefault();
            // window.history.pushState({}, '', item.closest('a').getAttribute("href").slice(1));
            // // console.log("======> location = ", window.location);
            // const path =  window.location.pathname;
            // loadPage(path);
            const contentElement = document.getElementById('content-id');
            const profile = document.createElement('profile-element')
            console.log("=====> profile : ", profile)
            contentElement.appendChild(profile)
        });
    })
    });