import createElement from "../framework/createElement.js";
import createDOMElement from "../framework/createDOMElement.js";
import render from "../framework/render.js";
import  "../components/header.js";
import "../components/sidebar.js"
import "../components/MatchHistory.js";
import  "../components/UserProfile.js";
import "../components/WiningRate.js";
import "../components/FreindsReqPending.js"
import "../components/Achievement.js"
import UserProfile from "../components/UserProfile.js";
import WinningRate from "../components/WiningRate.js";
import Achievement from "../components/Achievement.js";
import Friends from "../components/FreindsReqPending.js";
import MatchHistory from "../components/MatchHistory.js";
import header from "../components/header.js";
import sidebar from "../components/sidebar.js";



class Profile extends HTMLElement
{
    constructor()
    {
        console.log("----> is profile constr the component")
        super();
        this.attachShadow({ mode: 'open' });
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
        // this.createHeaderTag();
        this.createContentTag();

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
    // createHeaderTag()
    // {
    //     document.createElement('header-component');
    // }

    createContentTag()
    {
        console.log("------> here content tag ")
        const vdom = createElement('div', {className:'global'}, 
            createElement(header, {}), createElement('div', { className: 'content' },
                createElement(sidebar, {}), createElement('div', {className:'global-content'},
                    createElement('div', {className:'profile-content'},
                        createElement('div', {className:'profile-info'}, 
                        createElement('div', {className:'infos'}, createElement(UserProfile, {}), 
                        createElement(WinningRate, {})), 
                        createElement('div', {className:'other-cards'}, createElement(Achievement, {}), 
                        createElement(Friends, {}), createElement(MatchHistory, {}))))
                    ),
                    createElement('div', { className: 'friends-bar' })
            ))
            render(vdom, this.root)

        // const virtualDom = createElement('div', { className: 'content' });
        // const domElement = createDOMElement(virtualDom);
        
        // document.getElementById('global').appendChild(domElement);
        // document.createElement('sidebar-component');

        // this.createGlobalContent();
        // this.createFriendContent();
    }
    
    createGlobalContent()
    {
        // const virtualDom = createElement('div', { className: 'global-content' });
        // const domElement = createDOMElement(virtualDom);
        // document.getElementsByClassName('content')[0].appendChild(domElement);
        // this.createProfileContent();
    }                        

    createProfileContent()
    {

        this.root = document.getElementsByClassName('global-content')[0];
        render(createElement('div', {className:'profile-content'},
                    createElement('div', {className:'profile-info'}, 
                    createElement('div', {className:'infos'}, createElement(UserProfile, {ite}), 
                    createElement(WinningRate, {})), 
                    createElement('div', {className:'other-cards'}, createElement(Achievement, {}), 
                    createElement(Friends, {}), createElement(MatchHistory, {})))), this.root)
        this.drawWinningCircle()
    }
    
    createFriendContent()
    {
        const virtualDom = createElement('div', { className: 'friends-bar' });
        const domElement = createDOMElement(virtualDom);
        document.getElementsByClassName('content')[0].appendChild(domElement);
    }

    addEventListeners(){}
}
window.customElements.define('profile-element', Profile);


export default Profile;



