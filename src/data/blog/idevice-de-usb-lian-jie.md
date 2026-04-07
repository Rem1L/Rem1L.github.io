---
title: "iDevice的usb连接"
pubDatetime: 2024-04-05T00:00:00Z
description: "此处有崇山峻岭，茂林修竹"
tags: []
---

简单介绍一下如何用USB连接取代简单的网络连接

一般我们ssh连接iDevice的时候使用的是`ssh root@ip`，但看到有人建议使用usb连接。在mac上我使用`usbmuxd`来完成[参考](https://iphonedev.wiki/SSH_Over_USB)。

```
brew install libusbmuxd
```

使用brew下载`libusbmuxd`

再将

```
Host my-iphone
    ProxyCommand inetcat 22 <my-phone-uuid>
    User root
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
```

写入`~/.ssh/config`文件，就可以简单的`ssh my-iphone`进行ssh连接啦。

其次，`usbmuxd` 中还有`iproxy`工具，可以帮助我们打通主机和usb设备端口。

比如在IDA pro debugger中，我们一般用命令`debugserver 主机host:port0 --attach=<process_name>` 和 IDA中 `iDevicehost:port0` 来进行远程调试。而利用`iproxy`我们可以通过端口映射来打通设备。

先在主机上运行进程

```
iproxy port1 port2
```

之后iDevice上的debugserver命令可以是`debugserver localhost:port1 --attach=<process_name>` , IDA设置为`localhost:port2`由此来进行USB连接，提升网络性能。

赞赏