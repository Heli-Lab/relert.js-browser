# relert.js-browser 0.1 说明文档（2021.8.22未完成）

警告：本版本为尚未完成的开发版，许多功能不完善且未经验证。请在使用前对你的地图做好备份。

## 简介

### relert.js是什么？

`relert.js`是由**Heli**开发的系列`JavaScript`库，它允许地图制作者使用原生`JavaScript`直接对游戏《红色警戒2》的地图文件（`.map`等）进行操作，从而更方便的编写脚本处理地图。

**FinalAlert**的“工具脚本”功能使用了自带的类似汇编语言的低级脚本语言，它过于底层的语法不能清晰地表述逻辑，代码编写困难且不可读，其运行效率也是相当低。

而有了`relert.js`，你就可以解放`JavaScript`作为一门高级语言完全的编程能力，用更少的代码，以更高的运行效率，来实现更复杂的逻辑。

### relert.js-browser是什么？

最初版本的`relert.js`运行在`node.js`环境下，虽然我自己使用它感到十分满意，但大部分地图制作者并没有`node.js`的运行环境。

为了实现对大多数人的“开箱即用”，我决定将`relert.js`的运行环境移入**浏览器**——浏览器嘛，没有人的电脑里面没有这个。

这就促成了`relert.js-browser`这一分支项目。

当然，除了运行环境的移植以外，我还希望通过一些新技术的使用，进一步简化逻辑，让使用者在调用接口的时候可以得到更加符合直觉的结果。为此我也将代码进行了大规模的重构，希望这些重构是值得的。

### 运行需求

`relert.js-browser`主要通过网页加载的方式运行。

需要浏览器支持**ECMAScript6**标准和一些比较新的特性，具体版本为：
- **Chrome** 71 版本及以上
- **Edge** 79 版本及以上
- **Firefox** 65 版本及以上
- **Safari** 12.1 版本及以上
- **Opera** 58 版本及以上
- 各种双核浏览器请使用“极速模式”
- 不支持**IE**所有版本，及各种**IE**内核的套壳浏览器

一句话概述：除**IE**以外主流浏览器的最新版本均可使用。

当然除了`relert.js-browser`框架本身的运行需求以外，用户编写出来的的脚本也有自己的运行需求——如果你使用了更加激进的新特性来编写脚本，那么使用的范围就会更窄。

不过，鉴于`relert.js-browser`是一件有效的生产力工具，没有必要牺牲开发的便捷度而去追求对远古浏览器的兼容性，还是请诸位mapper把自己的浏览器升级到最新版为宜。

除了浏览器之外，你还可以通过`node.js`加载`relert.js`，以纯命令行的方式执行。



### 快速上手

如同一个网站一样，你可以使用`index.html`作为`relert.js-browser`的入口，它会为你提供一个浏览器窗口，其中包含一个简单易用的文本编辑器界面。

但你也可以在自己编写网页的环境中运行，或者在`node.js`环境中使用。在文档的后续章节会提供相关的参考。

“快速上手”部分的教程都以默认的`index.html`作为规范。

#### 用户界面结构

`relert.js-browser`的用户界面总体分为左右两栏，而右侧有上下两个区域，它们的功能如此划分：

* 左栏：**地图快照**列表。`relert.js-browser`用“快照”这一概念来管理地图在各个时刻的状态。你可以上传一张地图，分别执行多个脚本，生成多个“快照”，并随意在这些“快照”之间切换。
* 右栏上半部分：**脚本编辑**区。这里有一个简易的多标签文本编辑器界面，可以在这里查看并编写需要在地图上执行的`JavaScript`脚本。
* 右栏下半部分：**调试信息**区。脚本执行时输出的调试信息、警告信息、报错信息都会显示在这个区域。

#### HelloWorld

下面，我们试着编写并运行一些脚本。

在右栏上半部分的**脚本编辑区**键入以下代码：

```javascript
relert.log('helloworld');
```

然后点击脚本编辑区上方的“**运行**”按钮。

你可以看到，在右栏下半部分的调试信息区出现了类似这样的内容：

```
[2021.08.16 20:30:17] - helloworld
```

前面方括号内的内容是程序执行时的时间，而在后面，我们可以看到，字符串“helloworld”被成功输出了。It works!

本文档不会讲述`JavaScript`语言的语法，只会描述`relert.js`提供的接口——毕竟`relert.js`只是一个`JavaScript`的库而已，它并不是一个脚本引擎。也就是说，只要是你的浏览器支持的`JavaScript`语法，都可以在`relert.js-browser`之中运行！

`JavaScript`语言本身的教程很容易搜索到。或者照着本文档末尾的“常用逻辑示例”照葫芦画瓢，也可以很快写出能用的代码。

#### 打开地图，并在地图上执行代码

`relert.log(info: string)`这个`JavaScript`函数用于在调试信息区输出内容，这个函数不需要在某一张地图上就可以执行。

如果想要使用脚本具体操作地图上的物件，我们需要先加载一张地图。

加载地图的按钮在整个网页的左上角，左栏**地图快照**列表的最上端。按下它，会弹出一个选择文件的对话框。

选择你自己的地图文件以后，你会发现地图快照列表里面多了一项，它展示了你刚才打开地图的名称、打开时间，下面还用斜体字展示了“*打开文件*”四个字——这就是一个“**快照**”。（注：为了接下来的示例脚本顺利运行，选中的地图上应该有平民建筑物）

快照代表了一张地图在某时某刻的状态，以下三种操作会生成新的快照：

* **打开地图文件**。

