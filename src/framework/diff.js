import createDOMElement from "./createDOMElement.js";
export function diff(oldVNode, newVNode) {
    const patches = [];
    diffNode(oldVNode, newVNode, patches, 0);
    return patches;
}

function diffNode(oldVNode, newVNode, patches, index) {
    if (!oldVNode) {
        patches.push({ type: 'CREATE', vNode: newVNode, index });
    } else if (!newVNode) {
        patches.push({ type: 'REMOVE', index });
    } else if (oldVNode.tag !== newVNode.tag) {
        patches.push({ type: 'REPLACE', vNode: newVNode, index });
    } else if (typeof oldVNode === 'string' && oldVNode !== newVNode) {
        patches.push({ type: 'TEXT', text: newVNode, index });
    } else {
        const oldProps = oldVNode.props || {};
        const newProps = newVNode.props || {};
        
        for (const key in newProps) {
            if (oldProps[key] !== newProps[key]) {
                patches.push({ type: 'PROPS', props: { [key]: newProps[key] }, index });
            }
        }
        
        for (const key in oldProps) {
            if (!(key in newProps)) {
                patches.push({ type: 'REMOVE_PROP', prop: key, index });
            }
        }

        const oldChildren = oldVNode.children || [];
        const newChildren = newVNode.children || [];
        const maxLength = Math.max(oldChildren.length, newChildren.length);
        
        for (let i = 0; i < maxLength; i++) {
            // console.log("-----------> i = ", i)
            diffNode(oldChildren[i], newChildren[i], patches, i);
        }
    }
}

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
                console.log("----------> ", dom.childNodes[patch.index])
                dom.replaceChild(createDOMElement(patch.vNode), dom.childNodes[patch.index]);
                break;
            case 'TEXT':
                dom.childNodes[patch.index].textContent = patch.text;
                break;
            case 'PROPS':
                console.log(">>>>>>>>>>>>>>>>>>>>>>>> ", dom.childNodes[patch.index])
                const targetNode = dom.childNodes[patch.index];
                for (const key in patch.props) {
                    targetNode[key] = patch.props[key]; // Update the property
                }
                break;
            case 'REMOVE_PROP':
                const removeTargetNode = dom.childNodes[patch.index];
                delete removeTargetNode[patch.prop]; // Remove the property
                break;
        }
    });
}



