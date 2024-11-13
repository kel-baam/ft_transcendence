import createElement from "../framework/createElement.js";
import render from "../framework/render.js";
import createDOMElement from "../framework/createDOMElement.js";


class aboutUs{



    constructor()
    {
        this.render();
    }
    render()
    {
        const title = createElement("h2",{},"ABOUT US");
        const aboutUsContent=createElement("div",{className:"about"},
            createElement("div",{className:"glass-cart"},
                createElement("div",{className:"about-text"},
                    createElement("p",{},"Welcome to our website, we Designed this website as a final project for our",
                        createElement('br',{}),"school 1337, where the excitement of ping pong meets a vibrant community",
                        createElement('br',{}),"experience.Dive into thrilling matches, connect with fellow players through",
                        createElement('br',{}),"dynamic chatroom,and track your achievements as you climb the leader-board",
                        createElement('br',{}),"Whether you're a seasoned competitor or new to the game,our website",
                        createElement('br',{}),"is your go-to destination for enjoying and improving your ping pong skills",
                        createElement('br',{}),"in a friendly and competitive atmosphere. Join us today and discover",
                        createElement('br',{}),"the thrill of ping pong like never before!",)
                ),
                createElement("img",{src:"./images/aboutPic.png"},)
            )
        )
        return createElement("div",{id:"about-section"},title,aboutUsContent)
    }
}
export default aboutUs