* 在一个快照上**执行脚本**。“执行脚本”的过程其实就是：*脚本在当前快照的状态上进行操作，操作的结果会存入下一个状态，也就是新的快照*。

* 刚刚打开`relert.js-browser`时，**从缓存中恢复**上一次关闭之前的最后一个快照。

接下来我们尝试通过执行脚本的方式生成快照。在右栏上半部分的**脚本编辑区**键入以下代码：

```javascript
relert.Structure.forEach((structure) => {
    if (structure.House == 'Neutral House') {
        structure.Strength = relert.randomStrength(0.15, 0.24);
        relert.log(`${structure.Type}, ${structure.Strength}`);
    }
});
```

然后点击脚本编辑区上方的“**运行**”按钮。

这次在右栏下半部分的调试信息区出现了更多的内容，而且我们看到，左侧边栏的地图快照列表中新增了一个快照——它就是这段脚本执行以后地图的状态。而在这个快照的上方，地图刚打开时的原始状态仍然保留在快照列表中。

你可以通过快照列表里面的“**载入**”按钮随时切换哪一个快照为**当前快照**（在列表中使用彩色显示）。*脚本的执行都是在当前快照上执行*。

“**保存**”按钮允许你把任何一个快照以文件的形式下载。

“**删除**”按钮允许你删除某个快照。注意，删除快照的操作是不可恢复的。

#### 遍历对象，操作其属性

我们回到上面的那段测试代码。它具体做了什么呢？

作为`relert.js`这个库的入口，我们提供了`relert`这一全局对象作为所有函数的挂载点。也就是说，我们调用`relert.js`的所有接口时，都以`relert.XXXX`的格式调用。

`relert.Structure`提供了“建筑（Structure）”这一**数据代理**。数据代理这一概念在后面文档中会详细的讲，但在这里，你可以暂时理解为：我们通过`relert.Structure`这一接口，来更加方便直观的操作建筑对象。

有了`relert.Structure`以后，我们可以通过`relert.Structure.forEach`函数这一**遍历器**来遍历所有的建筑。

```javascript
relert.Structure.forEach((structure) => {
    // 相当于从relert.Structure中，取出每一个structure，进行这里面的操作
    // 中间写的代码都是针对structure的操作
    // structure只是一个变量名，你可以任意的自定义，比如用i都行
});
```

中间部分的代码就是对单个`Structure`的**子数据代理**进行的操作了。之所以叫“子数据代理”，是因为数据代理`Structure`下面还有另外一层数据代理，可以让你十分舒服的对单个的某一座建筑进行操作，比如，形如`JavaScript`的赋值语句`XXXX = XXXX`的形式：

```javascript
    // 如果这个structure的House属性（所属方属性）等于'Neutral House'，即单人任务中的平民作战方
	if (structure.House == 'Neutral House') {
        // 那么，设置这个structure的生命值，即Strength属性，为15%~24%之间的随机值
        // relert.randomStrength这一函数也由relert.js库提供
        structure.Strength = relert.randomStrength(0.15, 0.24);
        // 输出这个建筑的类型，以及它的当前生命值
        relert.log(`${structure.Type}, ${structure.Strength}`);
    }
```

完整的拼起来就是：

```javascript
// 相当于从relert.Structure中，取出每一个i，进行这里面的操作
relert.Structure.forEach((i) => {
    // 如果这个建筑i的House（所属方）属性等于'Neutral House'
    if (i.House == 'Neutral House') {
        // 那么，设置这个建筑i的Strength（生命值）属性为15%~24%之间的随机值
        i.Strength = relert.randomStrength(0.15, 0.24);
        // 输出这个建筑i的类型，以及它的当前生命值
        relert.log(`${i.Type}, ${i.Strength}`);
    }
});
```

以上脚本中，每一条代码都带有强烈的语义性，这是接口的优化带来的正面效果。希望这样的代码能读起来能像流程图一样清晰明确，并帮助你构建更加复杂的逻辑。

“快速上手”部分到此为止。想要完成更多的功能，其实你需要的只是在这篇文档中，找到相应的接口，然后用`JavaScript`的方式合理的调用它们。

祝Scripting愉快！



## 数据接口

由于`relert.js`和`relert.js-browser`暴露的接口几乎完全一致，下文如不特殊说明，均使用`relert.js`统一指代。

### 直接操作INI

`relert.js`会将整张地图的`INI`结构，转化为`JavaScript Object`类型的数据对象，并通过`relert.INI`这一属性对外暴露。

#### 结构

`INI`文件格式是`[Section] key = value`的两层结构，转成`JavaScript Object`以后也是一个两层的结构，如同这样：

```javascript
{
    Section: {
        key: 'value',
    },
}
```

我们来举一个稍微复杂点的例子。

比如说一段`INI`的结构是这样的：

```ini
[SectionA]
keyA1 = valueA1
keyA2 = valueA2

[SectionB]
keyB1 = valueB1
keyB2 = valueB2
```

把它转化成`JavaScript Object`就是：

```javascript
{
    SectionA : {
        keyA1 : 'valueA1',
        keyA2 : 'valueA2',
    },
    SectionB : {
        keyB1 : 'valueB1',
        keyB2 : 'valueB2',
    },
}
```

在这个例子中，我们在`relert.js`中想访问`SectionA`中的`keyA1`属性，可以这样写：

```javascript
relert.INI['SectionA']['keyA1']
```

对这个属性进行直接的取值或者赋值都是可以的。

这就是对`INI`的直接操作。

