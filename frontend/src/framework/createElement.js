function createElement(tag, props = {}, ...children) {
    if (tag.prototype)
    {
        return new tag(props).render();
    }
    return {tag, props, children};
}
export  default createElement;

