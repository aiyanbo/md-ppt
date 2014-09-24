Markdown PPT
============

Markdown PPT 是一款将 Markdown 文件转换成简单 PPT 文件显示的小工具。

## 语法

遵循 Markdown 语法，使用水平线 `hr` 将 Markdown 内容分割成 PPT 页。

**Markdown**

```
************

OR

* * *
```

**示例**

https://github.com/aiyanbo/md-ppt/blob/master/sample/sample.md

## 操作

### PC 端

- 向左剪头 --> 上一页
- 向右剪头 --> 下一页

### 移动设备

- 向左滑动 --> 下一页
- 向右滑动 --> 上一页

## 多屏互动

Markdown PPT 现已实现多屏互动的原型。使用方式为：

```
cd aiy-play
npm install
node server.js
```

> **Notes**
> 主控制器(一般是您的移动设备)请最后添加到多屏组里。

## 使用的组件

- CommonMark http://commonmark.org/
- Bootstrap http://getbootstrap.com/
