/**********************************
 * relert.object.celltag.js
 * relert.js 单元标记代理层
 **********************************/

 const __CellTag = function() {
    if (typeof __RelertObject == 'function') {
        __RelertObject.call(this);
    } else {
        require('./relert.object').call(this);
    }
    this.entrance = 'CellTag';
    this.register = 'CellTags';
    this.parameters = [
        'Tag',
    ]
    this.defaults = {
        'Tag': 'none',
    };
    this.arrayLike = false;
}

if ((typeof window == 'object') && (this === window)) {
    new __CellTag().mount(relert);
} else {
    module.exports = (parent) => {
        new __CellTag().mount(parent);
    }
}
