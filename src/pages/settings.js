import "../components/informations.js";
import "../components/blocke_fr_list.js"
class Settings extends HTMLElement
{
    constructor()
    {
        console.log("----> is Settings constr the component")
        super();
        this.attachShadow({ mode: 'open' });
        this.items = [];
        // this.root = createDOMElement(VirtualDOM.createElement('div', {className:'Settings-content'}));
        // this.fetchData()
        this.connectedCallBack()
        // console.log("=====> data fetched : ", this.items)
    }
    
    connectedCallBack()
    {
        console.log("---> here in connectedCallBack")
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
       document.createElement('informations-element');
    }
    
    addEventListeners()
    {

    }


}
window.customElements.define('settings-element', Settings);

export default Settings;