import createDOMElement from "./createDOMElement.js";

export function diff(oldVNode, newVNode)
{
    const patches = [];
    diffNode(oldVNode, newVNode, patches, 0, [0]);
    return patches;
}

function diffNode(oldVNode, newVNode, patches, index,path = [])
{
    // console.log('Diffing nodes at index', index, 'Old VNode:', oldVNode, 'New VNode:', newVNode);
    if (!oldVNode && newVNode)
    {
        patches.push({ type: 'CREATE', vNode: newVNode, index , path});
    }
    else if (oldVNode && !newVNode)
{
        patches.push({ type: 'REMOVE', index , path});
    }
    else if (oldVNode && newVNode && oldVNode.tag !== newVNode.tag)
    {
        patches.push({ type: 'REPLACE', vNode: newVNode, index, path });
    }
    else if (typeof oldVNode === 'string' && oldVNode !== newVNode) {
        patches.push({ type: 'TEXT', text: newVNode, index, path });
    }
    else if (oldVNode && newVNode)
    {
        const oldProps = oldVNode.props || {};
        const newProps = newVNode.props || {};
        
        for (const key in newProps) {
            if (oldProps[key] !== newProps[key]) {
                patches.push({ type: 'PROPS', props: { [key]: newProps[key] }, index, path });
            }
        }
        for (const key in oldProps) {
            if (!(key in newProps)) {
                patches.push({ type: 'REMOVE_PROP', prop: key, index, path });
            }
        }

        const oldChildren = oldVNode.children || [];
        const newChildren = newVNode.children || [];
        const maxLength = Math.max(oldChildren.length, newChildren.length);

        // console.log("--------> oldnode", oldVNode)
        // console.log("--------> newnode", newVNode)

        for (let i = 0; i < maxLength; i++)
        {
            // console.log("OLD chILD => ", oldChildren);
            // console.log("NEW chILD => ", newChildren);
            console.log("--------> path : ", path)
            diffNode(oldChildren[i], newChildren[i], patches, i, [...path, i]);
        }
    }
}

function getNodeByPath(dom, path) {
    let currentNode = dom;
    path.forEach(index => {
        currentNode = currentNode.childNodes[index];
        console.log(">>>>>>>>> currentNode : ", currentNode)
    });
    return currentNode;
}

// export function patch(dom,patches) {
//     patches.forEach(patch => {
//         const targetNode = getNodeByPath(dom, patch.path);
//         console.log("-------> ", targetNode)
//         switch (patch.type) {
//             // case 'CREATE':
//             //     dom.appendChild(createDOMElement(patch.vNode));
//             //     break;
//             // case 'REMOVE':
//             //     const nodeToRemove = dom.childNodes[patch.index];
//             //     if (nodeToRemove) {
//             //         dom.removeChild(nodeToRemove);
//             //     }
//             //     break;
//             case 'REPLACE':
//                 // const parent = patch.parent;

//                 // console.log("=========> ", parent);
//                 // console.log("kkkkkk",document.body)
//                 // console.log(patch.index);
//                 // const dom =  
//                 const oldNode = parent.childNodes[patch.index];
//                 const newNode = createDOMElement(patch.vNode);
//                 parent.replaceChild(newNode, oldNode);
//                 break;
//             // case 'TEXT':
//             //     if (dom.childNodes[patch.index]) dom.childNodes[patch.index].textContent = patch.text;
//             //     break;
//             // case 'PROPS':
//             //     const targetNode = dom.childNodes[patch.index];
//             //     for (const key in patch.props) {
//             //         targetNode[key] = patch.props[key];
//             //     }
//             //     break;
//             // case 'REMOVE_PROP':
//             //     const removeTargetNode = dom.childNodes[patch.index];
//             //     delete removeTargetNode[patch.prop];
//             //     break;
//         }
//     });
// }

export function patch(dom, patches) {
    patches.forEach(patch => {
        const targetNode = getNodeByPath(dom, patch.path); // Get the target node by path

        switch (patch.type) {
            case 'CREATE':
                targetNode.appendChild(createDOMElement(patch.vNode));
                break;
            case 'REMOVE':
                const targetNodeToRemove = targetNode;
                targetNodeToRemove.parentNode.removeChild(targetNodeToRemove);
                break;
            case 'REPLACE':
                const targetNodeToReplace = targetNode;
                targetNodeToReplace.replaceWith(createDOMElement(patch.vNode));
                break;
            case 'TEXT':
                targetNode.textContent = patch.text;
                break;
        }
    });
}
