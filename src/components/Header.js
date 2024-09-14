export class Header extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({ mode: 'open' });
        this.connectedCallback()
    }

    connectedCallback() {
        // const body = document.getElementsByTagName('body')[0]
        console.log("------> connectedCallBack in header")
        this.shadowRoot.innerHTML = ` <header>
        <nav>
            <img src="../../assets/images/logo.png" class="logo" alt="logo">
            <div class="search">
                <a href="#">
                    <i class="fa-solid fa-magnifying-glass icon"></i>
                </a>
                <input type="text" placeholder="Search...">
            </div>
            <div class="left-side">
                <i class="fa-regular fa-bell icon"></i>
                <a href="#/settings"><i class="fa-solid fa-sliders icon"></i></a>
                <i class="fa-solid fa-arrow-right-from-bracket icon"></i>
            </div>
        </nav>
        </header>` ;
        document.body.appendChild(this.shadowRoot)
        // this.addEventListeners()
    }

    addEventListeners()
    {
        const search = this.shadowRoot.querySelector('.search input');
        search.addEventListener('click', (event) =>{
            //handle event
        })
    }

}
customElements.define('header-element', Header);
export default Header;