（**注意**：`relert.INI['SectionA']`**不一定存在**，有时候你的代码需要考虑它不存在、 即读取出来的值是`undefined`的情况，以避免程序出错）

#### 多属性操作

如果想要同时对多个属性进行操作，考虑使用`JavaScript`自带的原型方法`Object.assign(target: Object, obj : Object)`来进行。

下面展示一个实用性的例子：

```javascript
// 本段程序作用：把列表中的平民单位的属性，都改为“可被自动攻击、生命值50点”

// 需要修改属性的平民单位列表
let civList = ['CIV1', 'CIV2', 'CIV3', 'CIVA', 'CIVB', 'CIVC'];

for (let i in civList) {
    // 判断对应的平民单位字段是否存在
    if (!relert.INI[civList[i]]) {
        // 如果不存在就新建一个空的
        relert.INI[civList[i]] = {};
    }
    // 使用Object.assign()将后面的对象合并入前面的relert.INI[civList[i]]
    Object.assign(relert.INI[civList[i]], {
        // 这样利用合并机制，可以同时修改多个属性
        Insignificant: 'yes',
        Strength: '50',
    });
}
```

#### 总结

`relert.INI`提供了最基本的底层接口。其实它已经允许我们**直接修改地图相关的任何底层数据**（毕竟红色警戒2的地图本质上就是一个`INI`文件），但是这种修改方式只对修改内置`rules`显得比较友好，进行其它地图相关的操作就显得非常繁琐了——当然，`relert.js`一定会有让你满意的办法！这就要等后面章节慢慢介绍了。



### 数据代理

除了直接操作INI以外，你还可以通过<code>relert.js</code>抽象出的**数据代理**接口，以一种人类可读的方式，对一些在游戏中有明确意义的属性进行操作。

为什么称之为“数据代理”呢？因为它只是对`relert.INI`的操作进行转化的**中间层**，并没有在`relert.INI`以外的地方存储额外的数据——这意味着，你对数据代理进行任何操作后，其背后的实际数据，`relert.INI`中的对应字段，也会进行实时的更新。

数据代理的具体实现使用了`JavaScript`的`Proxy`对象：`Proxy`对象允许我们接管对一个对象所有的操作，包括对它属性的赋值等基础操作。比如，我们想要修改某座建筑物的生命值，通过数据代理，只需要做以下操作：

* 通过在建筑列表的数据代理`relert.Structure`之中，（通过**索引**或者**遍历器**），找到这个具体建筑的数据代理`a`。
* 直接把`a.Strength`赋值为你需要的值。

这样就完成了“修改生命值”的过程。其余的操作，包括解析建筑数据的编码解码、导入INI等操作，`relert.js`提供的数据代理都会在内部帮你完成。

接下来，本文档将按照大类，具体罗列`relert.js`中提供的所有数据代理。



#### 物体 Object

物体`Object`描述这样一类对象：它们被放在地图上的某个位置。即，每一个物体`Item`，都有明确的位置坐标`(X, Y)`，对应属性`Item.X`和`Item.Y`。

由于它们都具有`X`和`Y`属性，因此它们都可以被当成“坐标”，传入需要输入坐标的函数接口。

属于物体`Object`的对象有以下几类：

| INI中的注册位置  | relert.js中的访问接口 | 描述     |
| ---------------- | --------------------- | -------- |
| `Structure`      | `relert.Structure`    | 建筑物   |
| `Infantry`       | `relert.Infantry`     | 步兵     |
| `Units`          | `relert.Unit`         | 车辆单位 |
| `Aircraft`       | `relert.Aircraft`     | 飞行器   |
| `Terrain`        | `relert.Terrain`      | 地形对象 |
| `Smudge`         | `relert.Smudge`       | 污染     |
| `Waypoint`       | `relert.Waypoint`     | 路径点   |
| 各作战方注册表下 | `relert.BaseNode`     | 基地节点 |
| `CellTags`       | `relert.CellTag`      | 单元标记 |

**注意**：覆盖物`Overlay`在地图中的存储方式有点特殊——它是以*Base64编码的二维数据*进行存储的。因此在`relert.js`中，并没有把它归类于物体`Object`，而是归类于后面介绍的`MapData`类型。



##### 公共操作

下面章节将会介绍一些适用于所有`Object`“物体”数据代理的公共操作。

虽然它们在地图中的存储形式不尽相同，但是`relert.js`尽量把它们包装成了相同的接口。

###### 按注册号访问

###### 遍历

对于一个`Object`类型数据代理，`relert.js`提供了两种接口来方便的遍历它：`forEach`函数和`for ... of`循环。

###### 新增

当我们需要新增一个物体的时候，只需要调用它相应代理下的`add`接口：

###### 属性设置

通过注册号或者遍历器获得子代理以后，相当于直接对某一个物体的属性进行操作了。



###### 删除

###### 查找类型



##### 建筑 Structure



| 属性            | 描述               | 默认值            |
| --------------- | ------------------ | ----------------- |
| `House`         | 所属方             | `'Neutral House'` |
| `Type`          | 注册名             | `'GAPOWR'`        |
| `Sterngth`      | 生命值             | `'255'`           |
| `X`             | `x`坐标            | `'0'`             |
| `Y`             | `y`坐标            | `'0'`             |
| `Facing`        | 面向               | `'0'`             |
| `Tag`           | 关联标签           | `'none'`          |
| `Sellable`      | 可变卖（无用属性） | `'0'`             |
| `Rebuild`       | 重建（无用属性）   | `'0'`             |
| `Enabled`       | 启用               | `'1'`             |
| `UpgradesCount` | 加载物数量         | `'0'`             |
| `SpotLight`     | 聚光灯             | `'0'`             |
| `Upgrade1`      | 加载物1            | `'none'`          |
| `Upgrade2`      | 加载物2            | `'none'`          |
| `Upgrade3`      | 加载物3            | `'none'`          |
| `AIRepair`      | AI修复             | `'1'`             |
| `ShowName`      | 显示名称           | `'0'`             |



