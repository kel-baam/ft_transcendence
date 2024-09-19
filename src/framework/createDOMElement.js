function createDOMElement(virtualDOM) {
    if (typeof virtualDOM === 'string') {
        return document.createTextNode(virtualDOM);
    }
    var element
    if(virtualDOM)
    {
        element = document.createElement(virtualDOM.tag);
    }
    if (virtualDOM && virtualDOM.props) {
        Object.keys(virtualDOM.props).forEach(prop => {
            if (prop.startsWith('on')) {
                // Handle event listeners
                const event = prop.slice(2).toLowerCase();
                element.addEventListener(event, virtualDOM.props[prop]);
            } else if (prop.startsWith('data-') || prop === 'class' || prop === 'for') {
                element.setAttribute(prop, virtualDOM.props[prop]);
            } else {
                element[prop] = virtualDOM.props[prop];
            }
        });
    }
1
    if (virtualDOM && virtualDOM.children) {
        virtualDOM.children.forEach(child => {
            element.appendChild(createDOMElement(child));
        });
    }
    if (element)
        return element;
    return null
}

export default createDOMElement;
