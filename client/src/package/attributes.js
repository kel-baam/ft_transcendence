export function setAttributes(el, attrs) {
    const { class: className, style, ...otherAttrs } = attrs
  
    // Delete the "key" property if it exists
    delete otherAttrs.key
  
    if (className) {
      setClass(el, className)
    }
  
    if (style) {
      Object.entries(style).forEach(([prop, value]) => {
        setStyle(el, prop, value)
      })
    }
  
    for (const [name, value] of Object.entries(otherAttrs)) {
      setAttribute(el, name, value)
    }
  }

export function setAttribute(el, name, value) {
    if (value == null) {
      removeAttribute(el, name)
    } else if (name.startsWith('data-')) {
      el.setAttribute(name, value)
    } else {
      el[name] = value
    }
}

export function removeAttribute(el, name) {
    try {
      el[name] = null
    } catch {
      // Setting 'size' to null on an <input> throws an error.
      // Removing the attribute instead works. (Done below.)
      console.warn(`Failed to set "${name}" to null on ${el.tagName}`)
    }
  
    el.removeAttribute(name)
}

export function setStyle(el, name, value) {
  el.style[name] = value
}

export function removeStyle(el, name) {
    el.style[name] = null
}

function setClass(el, className) {
    el.className = ''

    if (typeof className === 'string') {
        el.className = className
    }

    if (Array.isArray(className)) {
        el.classList.add(...className)
    }
}