##### 步兵 Infantry



##### 车辆 Unit



##### 飞行器 Aircraft



##### 地形对象 Terrain



| 属性   | 描述    | 默认值     |
| ------ | ------- | ---------- |
| `Type` | 注册名  | `'TREE01'` |
| `X`    | `x`坐标 | `'0'`      |
| `Y`    | `y`坐标 | `'0'`      |

注意：同一个位置上只有一个地形对象。这意味着你在修改地形对象的`X`或者`Y`属性的时候，可能会覆盖掉原有位置上的地形对象。

##### 污染 Smudge



| 属性     | 描述                              | 默认值       |
| -------- | --------------------------------- | ------------ |
| `Type`   | 注册名                            | `'CRATER01'` |
| `X`      | `x`坐标                           | `'0'`        |
| `Y`      | `y`坐标                           | `'0'`        |
| `Ignore` | 是否被忽略（填非0的值都会被忽略） | `'0'`        |



##### 路径点 Waypoint

（施工中）

##### 基地节点 BaseNode

（施工中）

#### 地表数据 MapData

地表`MapData`描述这样一类对象：它由覆盖整张地图的Base64编码数据组成。在使用之前，需要先对整个区段进行解码，才能得到可直接操作的数据。

##### 公共操作

（施工中）

##### 地形 MapPack

（施工中）

##### 覆盖物 OverlayPack

（施工中）

#### 逻辑 Logic

逻辑`Logic`描述这样一类对象：

##### 特遣部队 TaskForce

（施工中）

##### 动作脚本 Script

（施工中）

##### 作战小队 TeamType

（施工中）

##### 触发 Trigger

（施工中）

##### AI触发 AITrigger

（施工中）

##### 局部变量 LocalVariable

（施工中）

#### 注册表 Register

注册表`Register`描述这样一类对象：

（施工中）

#### 选择器 Picker

选择器对象`Picker`提供了对代理的另一个访问接口。

##### 位置坐标选择器

（施工中）

## 静态模块

“静态模块”指没有自己独立入口的模块，它们在被导入以后，会在全局对象`relert`上直接附加一些属性或者方法。

静态模块都由`relert.Static`类继承而来。



### 环境变量 Environment

环境变量模块`relert.Static.Environment`导出了几个非常基本的纯静态属性：

* `relert.isNode: Boolean`：当前脚本是否在`node.js`下运行。

* `relert.isBrowser: Boolean`：当前脚本是否在浏览器下运行。
* `relert.version: Float`：当前`relert.js`的版本号。

需要时直接使用即可，没什么好说的。



### 打点计时器 Tick

`JavaScript`是一种单线程的语言，用户调用`relert.js`执行`JavaScript`代码的时候，只能把用户编写的脚本注入到主线程中执行。在执行的过程中，主线程（含用户界面）会被阻塞，浏览器窗口会进入一种“假死”状态，直到脚本执行结束。

但这就引发了一个重大的安全隐患：万一用户编写的脚本中含有**死循环**、**无限递归**等导致脚本不能执行结束的问题，整个浏览器窗口就无法再使用了。用户可能会收到浏览器的报错：“喔唷，崩溃了！”（Chrome的提示如此）然后被迫关闭整个页面，从而丢失工作区中的所有未保存的内容，至少绝大部分内容都不可恢复。

而由于`JavaScript`的单线程特性，我们无法方便的在代码段的**外部**，对代码本身的执行状况进行监听——所有操作都在主线程之中排队进行，就连用于监听的函数自己也会被堵死在`JavaScript`事件队列中。

为了在这种情况下仍然能保护主线程，我开发了`relert.Static.Tick`模块来解决这一问题。由于它采用了“注入脚本内部，不断唤起自身”的方式对用户脚本的运行时间进行监测，因此我称其为“打点计时器”。

#### 基本使用方法

在`relert.js-browser`的环境下，一般来说，不用你做任何事情，`relert.Static.Tick`模块就已经在保护你的主线程了。

在一张地图上尝试以下脚本：

```javascript
// 死循环，不断的在地图上添加单位
while (true) {
  relert.Unit.add({
     Type: 'MTNK',
     X: 40,
     Y: 40,
  });
}
```

运行数秒之后，CPU狂转，你会观察到主界面恢复了响应，并输出了类似如下报错信息：

```
Time Limit Exceeded: [3000.100000023842ms > 3000ms]
  The script process has already been killed.
  Please check if there is an INFINITE LOOP in your script,
  or, manually increase the time limit with method <relert.tickTimeOut(number[in millseconds])>.
```
于是，我们的脚本在3000毫秒内没有执行完毕，就成功的抛出了一个异常并终止了进程。

#### 设置等待时间

`relert.Static.Tick`默认的超时时间为**3000毫秒**即**3秒**。

不像效率低下的`fscript`，对于`relert.js`来说，这些时间已经足以应付大多数的状况。但如果你要处理的数据量真的很多，你可能需要自行更改这个阈值，让`relert.Static.Tick`容忍更长的运行时间，~~说不定再运行几秒就能出结果了呢~~。

