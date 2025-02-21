import {
    removeAttribute,
    removeStyle,
    setAttribute,
    setStyle,
  } from './attributes.js'
  import { destroyDOM } from './destroy-dom.js'
  import { addEventListener } from './events.js'
  import { DOM_TYPES, extractChildren, isComponent } from './h.js'
  import { mountDOM } from './mount-dom.js'
  import { areNodesEqual } from './nodes-equal.js'
  import {
    arraysDiff,
    arraysDiffSequence,
    ARRAY_DIFF_OP,
  } from './utils/arrays.js'
  import { objectsDiff } from './utils/objects.js'
  import { extractPropsAndEvents } from './utils/props.js'
  import { isNotBlankOrEmptyString } from './utils/strings.js'


export function patchDOM(oldVdom, newVdom, parentEl, hostComponent = null) {
    if (!areNodesEqual(oldVdom, newVdom)) {
      // console.log("----------------------------------> here here patch equal zero ")
        const index = findIndexInParent(parentEl, oldVdom.el)
        destroyDOM(oldVdom)
        mountDOM(newVdom, parentEl, index, hostComponent)

        return newVdom
    }

    newVdom.el = oldVdom.el

    switch (newVdom.type) {
        case DOM_TYPES.TEXT: {
        patchText(oldVdom, newVdom)
        return newVdom
        }

        case DOM_TYPES.ELEMENT: {
        patchElement(oldVdom, newVdom, hostComponent)
        break
        }

        case DOM_TYPES.COMPONENT: {
        patchComponent(oldVdom, newVdom)
        break
        }
}

patchChildren(oldVdom, newVdom, hostComponent)

return newVdom
}

function findIndexInParent(parentEl, el) {
    const index = Array.from(parentEl.childNodes).indexOf(el)
    if (index < 0) {
        return null
    }

    return index
}

function patchText(oldVdom, newVdom) {
    const el = oldVdom.el
    const { value: oldText } = oldVdom
    const { value: newText } = newVdom
  
    if (oldText !== newText) {
      el.nodeValue = newText
    }
}

function patchElement(oldVdom, newVdom, hostComponent) {
    const el = oldVdom.el
    const {
      class: oldClass,
      style: oldStyle,
      on: oldEvents,
      ...oldAttrs
    } = oldVdom.props
    const {
      class: newClass,
      style: newStyle,
      on: newEvents,
      ...newAttrs
    } = newVdom.props
    const { listeners: oldListeners } = oldVdom
  
    patchAttrs(el, oldAttrs, newAttrs)
    patchClasses(el, oldClass, newClass)
    patchStyles(el, oldStyle, newStyle)
    newVdom.listeners = patchEvents(
      el,
      oldListeners,
      oldEvents,
      newEvents,
      hostComponent
    )
}

function patchAttrs(el, oldAttrs, newAttrs) {
    const { added, removed, updated } = objectsDiff(oldAttrs, newAttrs)
  
    for (const attr of removed) {
      removeAttribute(el, attr)
    }
  
    for (const attr of added.concat(updated)) {
      setAttribute(el, attr, newAttrs[attr])
    }
}

function patchClasses(el, oldClass, newClass) {
    const oldClasses = toClassList(oldClass)
    const newClasses = toClassList(newClass)
  
    const { added, removed } = arraysDiff(oldClasses, newClasses)
  
    if (removed.length > 0) {
      el.classList.remove(...removed)
    }
    if (added.length > 0) {
      el.classList.add(...added)
    }
}

function toClassList(classes = '') {
    return Array.isArray(classes)
      ? classes.filter(isNotBlankOrEmptyString)
      : classes.split(/(\s+)/).filter(isNotBlankOrEmptyString)
}

function patchStyles(el, oldStyle = {}, newStyle = {}) {
    const { added, removed, updated } = objectsDiff(oldStyle, newStyle)
  
    for (const style of removed) {
      removeStyle(el, style)
    }
  
    for (const style of added.concat(updated)) {
      setStyle(el, style, newStyle[style])
    }
}

function patchEvents(
    el,
    oldListeners = {},
    oldEvents = {},
    newEvents = {},
    hostComponent
  ) {
    const { removed, added, updated } = objectsDiff(oldEvents, newEvents)
  
    for (const eventName of removed.concat(updated)) {
      el.removeEventListener(eventName, oldListeners[eventName])
    }
  
    const addedListeners = {}
  
    for (const eventName of added.concat(updated)) {
      const listener = addEventListener(
        eventName,
        newEvents[eventName],
        el,
        hostComponent
      )
      addedListeners[eventName] = listener
    }
    return addedListeners
  }

function patchComponent(oldVdom, newVdom) {
    const { component } = oldVdom
    const { children } = newVdom
    const { props } = extractPropsAndEvents(newVdom)

    component.setExternalContent(children)
    component.updateProps(props)

    newVdom.component = component
    newVdom.el = component.firstElement
}

function patchChildren(oldVdom, newVdom, hostComponent) {
    const oldChildren = extractChildren(oldVdom)
    const newChildren = extractChildren(newVdom)
    const parentEl = oldVdom.el
  
    const diffSeq = arraysDiffSequence(
      oldChildren,
      newChildren,
      areNodesEqual
    )
  
    for (const operation of diffSeq) {
      const { originalIndex, index, item } = operation
      const offset = hostComponent?.offset ?? 0
  
      switch (operation.op) {
        case ARRAY_DIFF_OP.ADD: {
          mountDOM(item, parentEl, index + offset, hostComponent)
          break
        }
  
        case ARRAY_DIFF_OP.REMOVE: {
          destroyDOM(item)
          break
        }
  
        case ARRAY_DIFF_OP.MOVE: {
          const oldChild = oldChildren[originalIndex]
          const newChild = newChildren[index]
          const elAtTargetIndex = parentEl.childNodes[index + offset]
  
          // Note to readers:
          //
          // If you are following along with the code in the book, you will notice that the `elementsToMove` variable
          // isn't defined in the book. The original code had a bug that caused only the first element of a component
          // using a top-level fragment to be moved. This bug was fixed by adding the `elementsToMove` variable and
          // using it to move all the elements of a component when the component is a top-level fragment.
          //
          // For more information see:
          //  - The bug report: https://github.com/angelsolaorbaiceta/fe-fwk-book/issues/267
          //  - The PR fixing the issue: https://github.com/angelsolaorbaiceta/fe-fwk-book/pull/269
          const elementsToMove = isComponent(oldChild)
            ? oldChild.component.elements
            : [oldChild.el]
  
          elementsToMove.forEach((el) => {
            parentEl.insertBefore(el, elAtTargetIndex)
            patchDOM(oldChild, newChild, parentEl, hostComponent)
          })
  
          break
        }
  
        case ARRAY_DIFF_OP.NOOP: {
          patchDOM(
            oldChildren[originalIndex],
            newChildren[index],
            parentEl,
            hostComponent
          )
          break
        }
      }
    }
  }
