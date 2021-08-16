/**********************************
 * relert.editor.js
 * relert.js 标签页模块
 * 此模块为浏览器端独有，并直接以<script>标签导入
 * node.js中此模块不能运作
 **********************************/

const editor = new function() {
    // 标签页
    this.tabs = {};
    // 当前页
    this.currentIndex = 0;

    // 自增Id
    let tabId = 0;
    this.newId = () => {
        tabId ++;
        return tabId;
    }

    // 标签页构造函数
    this.tab = function(obj) {
        this.data = obj.data;
        this.fileName = obj.fileName;
        this.encoding = obj.encoding;
    }

    // 重绘
    this.shift = () => {
        
    }

    // 新增标签
    this.addTab = (obj) => {
        let id = this.newId();
        this.tabs[id] = new this.tab(obj);
        this.currentIndex = id;
        // 重绘
        this.shift();
        return id;
    }

    // 新建
    this.newTab = () => {
        this.addTab({
            fileName: 'newScript.js',
            data: '',
            encoding: 'UTF-8',
        })
    }

    // 关闭
    this.closeTab = (id) => {
        delete this.tabs[id];
        if (id == this.currentIndex) {
            this.currentTab(Object.keys(this.tabs).pop());
        }
        // 重绘
        this.shift();
    }

    // 设置或者获取当前标签
    this.currentTab = (index) => {
        if (index && this.tabs[index]) {
            this.currentIndex = index;
            // 加载当前标签

            // 重绘
            this.shift();
        }
        return this.snapshots[this.currentIndex];
    }
}