为此，`relert.Static.Tick`提供了一个挂载在全局对象`relert`的接口：

```javascript
relert.tickTimeOut(timeOut: Number): Number;
```

接收数值类型输入，并返回一个数值，其含义均代表当前`relert.Static.Tick`模块的全局等待时间，单位为毫秒。

设置等待时间：

```javascript
relert.tickTimeOut(5000); //将等待时间设为5000毫秒，即5秒
```

获取并打印当前的等待时间：

```javascript
relert.log(relert.tickTimeOut()); //输出当前的等待时间
```

#### 手动打点

你可能会注意到，`relert.Static.Tick`模块无法对一些没有调用`relert`相关接口的耗时工作进行监听，比如说你尝试在`relert.js`中写一个空的死循环：

```javascript
//一个死循环
while (true) { }
```

或者不那么明显的，在一个复杂的计算过程中：

```javascript
//一个有错误的验证角谷猜想的程序
let collatz = function(start) {
    let step = 0;
    let number = start;
	while (number != 7) { //这里不小心把终止条件1写成了7，导致部分条件下程序无法停止
        if ((number % 2) == 0) {
            number = parseInt(number / 2);
        } else {
            number = number * 3 + 1;
        }
        step ++;
    }
    return step;
}

// 调用函数以后，就会进入死循环
relert.log(`Steps: ${collatz(180352746940718527, 0)}`);
```

这段代码仍然会引起整个浏览器的崩溃，~~`relert.Static.Tick`模块你干什么吃的？~~

这要从`relert.Static.Tick`模块的原理讲起。

该模块中导出了一个全局函数`relert.tick()`。每当`relert.tick()`被调用，都相当于脚本向监视者`relert.Static.Tick`**主动**报告状态，此时该模块就可以**暂时接管主线程**，快速的做时间计算、异常处理等操作。而`relert.Static.Tick`模块在自身被加载时，就将自身的`relert.tick()`函数注入到INI访问的底层接口中——也就是说，你每次使用`relert.js`提供的其它模块的接口时，`relert.tick()`函数都会自动插入执行。（不必担心这个操作耗费大量时间，`relert.tick()`被设计为可以快速多次调用，消耗性能极低。）

所以，**当一个耗时操作之中完全没有使用`relert.js`提供的数据代理接口时，`relert.Static.Tick`模块就监视不到它了**。在我们编写操作地图对象的脚本时，这样的耗时操作真的少见……但偶尔真的需要监视这样一个纯计算函数的时候，就需要我们手动去调用了，比如这样：

```javascript
//一个死循环2.0
while (true) {
    relert.tick();
}
```

或者这样：

```javascript
//一个有错误的验证角谷猜想的程序 2.0
let collatz = function(start) {
    let step = 0;
    let number = start;
	while (number != 7) { //这里不小心把终止条件1写成了7，导致部分条件下程序无法停止
        if ((number % 2) == 0) {
            number = parseInt(number / 2);
        } else {
            number = number * 3 + 1;
        }
        step ++;
        relert.tick(); //把 relert.tick() 放到最底层的循环之内，进行打点操作
    }
    return step;
}

// 调用函数以后，relert.Tick模块会正确的监视脚本超时并抛出异常
relert.log(`Steps: ${collatz(180352746940718527, 0)}`);
```

相比之前完全自动的“打点计时器”，这样的操作被我称为“手动打点”。

#### 自定义监听

除了尽职尽责的保护你的主界面不被卡死以外，`relert.Static.Tick`模块还提供了简明易用的**自定义监听**功能：它可以监听任何一个函数执行了多久，也可以对任何一个函数开启超时保护，抛出异常，并允许脚本的其他部分捕获异常进行处理。

`relert.Static.Tick`模块提供了这样的一个静态函数入口：

```javascript
relert.tickProcess(process: Function, [processId: Any, timeOut: Number]);
```

* `process`：必需，被监听的函数；
* `processId`：监听任务的唯一ID，用于区分不同的监听起点与等待时间。具体是什么值无所谓，只要**唯一**且**对应**即可。缺省值为全局监听ID `Symbol`。
* `timeOut`：监听任务的等待时间，单位为毫秒。缺省值为全局等待时间（即`relert.tickTimeOut()`的返回值）。

而我们的“打点”操作`relert.tick()`函数除了可以无参数调用以表示全局打点以外，它也可以有自己的参数和返回值：

```javascript
relert.tick([processId: Any]): number;
```

* `processId`：监听任务的唯一ID，与`relert.tickProcess()`的参数对应。缺省值为全局监听ID。
* 返回值：当前监听任务已经执行的时间。如果在指定ID的监听任务之外被调用，则返回0。

**自定义监听必须使用自定义打点。**也就是说，`relert.tickProcess()`所监听的函数之中，必须有对应ID的`relert.tick( ID )`打点。

下面的范例中，使用字符串`'proc'`作为了监听任务的唯一ID，等待时间100毫秒，超时则抛出异常：

```javascript
relert.tickProcess(() => {
    while (true) {
        relert.tick('proc');
    }
}, 'proc', 100);
```

当然最适合做唯一ID的还是`Symbol`类型：

```javascript
let procId = Symbol();
relert.tickProcess(() => {
    while (true) {
        relert.tick(procId);
    }
}, procId, 100);
```

可以读取`relert.tick()`的返回值，获取“这个被监听的函数已经执行了多久”：

```javascript
let procId2 = Symbol();
relert.tickProcess(() => {
    while (true) {
        relert.log(relert.tick(procId2));
    }
}, procId2, 100);
```

