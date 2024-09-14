export class Login extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      
    }
}
customElements.define('Header', Header);