document.addEventListener('DOMContentLoaded', ()=>
{
    // console.log("=====> here ");
    
    const contentElement = document.getElementById('content-id');
    let page;

    function loadPage(path)
    {
        switch(path)
        {
            case '/profile':
                page = "/profile.html";
               break;
            case '/settings':
                page = "settings.html";
                break;
            default:
                page = 'index.html';
        }
        const xml = new XMLHttpRequest();
        xml.open('GET', page, true);
        xml.send();
        xml.onload = () => {
                // console.log("<<<<<<< xml.status = ", xml.status);
                if (xml.status >= 200)
                {
                    // console.log(">>>>>>>> here last time ");
                    contentElement.innerHTML = xml.responseText;
                }

                const friendsList = document.querySelector(".friends-button");
                if (friendsList)
               { 
                    friendsList.addEventListener('click', (event) =>
                    {
                        // console.log(">>>>>>>>>>>>> here ");
                        document.querySelector(".friends-scope-item").style.display="grid";
                        document.querySelector(".requestes-items").style.display="none";
                        document.querySelector(".pending-friends-items").style.display="none";
                        document.querySelector(".view-all-link-fr").style.display="flex";
                    });
                }
                const requestsList = document.querySelector(".request-button");
                if (requestsList)
                {
                    requestsList.addEventListener('click', (event)=> 
                    {
                        // console.log(">>>>>>>>>>>>> here ");
                        document.querySelector(".friends-scope-item").style.display="none";
                        document.querySelector(".requestes-items").style.display="grid";
                        document.querySelector(".pending-friends-items").style.display="none";
                        document.querySelector(".view-all-link-fr").style.display="flex";
                    });
                }
                const pendingList = document.querySelector(".pending-button");
                if (pendingList)
                {
                    pendingList.addEventListener('click', (event)=>
                    {
                        // console.log(">>>>>>>>>>>>> here ");
                        document.querySelector(".friends-scope-item").style.display="none";
                        document.querySelector(".requestes-items").style.display="none";
                        document.querySelector(".pending-friends-items").style.display="grid";
                        document.querySelector(".view-all-link-fr").style.display="flex";
                    });
                }
            };
        
    }
    // const icon = document.querySelector(".fa-circle-user");
    const icons = document.querySelectorAll(".icon");
    // console.log("------> retuen icons ", icons);
    icons.forEach((item) =>
    {
        item.addEventListener('click',  (event) =>
        {
            event.preventDefault();
            window.history.pushState({}, '', item.closest('a').getAttribute("href").slice(1));
            // console.log("======> location = ", window.location);
            const path =  window.location.pathname;
            loadPage(path);
        });
    })
});