import { DOM_TYPES } from './h.js'

export function areNodesEqual(nodeOne, nodeTwo) {
    if (nodeOne.type !== nodeTwo.type) {
      return false
    }
  
    if (nodeOne.type === DOM_TYPES.ELEMENT) {
      const {
        tag: tagOne,
        // props: { key: keyOne },
      } = nodeOne
      const {
        tag: tagTwo,
        // props: { key: keyTwo },
      } = nodeTwo
//    && keyOne === keyTwo
      return tagOne === tagTwo
    }
  
    if (nodeOne.type === DOM_TYPES.COMPONENT) {
      const {
        tag: componentOne,
        // props: { key: keyOne },
      } = nodeOne
      const {
        tag: componentTwo,
        // props: { key: keyTwo },
      } = nodeTwo
//   && keyOne === keyTwo
      return componentOne === componentTwo 
    }
  
    return true
}