除了`relert.tickProcess()`方法来监听一个函数以外，我们还提供了另一种方式：把两个函数`relert.tickStart()`和`relert.tickEnd()`分别放到需要监听代码段的开头和末尾：

```javascript
relert.tickStart([processId: Any, timeOut: Number]);
relert.tickEnd([processId: Any]);
```

比如这样：

```javascript
let procId3 = Symbol();
relert.tickStart(procId3, 100);
while (true) {
    relert.log(relert.tick(procId3));
}
relert.tickEnd(procId3);
```

#### 异常捕获

自定义监听功能抛出的异常是可以被`try..catch`语句捕获的，像下面这样：

```javascript
let procId4 = Symbol();
relert.tickStart(procId4, 100);
try {
    while (true) {
        relert.log(relert.tick(procId4));
    }
} catch(e) {
    //捕获异常并进行处理
    
} finally {
    //结束处理
	relert.tickEnd(procId4);
}
```

这就使得我们可以在程序的局部，给一些可能会无法终止的步骤（比如说尝试寻找某个数学问题的可行解）加一层保险：如果它运行超过一定时间，就判定它无法成功，从而避免程序整体崩溃，方便进行后续的处理。

#### 在node.js环境中使用

`node.js`环境下的`relert.Static.Tick`模块的行为和在浏览器中行为稍有不同。

在`node.js`下。`relert.Static.Tick`不会自动启动全局的监听，需要手动执行`relert.tickStart()`来开启监听。毕竟`node.js`下不存在崩掉整个工作区的问题，即便是出现了死循环也可以通过`Ctrl+C`组合键来打断。另外，默认关闭也方便了在`node.js`的交互式执行界面进行操作——如果监听开着，那么你每敲入一行代码，都会产生超时异常！



### 调试输出 Log

调试输出是一个最基本的功能。`relert.Static.Log`模块在`node.js`环境和浏览器环境下均可使用，但它在`node.js`环境下和自带的`console`对象差别不大。

#### 导出接口

`relert.Static.Log`模块提供的接口有如下几个：

```javascript
relert.log(info: Any);
```

