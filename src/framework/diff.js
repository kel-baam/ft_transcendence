import VirtualDOM from "./VirtualDOM.js";
// Utility function to create a virtual node representation of a real DOM node
function createVNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        // return { type: 'TEXT_NODE', text: node.textContent };
        return VirtualDOM.createElement('TEXT_NODE', {text: node.textContent})
    }

    // return {
        // type: node.nodeName.toLowerCase(),
        // attributes: Array.from(node.attributes).reduce((attrs, attr) => {
        //     attrs[attr.name] = attr.value;
        //     return attrs;
        // }, {}),
        // children: Array.from(node.childNodes).map(createVNode)
    // };
    return VirtualDOM.createElement(node.nodeName.toLowerCase(), 
        Array.from(node.attributes).reduce((attrs, attr) => {
            attrs[attr.name] = attr.value;
            return attrs;
        }),
        Array.from(node.childNodes).map(createVNode))
}

// Function to compare a real DOM node with a virtual DOM node
function diffDOM(oldNode, newVNode) {
    const patches = [];
    diffNode(oldNode, newVNode, patches);
    return patches;
}

// Recursive function to compare nodes
function diffNode(oldNode, newVNode, patches) {
    if (!oldNode) {
        // New node doesn't have an old node, so it's a creation
        patches.push({ type: 'CREATE', vNode: createVNode(newVNode) });
        return;
    }
    
    if (!newVNode) {
        // Old node doesn't have a new node, so it's a removal
        patches.push({ type: 'REMOVE', node: oldNode });
        return;
    }
    
    if (oldNode.nodeType !== newVNode.nodeType) {
        // Node types are different, so it's a replacement
        patches.push({ type: 'REPLACE', newNode: createVNode(newVNode), oldNode });
        return;
    }
    
    if (oldNode.nodeType === Node.TEXT_NODE) {
        // Compare text content
        if (oldNode.textContent !== newVNode.text) {
            patches.push({ type: 'TEXT', text: newVNode.text, node: oldNode });
        }
        return;
    }
    
    // Compare attributes
    const oldAttrs = oldNode.attributes;
    const newAttrs = newVNode.attributes;
    
    // Check for attributes that need to be updated or removed
    for (let i = 0; i < oldAttrs.length; i++) {
        const attr = oldAttrs[i];
        if (newVNode.attributes[attr.name] !== attr.value) {
            patches.push({ type: 'ATTR', name: attr.name, value: newVNode.attributes[attr.name], node: oldNode });
        }
    }
    
    // Check for new attributes
    for (const name in newAttrs) {
        if (!oldAttrs[name] || oldAttrs[name] !== newAttrs[name]) {
            patches.push({ type: 'ATTR', name, value: newAttrs[name], node: oldNode });
        }
    }
    
    // Compare children
    const oldChildren = oldNode.childNodes;
    const newChildren = newVNode.children || [];
    
    for (let i = 0; i < Math.max(oldChildren.length, newChildren.length); i++) {
        diffNode(oldChildren[i], newChildren[i], patches);
    }
}

// Example usage
const oldDOM = document.getElementById('old');
const newVNode = {
    type: 'div',
    attributes: { id: 'old' },
    children: [
        { type: 'h1', attributes: {}, children: [{ type: 'TEXT_NODE', text: 'Hello, World!' }] },
        { type: 'p', attributes: {}, children: [{ type: 'TEXT_NODE', text: 'This is a paragraph.' }] }
    ]
};

const patches = diffDOM(oldDOM, newVNode);
console.log(patches);
