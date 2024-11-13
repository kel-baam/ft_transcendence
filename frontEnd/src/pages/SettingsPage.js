import createElement from "../framework/createElement.js";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import { diff , patch} from "../framework/diff.js";
// import settingsHeader from "../components/settingsHeader.js";
import TwoFactorContent from "../components/TwoFactorCard.js";

class Settings
{
    constructor(props)
    {
        this.items = [];
        this.root = document.body;
        this.state = {qrCodeUrl: null,firstScan:null,code:false,active2FA:null};
        this.fetchData().then(() => {
            this.render();
        });
        // this.render()    
    }
    
    async fetchData()
    {
        try {
                const response = await fetch('https://legendary-bassoon-jpvw6597q7jcq7rp-8000.app.github.dev/api/test/',{
                    method: 'GET', 
                    credentials: 'include'
                }); 

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                else{

                    const data = await response.json();
                    this.state.active2FA = data.active2FA
                    }
        } catch (error) {
                    console.error('Fetch error:', error);
        }
    }
  
    handleStateChange(type,value)
    {
        this.state.firstScan = false;
        if(type=="qrCodeUrl")
        {
            this.state.firstScan = true;
            this.state.qrCodeUrl = value;

        }
        else if (type=="active2FA")
        {
            this.state.active2FA = value
        }
        else
        {
            this.state.firstScan = false;
            if(value == "false")
                this.state.code = false;
            else
            {
                this.state.code = true;
                this.state.active2FA = true
            }

        }

        this.render();
    }
  
    render()
    {
        const vdom = createElement('div', {id:'global'}, 
            createElement(Header, {}), createElement('div', { className: 'content' },
                createElement(Sidebar, {}), createElement('div', {className:'global-content'},
                    createElement('div',{ className: 'settings-content' }, 
                            createElement(TwoFactorContent, {active2FA:this.state.active2FA,code:this.state.code,qrCodeUrl: this.state.qrCodeUrl,firstScan:this.state.firstScan,onStateChange: this.handleStateChange.bind(this)})),
                    createElement('div', { className: 'friends-bar' })
            )))
            
            const container = document.body;
            const patches = diff(container.__vdom, vdom, 0);
            patch(document.body, patches);
            container.__vdom = vdom;
    }

}
export default Settings;