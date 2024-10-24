function createDOMElement(virtualDOM) {
    // Handle text nodes


    // console.log("in cDOM : ", virtualDOM);
    if (typeof virtualDOM === 'string') {
        return document.createTextNode(virtualDOM);
    }

    // Check if virtualDOM.tag is a function (component)
    // if (typeof virtualDOM.tag === 'function') {
    //     // Check if it's a class-based component
    //     const componentInstance = new virtualDOM.tag(virtualDOM.props);  // Instantiate the component
    //     const componentVNode = componentInstance.render();  // Call the render method to get virtual DOM
    //     return createDOMElement(componentVNode);  // Recursively create DOM for the component's virtual DOM
    // }

    // Create regular HTML elements
    var element = document.createElement(virtualDOM.tag);

    // Set properties and attributes
    if (virtualDOM.props) {
        Object.keys(virtualDOM.props).forEach(prop => {
            // if (prop.startsWith('on')) {
            //     // Handle event listeners
            //     const event = prop.slice(2).toLowerCase();
            //     element.addEventListener(event, virtualDOM.props[prop]);
             if (prop.startsWith('data-') || prop === 'class' || prop === 'for') {
                element.setAttribute(prop, virtualDOM.props[prop]);
            } else {
                element[prop] = virtualDOM.props[prop];
            }
        });
    }

    // Recursively handle children
    if (virtualDOM.children) {
        virtualDOM.children.forEach(child => {
            element.appendChild(createDOMElement(child));
        });
    }

    return element;
}

export default createDOMElement;
