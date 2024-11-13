import createElement from "../framework/createElement.js";
import render from "../framework/render.js";
import UserProfile from "../components/UserProfile.js";
import WinningRate from "../components/WiningRate.js";
import Achievement from "../components/Achievement.js";
import Friends from "../components/FreindsReqPending.js";
import MatchHistory from "../components/MatchHistory.js";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import { diff , patch} from "../framework/diff.js";

class Profile 
{
    constructor()
    {
        this.items = [];
        this.root = document.body;
        this.customFetch("https://legendary-bassoon-jpvw6597q7jcq7rp-8000.app.github.dev/api/test/",{}).then(()=>
        {
            console.log("render")
            this.render()
        }).catch((error) => {
           
            console.error("An error occurred:", error);
           
          });
        
    }

    async customFetch(url,options={})
    {
        const defaultOptions = {
            method: 'GET',
            credentials: 'include',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
        }

        const mergedOptions = {
            ...defaultOptions,
            ...options,
        }

        return  await fetch(url,mergedOptions).then(async (response)=>
                {
                    if(!response.ok)
                    {
                        if(response.status == 401)
                        {
                            const refreshAccessToken = await fetch('https://legendary-bassoon-jpvw6597q7jcq7rp-8000.app.github.dev/api/refresh/token/',{
                            method:'GET',
                            credentials: 'include',})
                            if(!refreshAccessToken.ok)
                            {
                                window.location.href = 'https://frontend:80/login';                    
                                return;
                            }
                            return  this.customFetch(url,options)
                        }
                        return new Error(response.message || "error when you trying to fetch data")
                    }
                    const data =   await response.json()
                    return data
            })
    }

    render()
    {
        const vdom = createElement('div', {id:'global'}, 
            createElement(Header, {}), createElement('div', { className: 'content' },
                createElement(Sidebar, {}), createElement('div', {className:'global-content'},
                    createElement('div', {className:'profile-content'},
                        createElement('div', {className:'profile-info'}, 
                        createElement('div', {className:'infos'}, createElement(UserProfile, {}), 
                        createElement(WinningRate, {})), 
                        createElement('div', {className:'other-cards'}, createElement(Achievement, {}), 
                        createElement(Friends, {}), createElement(MatchHistory, {}))))
                        ,createElement('div', { className: 'friends-bar' }))
            ))
            
            const container = document.body;
            const patches = diff(container.__vdom, vdom, container);
            patch(document.body, patches);
            container.__vdom = vdom;
            this.drawWinningCircle()
    }

    drawWinningCircle() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const percentage = 50; 
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const endAngle = (Math.PI * 2) * (percentage / 100);
        this.drawCircle('#ddd',endAngle , (Math.PI * 2), canvas);

        this.drawCircle('#0AA989', 0, endAngle, canvas);

        this.drawPercentageText(canvas);

        }
        drawCircle(color, startAngle, endAngle, canvas) {
            const ctx = canvas.getContext('2d');
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = 82;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.lineWidth = 8;
            ctx.strokeStyle = color;
            ctx.stroke();
        }
        drawPercentageText(canvas) {
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const percentage = 50;
        ctx.font = '26px "myFont"';
        ctx.fillStyle = '#0AA989'; 
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${percentage}%`, centerX, centerY);
    }
   
    addEventListeners()
    {

    }
}

export default Profile;
