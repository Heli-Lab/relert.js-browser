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
    // 拖拽事件
    this.draggingIndex = 0;

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
        this.row = obj.row;
        this.column = obj.column;
    }

    // 重绘
    this.shift = () => {
        let list = '';
        for (let i in this.tabs) {
            list += `
            <div class="tab${i == this.currentIndex ? ' active' : ''}" index="${i}" draggable="true">
                ${this.tabs[i].fileName}
                <div class="close">×</div>
            </div>
            `;
        }
        list += '<div class="tab new">+</div>';
        list += '<div class="placeholder"></div>';

        $('#tabs').html(list);

        $('#tabs>.tab').on('click', function() {
            if (!$(this).hasClass('new')) {
                $(this).addClass('active').siblings().removeClass('active');
                editor.currentTab($(this).attr('index'));
            }
        });

        $('#tabs>.tab .close').on('click', function(e) {
            if ((editor.tabs[$(this).parent().attr('index')].data.length == 0)
                || confirm('确认关闭此标签页？请确保你需要的文件已经保存。')) {
                editor.closeTab($(this).parent().attr('index'));
            }
            e.stopPropagation();
        });

        $('#tabs>.new').on('click', function() {
            editor.newTab();
        });

        $('#tabs').trigger('wheel');

        //标签拖拽事件

        $('#tabs>.tab').on('dragover', function(ev) {
            if (!$(this).hasClass('new')) {
                ev.preventDefault();
            }
        });

        $('#tabs>.tab').on('dragstart', function(ev) {
            if (!$(this).hasClass('new')) {
                editor.draggingIndex = $(this).attr('index');
            }
        });

        $('#tabs>.tab').on('drop', function(ev) {
            if (!$(this).hasClass('new')) {
                editor.dragTab(editor.draggingIndex, $(this).attr('index'));
            }
        });
    }

    // 新增标签
    this.addTab = (obj, coverEmpty) => {
        let id = this.newId();
        if (coverEmpty) {
            if (this.getText() == '') {
                id = this.currentIndex;
            }
        }
        this.tabs[id] = new this.tab(obj);
        this.currentTab(id);
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
            row: 0,
            column: 0,
        });
    }

    // 关闭
    this.closeTab = (id) => {
        delete this.tabs[id];
        if (Object.keys(this.tabs).length == 0) {
            this.newTab();
        }
        if (id == this.currentIndex) {
            this.currentTab(Object.keys(this.tabs).pop());
        }
        // 重绘
        this.shift();
    }

    // 设置或者获取当前标签
    this.currentTab = (index) => {
        if (index && this.tabs[index]) {
            // 保存之前标签
            if (this.__editor.getValue() && this.tabs[this.currentIndex]) {
                this.tabs[this.currentIndex].data = this.__editor.getValue();
                this.tabs[this.currentIndex].row = this.__editor.selection.getCursor().row;
                this.tabs[this.currentIndex].column = this.__editor.selection.getCursor().column;
            }
            // 更改序号
            this.currentIndex = index;
            // 加载当前标签
            this.__editor.setValue(this.tabs[this.currentIndex].data);
            this.__editor.gotoLine(this.tabs[this.currentIndex].row);
            this.__editor.moveCursorTo(this.tabs[this.currentIndex].row, this.tabs[this.currentIndex].column);
            // 重绘
            this.shift();
            // 焦点转移
            this.__editor.focus();
        }
        return this.tabs[this.currentIndex];
    }

    // 拖拽标签
    this.dragTab = (a, b) => {
        if (a == b) {
            return;
        }
        this.currentTab(a);
        this.__editor.setValue('');
        let indexList = Object.keys(this.tabs);
        let posA = indexList.indexOf(a);
        let posB = indexList.indexOf(b);
        let backup = this.tabs[a];
        if (a < b) {
            for (let i = posA; i < posB; i++) {
                this.tabs[indexList[i]] = this.tabs[indexList[i + 1]];
            }
        } else {
            for (let i = posA; i > posB; i--) {
                this.tabs[indexList[i]] = this.tabs[indexList[i - 1]];
            }
        }
        this.tabs[b] = backup;
        this.currentTab(b);
    }

    // 获取文本
    this.getText = () => {
        return this.__editor.getValue();
    }

    // 获取文件名
    this.getFileName = () => {
        return this.tabs[this.currentIndex].fileName;
    }

    // 设置文件名
    this.setFileName = (str, i = this.currentIndex) => {
        this.tabs[i].fileName = str;
        this.shift();
    }

    // 保存标签页
    this.saveTab = (i = this.currentIndex) => {

    }

    // 产生新标签的2种来源：打开文件，新建标签

    // 1.打开文件
    this.openFile = (blob) => {
        let fr = new FileReader();
        fr.onloadend = (e) => {
            // 打开文件
            let backupEncoding = relert.encoding();
            
            // 产生标签
            this.currentIndex = this.addTab({
                data: relert.decode(e.target.result),
                fileName: blob.name,
                encoding: relert.encoding(),
            }, true);

            relert.encoding(backupEncoding);

            relert.log('Done.');
        }
        relert.log(`Opening Script "${blob.name}"...`);
        fr.readAsBinaryString(blob);
    }

    // 2.新标签页 见this.newTab()

    // 初始化Ace Editor
    this.__editor = ace.edit('editor');
    this.__editor.setFontSize(14);
    this.__editor.session.setMode('ace/mode/javascript');
    this.__editor.session.setTabSize(4);
    this.__editor.session.setUseSoftTabs(true);

    // 标签栏鼠标滚轮横向滚动
    $('#tabs').on('wheel', (ev) => {
        ev.currentTarget.scrollLeft += ev.deltaY;
        if (ev.currentTarget.scrollWidth > ev.currentTarget.clientWidth) {
            $('#tabs>.new').addClass('magnetRight');
        } else {
            $('#tabs>.new').removeClass('magnetRight');
        }
    });

    // 建立空标签
    this.newTab();
}