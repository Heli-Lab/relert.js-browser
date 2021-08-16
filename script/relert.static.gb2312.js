/**********************************
 * relert.static.gb2312.js
 * relert.js GB2312编码转换
 **********************************/

globalThis = this;

const __GB2312 = new function() {
    if (typeof __RelertStatic == 'function') {
        __RelertStatic.call(this);
    } else {
        require('./relert.static').call(this);
    }

    this.ENCODING = 'GB2312';

    if (typeof iconv == 'object') {
        this.iconv = iconv;
    } else {
        if ((typeof window == 'object') && (globalThis === window)) {
            this.iconv = {
                encode: (data) => {
                    if (data.indexOf('\ufffd') == -1) {
                        return data;
                    } else {
                        throw new Error('UTF-8 encoding Error. Please confirm the module "iconv-lite" to support GB2312 encoding.');
                    }
                },
                decode: (data) => {
                    return data.toString();
                }
            }
        } else {
            this.iconv = require('./iconv-lite.min.js');
        }
    }

    this.iconv.skipDecodeWarning = true;

    this.encode = (str) => {
        return this.iconv.encode(str, this.ENCODING);
    }

    this.decode = (data) => {
        let dataUTF8 = this.iconv.decode(data, 'UTF-8');
        if (dataUTF8.indexOf('\ufffd') >= 0) {
            this.ENCODING = 'GB2312';
            return this.iconv.decode(data, this.ENCODING);
        } else {
            this.ENCODING = 'UTF-8';
            return dataUTF8;
        }
    }

    this.encoding = (NEW_ENCODING) => {
        if (NEW_ENCODING) {
            this.ENCODING = NEW_ENCODING;
        }
        return this.ENCODING;
    }
    
    this.exports = {
        decode: this.decode,
        encode: this.encode,
        encoding: this.encoding,
    }
}

if ((typeof window == 'object') && (this === window)) {
    __GB2312.mount(relert);
} else {
    module.exports = __GB2312.mount;
}
