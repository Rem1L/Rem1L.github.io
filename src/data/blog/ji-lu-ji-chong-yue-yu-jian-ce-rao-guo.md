---
title: "记录几种越狱检测绕过"
pubDatetime: 2024-04-09T00:00:00Z
description: "此处有崇山峻岭，茂林修竹"
tags: []
---

这两天需要hook几款app，几乎每款都有越狱检测，故记录一下几种已经使用过的绕过方法。

- 修改frida-server二进制文件名，绕过简单的文件名检测。爱思助手或者mv均可
- 修改frida监听端口，默认检测27042。
  - ./frida -l 0.0.0.0:41032
  - iproxy 41032 41032
  - objection -N -h **localhost** -p 3333 -g `bundle_id` explore 这里的localhost换成127.0.0.1或0.0.0.0都会无法连接，不知道为啥。
- 添加Shadow的Cydia源，并安装Shadow，运行Shadow来遮蔽越狱。Shadow开启动态库会使objection无法连接

赞赏