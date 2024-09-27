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
        // this.fetchData()
        this.render()    
    }
    
    async fetchData()
    {
        try {
                const response = await fetch(''); // Replace with your API URL

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                this.items = await response.json();
        } catch (error) {
                    console.error('Fetch error:', error);
                    // this.shadowRoot.querySelector('#itemList').innerHTML = '<li>Failed to load items</li>';
            }
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
            console.log(patches);
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
