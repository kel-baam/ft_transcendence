import createElement from "../framework/createElement.js";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import { diff , patch} from "../framework/diff.js";
import TwoFactorContent from "../components/TwoFactorCard.js";

class Settings
{
    constructor()
    {
        console.log("----> is profile constr the component")
        this.items = [];
        this.root = document.body;
        // this.fetchData() /api/profile
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
        console.log("------> here content tag ")
        const vdom = createElement('div', {id:'global'}, 
            createElement(Header, {}), createElement('div', { className: 'content' },
                createElement(Sidebar, {}), createElement('div', {className:'global-content'},
                    createElement('div',{ className: 'settings-content' }, 
                            createElement(TwoFactorContent, {})),
                    createElement('div', { className: 'friends-bar' })
            )))
            
            const container = document.body;
            const patches = diff(container.__vdom, vdom, 0);
            // console.log(">>>>>>>>> patches :", patches)
            patch(document.body, patches);
            container.__vdom = vdom;
    }
}
export default Settings;