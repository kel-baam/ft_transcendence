function createDOMElement(virtualDOM) {
    if (typeof virtualDOM === 'string') {
        return document.createTextNode(virtualDOM);
    }
    const element = document.createElement(virtualDOM.tag);
    if (virtualDOM && virtualDOM.props)
    {
        Object.keys(virtualDOM.props).forEach(prop => {
            if (prop !== 'children')
                  element[prop] = virtualDOM.props[prop];
        });
    }

    if (virtualDOM && virtualDOM.children)
    {
        virtualDOM.children.forEach(child => {
            element.appendChild(createDOMElement(child));
            // console.log(child)
        });
    }

    return element;
}
export default createDOMElement;