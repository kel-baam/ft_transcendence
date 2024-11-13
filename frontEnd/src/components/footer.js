import createElement from "../framework/createElement.js";
import render from "../framework/render.js";
import createDOMElement from "../framework/createDOMElement.js";



class Footer{
    constructor()
    {
        this.render();
    }
    render()
    {
        const mediaScope=createElement("ul",{},
            createElement("div",{className:"media-bg"},
                createElement("li",{},
                createElement("a",{href:"https://github.com/kel-baam"},
                createElement("i",{className:"fa-brands fa-github"})
                )
            )),
            createElement("div",{className:"media-bg"},
                createElement("li",{},
                createElement("a",{href:"www.linkedin.com/in/kaoutar-el-baamrani-a99235271"},
                createElement("i",{className:"fa-brands fa-linkedin-in"})
                ))
            ),
            createElement("div",{className:"media-bg"},
            createElement("li",{},
            createElement("a",{href:"mailto:kaoutarelbaamrani@gmail.com"},
            createElement("i",{className:"fa-solid fa-envelope"}
                ))
            ))
        )
        const footerServices= createElement("div",{className:"footer-services"},
            createElement("ul",{},
            createElement("li",{},
            createElement("a",{href:"#header"},"Home")),
            createElement("li",{},
            createElement("a",{href:"#about-section"},"About us")),
            createElement("li",{},
            createElement("a",{href:"#team-section"},"Our Team")),
            createElement("li",{},
            createElement("a",{href:"#"},"Join us"))),

        )
        const footerCopyRight= createElement("div",{className:"footer-copy-right"},
            createElement("p",{},"Copyright &copy;2024 Designed by 1337 students (power girls team)")
        )
        return (
            createElement("div",{id:"footer-section"},
                createElement("div",{class:"footer-media"},mediaScope),
                footerServices,footerCopyRight
            )
        )
    }
}

export default Footer