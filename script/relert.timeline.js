/**********************************
 * relert.timeline.js
 * relert.js 时光机模块
 * 此模块为浏览器端独有，并直接以<script>标签导入
 * node.js中此模块不能运作
 **********************************/

// 日期格式化函数

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds(),
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

const timeline = new function() {

    this.maxLogHistory = 11;

    // 自增Id
    let snapshotId = 0;
    this.newId = () => {
        snapshotId ++;
        return snapshotId;
    }

    // 快照构造函数
    this.snapshot = function(obj) {
        this.data = obj.data;
        this.fileName = obj.fileName;
        this.encoding = obj.encoding;
        this.log = obj.log;
        this.time = new Date().format('yyyy.MM.dd hh:mm:ss');
    }

    // 当前快照编号
    this.currentIndex = -1;
    // 快照列表
    this.snapshots = {};

    // 侧边栏绘制
    this.$dom = $('ul#timeline');
    this.shift = () => {
        let list = '';
        for (let i in this.snapshots) {
            list += `
            <li${i == this.currentIndex ? ' class="current"' : ''}>
                <div class="file-name">${this.snapshots[i].fileName}</div>
                <div class="time">${this.snapshots[i].time}&nbsp;&nbsp;&nbsp;${this.snapshots[i].encoding}</div>
                <div class="log">${this.snapshots[i].log}</div>
                <div class="toolbar">
                    <button class="load" index="${i}"${i == this.currentIndex ? ' disabled' : ''}>载入</button>
                    <button class="download" index="${i}">保存</button>
                    <button class="delete red right" index="${i}">删除</button>
                </div>
            </li>
            `;
        }
        this.$dom.html(list);

        $('ul#timeline>li').on('click', function() {
            $(this).addClass('active').siblings().removeClass('active');
        });

        $('ul#timeline>li button.load').on('click', function() {
            timeline.currentSnapshot($(this).attr('index'));
        });

        $('ul#timeline>li button.delete').on('click', function() {
            if (confirm('确认要删除此快照吗？此操作是不可恢复的！')) {
                timeline.deleteSnapshot($(this).attr('index'));
            }
        });

        $('ul#timeline>li button.download').on('click', function() {
            timeline.downloadSnapshot($(this).attr('index'));
        });

    }

    // 增加快照
    this.addSnapshot = (obj) => {
        let id = this.newId();
        this.snapshots[id] = new this.snapshot(obj);
        this.currentIndex = id;
        // 重绘
        this.shift();
        return id;
    }

    // 删除快照
    this.deleteSnapshot = (id) => {
        delete this.snapshots[id];
        if (id == this.currentIndex) {
            this.currentSnapshot(Object.keys(this.snapshots).pop());
        }
        // 重绘
        this.shift();
    }

    // 快照保存进localStorage
    this.localSnapshot = () => {
        localStorage.setItem('snapshotData', this.snapshots[this.currentIndex].data);
        localStorage.setItem('snapshotFileName', this.snapshots[this.currentIndex].fileName);
        localStorage.setItem('snapshotEncoding', this.snapshots[this.currentIndex].encoding);
    }

    // 从localStorage中恢复快照
    this.recoverSnapshot = () => {
        if (localStorage.getItem('snapshotFileName')) {
            this.currentSnapshot(this.addSnapshot({
                data: localStorage.getItem('snapshotData'),
                fileName: localStorage.getItem('snapshotFileName'),
                encoding: localStorage.getItem('snapshotEncoding'),
                log: '(从缓存中恢复)',
            }));
            // 重绘
            this.shift();
        }
    }

    // 设置或者获取当前快照
    this.currentSnapshot = (index) => {
        if (index && this.snapshots[index]) {
            this.currentIndex = index;
            // 缓存
            this.localSnapshot();
            // relert读取当前快照
            relert.loadString(this.snapshots[index].data);
            relert.fileName(this.snapshots[index].fileName);
            relert.encoding(this.snapshots[index].encoding);
            // 重绘
            this.shift();
        }
        return this.snapshots[this.currentIndex];
    }

    this.downloadSnapshot = (index) => {
        relert.save(this.snapshots[index].fileName,
            relert.encode(this.snapshots[index].data, this.snapshots[index].encoding));
    }

    // 产生新快照的3种来源：打开文件，执行脚本，从缓存恢复

    // 1.打开文件
    this.openFile = (blob) => {
        let fr = new FileReader();
        fr.onloadend = (e) => {
            // 打开文件
            relert.loadBuffer(e.target.result);
            relert.fileName(blob.name);
            relert.log('Done.');
            
            // 产生快照
            this.currentIndex = this.addSnapshot({
                data: relert.toString(),
                fileName: relert.fileName(),
                encoding: relert.encoding(),
                log: '打开文件',
            });
            // 缓存快照
            this.localSnapshot();
        }
        relert.log(`Opening Map "${blob.name}"...`);
        fr.readAsBinaryString(blob);
    }

    // 2.执行脚本
    this.runScript = (script, scriptName) => {
        relert.execute(script);
        // 产生快照
        this.currentIndex = this.addSnapshot({
            data: relert.toString(),
            fileName: relert.fileName(),
            encoding: relert.encoding(),
            log: `${this.snapshots[this.currentIndex].log.split('\n').slice(-this.maxLogHistory).join('\n')}\n执行脚本：${scriptName}`,
        });
        // 缓存快照
        this.localSnapshot();
    }

    // 3.从缓存恢复
    this.recoverSnapshot();
}
