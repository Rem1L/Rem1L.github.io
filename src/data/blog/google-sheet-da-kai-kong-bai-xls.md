---
title: "Google sheet打开空白xls"
pubDatetime: 2024-06-04T00:00:00Z
description: "此处有崇山峻岭，茂林修竹"
tags: []
---

> 通过将某空白xls格式的加密凭证用Google sheet打开，取得了意想不到的破解效果，推测是xls上某种弱加密方式受到了软件兼容问题。

作者在Bugcrowd悬赏的目标网站上寻找漏洞时发现了一个名为`redacted.xls` 的可疑文件，正常打开是一片空白，使用电子取证技术结果如下

![](https://raw.githubusercontent.com/AegeanYan/ImageBed/main/202406042224911.png)

- 该文件Security项标为Password protected，但实际打开时没有输入密码
- 文件大小约为16KB，但看上去是空的，元数据理应只占1-2KB
- 使用OLE及其他工具提取数据一无所获

奇怪的是，使用Excel和LibreOffice打开该xls文件时出现了异常现象: Excel中的显示从J列开始，而LibreOffice中从L列开始：某些表格类数据确实被隐藏了。

![](https://raw.githubusercontent.com/AegeanYan/ImageBed/main/202406042230121.png)

然而，当用Google Sheet打开它时，意外的是可以展开J列了

![](https://raw.githubusercontent.com/AegeanYan/ImageBed/main/202406042232404.png)

隐藏信息包含了大量的“企业详细信息”、“用户ID和密码”、“登录页面地址”等。

###### Conclusion

该文件采取了某种过时的空白加密方式以至于市面上的取证方法无法识别，但由于兼容性问题，在Google Sheet中将其显示出来。

赞赏