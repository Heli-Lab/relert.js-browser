# relert.js-browser 0.1 说明文档（2021.8.15未完成）

## 简介

### relert.js是什么？

`relert.js`是由**Heli**开发的系列`JavaScript`库，它允许地图制作者使用原生`JavaScript`直接对游戏**《红色警戒2》**的地图文件（`.map`等）进行操作，从而更方便的编写脚本处理地图。

**FinalAlert**的“工具脚本”功能使用了自带的类似汇编语言的低级脚本语言，它过于底层的语法不能清晰地表述逻辑，代码编写困难且不可读，其运行效率也是相当低。

而有了`relert.js`，你就可以解放`JavaScript`作为一门高级语言完全的编程能力，用更少的代码，以更高的运行效率，来实现更复杂的逻辑。

### relert.js-browser是什么？

最初版本的`relert.js`运行在`node.js`环境下，虽然我自己使用它感到十分满意，但大部分地图制作者并没有`node.js`的运行环境。

为了实现对大多数人的“开箱即用”，我决定将`relert.js`的运行环境移入**浏览器**——浏览器嘛，没有人的电脑里面没有这个。

这就促成了`relert.js-browser`这一分支项目。

当然，除了运行环境的移植以外，我还希望通过一些新技术的使用，进一步简化逻辑，让使用者在调用接口的时候可以得到更加符合直觉的结果。为此我也将代码进行了大规模的重构，希望这些重构是值得的。

### 运行需求

`relert.js-browser`通过网页加载的方式运行。

需要浏览器支持**ECMAScript6**标准和一些比较新的特性，具体版本为：
- **Chrome** 71 版本及以上
- **Edge** 79 版本及以上
- **Firefox** 65 版本及以上
- **Safari** 12.1 版本及以上
- **Opera** 58 版本及以上
- 各种双核浏览器请使用“极速模式”
- 不支持**IE**所有版本，及各种**IE**内核的套壳浏览器

一句话概述：==除**IE**以外主流浏览器的最新版本均可使用==。

当然除了`relert.js-browser`框架本身的运行需求以外，用户编写出来的的脚本也有自己的运行需求——如果你使用了更加激进的新特性来编写脚本，那么使用的范围就会更窄。

不过，鉴于`relert.js-browser`是一件有效的生产力工具，没有必要牺牲开发的便捷度而去追求对远古浏览器的兼容性，还是请诸位mapper把自己的浏览器升级到最新版为宜。



### 快速上手

如同一个网站一样，你可以使用`index.html`作为`relert.js-browser`的入口，它会为你提供一个浏览器窗口，其中包含一个简单易用的文本编辑器界面。

但你也可以在自己编写网页的环境中运行，或者在`node.js`环境中使用。在文档的后续章节会提供相关的参考。

#### 用户界面简介

#### HelloWorld

#### 打开地图，并在地图上执行代码

#### 遍历对象，操作其属性

## 数据接口

由于`relert.js`和`relert.js-browser`暴露的接口几乎完全一致，下文如不特殊说明，均使用`relert.js`统一指代。

### 直接操作INI

`relert.js`会将整张地图的INI结构，转化为`Object`类型的数据对象，并通过`relert.INI`这一属性对外暴露。



### 数据代理

除了直接操作INI以外，你还可以通过<code>relert.js</code>抽象出的数据代理接口，以一种人类可读的方式，对一些在游戏中有明确意义的属性进行操作。



#### 物体 Object

物体`Object`描述这样一类对象：它们被放在地图上的某个位置。即，每一个物体，都有明确的位置坐标`(X, Y)`。

##### 建筑 Structure

##### 步兵 Infantry

##### 车辆 Unit

##### 飞行器 Aircraft

##### 地形对象 Terrain

##### 路径点 Waypoint

##### 基地节点 BaseNode



#### 地表 Landscape

地表`Landscape`描述这样一类对象：它由覆盖整张地图的二维数据组成。

##### 地形 MapPack

##### 覆盖物 OverlayPack



#### 逻辑 Logic

逻辑`Logic`描述这样一类对象：

##### 特遣部队 TaskForce

##### 动作脚本 Script

##### 作战小队 TeamType

##### 触发 Trigger

##### AI触发 AITrigger

##### 局部变量 LocalVariable



#### 注册表 Register

注册表`Register`描述这样一类对象：



#### 选择器 Picker

选择器对象`Picker`提供了对代理的另一个访问接口。

