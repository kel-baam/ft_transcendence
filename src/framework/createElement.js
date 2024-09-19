function createElement(tag, props = {}, ...children) {
    if(tag.prototype)
    {
        const tagOb = new tag(props)
        return tagOb.render()
    }
    return {tag, props, children};
}
export  default createElement;
