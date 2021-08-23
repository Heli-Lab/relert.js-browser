/**********************************
 * relert.log.js
 * relert.js 日志信息模块
 **********************************/

// 日期格式化函数
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds(),
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

const __Log = new function() {
    if (typeof __RelertStatic == 'function') {
        __RelertStatic.call(this);
    } else {
        require('./relert.static').call(this);
    }

    this.dom = null;
    this.domParent = null;

    this.waiting = false;
    this.__writeDOM = (data) => {
        if (!this.buffer) {
            this.buffer = document.createDocumentFragment();
        }
        if (data) {
            this.buffer.appendChild(data);
        }
        if (!this.waiting) {
            this.dom.appendChild(this.buffer);
            this.domParent.scrollTop = this.domParent.scrollHeight - this.domParent.clientHeight;
            this.buffer = document.createDocumentFragment();
            this.waiting = true;
            setTimeout(() => {
                this.waiting = false;
                this.dom.appendChild(this.buffer);
                this.domParent.scrollTop = this.domParent.scrollHeight - this.domParent.clientHeight;
                this.buffer = document.createDocumentFragment();
            }, 0);
        }
    }

    this.__log = (str, addClass) => {
        let ele = document.createElement('div');
        ele.setAttribute('class', `log-item ${addClass}`);
        ele.textContent = `[${new Date().format('yyyy.MM.dd hh:mm:ss')}] - ${str}`;
        this.__writeDOM(ele);
    }

    this.exports = {
        log: (...strs) => {
            let str = strs.join(' ');
            if (this.dom) {
                this.__log(str, '');
            } else {
                console.log(str);
            }
        },
        error: (...strs) => {
            let str = strs.join(' ');
            if (this.dom) {
                this.__log(str, 'log-item-error');
            } else {
                console.error(str);
            }
        },
        warn: (...strs) => {
            let str = strs.join(' ');
            if (this.dom) {
                this.__log(str, 'log-item-warn');
            } else {
                console.warn(str);
            }
        },
        cls: () => {
            if (this.dom) {
                this.dom.innerHTML = "";
            } else {
                console.clear();
            }
        }
    }
}

if ((typeof window == 'object') && (this === window)) {
    __Log.mount(relert);
    __Log.dom = document.getElementById('log');
    __Log.domParent = document.getElementById('log-box');
} else {
    module.exports = (parent) => {
        __Log.mount(parent);
    }
}