##### 位置坐标选择器



## 静态模块 Static

“静态模块”指没有自己独立入口的模块，它们在被导入以后，会在全局对象`relert`上直接附加一些属性或者方法。



### 环境变量 Environment

---

环境变量模块`relert.Static.Environment`导出了几个非常基本的纯静态属性：

* `relert.isNode: boolean`：当前脚本是否在`node.js`下运行。

* `relert.isBrowser: boolean`：当前脚本是否在浏览器下运行。
* `relert.version: float`：当前`relert.js`的版本号。

需要时直接使用即可，没什么好说的。



### 打点计时器 Tick

---

`JavaScript`是一种单线程的语言，用户调用`relert.js`执行`JavaScript`代码的时候，只能把用户编写的脚本注入到主线程中执行。在执行的过程中，主线程（含用户界面）会被阻塞，浏览器窗口会进入一种“假死”状态，直到脚本执行结束。

但这就引发了一个重大的安全隐患：万一用户编写的脚本中含有**死循环**、**无限递归**等导致脚本不能执行结束的问题，整个浏览器窗口就无法再使用了。用户可能会收到浏览器的报错：“喔唷，崩溃了！”（Chrome的提示如此）然后被迫关闭整个页面，从而丢失工作区中的所有未保存的内容，至少绝大部分内容都不可恢复。

而由于`JavaScript`的单线程特性，我们无法方便的在代码段的**外部**，对代码本身的执行状况进行监听——所有操作都在主线程之中排队进行，就连用于监听的函数自己也会被堵死在`JavaScript`事件队列中。

为了在这种情况下仍然能保护主线程，我开发了`relert.Static.Tick`模块来解决这一问题。由于它采用了“注入脚本内部，不断唤起自身”的方式对用户脚本的运行时间进行监测，因此我称其为“打点计时器”。

#### 基本使用方法

在`relert.js`的环境下，一般来说，不用你做任何事情，`relert.Static.Tick`模块就已经在保护你的主线程了。

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
relert.tickTimeOut = function(timeOut: number): number;
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
relert.tickProcess(process: function, [processId: any, timeOut: number]);
```

* `process`：必需，被监听的函数；
* `processId`：监听任务的唯一ID，用于区分不同的监听起点与等待时间。具体是什么值无所谓，只要唯一即可。缺省值为全局监听ID `Symbol`。
* `timeOut`：监听任务的等待时间，单位为毫秒。缺省值为全局等待时间（即`relert.tickTimeOut()`的返回值）。

而我们的“打点”操作`relert.tick()`函数除了可以无参数调用以表示全局打点以外，它也可以有自己的参数和返回值：

```javascript
relert.tick([processId: any]): number;
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
relert.tickStart([processId: any, timeOut: number]);
relert.tickEnd([processId: any]);
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

`relert.js`在被`require`引入以后，如果加载了文件，就会自动启动全局的`relert.tickStart()`。如果文件是事后手动加载的，也会在文件加载的时候执行。

而在执行保存文件以后，会立刻执行全局的`relert.tickEnd()`，但立刻启动下一个全局`relert.tickStart()`。



### 调试输出 Log

调试输出是一个最基本的功能。`relert.Static.Log`模块在`node.js`环境和浏览器环境下均可使用，但它在`node.js`环境下和自带的`console`对象差别不大。

#### 导出接口

`relert.Static.Log`模块提供的接口有如下几个：

```javascript
relert.log(info: any);
```