输出调试信息。没什么好说的，就是在调试区显示一段文字。如果要输出多个变量的值，建议使用模板字符串，即类似\`${var}\`的格式。

```javascript
relert.warn(warning: Any);
```

输出警告调试信息，以黄色为主色调显示。

```javascript
relert.error(error: Any);
```

输出错误信息，以红色为主色调显示。注意这里并没有真的引发异常使程序终止。

```javascript
relert.cls();
```

清空输出区域。在浏览器环境下就是编辑器下方的调试区，在`node.js`环境下就是整个`console`窗口。

#### 为什么使用relert.log而不是console.log

`relert.Static.Log`模块在浏览器中运行时，其内部做了缓存操作。这使得一瞬间连续输出几十万条信息，也不会让浏览器当场崩溃（虽然这仍然是很不好的习惯，过多的调试信息可能会让浏览器变卡）。

使用`relert.log`代替`console.log`的一个另好处是，脚本在浏览器端的行为和在`node.js`端的行为被统一了起来，使得我们更容易写出能在两个环境下通用的脚本。



### 编码解码 GB2312

中文文本编码问题一直是远古软件的一大积弊，`FinalAlert`也是一样。基于旧地图编辑器`FinalAlert`制作的地图，一律以`GB2312`格式进行中文文本编码；而`JavaScript`的字符串只支持`UTF-8`编码；一些新开发的地图编辑器如`RelertSharp`则采用纯`UTF-8`格式……如此种种不统一的问题造成了中文读写时常出现乱码，为此我开发了`relert.Static.GB2312`模块。

`relert.Static.GB2312`模块基于`iconv-lite`库的改写、打包与再封装，为`relert.js`在浏览器环境和`node.js`环境提供了基础的编码解码支持。正是在这个模块的加持下，`relert.js`在`UTF-8`和`GB2312`模式下均可工作，并且可以把文件在这两种格式之间任意转换。

#### 基本使用

`relert.Static.GB2312`模块已经与`relert.Static.FileSys`模块做了深度的整合，也就是说你不用做任何操作，只是正常的读写文件，`relert.Static.GB2312`库就会自动帮你完成编码与解码。

#### 编码转换

#### 导出接口



### 文件接口 FileSys

#### 基本使用

#### 文件改名

#### 导出接口



### 注册号 RegKey

该模块提供了几种不同格式的注册号生成函数，可以自动生成地图中没有使用过的注册号。



### 地图初始化 Init

该模块提供了一个函数`relert.init()`。一旦你在一个空的`relert`对象上执行这个函数，它就会被写入必要的数据，从而使其成为一张合法的空白地图。

当你在`node.js`环境中生成了一个新的`relert`对象而不打算打开文件的时候，或者是在浏览器环境中打开了一个空白文件（真·空白文件）的时候，可能会需要用它来初始化地图。

`relert.init()`只会尝试**添加**属性，它不会覆盖任何已经设置的属性。



### 工具箱 Toolbox

`relert.Static.Toolbox`“工具箱”是一个独立的纯静态模块。

该模块一旦加载，就会将一些可能被高频率使用的纯静态函数挂载在`relert`全局对象下。适当使用这些函数可以让代码更加方便可读。

下面分类对这些函数进行介绍：

#### 随机数相关

```javascript
relert.randomBetween(a: Integer, b: Integer): Integer;
```

接受2个整数`a`和`b`，返回介于`a`和`b`之间的随机整数。

```javascript
relert.randomFacing(): Integer;
```

返回随机朝向数值。朝向数值有`0, 32, 64, 96, 128, 160, 192, 224`八个，分别对应“右上, 右, 右下, 下, 左下, 左, 左上, 上”。

```javascript
relert.randomStrength(a: Float, b: Float): Integer;
```

接受两个0~1之间的实数`a`和`b`（代表生命值百分比的上下限，但是此函数不会检查输入），返回随机的生命值数字（`255`为满生命值的整数）。

```javascript
relert.randomPosInnerMap(): Object {X: Integer, Y: Integer}
```

返回地图内的随机坐标。（暂未实装）

返回值为一个`Object`对象，其属性`X`和`Y`对应了X坐标和Y坐标。

```javascript
relert.randomPosOnLine(obj1: Object, obj2: Object): Object {X: Integer, Y: Integer}
```

返回`obj1`和`obj2`两个对象之间连线上的随机一格坐标。（暂未实装）

`obj1`和`obj2`两个对象都必须具有`X`和`Y`属性，代表了它们的坐标。

可以将`relert.js`提供的，数据代理层的“物体”对象直接传入，因为它们都有`X`和`Y`属性。

也可以输入形如`{X: 12, Y: 34}`这样的对象，直接指定坐标。

返回值为一个`Object`对象，其属性`X`和`Y`对应了X坐标和Y坐标，均为整数。

```javascript
relert.randomPosInnerCircle(center: Object, r: Number): Object {X: Integer, Y: Integer}
```

返回以对象`center`为圆心、半径`r`的圆范围内随机一格的坐标。（暂未实装）

有关于对象`center`的属性需求，参考上一条`relert.randomPosOnLine`。

返回值为一个`Object`对象，其属性`X`和`Y`对应了X坐标和Y坐标，均为整数。

*返回结果保证一定落在地图内*。如果给的条件不足以产生落在地图内的随机坐标，会抛出异常。

```javascript
relert.randomSelect(list: Array): Any;
```

接受一个数组`list`，返回数组中的随机一项。

#### 几何相关

```javascript
relert.posInnerMap(obj: Object): Boolean;
```

接受一个对象`obj`（其必须带有`X`和`Y`属性，代表它的X坐标和Y坐标），返回它的坐标是否在地图内。（暂未实装）

可以将`relert.js`提供的，数据代理层的“物体”对象直接传入，因为它们都有`X`和`Y`属性。

也可以输入形如`{X: 12, Y: 34}`这样的对象，直接指定坐标。

```javascript
relert.posInnerCircle(obj: Object, center: Object, r: Number): Boolean;
```

接受一个对象（其必须带有`X`和`Y`属性，代表它的X坐标和Y坐标），返回它的坐标是否在圆心坐标`(x, y)`、半径`r`的圆内。（暂未实装）

有关于对象`obj`的属性需求，参考上一条`relert.posInnerMap`。

```javascript
relert.posInnerTriangle(obj1: Object, obj2: Object, obj3: Object): Boolean;
```

（暂未实装）

#### 坐标转换相关

在`relert.js`中的“坐标”类型的数据有`pos`和`coord`两种格式：

* `pos`格式：使用一个对象表示坐标，对象的`X`和`Y`属性代表`x`、`y`坐标值。任何一个“物体”的子代理都是合法的`pos`格式坐标，因为它们都有`X`和`Y`属性。
* `coord`格式：使用一个4~6位由数码组成的字符串表示坐标，后3位表示`x`坐标（缺位用0补齐），后3位之前表示`y`坐标。（地图内部结构中多使用这种坐标，而且这种坐标表示便于使用1维结构进行编码）

虽然`relert.js`提供的大部分接口都使用了`pos`格式的坐标，但总有不得不使用`coord`格式的坐标的时候。

`relert.static.Toolbox`提供了在两种坐标格式之间转换的函数：

```javascript
relert.posToCoord(pos: Object): String;
```

把`pos`格式转化为`coord`格式坐标。

```javascript
relert.coordToPos(coord: String): Object;
```

把`coord`格式转化为`pos`格式坐标。





## 浏览器环境模块

### 时光机 Timeline

（施工中）

### 编辑器 Editor

（施工中）

### 运行时沙盒 Sandbox

（施工中）



## 在node.js环境使用

`relert.js`最早是一个基于`node.js`的脚本库。在移植到浏览器端以后，在合适的兼容处理下，它仍然能够无缝的在`node.js`环境中使用。



### 程序入口

在浏览器环境中，浏览器已经自动在环境中生成了一个`relert`对象。但在`node.js`环境中我们无法预先指定运行环境上下文，故需要自己在脚本中引入`relert`对象。

首先通过`require`语句，从`relert.js`中获取用于创建`relert`对象工厂函数，然后再调用这个函数：

```javascript
const relertCreater = require('./script/relert.js'); //应为relert.js存储的位置
const relert = relertCreater();
```

这样我们就获取了一个和浏览器端几乎完全一致的`relert`对象，可以使用它上面的各种方法。

以上两条语句也可以合并为一条（注意`require`语句末尾多了一个空括号）：

```javascript
const relert = require('./script/relert.js')();
```

当然，你也可以给`relert`全局对象换个名字，接口也会发生相应的改变。下文如不特殊说明，仍默认全局对象的命名仍然是`relert`。



### 文件接口

在浏览器环境中，我们执行脚本的直接作用对象是**快照**；而在`node.js`环境下，没有这个东西。

但是鉴于`node.js`有对文件系统的完全访问权限，我们写在`node.js`中的脚本，可以**直接读写本地文件**——这不比快照更好用？

首先，这带来的好处就是，`relert.js`在`node.js`端所有和“文件名”有关的接口，其“文件名”都可以指定为“文件路径”，即直接指向本地的某个文件。

其次，在`node.js`端还多了一个可以直接使用的文件读取接口：

```javascript
relert.load(filename: String);
```

指定一个文件，将其读取并加载入`relert`实例。

有读就有写，我们原有的`relert.save`接口仍然能正常的发挥作用。不带任何参数就是存到原有打开的文件，但甚至能存到任意位置的本地文件：

```javascript
relert.save([filename: String, [content: Buffer]]);
```





### 通用脚本编写

本章讨论如何使用`relert.js`写出在浏览器和`node.js`中**都可以正常发挥作用**的地图脚本。

#### 判断入口

（施工中）

#### 文件读写

（施工中）

#### 环境差异

（施工中）

#### 使用relert.log

（施工中）



### 多个relert.js实例

（施工中）



## 定制开发

本章讨论`relert.js-browser`在浏览器端的定制开发问题——比如说，我想要丢弃原有的`index.html`，重新开发一个网页客户端，需要做什么呢？

（施工中）

## 关于

`relert.js-browser`版本`0.1`，2021年9月

开发及贡献者：

* heli-lab

## 附录：relert.js代码风格约定

（施工中）

## 附录：常用逻辑示例代码

### INI导入

```javascript
// relert.js范例A-1：平民单位INI导入
// * 用途：将所有平民步兵全都设置为不随机走动、受主动攻击、血量50点
// * 运行环境：浏览器

