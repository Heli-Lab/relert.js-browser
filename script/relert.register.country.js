/**********************************
 * relert.object.country.js
 * relert.js 作战方代理层
 **********************************/

 const __Country = function() {
    if (typeof __RelertRegister == 'function') {
        __RelertRegister.call(this);
    } else {
        require('./relert.object').call(this);
    }
    this.entrance = 'Country';
    this.register = 'Countries';
    this.addName = true;
    this.defaults = {
        'Name': '',
        'Side': 'GDI',
        'Color': 'Gold',
        'Prefix': 'G',
        'Suffix': 'Allied',
        'SmartAI': 'yes',
        'CostUnitsMult': '1',
        'ParentCountry': 'Americans',
    };
}

if ((typeof window == 'object') && (this === window)) {
    new __Country().mount(relert);
} else {
    module.exports = (parent) => {
        new __Country().mount(parent);
    }
}
