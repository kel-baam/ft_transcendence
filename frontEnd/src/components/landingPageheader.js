import createElement from "../framework/createElement.js";
import render from "../framework/render.js";
import createDOMElement from "../framework/createDOMElement.js";


class landingPageHeader{
    constructor()
    {
        this.render();
    }

    render()
    {
        const nav = createElement('nav', );

        // Create the logo image
        const logo = createElement('img', {
          class: 'logo',
          src: './images/logo.png',
          alt: 'logo'
        });

        const homeLink = createElement('li',{},createElement('a', { href: '#header-intro', class: 'navLink' }, 'Home'));
        const aboutLink = createElement('li',{},createElement('a', { href: '#about-section', class: 'navLink' }, 'About'));
        const teamLink = createElement('li',{},createElement('a',{href: '#team-section', class: 'navLink' }, 'Our Team'));
      
        const joinButton = createElement('button', { type: 'button' }, 'Join Now');
        const joinLink = createElement('a', { href: 'login', class: 'btn',}, joinButton);
        const heading = createElement('h1',{},'Dive into our',createElement('br',{}),'\u00A0\u00A0\u00A0',createElement('span', {}, 'ping pong'),
            createElement('br',{}),'\u00A0\u00A0\u00A0','universe!');
        
          // Create the paragraph
        const paragraph = createElement('p',{},'Welcome to your ultimate ping pong playground! Get ready to smash your way to victory.',
            createElement('br',{}),
            'Whether you\'re a seasoned player or just starting out, let\'s bounce into action together.',createElement('br',{}));


        const button = createElement('button', { type: 'button' }, 'Join Now');

        const buttonLink = createElement('a', { href: 'login', class: 'btn' }, button);
         
        const joinButtonContainer = createElement('div', { class: 'join-btn' }, buttonLink);
        const image = createElement('img', {src: './images/player1.png',alt: 'player-pic'});

        // Create the intro div and append all elements
        const introDiv = createElement('div', { class: 'intro' },heading,paragraph,joinButtonContainer);

        // Create the header-intro div and append intro and image
        const headerIntroDiv = createElement('div', { id: 'header-intro' },introDiv,image);
        return createElement("div",{id:"landing-header"},createElement("nav",{ class: 'landing-nav' },
            logo,createElement('ul', { class: 'nav-links' }, homeLink, aboutLink, teamLink, joinLink),),headerIntroDiv)
    }
}

export default landingPageHeader