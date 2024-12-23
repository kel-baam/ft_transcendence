
import { withoutNulls } from './utils/arrays.js'
import { assert } from './utils/assert.js'

let hSlotCalled = false

export const DOM_TYPES = {
    TEXT: 'text',
    ELEMENT: 'element',
    FRAGMENT: 'fragment',
    COMPONENT: 'component',
    SLOT: 'slot',
}

export function h(tag, props = {}, children = []) {
    const type =
    typeof tag === 'string' ? DOM_TYPES.ELEMENT : DOM_TYPES.COMPONENT
  
    assert(
      typeof props === 'object' && !Array.isArray(props),
      '[vdom] h() expects an object as props (2nd argument)'
    )
    assert(
      Array.isArray(children),
      `[vdom] h() expects an array of children (3rd argument), but got '${typeof children}'`
    )
  
    return {
      tag,
      props,
      type,
      children: mapTextNodes(withoutNulls(children)),
    }
  }

export function isComponent({ tag }) {
  return typeof tag === 'function'
}


export function hString(str) {
  return { type: DOM_TYPES.TEXT, value: String(str) }
}

export function hFragment(vNodes) {
  assert(
    Array.isArray(vNodes),
    '[vdom] hFragment() expects an array of vNodes'
  )

  return {
    type: DOM_TYPES.FRAGMENT,
    children: mapTextNodes(withoutNulls(vNodes)),
  }
}

export function didCreateSlot() {
  return hSlotCalled
}

export function resetDidCreateSlot() {
  hSlotCalled = false
}

export function hSlot(children = []) {
  hSlotCalled = true
  return { type: DOM_TYPES.SLOT, children }
}

function mapTextNodes(children) {
  return children.map((child) =>
    typeof child === 'string' ||
    typeof child === 'number' ||
    typeof child === 'boolean' ||
    typeof child === 'bigint' ||
    typeof child === 'symbol'
      ? hString(child)
      : child
  )
}

export function extractChildren(vdom) {
  if (vdom.children == null) {
    return []
  }

  const children = []

  for (const child of vdom.children) {
    if (child.type === DOM_TYPES.FRAGMENT) {
      children.push(...extractChildren(child))
    } else {
      children.push(child)
    }
  }

  return children
}
