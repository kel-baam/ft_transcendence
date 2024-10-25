function createDOMElement(virtualDOM) {
    if (typeof virtualDOM === 'string') {
        return document.createTextNode(virtualDOM);
    }

    var element = document.createElement(virtualDOM.tag);

    // for (const key in props) {
    //     if (key === 'ref') {
    //         props[key](element); // Call the ref function with the created element
    //     } else {
    //         element.setAttribute(key, props[key]);
    //     }
    // }

    if (virtualDOM.props) {
        Object.keys(virtualDOM.props).forEach(prop => {
            if (prop.startsWith('on')) {
                const event = prop.slice(2).toLowerCase();
                element.addEventListener(event, virtualDOM.props[prop]);
            } else if (prop.startsWith('data-') || prop === 'class' || prop === 'for') {
                element.setAttribute(prop, virtualDOM.props[prop]);
            } else {
                element[prop] = virtualDOM.props[prop];
            }
        });
    }

    if (virtualDOM.children) {
        virtualDOM.children.forEach(child => {
            element.appendChild(createDOMElement(child));
        });
    }

    return element;
}

export default createDOMElement;