输出调试信息。没什么好说的，就是在调试区显示一段文字。如果要输出多个变量的值，建议使用==模板字符串，即类似\`${var}\`的格式==。

```javascript
relert.warn(warning: any);
```

输出警告调试信息，以黄色为主色调显示。

```javascript
relert.error(error: any);
```

输出错误信息，以红色为主色调显示。注意这里并没有真的引发异常使程序终止。

```javascript
relert.cls();
```

清空输出区域。在浏览器环境下就是编辑器下方的调试区，在`node.js`环境下就是整个`console`窗口。

#### 为什么使用relert.log而不是console.log

`relert.Static.Log`模块在浏览器中运行时，其内部做了缓存操作。这使得一瞬间连续输出几十万条信息，也不会直接让浏览器崩溃（虽然这仍然是很不好的习惯）。

使用`relert.log`代替`console.log`的一个好处是，脚本在浏览器端的行为和在`node.js`端的行为被统一了起来，使得我们更容易写出能在两个环境下通用的脚本。



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



### 运行时沙盒 Execute

`relert.Static.Execute`“运行时沙盒”模块是==浏览器环境下独占==的静态模块，它为一段程序代码隔离出了独立的运行环境，避免其危险行为，并中途截获程序运行时的异常，显示到浏览器调试信息区。

用户在编写程序的时候，几乎没有必要主动使用`relert.Static.Execute`模块——事实上，你在`relert.js-browser`的浏览器界面上点击“运行”按钮的时候，就是把编辑器的文本传入该模块执行。

#### 导出接口

该模块只导出了一个函数：

```javascript
relert.execute(script: string);
```

* `script`：一段字符串形式的`JavaScript`代码。这段代码会在沙盒中执行。



### 工具箱 Toolbox

`relert.Static.Toolbox`“工具箱”是一个独立的纯静态模块。

该模块一旦加载，就会将一些可能被高频率使用的纯静态函数挂载在`relert`全局对象下。适当使用这些函数可以让代码更加方便可读。

下面分类对这些函数进行介绍：

#### 随机数相关

```javascript
relert.randomBetween(a: integer, b: integer): integer;
```

接受2个整数`a`和`b`，返回介于`a`和`b`之间的随机整数。

```javascript
relert.randomFacing(): integer;
```

返回随机朝向数值。朝向数值有`0, 32, 64, 96, 128, 160, 192, 224`八个，分别指==右上, 右, 右下, 下, 左下, 左, 左上, 上==。

```javascript
relert.randomStrength(a: float, b: float): integer;
```

接受两个0~1之间的实数`a`和`b`（代表生命值百分比的上下限，但是此函数不会检查输入），返回随机的生命值数字（`255`为满生命值的整数）。

```javascript
relert.randomPosInnerMap(): Object {X: integer, Y: integer}
```

返回地图内的随机坐标。

返回值为一个`Object`对象，其属性`X`和`Y`对应了X坐标和Y坐标。

```javascript
relert.randomPosOnLine(obj1: Object, obj2: Object): Object {X: integer, Y: integer}
```

返回`obj1`和`obj2`两个对象之间连线上的随机一格坐标。

`obj1`和`obj2`两个对象都必须具有`X`和`Y`属性，代表了它们的坐标。

可以将`relert.js`提供的，数据代理层的“物体”对象直接传入，因为它们都有`X`和`Y`属性。

也可以输入形如`{X: 12, Y: 34}`这样的对象，直接指定坐标。

返回值为一个`Object`对象，其属性`X`和`Y`对应了X坐标和Y坐标，均为整数。

```javascript
relert.randomPosInnerCircle(obj: Object, r: number): Object {X: integer, Y: integer}
```

返回以对象`obj`为圆心、半径`r`的圆范围内随机一格的坐标。

有关于对象`obj`的属性需求，参考上一条`relert.randomPosOnLine`。

返回值为一个`Object`对象，其属性`X`和`Y`对应了X坐标和Y坐标，均为整数。

*返回结果保证一定落在地图内*。如果给的条件不足以产生落在地图内的随机坐标，会抛出异常。

```javascript
relert.randomSelect(list: array): any;
```

接受一个数组`list`，返回数组中的随机一项。

#### 几何坐标相关

```javascript
relert.posInnerMap(obj: object): boolean;
```

接受一个对象`obj`（其必须带有`X`和`Y`属性，代表它的X坐标和Y坐标），返回它的坐标是否在地图内。

可以将`relert.js`提供的，数据代理层的“物体”对象直接传入，因为它们都有`X`和`Y`属性。

也可以输入形如`{X: 12, Y: 34}`这样的对象，直接指定坐标。

```javascript
relert.posInnerCircle(obj: object, x: number, y: number, r: number): boolean;
```

接受一个对象（其必须带有`X`和`Y`属性，代表它的X坐标和Y坐标），返回它的坐标是否在圆心坐标`(x, y)`、半径`r`的圆内。

有关于对象`obj`的属性需求，参考上一条`relert.posInnerMap`。

```javascript
relert.posInnerTriangle(obj1: object, obj2: object, obj3: object): boolean;
```



## 时光机

计划开发内容。



## 在node.js环境使用

### 程序入口

### 文件接口

### 通用脚本编写



## 定制



## 关于

`relert.js-browser`版本`0.1`，2021年9月

开发及贡献者：

* heli-lab

## 附录：relert.js代码风格约定



## 附录：常用逻辑示例

