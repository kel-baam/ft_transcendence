// Utility function to create a unique key for nodes
function generateKey(node) {
    return node.props && node.props.key ? node.props.key : null;
}

// Function to create patches from diffing process
export function diff(oldVNode, newVNode) {
    const patches = [];
    diffNode(oldVNode, newVNode, patches, 0);
    return patches;
}

// Recursive function to diff nodes
function diffNode(oldVNode, newVNode, patches, index) {
    if (!oldVNode) {
        // If there's no oldVNode, add newVNode as a new element
        patches.push({ type: 'CREATE', vNode: newVNode, index });
    } else if (!newVNode) {
        // If there's no newVNode, remove the oldVNode
        patches.push({ type: 'REMOVE', index });
    } else if (oldVNode.type !== newVNode.type) {
        // If the types are different, replace the oldVNode with the newVNode
        patches.push({ type: 'REPLACE', vNode: newVNode, index });
    } else if (typeof oldVNode === 'string' && oldVNode !== newVNode) {
        // If both are text nodes and different, update the text content
        patches.push({ type: 'TEXT', text: newVNode, index });
    } else {
        // If nodes are the same type, diff their children
        const oldChildren = oldVNode.props.children || [];
        const newChildren = newVNode.props.children || [];
        const maxLength = Math.max(oldChildren.length, newChildren.length);
        
        for (let i = 0; i < maxLength; i++) {
            diffNode(oldChildren[i], newChildren[i], patches, i);
        }
    }
}

// Function to apply patches to the real DOM
export function patch(dom, patches) {
    patches.forEach(patch => {
        switch (patch.type) {
            case 'CREATE':
                dom.appendChild(createDOMElement(patch.vNode));
                break;
            case 'REMOVE':
                dom.removeChild(dom.childNodes[patch.index]);
                break;
            case 'REPLACE':
                dom.replaceChild(createDOMElement(patch.vNode), dom.childNodes[patch.index]);
                break;
            case 'TEXT':
                dom.childNodes[patch.index].textContent = patch.text;
                break;
        }
    });
}

// Helper function to create DOM element from virtual node
function createDOMElement(vNode) {
    if (typeof vNode === 'string') {
        return document.createTextNode(vNode);
    }

    const element = document.createElement(vNode.type);
    Object.keys(vNode.props).forEach(prop => {
        if (prop !== 'children') {
            element[prop] = vNode.props[prop];
        }
    });

    vNode.props.children.forEach(child => {
        element.appendChild(createDOMElement(child));
    });

    return element;
}
