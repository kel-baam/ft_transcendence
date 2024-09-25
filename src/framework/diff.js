import createDOMElement from "./createDOMElement.js";

export function diff(oldVNode, newVNode)
{
    const patches = [];
    diffNode(oldVNode, newVNode, patches, 0, [0]);
    return patches;
}

function diffNode(oldVNode, newVNode, patches, index,path = [])
{
    if ((!oldVNode && newVNode) || (oldVNode === undefined && newVNode))
    {
        patches.push({ type: 'CREATE', vNode: newVNode, index , path});
    }
    else if ((oldVNode && !newVNode) || (oldVNode && newVNode === undefined))
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


        for (let i = 0; i < maxLength; i++)
            diffNode(oldChildren[i], newChildren[i], patches, i, [...path, i]);
    }
}

function getNodeByPath(dom, path) {
    let currentNode = dom, parent = currentNode;

    path.forEach(index => {
        parent = currentNode;
        currentNode = currentNode.childNodes[index];
    });
    return parent;
}


export function patch(dom, patches) {
 
    for (let i = patches.length - 1; i >= 0; i--)
    {
        const targetNode = getNodeByPath(dom,  patches[i].path);
        switch (patches[i].type) {
           case 'REMOVE':
                const targetNodeToRemove = targetNode.childNodes[patches[i].index];
                targetNode.removeChild(targetNodeToRemove);
                break;
        }
      
    }
    for(let i = 0; i < patches.length; i++)
    {
        const targetNode = getNodeByPath(dom, patches[i].path);

        switch (patches[i].type) {
            case 'REMOVE':
                    const targetNodeToRemove = targetNode.childNodes[patches[i].index];
                    targetNode.removeChild(targetNodeToRemove);
                    break;
        }
    }
    for(let i = 0; i < patches.length; i++)
    {
        const targetNode = getNodeByPath(dom, patches[i].path);
        
        switch (patches[i].type) {
            case 'CREATE':
                targetNode.appendChild(createDOMElement(patches[i].vNode));
                break;
            case 'REPLACE':
                const targetNodeToReplace = targetNode.childNodes[patches[i].index];
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

