class VirtualDOM {
    constructor(tag, props = {}, children = []) {
        this.tag = tag;
        this.props = props;
        this.children = children;
    }
    
    static createElement(tag, props = {}, ...children) {
        return new VirtualDOM(tag, props, children);
    } 
}


export  default VirtualDOM;
