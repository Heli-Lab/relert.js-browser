/**********************************
 * relert.mapdata.js
 * relert.js 地图数据基类
 **********************************/

globalThis = this;

const __RelertMapData = function() {
    // 入口
    this.entrance = '';
    this.register = '';
    this.parameters = [];
    this.defaults = {};
    // 挂载点
    this.mount = (parent) => {
        this.parent = parent;
        Object.defineProperty(parent, this.entrance, {
            get: () => {
                return this.proxy;
            },
            set: () => {
                throw new Error(`TypeError: Assignment to constant property 'relert.${func}'.`);
            },
        });
    }
    // 主代理
    this.proxy = new Proxy(() => {}, {
        apply: (func, target, args) => {
            let data = this.readData(this.unpack(this.parent.INI[this.register]));
            let getData = (key) => {
                if (typeof key == 'object') {
                    if ((key.X) && (key.Y)) {
                        if (!data[key.X]) {
                            data[key.X] = {};
                        }
                        if (!data[key.X][key.Y]) {
                            data[key.X][key.Y] = this.defaults;
                        }
                        return data[key.X][key.Y];
                    }
                }
            }
            if (typeof args[0] == 'function') {
                args[0](getData);
            }
        }
    });

    this.isNode = ((typeof window == 'undefined') || !(globalThis === window));

    // 引入解码模块
    if (this.isNode) {
        this.compressor = require('./wwcompression.js');
        this.atob = (data) => {
            return buffer.atob(data)
        };
        this.btoa = (data) => {
            return buffer.btoa(data);
        }
    } else {
        this.compressor = wwCompression;
        this.atob = (data) => {
            return window.atob(data)
        };
        this.btoa = (data) => {
            return window.btoa(data);
        }
    }

    // 解包函数
    this.unpack = (ini) => {
        // Base64字符串拼接
        let data_base64 = Object.values(ini).join('');
        // Base64解码
        let data_binaryString = this.atob(data_base64);
        // 转ArrayBuffer
        let data_bytes = new Uint8Array(data_binaryString.length);
        for (let i = 0; i < data_binaryString.length; i++) {
            data_bytes[i] = data_binaryString.charCodeAt(i);
        }

        let i = 0; //指针
        let data_decompressed = [];
        // 循环读取
        while (i < data_bytes.length) {
            // 读取区块大小
            let inputSize = data_bytes[i] + data_bytes[i + 1] * 256;
            i += 2;
            let outputSize = data_bytes[i] + data_bytes[i + 1] * 256;
            i += 2;
            // 读取压缩区块数据
            let data_compressed = new Uint8Array(inputSize);
            for (let j = 0; j <= inputSize; j++) {
                data_compressed[j] = data_bytes[i + j];
            }
            i += inputSize;
            let outputBuffer = new Uint8Array(outputSize);
            // 解压缩
            this.compressor.LCWDecompress(data_compressed, 0, outputBuffer, data_compressed.length);
            console.log(outputBuffer);
            // 拼接区块
            data_decompressed.push(...outputBuffer);
        }
        return data_decompressed;
    }

    // 打包函数
    this.pack = (data) => {
        // 区块大小
        const CHUNK_LENGTH = 8192;
        // 字符串分页长度
        const LINE_LENGTH = 70;

        let i = 0;
        let data_binaryString = '';
        // 循环读取
        while (i < data.length) {
            // 读取区块数据
            let chunkSize = ((i + CHUNK_LENGTH) >= data.length) ? (data.length - i - 1) : CHUNK_LENGTH;
            let chunk = new Uint8Array(chunkSize);
            for (let j = 0; j < chunkSize; j++) {
                chunk[j] = data[i + j];
            }
            i += CHUNK_LENGTH;
            // 压缩
            let outputBuffer = this.compressor.LCWCompress(chunk);
            // 拼接
            data_binaryString += String.fromCharCode(Math.trunc(outputBuffer.length % 256));
            data_binaryString += String.fromCharCode(Math.trunc(outputBuffer.length / 256));
            data_binaryString += String.fromCharCode(Math.trunc(chunkSize % 256));
            data_binaryString += String.fromCharCode(Math.trunc(chunkSize / 256));
            for (let m = 0; m < outputBuffer.length; m++) {
                data_binaryString += String.fromCharCode(outputBuffer[m]);
            }
        }

        // Base64编码
        let data_base64 = this.btoa(data_binaryString);
        // 转对象输出
        let k = 0;
        let count = 0;
        let ini = {};
        while (k < data_base64.length) {
            let lineSize = ((k + LINE_LENGTH) >= data_base64.length) ? (data_base64.length - k - 1) :  LINE_LENGTH;
            ini[count] = data_base64.substring(k, lineSize + k);
            k += LINE_LENGTH;
            count ++;
        }

        return ini;
    }

    // 读取数据
    this.readData = (data_decompressed) => {
        let mapdataObj = {};

        let i = 0;
        let tempObj = {};
        while (i < data_decompressed.length) {
            for (let j in this.parameters) {
                tempObj[this.parameters[j].name] = 0;
                for (let k = 0; k < this.parameters[j].bytes; k++) {
                    tempObj[this.parameters[j].name] += data_decompressed[i] * (256 ** k);
                    i++;
                }
            }

            let X = tempObj.X;
            let Y = tempObj.Y;
            delete tempObj.X;
            delete tempObj.Y;

            if (!mapdataObj[X]) {
                mapdataObj[X] = {};
            }
            mapdataObj[X][Y] = Object.assign({}, tempObj);

        }

        return mapdataObj;
    }



}

// 导出
if ((typeof window == 'undefined') || !(this === window)) {
    module.exports = __RelertMapData;
}
