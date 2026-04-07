---
title: "IDA pro debugger初尝避坑指南"
pubDatetime: 2024-04-05T00:00:00Z
description: "此处有崇山峻岭，茂林修竹"
tags: []
---

萌新想要调试自己手上的一个简单项目，但在使用自己的IDA pro 7.0 cracked 版本 按教程启动debugger时出现了 `Invalid service` 的问题，最初我以为是自己的IDA pro版本过低的问题。从Hex-rays[官方教程](https://hex-rays.com//wp-content/uploads/2020/06/ios_debugger_primer2.pdf)中发现自己的 `Device`栏没有自动识别。于是去PYG找到了8.3版本的window版IDA pro并用crossover与自己的intel mac打通debugger成功。发现网络上的教程或太老或不全，考虑到自己的探索可能是互联网上头一份，故记录一下。

首先已经验证的是报错`Error launching iOS debugserver: The service is invalid. (errcode = 0xe8000022)`和IDA pro版本没有直接关系，和win/mac的IDA pro版本存在一定关系。在IDA pro任务栏 debugger->Debugger options->Set specific options中可以选择`Lauch debugserver automatically`项，推测这是IDA利用Xcode做的自动识别与启动iDevice上的debugserver（windows版本是没有这项的）。然而这里存在两个问题：Hex-rays官方教程里使用的是未越狱版本的iDevice，且iOS\_deploy.zip这个工具已难找到绿色资源（痛失一块大洋从旮旯里买了一份）。未越狱版本的debugserver有两个问题：

- Xcode自动安装的debugserver为只读，在越狱版中可以重签名放回（已尝试[debugserver codesign](https://book.crifan.org/books/ios_re_debug_debugserver_lldb/website/debugserver_lldb_debug/proper_entitlemets.html)），（这里面我遇到个坑，为后人避雷了：Xcode自动安装debugserver时虽然我的Xcode版本足够新，有DeviceSupport/<version>/DeveloperDiskImage.dmg 资源，但Xcode于任务栏Windows->Devices and Simulators首次连接设备时报错Failed to prepare the device for development，且debugserver未安装成功，而我自己的未越狱手机连接正常，[stackoverflow](https://stackoverflow.com/q/64974291)上提到一嘴JB的问题给了我思路，我的解决方法是重启非完美越狱的设备回到Jailed状态即可正常连接Xcode，后续即使再次越狱也能正常连接了，虽然JB版本的debugserver完全没必要从这里安装，但不知道Xcode这里的报错会不会带来后续影响）
- 在我的越狱版本中可以直接在Cydia中下载安装debugserver-10来完美替代。功能应该没有区别，并且无论哪种debugserver，最后我在使用`Lauch debugserver automatically` 都失败了，但手动启动却都能成功debug。

总而言之这个错误的来源是mac版的IDA pro上才有的`Lauch debugserver automatically`项，将其关闭后手动配置host:port，并手动启动任何一种debugserver即能正常运行。

其次分享一下自己利用Crossover打通win版IDA pro debugger的经验。由于自己最早的怀疑是IDA pro版本问题，从P.Y.G搞到了几乎是最新版的IDA pro 8.3，但是好像只有win版，受社区启发利用Crossover试试。Crossover资源自行寻找。Crossover实际做了一个简化版本的win虚拟机，简单讲一下安装上的一点问题，参考[飘雪](https://bbs.kanxue.com/thread-278679.htm)。我们保持Python版本和P.Y.G的安装包一致，不下载embeded版本（因为需要Script/pip来进行包管理和下载），而是利用运行命令`cmd`来用exe安装Python，设置中将路径放到了IDA pro文件夹里。这里说几个需要注意的地方：

- 安装目录随意，出错点跳过这一步就行
- 运行命令`regedit`打开注册表，（猜测这个和Win+R效果一样的）填写环境变量HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Environment中的PATH项，同时放入python文件夹路径和<python>/Script路径，来保证python和pip都对整体环境可见
- 在注册表中继续填写HKEY\_USERS\S-1-5-21-0-0-0-1000\Software\Hex-Rays\IDA\Python3TargetDLL，若未见Python3TargetDLL项则新增 字符串值 , 名字是 Python3TargetDLL, 值是 ida目录下 python3.dll 的目录
- 注意我们在实际在操作win虚拟机，各种路径需要从win的角度来看（分盘、反斜杠）
- 运行命令`cmd`,安装python到自定义路径，按照说明升级pip、安装keystone-engine和six
- 在debugger中填写各种必要项，注意反斜杠和分盘（ios设备路径用正斜杠），填写host:port并手动启动debugserver即可成功。

关于F5报错：安装[该链接](https://www.chinapyg.com/forum.php?mod=viewthread&tid=149566&highlight=IDA%2Bpro%2B8.3)覆盖文件即可

赞赏