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

class Profile extends HTMLElement
{
    constructor()
    {
        console.log("----> is profile constr the component")
        super();
        this.attachShadow({ mode: 'open' });
        this.items = [];
        this.root = "";
        // this.fetchData()
        this.connectedCallBack()
    }
    
    connectedCallBack()
    {
        this.render()
        // this.addEventListeners()
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

        this.createHeaderTag();
        this.createContentTag();



    }

    createHeaderTag()
    {
        document.createElement('header-component');
    }

    createContentTag()
    {
        const virtualDom = createElement('div', { className: 'content' });
        const domElement = createDOMElement(virtualDom);
        
        document.getElementById('global').appendChild(domElement);
        document.createElement('sidebar-component');

        this.createGlobalContent();
        this.createFriendContent();
    }
    
    createGlobalContent()
    {
        const virtualDom = createElement('div', { className: 'global-content' });
        const domElement = createDOMElement(virtualDom);
        document.getElementsByClassName('content')[0].appendChild(domElement);
        this.createProfileContent();
    }                        

    createProfileContent()
    {

        this.root = document.getElementsByClassName('global-content')[0];
        render(createElement('div', {className:'profile-content'},
                createElement('div', {className:'profile-info'}, 
                    createElement('div', {className:'infos'}), 
                    createElement('div', {className:'other-cards'}))), this.root)
        document.createElement('user-profile');
        document.createElement('winning-rate');
        document.createElement('achievements-element')
        document.createElement('friends-element')
        document.createElement('match-history')
    }
    
    createFriendContent()
    {
        const virtualDom = createElement('div', { className: 'friends-bar' });
        const domElement = createDOMElement(virtualDom);
        document.getElementsByClassName('content')[0].appendChild(domElement);
    }
    
    addEventListeners()
    {

    }


}
window.customElements.define('profile-element', Profile);

export default Profile;
