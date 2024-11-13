import createElement from "../framework/createElement.js"
import  { customFetch } from "../framework/fetch.js"

class TwoFactorContent{
    constructor(props)
    {
        this.props = props;
        this.state = {qrCodeUrl: this.props.qrCodeUrl,code:this.props.code,firstScan:this.props.firstScan,active2FA:this.props.active2FA};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    enableTwoFactor = async ()=>
    {
        const response = await fetch("https://legendary-bassoon-jpvw6597q7jcq7rp-8000.app.github.dev/authentication/twoFactor/activate/",
        {
                method:'GET',
                credentials: 'include',
        })
        if(response.ok)
        {
            const data = await response.json();
            this.props.onStateChange("qrCodeUrl",data.qrImage)
        }
    }
    async handleSubmit(event) {
        event.preventDefault() ; 
        try
        {
            const csrf = await customFetch("https://legendary-bassoon-jpvw6597q7jcq7rp-8000.app.github.dev/get-csrf-token/",{})
            const response = await fetch("https://legendary-bassoon-jpvw6597q7jcq7rp-8000.app.github.dev/authentication/twoFactor/validateQrCode/",
                {
                    method:'POST',
                    body:new FormData(document.querySelector(".twoFactorForm")),
                    headers: {
                        'X-CSRFToken':csrf.csrf_token,
                    },
                    credentials: 'include', 
                });

                if (response.status == 200) {
                    this.props.onStateChange("inputCode","true")
                } else {
                    this.props.onStateChange("inputCode","false")
                }
    
        }catch(error){
            console.log("eeeeeeeeeeeeee++rozzr",error)
        }
    }
    
    disableTwoFactor = async ()=>
    {
        const response = await fetch("https://legendary-bassoon-jpvw6597q7jcq7rp-8000.app.github.dev/authentication/twoFactor/desactivate/",
        {
            method:'GET',
            credentials: 'include',
        })
        if(response.ok)
        {
            const data = await response.json();
            this.props.onStateChange("active2FA",data.active2FA)
        }
    }
    render()
    {
        // i should return something here to display desactive button in statrt
        return createElement(
            'div',
            { className: 'settings-container' },
            createElement(
                'div',
                { className: 'section-headings' },
                createElement(
                    'button',
                    {},
                    createElement(
                        'img',
                        { src: '../../assets/images/informations_icon.png', alt:'informations icon'}
                    ),
                    createElement('h2', {}, 'Informations')
                ),
                createElement(
                    'button',
                    {},
                    createElement(
                        'img',
                        { src: '../../assets/images/blocked_fr_icon.png', alt: 'blocked friends icon' }
                    ),
                    createElement('h2', {}, 'Blocked friends')
                ),
                createElement(
                    'button',
                    {style:'background-color: rgba(0, 0, 0, 0.2);'},
                    createElement(
                        'i',
                        { className:'fas fa-lock', style:'font-size:20px; color: #0A377E;'}
                    ),
                    createElement('h2', {}, 'Security')
                )
            ),createElement('div', {className:'two-f-content'},
                createElement('h1', {}, 'Two-Factor authentication (2FA)'),

                this.state.active2FA? 
                createElement('button', { id: "btn-disable", onclick: this.disableTwoFactor }, 'Disable 2FA') 
                :
                createElement('div',{},
                this.state.qrCodeUrl ?
                createElement('div', {},
                    createElement('img', {className:"qrCode",src: `data:image/png;base64,${this.state.qrCodeUrl}`, alt: '2FA qr code' }),
                    createElement('p', {}, 'Scan the QR code with your authentication app.'),
                    createElement('form',{className:'twoFactorForm',onSubmit: this.handleSubmit},
                        createElement('input',{id:'code',type:"text",name:"code",placeholder:"Enter the 6-digit code"}),
                        createElement('br',{}),
                        createElement('input',{type:"submit",id:'active',value:"Active"})),
                ) :
                createElement("div",{},
                createElement('div', {}, 'Enhance your security with Two-Factor Authentication (2FA). ', 
                createElement('br'),  'This robust security measure adds an extra layer of protection',
                createElement('br'), 'to your account by requiring two forms of verification',
                createElement('br'), 'before granting access.'),
                createElement('button', { id: "btn-active", onclick: this.enableTwoFactor }, 'Activate 2FA')))
              
                
            )
        )
    }
}
export default TwoFactorContent;

      
  