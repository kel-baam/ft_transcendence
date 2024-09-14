import createDOMElement from "../framework/createDOMElement.js";
import render from "../framework/Renderer.js";
import VirtualDOM from "../framework/VirtualDOM.js";
import "../components/MatchHistory.js";
import  "../components/UserProfile.js";
import "../components/WiningRate.js";
import "../components/FreindsReqPending.js"
import "../components/Achievement.js"
import "../components/Header.js"
import "../components/Side-bar.js"

// import stateManager from 

class Profile extends HTMLElement
{
    constructor()
    {
        console.log("----> is profile constr the component")
        super();
        // this.attachShadow({ mode: 'open' });
        this.items = [];
        this.root = "";
        // this.fetchData()
        this.connectedCallBack()
        // console.log("=====> data fetched : ", this.items)
    }
    
    connectedCallBack()
    {
        // console.log("---> here in connectedCallBack")
        // const contentElement = document.getElementById('content-id');
        // console.log("-----> root", this.root)
        // contentElement.appendChild(this.root)

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
        document.createElement('header-element')
        document.createElement('side-bar')
        this.root = document.getElementById('content-id')
        console.log("--------> root : ", this.root)
        render(VirtualDOM.createElement('div', {className:'profile-content'},
                VirtualDOM.createElement('div', {className:'profile-info'}, 
                    VirtualDOM.createElement('div', {className:'infos'}), 
                    VirtualDOM.createElement('div', {className:'other-cards'}))), this.root)
        // document.createElement('user-profile');
        // document.createElement('winning-rate');
        // document.createElement('achievements-element')
        // document.createElement('friends-element')
        // document.createElement('match-history')
    }
    
    addEventListeners()
    {

    }


}
window.customElements.define('profile-element', Profile);
export default Profile;