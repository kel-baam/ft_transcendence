function createElement(tag, props = {}, ...children) {
    if (tag.prototype)
    {
        // console.log("**************> props : ",props)
        // console.log(">>>>>>>>>>>>>>>>>>>>>> tag : ", props.tag)
        return new tag(props).render();
    }
    return {tag, props, children};
}
export  default createElement;
