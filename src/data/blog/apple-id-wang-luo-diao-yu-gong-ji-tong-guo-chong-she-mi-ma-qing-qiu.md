---
title: "Apple ID网络钓鱼攻击——通过重设密码请求"
pubDatetime: 2024-04-08T00:00:00Z
description: "此处有崇山峻岭，茂林修竹"
tags: []
---

2024年3月24日，X用户汇报受到了新型的网络钓鱼攻击，主要原因来自于Apple对于[重设密码](https://iforgot.apple.com/)请求的低限制。

![](https://raw.githubusercontent.com/AegeanYan/ImageBed/main/Apple_reset_attack.jpeg)![](https://raw.githubusercontent.com/AegeanYan/ImageBed/main/Apple_reset_attack_1.jpeg)

攻击者只需要受害者的Apple ID和电话号码就可以发出数以百计的Reset请求到受害者的所有apple设备，必须全部点击后才能正常使用设备，该攻击会影响用户正常使用（比如夜间进行大批量的请求），个人测试只需要全部点击Don't Allow，在一段时间内就不会收到新的请求。

此外攻击者还会假扮Apple公司的客服号码1-800-275-2273，告诉受害者其账号正受到攻击，需要提供OTP。而OTP很可能被攻击者用于重设Apple ID。OTP修改密码并不会快速完成，Apple会对受害者进行提醒并审核约一周。所以我觉得实际能钓到鱼的难度很大。

[参考1](https://twitter.com/parth220_/status/1771589789143478471?s=61)

[参考2](https://www.macworld.com/article/2280669/apple-id-push-bombing-attack-reset-password-notification.html?utm_source=danielmiessler.com&utm_medium=referral&utm_campaign=ul-no-426-unveiling-xz-ai-monitoring-investigative-visualizations-with-fabric)

赞赏