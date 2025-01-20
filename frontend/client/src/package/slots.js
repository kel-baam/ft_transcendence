import { DOM_TYPES, hFragment } from './h.js'
import { traverseDFS } from './traverse-dom.js'
import { assert } from './utils/assert.js'

export function fillSlots(vdom, externalContent = []) {
    function processNode(node, parent, index) {
      insertViewInSlot(node, parent, index, externalContent)
    }
  
    traverseDFS(vdom, processNode, shouldSkipBranch)
}

function insertViewInSlot(node, parent, index, externalContent) {
    if (node.type !== DOM_TYPES.SLOT) return
  
    assert(parent !== null, 'Slot nodes must have a parent')
    assert(index !== null, 'Slot nodes must have an index')
  
    const defaultContent = node.children
    const views =
      externalContent.length > 0 ? externalContent : defaultContent
  
    assert(Array.isArray(views), 'Slot views must be an array')
  
    const hasContent = views.length > 0
    if (hasContent) {
      parent.children.splice(index, 1, hFragment(views))
    } else {
      parent.children.splice(index, 1)
    }
}

function shouldSkipBranch(node) {
    return node.type === DOM_TYPES.COMPONENT
}