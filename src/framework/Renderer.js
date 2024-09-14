import createDOMElement from "./createDOMElement.js";

function render(virtualDOM, container) {
    const dom = createDOMElement(virtualDOM);
    container.appendChild(dom);
}
export default render;