// 需要修改属性的平民单位列表
let civList = ['CIV1', 'CIV2', 'CIV3', 'CIVA', 'CIVB', 'CIVC'];

for (let i in civList) {
    // 判断对应的平民单位字段是否存在
    if (!relert.INI[civList[i]]) {
        // 如果不存在就新建一个空的
        relert.INI[civList[i]] = {};
    }
    Object.assign(relert.INI[civList[i]], {
        Insignificant: 'yes',
        Strength: '50',
    });
}
```



### 遍历物体，调整属性

```javascript
// relert.js范例B-1：平民建筑生命值调整
// * 用途：将地图上特定作战方（平民方）的特定建筑物，生命值在一个范围内随机调整
// * 运行环境：浏览器

let ignoreList = []; //定义一个ignoreList“忽略列表”，表示不想被此脚本处理的建筑物类型列表

relert.Structure.forEach((item) => { //对于从Structure中取出每一个item
	if ((item.House == 'Neutral Houe') && (ignoreList.indexOf(item.Type) == -1) { //如果其所属为Neutral House，且类型不在ignoreList内
        item.set({
           Strength: randomStrength(0.15, 0.25), //设置其生命值在15%~25%之间
           AIRepair: '0', //设置其AI修复属性为0
        });
    }
});
```

```javascript
// relert.js范例B-2：均匀分布树木类型
// * 用途：地图上已有的树木位置不变，但类型重新安排，使其尽可能保证平均分布，重复的树木不挨的太近
// * 运行环境：浏览器

//计算量可能很大，多给点时间吧
relert.tickTimeOut(10000);

//希望出现的树木类型
let treeType = ['TREE05', 'TREE06', 'TREE07', 'TREE08', 'TREE10', 'TREE11', 'TREE12', 'TREE14', 'TREE15'];

//判断Terrain是否是树木的函数
let isTree = (item) => {
    return (item.Type.substring(0, 4)) == 'TREE';
}

//树木分布权重图
//每放置一棵树，在其周围都会产生一圈递减的权重
let heatMap = {};
//在权重图上放置树木
let heatPlace = (item) => {
    let r = 15; //每棵树木的影响半径/格
    for (let i = -r; i <= r; i++) {
        for (let j = -r; j <= r; j++) {
            let distance = Math.hypot(i, j);
            let coord = relert.posToCoord({
                X: parseInt(item.X) + i,
                Y: parseInt(item.Y) + j,
            });
            if ((distance > r) || (distance < Number.EPSILON)) {
                continue;
            }
            if (!heatMap[coord]) {
                heatMap[coord] = {};
            }
            if (!heatMap[coord][item.Type]) {
                heatMap[coord][item.Type] = 0;
            }
            heatMap[coord][item.Type] += Math.exp(-distance);
        }
    }
}

//获取某个点位权重最低的树木
let getWeakHeat = (pos) => {
    let coord = relert.posToCoord(pos);
    if (!heatMap[coord]) {
        return relert.randomSelect(treeType);
    }
    let minHeat = 9999;
    let minHeatType = '';
    for (let i in treeType) {
        if (!heatMap[coord][treeType[i]]) {
            return treeType[i];
        } else {
            if (heatMap[coord][treeType[i]] < minHeat) {
                minHeatType = treeType[i];
                minHeat = heatMap[coord][treeType[i]];
            }
        }
    }
    return minHeatType;
}

//遍历树木并重新排布
relert.Terrain.forEach((item) => {
    if (isTree(item)) {
        item.Type = getWeakHeat(item);
        heatPlace(item);
    }
});
```



### 随机生成

```javascript
// relert.js范例：随机生成污染
// * 用途：在地图上随机生成污染
// * 运行环境：浏览器

let density = 0.01; //随机生成污染的密度（个/格）
let smudgeList = []; //污染种类

//此示例未完成
```



### 批量删除物体

### 触发组制作

（施工中）

### 修改地形

（施工中）

