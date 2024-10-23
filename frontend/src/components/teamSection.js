import createElement from "../framework/createElement.js";
import render from "../framework/render.js";
import createDOMElement from "../framework/createDOMElement.js";



class Team{
    constructor(){
        this.render();
    }
    render()
    {
        const teamTitle=createElement("div",{id:"team-title"},
            createElement("h2",{},"The team",createElement("span",{},
            createElement("br",{}),"behind the magic")),
            createElement("p",{},"Our developers work tirelessly to bring the ping pong website to life,",
            createElement("br",{}),"ensuring every user enjoys a seamless and unforgettable experience.",
            createElement("br",{}),"Meet the team behind the magic!"
            )
        )
        const teamScope= createElement("div",{className:"team-pics"},
            createElement("div",{className:"card"},
            createElement("div",{className:"pic"},createElement("img",{src:"./images/pic.jpg"})),
            createElement("div",{className:"content-card"},createElement("div",{className:"contentBx"},
            createElement("h3",{},"kaoutar el baamrani",createElement("br",{}),
            createElement("span",{},"software engineer"))),
            createElement("ul",{className:"box-icon"},
            createElement("li",{style:"--i: 1"},createElement("a",{href:"https://github.com/kel-baam"},createElement("i",{class:"fa-brands fa-github"}))),
            createElement("li",{style:"--i: 2"},createElement("a",{href:"www.linkedin.com/in/kaoutar-el-baamrani-a99235271"},createElement("i",{class:"fa-brands fa-linkedin-in"}))),
            createElement("li",{style:"--i: 3"},createElement("a",{href:"mailto:kaoutarelbaamrani@gmail.com"},createElement("i",{class:"fa-solid fa-envelope"}))),)
            )
            ),
            createElement("div",{className:"card"},
            createElement("div",{className:"pic"},createElement("img",{src:"./images/pic2.jpg"})),
            createElement("div",{className:"content-card"},createElement("div",{className:"contentBx"},
            createElement("h3",{},"nisren boukhari",createElement("br",{}),
            createElement("span",{},"software engineer"))),
            createElement("ul",{className:"box-icon"},
            createElement("li",{style:"--i: 1"},createElement("a",{href:"https://github.com/niboukha"},createElement("i",{class:"fa-brands fa-github"}))),
            createElement("li",{style:"--i: 2"},createElement("a",{href:""},createElement("i",{class:"fa-brands fa-linkedin-in"}))),
            createElement("li",{style:"--i: 3"},createElement("a",{href:"mailto:nisrinboukhari19@gmail.com"},createElement("i",{class:"fa-solid fa-envelope"}))),)
            )
            ),
            createElement("div",{className:"card"},
            createElement("div",{className:"pic"},createElement("img",{src:"./images/pic2.jpg"})),
            createElement("div",{className:"content-card"},createElement("div",{className:"contentBx"},
            createElement("h3",{},"karima jarmoumi",createElement("br",{}),
            createElement("span",{},"software engineer"))),
            createElement("ul",{className:"box-icon"},
            createElement("li",{style:"--i: 1"},createElement("a",{href:"https://github.com/karimajarmoumi"},createElement("i",{class:"fa-brands fa-github"}))),
            createElement("li",{style:"--i: 2"},createElement("a",{href:""},createElement("i",{class:"fa-brands fa-linkedin-in"}))),
            createElement("li",{style:"--i: 3"},createElement("a",{href:""},createElement("i",{class:"fa-solid fa-envelope"}))),)
            )
            ),
            createElement("div",{className:"card"},
            createElement("div",{className:"pic"},createElement("img",{src:"./images/pic.jpg"})),
            createElement("div",{className:"content-card"},createElement("div",{className:"contentBx"},
            createElement("h3",{},"souad hisham",createElement("br",{}),
            createElement("span",{},"software engineer"))),
            createElement("ul",{className:"box-icon"},
            createElement("li",{style:"--i: 1"},createElement("a",{href:"https://github.com/s-hicham"},createElement("i",{class:"fa-brands fa-github"}))),
            createElement("li",{style:"--i: 2"},createElement("a",{href:""},createElement("i",{class:"fa-brands fa-linkedin-in"}))),
            createElement("li",{style:"--i: 3"},createElement("a",{href:""},createElement("i",{class:"fa-solid fa-envelope"}))),)
            )
            ),
        )
        return(createElement("div",{id:"team-section"},teamTitle,teamScope

        )

        )
    }
}



export default Team