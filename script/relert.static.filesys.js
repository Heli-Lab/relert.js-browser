/**********************************
 * relert.static.file.js
 * relert.js 文件接口
 **********************************/

globalThis = this;

const __FileSys = function() {
    if (typeof __RelertStatic == 'function') {
        __RelertStatic.call(this);
    } else {
        require('./relert.static').call(this);
    }

    this.isNode = ((typeof window == 'undefined') || !(globalThis === window));

    // 内部存储一个文件名，作为文件名的缺省值
    this.savedFileName = 'test_relert.map';

    // 字符串转成带有INI结构的json object
    this.stringToINI = (data) => {
        var regex = {
            section: /^\s*\s*\[([^]*)\s*\]\s*$/,
            param: /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,
            comment: /^\s*;.*$/
        };
        var value = {};
        var lines = data.split(/\r\n|\r|\n/);
        var section = null;
        lines.forEach((line) => {
            if (regex.comment.test(line)) {
                return;
            } else if (regex.param.test(line)) {
                var match = line.match(regex.param);
                if (section) {
                    value[section][match[1]] = match[2];
                } else {
                    value[match[1]] = match[2];
                }
            } else if (regex.section.test(line)) {
                var match = line.match(regex.section);
                value[match[1]] = {};
                section = match[1];
            } else if (line.length == 0 && section) {
                section = null;
            };
        });
        return value;
    }
    
    // INI结构的json object转为字符串
    this.INIToString = (obj) => {
        var str = '';
        for (var section in obj) {
            str += `[${section}]\n`;
            for (var key in obj[section]) {
                str += `${key}=${obj[section][key]}\n`;
            }
            str += '\r\n';
        }
        return str;
    }

    // 从buffer读取数据到relert.INI
    this.loadBuffer = (buffer) => {
        this.parent.INI = this.stringToINI(this.parent.decode(buffer));
    }

    // 从字符串读取数据到relert.INI
    this.loadString = (str) => {
        this.parent.INI = this.stringToINI(str);
    }

    // relert.INI转buffer数据
    this.toBuffer = () => {
        return this.parent.encode(this.INIToString(this.parent.INI));
    }

    // relert.INI转字符串
    this.toString = () => {
        return this.INIToString(this.parent.INI);
    }

    // 存储到文件
    this.save = (fileName = this.savedFileName, content = this.toBuffer()) => {
        this.savedFileName = fileName;
        if (this.isNode) {
            // Node环境下，使用fs接口
            require('fs').writeFileSync(fileName, content);
            this.parent.tickEnd();
            this.parent.tickStart();
        } else {
            // 浏览器环境下，创建一个下载文件任务
            var downloadDOM = document.createElement('a');
            downloadDOM.download = fileName;
            downloadDOM.style.display = 'none';
            var contentBlob = new Blob([content]);
            downloadDOM.href = URL.createObjectURL(contentBlob);
            document.body.appendChild(downloadDOM);
            downloadDOM.click();
            document.body.removeChild(downloadDOM);
        }
    }

    // 文件名修改接口
    this.fileName = (newFileName) => {
        if (newFileName) {
            this.savedFileName = newFileName;
        }
        return this.savedFileName;
    }

    // 以下是专门为node留的接口
    if (this.isNode) {

        // 直接读取文件
        this.loadFile = (fileName) => {
            this.savedFileName = fileName;
            this.loadBuffer(require('fs').readFileSync(this.savedFileName));
            this.parent.tickStart();
        }

        // 挂载以后
        this.mounted = () => {
            this.parent.tickStart();
            // 读取命令行参数
            this.args = require('process').argv;
            if (this.args[2]) {
                this.savedFileName = this.args[2];
                this.loadFile(this.savedFileName);
            }
        }
    }

    this.exports = {
        stringToINI: this.stringToINI,
        INIToString: this.INIToString,
        loadBuffer: this.loadBuffer,
        loadString: this.loadString,
        loadFile: this.loadFile,
        toBuffer: this.toBuffer,
        toString: this.toString,
        save: this.save,
        fileName: this.fileName,
        args: this.args,
    }
}

if ((typeof window == 'object') && (this === window)) {
    new __FileSys().mount(relert);
} else {
    module.exports = (parent) => {
        new __FileSys().mount(parent);
    }
}
