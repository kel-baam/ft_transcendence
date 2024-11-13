import createDOMElement from "./createDOMElement.js";

function render(virtualDOM, container)
{
    const dom = createDOMElement(virtualDOM);
    if (container)
    {
        // container.innerHTML = '';
        container.appendChild(dom);

    }
}

export default render;
