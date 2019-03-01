[English](./README.md)

# BlaCatSDK使用文档
本文讲述如何使用BlaCatSDK(NeoGameSDK)接入NEO公链。


## 目录
* [BlaCat简介](#blacat简介)
* [引入SDK](#引入sdk)
* [SDK回调说明](#sdk回调说明)
* [SDK初始化](#sdk初始化)
	* [初始化SDK（init）](#1初始化sdkinit)
	* [锁定网络类型（lockNet）](#2锁定网络类型locknet)
* [SDK基础功能使用方法](#sdk基础功能使用方法)
	* [登录（login）](#1登录login)
	* [获取用户信息（getUserInfo）](#2获取用户信息getuserinfo)
	* [获取当前网络类型（getNetType）](#3获取当前网络类型getnettype)
	* [获取代币余额（getBalance）](#4获取代币余额getbalance)
	* [获取高度信息（getHeight）](#5获取高度信息getheight)
* [SDK进阶功能使用方法](#sdk进阶功能使用方法)
	* [合约读取(invokescript)](#1合约读取invokescript)
	* [合约写入（makeRawTransaction）](#2合约写入makerawtransaction)
	* [确认（confirmAppNotify）](#3确认confirmappnotify)
* [SDK转账功能使用说明](#sdk转账功能使用说明)
	* [转账（makeTransfer）](#1转账maketransfer)
	* [GAS批量转账（makeGasTransferMulti）](#2gas批量转账makegastransfermulti)
* [SDK界面语言](#sdk界面语言)
	* [切换界面语言（setLang）](#1切换界面语言setlang)
* [SDK图标](#sdk图标)
	* [显示SDK图标（showIcon）](#1显示sdk图标showicon)
	* [显示主界面（showMain）](#2显示主界面showmain)
* [SDK默认网络类型](#sdk默认网络类型)
	* [设置默认网络类型（setDefaultNetType）](#1设置默认网络类型setdefaultnettype)
* [SDK其他说明](#sdk其他说明)
    * [关联程序](#1关联程序)
    * [操作记录存储](#2操作记录存储)


## BlaCat简介
BlaCat是基于NEO高性能侧链的链游平台，平台业务主要包括：钱包、交易市场、游戏平台、用户社区。BlaCat最大的技术特点是ZoroChain，它提供了一套面向高速DApp开发的整体区块链技术解决方案。





## 引入SDK
要使用BlaCatSDK，先要引入BlaCatSDK运行的必要文件
```javascript
<link rel="stylesheet" href="res/css/panel.css" type="text/css" />
<script src="lib/rollup/aes.js"></script>
<script src="lib/component/aes.js"></script>
<script src="lib/component/mode-ecb.js"></script>
<script src="lib/component/pad-nopadding.js"></script>
<script src="lib/scrypt.js"></script>
<script src="lib/jsrsasign.js"></script>
<script src="lib/neo-ts.js"></script>
<script src="lib/qr-code-with-logo.browser.min.js"></script>
<script src="lib/code.js"></script>
```

[`返回目录`](#目录)

----



## SDK回调说明
BlaCatSDK支持两种回调方式，第一种是初始化SDK时（init）注册回调函数方式（推荐），第二种是匿名函数回调方式。有些功能回调，比如切换网络类型通知、交易确认完成通知等，只能通过第一种方式回调。

- 方式一：注册回调函数（推荐）
```javascript
var listener = function(data) {
	// 回调处理，data是JSON格式String
	var res = JSON.parse(data)
	console.log('listener => ', res)
	switch (res.cmd) {
		case "loginRes": // 登录成功回调
			break;
		case "getUserInfoRes": // 获取登录用户信息
			break;
		case "getNetTypeRes": // 获取网络类型
			break;
		case "getBalanceRes": // 获取余额
			break;
		case "getHeightRes": // 获取高度
			break;
		case "invokescriptRes": // 合约读取调用
			break;
		case "makeRawTransactionRes": // 合约写入请求结果
			break;
		case "makeTransferRes": // 转账回调
			break;
		case "makeGasTransferMultiRes": // GAS批量转账回调
			break;
		case "logoutRes": // 登出回调
			break;
		case "changeNetTypeRes": // 网络切换回调
			break;
		case "getAppNotifysRes": // 交易成功回调
			break;
		case "confirmAppNotifyRes": // 交易确认成功回调
			break;
	}
};
BlackCat.SDK.init(listener, "cn")
```

- 方式二：匿名函数回调
```javascript
BlackCat.SDK.functionName(data, function(res) { ... })
```

[`返回目录`](#目录)

----






## SDK初始化

### 1、初始化SDK（init）
BlaCatSDK使用前，必须执行初始化操作

- 调用方法
```javascript
BlackCat.SDK.init(listener, lang)
```

- 调用参数

|参数名    | 必选 | 类型 | 说明 |
|:-----   |:-----|:-----|-----|
|listener |是    |function |SDK回调函数   |
|lang     |否    |string   |SDK界面语言，默认cn（中文），可取值cn、en、jp   |

- 调用返回

`无返回`

[`返回目录`](#目录)


----
### 2、锁定网络类型（lockNet）
锁定网络类型，用户不能切换

- 调用限制

必须先执行init

- 调用方法
```javascript
BlackCat.SDK.lockNet()
```

- 调用返回

`无返回`

[`返回目录`](#目录)

----





## SDK基础功能使用方法

### 1、登录（login）
打开钱包

- 调用限制

必须先执行init

- 调用方法
```javascript
BlackCat.SDK.login()
BlackCat.SDK.login(function(res){ ... })
```

- 调用返回
```javascript
// listener(data)
{
	"cmd": "loginRes",
	"data": "AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5"
}
// 匿名回调函数(res)
"AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5"
```

- 返回数据说明

返回当前登录的钱包地址

[`返回目录`](#目录)

----




### 2、获取用户信息（getUserInfo）
获取当前用户信息

- 调用限制

必须先执行init、login

- 调用方法
```javascript
BlackCat.SDK.getUserInfo()
BlackCat.SDK.getUserInfo(function(res){ ... })
```

- 调用返回
```javascript
// listener(data)
{
	"cmd": "getUserInfoRes",
	"data": {
		"params": null,
		"res": {
			"err": false,
			"info": {
			"wallet": "AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5"
			}
		}
	}
}
// 匿名回调函数(res)
{
    "err": false,
    "info": {
        "wallet": "AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5"
    }
}
```

- 返回数据说明

|参数名    | 必选 | 类型 | 说明 |
|:-----   |:-----|:-----|-----|
|wallet |是    |string |当前登录的钱包地址   |

[`返回目录`](#目录)

----



### 3、获取当前网络类型（getNetType）
获取当前网络类型

- 调用限制

必须先执行init

- 调用方法
```javascript
BlackCat.SDK.getNetType()
BlackCat.SDK.getNetType(function(res){ ... })
```

- 调用返回
```javascript
// listener(data)
{
    "cmd": "getNetTypeRes",
    "data": {
        "params": null,
        "res": {
            "err": false,
            "info": 2
        }
    }
}
// 匿名回调函数(res)
{
    "err": false,
    "info": 2
}
```

- 返回数据说明

1表示主网，2表示测试网

[`返回目录`](#目录)

----



### 4、获取代币余额（getBalance）
获取当前用户的代币余额

- 调用限制

必须先执行init、login

- 调用方法
```javascript
BlackCat.SDK.getBalance()
BlackCat.SDK.getBalance(function(res){ ... })
```

- 调用返回
```javascript
// listener(data)
{
    "cmd": "getBalanceRes",
    "data": {
        "params": null,
        "res": {
            "err": false,
            "info": {
                "gas": 171.4886099,
                "cgas": 67.4240101,
                "neo": 5,
                "cneo": 1.31580503
            }
        }
    }
}
// 匿名回调函数(res)
{
    "err": false,
    "info": {
        "gas": 171.4886099,
        "cgas": 67.4240101,
        "neo": 5,
        "cneo": 1.31580503
    }
}
```

- 返回数据说明

返回对应的币种余额

[`返回目录`](#目录)

----






### 5、获取高度信息（getHeight）
获取高度信息

- 调用限制

必须先执行init、login

- 调用方法
```javascript
BlackCat.SDK.getBalance()
BlackCat.SDK.getBalance(function(res){ ... })
```

- 调用返回
```javascript
// listener(data)
{
    "cmd": "getHeightRes",
    "data": {
        "params": null,
        "res": {
            "err": false,
            "info": {
                "node": 2378074,
                "cli": 0
            }
        }
    }
}
// 匿名回调函数(res)
{
    "err": false,
    "info": {
        "node": 2378074,
        "cli": 0
    }
}
```

- 返回数据说明

返回对应的节点高度

[`返回目录`](#目录)

----




## SDK进阶功能使用方法
一般情况下，智能合约调用分为两种，一种是合约读取请求（invokescript），一种是合约写入请求(makeRawTransaction)。读取请求不做任何修改，只是单纯的读取相关数据。写入请求会做数据变更，需要用户授权签名。

### 1、合约读取(invokescript)
以只读方式读取智能合约信息，该调用不需要钱包用户签名即可调用。

- 调用限制

必须先执行init、login

- 调用方法
```javascript
var params = {
	sbParamJson: ["(addr)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT"],
	sbPushString: "balanceOf",
	nnc: "0x74f2dc36a68fdc4682034178eb2220729231db76",
	extString: "invokeScript"
};
BlackCat.SDK.invokescript(params)
BlackCat.SDK.invokescript(params, function(res){ ... })
```

- 调用参数

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|sbParamJson |是  |Array |合约参数数组   |
|sbPushString |是  |string |合约方法名   |
|nnc |是  |string |合约地址   |
|extString |是  |string |透传参数  |

- 调用返回
```javascript
// listener(data)
{
    "cmd": "invokescriptRes",
    "data": {
        "params": {
            "nnc": "0x74f2dc36a68fdc4682034178eb2220729231db76",
            "sbParamJson": [
                "(addr)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT"
            ],
            "sbPushString": "balanceOf",
            "extString": "invokeScript"
        },
        "res": {
            "err": false,
            "info": {
                "script": "14ba42009c9f422111ca847526b443467fc6483f3651c10962616c616e63654f666776db3192722022eb7841038246dc8fa636dcf274",
                "state": "HALT, BREAK",
                "gas_consumed": "0.333",
                "stack": [
                    {
                        "type": "ByteArray",
                        "value": "a0f31335"
                    }
                ]
            }
        }
    }
}
// 匿名回调函数(res)
{
    "err": false,
    "info": {
        "script": "14ba42009c9f422111ca847526b443467fc6483f3651c10962616c616e63654f666776db3192722022eb7841038246dc8fa636dcf274",
        "state": "HALT, BREAK",
        "gas_consumed": "0.333",
        "stack": [
            {
                "type": "ByteArray",
                "value": "a0f31335"
            }
        ]
    }
}
```

- 返回数据说明

返回合约查询结果。  
关于sbParamJson的特殊说明  
> 如果参数为string,其实是特殊值
    (string) or (str) 开头，表示是个字符串，utf8编码为bytes  
    (bytes) or ([])开头，表示就是一个bytearray  
    (address) or (addr)开头，表示是一个地址，转换为脚本hash  
    (integer) or (int) 开头，表示是一个大整数  
    (hexinteger) or (hexint) or (hex) 开头，表示是一个16进制表示的大整数，转换为bytes就是反序  
    (int256) or (hex256) 开头,表示是一个定长的256位 16进制大整数  
    (int160) or (hex160) 开头,表示是一个定长的160位 16进制大整数  

[`返回目录`](#目录)

----




### 2、合约写入（makeRawTransaction）
以写方式操作智能合约，该调用需要钱包用户签名。

- 调用限制

必须先执行init、login

- 调用方法
```javascript
var params = {
	sbParamJson: ["(addr)AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5","(address)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT","(integer)100000"],
	sbPushString: "transfer",
	nnc: "0x74f2dc36a68fdc4682034178eb2220729231db76",
	extString: "makeRawTransaction"
};
BlackCat.SDK.makeRawTransaction(params)
BlackCat.SDK.makeRawTransaction(params, function(res){ ... })
```

- 调用参数

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|sbParamJson |是  |Array |合约参数数组   |
|sbPushString |是  |string |合约方法名   |
|nnc |是  |string |合约地址   |
|extString |是  |string |透传参数  |

- 调用返回
```javascript
// listener(data)
{
    "cmd": "makeRawTransactionRes",
    "data": {
        "params": {
            "nnc": "0x74f2dc36a68fdc4682034178eb2220729231db76",
            "sbParamJson": [
                "(addr)AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5",
                "(address)AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT",
                "(integer)100000"
            ],
            "sbPushString": "transfer",
            "extString": "makeRawTransaction"
        },
        "res": {
            "err": false,
            "info": {
                "txid": "0xbd651ad15de7f9b02249828edf606696805f810773641597d429c183482fdbbb"
            }
        }
    }
}
// 匿名回调函数(res)
{
    "err": false,
    "info": {
        "txid": "0xbd651ad15de7f9b02249828edf606696805f810773641597d429c183482fdbbb"
    }
}
```

- 返回数据说明

返回合约执行交易ID（txid）

[`返回目录`](#目录)

----






### 3、确认（confirmAppNotify）
向SDK确认已经收到交易信息

- 调用限制

必须先执行init、login

- 调用方法
```javascript
var params = {
	txid: "0xbd651ad15de7f9b02249828edf606696805f810773641597d429c183482fdbbb",
};
BlackCat.SDK.confirmAppNotify(params)
BlackCat.SDK.confirmAppNotify(params, function(res){ ... })
```

- 调用参数

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|txid |是  |string |确认交易ID   |

- 调用返回
```javascript
// listener(data)
{
    "cmd": "confirmAppNotifyRes",
    "data": {
        "params": {
            "txid": "0xbd651ad15de7f9b02249828edf606696805f810773641597d429c183482fdbbb"
        },
        "res": {
            "err": false,
            "info": "1"
        }
    }
}
// 匿名回调函数(res)
{
    "err": false,
    "info": {
        "txid": "0xbd651ad15de7f9b02249828edf606696805f810773641597d429c183482fdbbb"
    }
}
```

- 返回数据说明

返回合约执行交易ID（txid）

[`返回目录`](#目录)

----







## SDK转账功能使用说明

### 1、转账（makeTransfer）
转账接口

- 调用限制

必须先执行init、login

- 调用方法
```javascript
var params = {
	type: "gas",
	toaddr: "AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5",
	count: "0.01",
	extString: "makeTransfer"
}
BlackCat.SDK.makeTransfer(params)
BlackCat.SDK.makeTransfer(params, function(res){ ... })
```

- 调用参数

|参数名    | 必选 | 类型 | 说明 |
|:-----   |:-----|:-----|-----|
|type |是    |string |转账币种(gas/cgas/neo/cneo)   |
|toaddr |是  |String |转账收款地址   |
|count |是  |string |转账数量   |
|extString |是  |string |透传参数  |

- 调用返回
```javascript
// listener(data)
{
    "cmd": "makeTransferRes",
    "data": {
        "params": {
            "type": "gas",
            "toaddr": "AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5",
            "count": "1",
            "extString": "makeTransfer",
            "nnc": "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7",
            "sbPushString": "transfer"
        },
        "res": {
            "err": false,
            "info": "0xb2d628f858d8ae13b6e33d5488231368a611d328bba667ecf16eea6c540a90a1"
        }
    }
}
// 匿名回调函数(res)
{
    "err": false,
    "info": "0xb2d628f858d8ae13b6e33d5488231368a611d328bba667ecf16eea6c540a90a1"
}
```

- 返回数据说明

返回转账执行的交易ID

[`返回目录`](#目录)

----



### 2、GAS批量转账（makeGasTransferMulti）
转账接口

- 调用限制

必须先执行init、login

- 调用方法
```javascript
var params = [
	{
		toaddr: "AbYR3eUbPUcnenEfmbJ7Fc4DUZLabKD6Cf",
		count: "0.001",
		extString: "makeGasTransferMulti1"
	},
	{
		toaddr: "AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT",
		count: "0.002",
		extString: "makeGasTransferMulti2"
	}
]
BlackCat.SDK.makeGasTransferMulti(params)
BlackCat.SDK.makeGasTransferMulti(params, function(res){ ... })
```

- 调用参数

|参数名    | 必选 | 类型 | 说明 |
|:-----   |:-----|:-----|-----|
|toaddr |是  |String |转账收款地址   |
|count |是  |string |转账数量   |
|extString |是  |string |透传参数  |

- 调用返回
```javascript
// listener(data)
{
    "cmd": "makeGasTransferMultiRes",
    "data": {
        "params": [
            {
                "toaddr": "AbYR3eUbPUcnenEfmbJ7Fc4DUZLabKD6Cf",
                "count": "0.001",
                "extString": "makeGasTransferMulti1",
                "nnc": "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7",
                "sbPushString": "transfer"
            },
            {
                "toaddr": "AYkiQ74FHWFygR39WizXCz9f4xCLRYCxMT",
                "count": "0.002",
                "extString": "makeGasTransferMulti2",
                "sbPushString": "transfer"
            }
        ],
        "res": {
            "err": false,
            "info": "0x0615da2c7279051b2535acd3caa50ba7782125faf2c8bc17716029bc95b44797"
        }
    }
}
// 匿名回调函数(res)
{
    "err": false,
    "info": "0x0615da2c7279051b2535acd3caa50ba7782125faf2c8bc17716029bc95b44797"
}
```

- 返回数据说明

返回批量转账执行的交易ID

[`返回目录`](#目录)

----





## SDK界面语言
切换语言
### 1、切换界面语言（setLang）
- 调用限制

需要先执行init

- 调用方法
```javascript
BlackCat.SDK.setLang(lang)
```

- 调用参数

|参数名    | 必选 | 类型 | 说明 |
|:-----   |:-----|:-----|-----|
|lang     |是    |string   |SDK界面语言，可取值cn、en、jp   |

- 调用返回

`无返回`

[`返回目录`](#目录)

----



## SDK图标
显示或隐藏SDK小图标
### 1、显示SDK图标（showIcon）
显示SDK图标，隐藏主界面
- 调用限制

需要先执行init

- 调用方法
```javascript
BlackCat.SDK.showIcon()
```

- 调用返回

`无返回`

[`返回目录`](#目录)

----




### 2、显示主界面（showMain）
显示主界面，隐藏SDK图标
- 调用限制

需要先执行init

- 调用方法
```javascript
BlackCat.SDK.showMain()
```

- 调用返回

`无返回`

[`返回目录`](#目录)

----



## SDK默认网络类型

### 1、设置默认网络类型（setDefaultNetType）
设置默认的网络类型
- 调用限制

需要先执行init

- 调用方法
```javascript
BlackCat.SDK.setDefaultNetType(netType)
```

- 调用参数

|参数名    | 必选 | 类型 | 说明 |
|:-----   |:-----|:-----|-----|
|netType     |是    |number   |主网：1，测试网：2   |

- 调用返回

`无返回`

[`返回目录`](#目录)

----


## SDK其他说明

### 1、关联程序

* [`NEO_Block_API`](#https://github.com/NewEconoLab/NEO_Block_API)
* [`NeoBlock-Mongo-Storage`](#https://github.com/NewEconoLab/NeoBlock-Mongo-Storage)
* [`neo-cli`](#https://github.com/neo-project/neo-cli)

### 2、操作记录存储

> 当前钱包操作记录存储于浏览器的LocalStorage，如果有其他需求，可自行修改。

[`返回目录`](#目录)

----



