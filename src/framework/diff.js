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
            // console.log("--------> path : ", path)
            diffNode(oldChildren[i], newChildren[i], patches, i, [...path, i]);
        }
    }
}

function getNodeByPath(dom, path) {
    let currentNode = dom, parent = currentNode;

    path.forEach(index => {
        parent = currentNode;
        currentNode = currentNode.childNodes[index];

        // console.log(">>>>>>>>> currentNode : ", currentNode, index)
    });
    return parent;
}


export function patch(dom, patches) {
    // patches.forEach(patch => {
    for(let i = patches.length - 1; i >= 0; i--)
    {
        const targetNode = getNodeByPath(dom, patches[i].path); // Get the target node by path
        
        switch (patches[i].type) {
            case 'CREATE':
                targetNode.appendChild(createDOMElement(patches[i].vNode));
                break;
            case 'REMOVE':
                const targetNodeToRemove = targetNode.childNodes[patches[i].index];
                // console.log("--------> target node : ", targetNode, patches[i].index)
                // console.log("remove : -> ", targetNodeToRemove);
                targetNode.removeChild(targetNodeToRemove);
                break;
            case 'REPLACE':
                const targetNodeToReplace = targetNode.childNodes[patches[i].index];
                // console.log("replace : -> ", targetNodeToReplace);
                targetNodeToReplace.replaceWith(createDOMElement(patches[i].vNode));
                break;
            case 'TEXT':
                targetNode.textContent = patches[i].text;
                break;
            case 'PROPS':
                const targetNodeA = targetNode.childNodes[patches[i].index];;
                for (const key in patches[i].props) {
                    targetNodeA[key] = patches[i].props[key];
                }
                break;
            case 'REMOVE_PROP':
                const removeTargetNode = targetNode.childNodes[patches[i].index];
                delete removeTargetNode[patches[i].prop];
                break;

            }
    }
}
