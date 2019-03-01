[简体中文](./README_cn.md)

# BlaCatSDK Usage Documentation
This document illustrates how to use the BlaCatSDK(NeoGameSDK) and how to access the NEO public blockchain.






## Catalog
* [BlaCat Introduction](#blacat-introduction)
* [SDK Preparation](#sdk-preparation)
* [Callback Mode Description](#callback-mode-description)
* [SDK Initialization](#sdk-initialization)
	* [SDK Initialization(init)](#1-sdk-initializationinit)
	* [Lock Net Type(lockNet)](#2-lock-net-typelocknet)
* [SDK Basic](#sdk-basic)
	* [Login(login)](#1-loginlogin)
	* [Get User Information(getUserInfo)](#2-get-user-informationgetuserinfo)
	* [Get Current Network Type(getNetType)](#3-get-current-network-typegetnettype)
	* [Get Balance(getBalance)](#4-get-balancegetbalance)
	* [Get Height(getHeight)](#5-get-heightgetheight)
* [SDK Advance](#sdk-advance)
	* [Contract Reading(invokescript)](#1-contract-readinginvokescript)
	* [Contract Writing(makeRawTransaction)](#2-contract-writingmakerawtransaction)
	* [Confirm Notify(confirmAppNotify)](#3-confirm-notifyconfirmappnotify)
* [SDK Transfer](#sdk-transfer)
	* [Transfer(makeTransfer)](#1-transfermaketransfer)
	* [GAS Multiple Transfer(makeGasTransferMulti)](#2-gas-multiple-transfermakegastransfermulti)
* [SDK Language](#sdk-language)
	* [Set Language(setLang)](#1-set-languagesetlang)
* [SDK ICON](#sdk-icon)
	* [Show SDK Icon(showIcon)](#1-show-sdk-iconshowicon)
	* [Show Main View(showMain)](#2-show-main-viewshowmain)
* [SDK Default Net Type](#sdk-default-net-type)
	* [Set Default Net Type(setDefaultNetType)](#1-set-default-net-typesetdefaultnettype)
* [SDK Others](#sdk-others)
    * [Dependent](#1-dependent)
    * [Storage of Wallet Operation Records](#2-storage-of-wallet-operation-records)



## BlaCat Introduction
BlaCat is a blockchain game platform running as a side chain based on NEO high-performance blockchain, the platform’s business mainly consists of: wallet, transaction/trading market, game platform and user community. BlaCat’s biggest technological feature is the ZoroChain, it provides an integrated blockchain technology solution for high-speed DAPP development.






## SDK Preparation
To use the BlaCatSDK, you firstly need to access these necessary files to run the BlacatSDK.
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

[`Return Catalog`](#catalog)

----



## Callback Mode Description
BlaCatSDK supports two types of callback modes, one is when initializing the SDK(init) register a callback function (recommended), another is a function callback mode. Some function/feature callbacks，such as switching network type notification,Transaction confirmation completion notification, etc. can be done only through the first mode.

- Callback method one: register a callback function (recommended)
```javascript
var listener = function(data) {
	// data is a json string
	var res = JSON.parse(data)
	console.log('listener => ', res)
	switch (res.cmd) {
		case "loginRes": // login success callback
			break;
		case "getUserInfoRes": // get login user info
			break;
		case "getNetTypeRes": // get net type
			break;
		case "getBalanceRes": // get coin balance
			break;
		case "getHeightRes": // get height info
			break;
		case "invokescriptRes": // invoke script
			break;
		case "makeRawTransactionRes": // make raw transaction
			break;
		case "makeTransferRes": // transfer callback
			break;
		case "makeGasTransferMultiRes": // gas multi transfer callback
			break;
		case "logoutRes": // login out
			break;
		case "changeNetTypeRes": // switch net type
			break;
		case "getAppNotifysRes": // transaction processed callback
			break;
		case "confirmAppNotifyRes": // confirm notify callback
			break;
	}
};
BlackCat.SDK.init(listener, "cn")
```

- Callback Mode 2：Anonymous function callback
```javascript
BlackCat.SDK.functionName(data, function(res) { ... })
```

[`Return Catalog`](#catalog)

----







## SDK Initialization

### 1. SDK Initialization(init)
Before using the BlaCatSDK，you need to perform some initialization processes.

- Call method
```javascript
BlackCat.SDK.init(listener, lang)
```

- Call parameters

|Parameter Name    | Required | Type | Description |
|:-----   |:-----|:-----|-----|
|listener |Yes    |function |SDK callback function   |
|lang     |No    |string   |SDK language, Default cn(Simplified Chinese), can change to cn. en. jp   |

- Call return

`Void`

[`Return Catalog`](#catalog)


----
### 2. Lock Net Type(lockNet)
Lock the network type, users can not switch

- Call restriction

The init method must be executed first

- Call method
```javascript
BlackCat.SDK.lockNet()
```

- Call return

`Void`

[`Return Catalog`](#catalog)

----





## SDK Basic

### 1. Login(login)
Use this to open wallet

- Call restriction

The init method must be executed first

- Call method
```javascript
BlackCat.SDK.login()
BlackCat.SDK.login(function(res){ ... })
```

- Call return
```javascript
// listener(data)
{
	"cmd": "loginRes",
	"data": "AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5"
}
// Anonymous callback function(res)
"AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5"
```

- Return data description

Return the current login wallet address

[`Return Catalog`](#catalog)

----



### 2. Get User Information(getUserInfo)
Use this method to get user information

- Call restriction

Init method and login method must be executed first

- Call method
```javascript
BlackCat.SDK.getUserInfo()
BlackCat.SDK.getUserInfo(function(res){ ... })
```

- Call return
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
// Anonymous callback function(res)
{
    "err": false,
    "info": {
        "wallet": "AQXPAKF7uD5rYbBnqikGDVcsP1Ukpkopg5"
    }
}
```

- Return data description

|Parameter Name    | Required | Type | Description |
|:-----   |:-----|:-----|-----|
|wallet |Yes    |string |User Wallet Address   |

[`Return Catalog`](#catalog)

----



### 3. Get Current Network Type(getNetType)
Get the current network type

- Call restriction

The init method must be executed first

- Call method
```javascript
BlackCat.SDK.getNetType()
BlackCat.SDK.getNetType(function(res){ ... })
```

- Call return
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
// Anonymous callback function(res)
{
    "err": false,
    "info": 2
}
```

- Return data description

1 for the main network and 2 for the test network

[`Return Catalog`](#catalog)

----



### 4. Get Balance(getBalance)
Get the token balance of the current user

- Call restriction

Init method and login method must be executed first

- Call method
```javascript
BlackCat.SDK.getBalance()`
BlackCat.SDK.getBalance(function(res){ ... })
```

- Call return
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
// Anonymous callback function(res)
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

- Return data description

Return the token balance of the current user

[`Return Catalog`](#catalog)

----



### 5. Get Height(getHeight)
Get height infomation

- Call restriction

Init method and login method must be executed first

- Call method
```javascript
BlackCat.SDK.getBalance()
BlackCat.SDK.getBalance(function(res){ ... })
```

- Call return
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
// Anonymous callback function(res)
{
    "err": false,
    "info": {
        "node": 2378074,
        "cli": 0
    }
}
```

- Return data description

Return height infomation

[`Return Catalog`](#catalog)

----






## SDK Advance
In general, there are two types of smart contract calls, one is a contract read request (invokescript) and the other is a contract write request (makeRawTransaction). The read request is not modified, just read the relevant data. The write request will change and require the user to authorize the signature.

### 1. Contract Reading(invokescript)
Read smart contract information in read-only mode, which can be called without user signature.

- Call restriction

Init method and login method must be executed first

- Call method
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

- Call parameters

|Parameter Name|Required|Type|Description|
|:----    |:---|:----- |-----   |
|sbParamJson |Yes  |Array |contract parameters   |
|sbPushString |Yes  |string |contract method name   |
|nnc |Yes  |string |contract hash address   |
|extString |Yes  |string |Transmission parameters  |

- Call return
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
// Anonymous callback function(res)
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

- Return data description

Returns contract query results.
> Special Notes on sbParamJson:  
If the parameter is string, it's actually a special value.  
    (string) or (str): Represents a string, utf8 encoded as bytes  
    (bytes) or ([]): It means a bytearray.  
    (address) or (addr): Represents an address, converted to script hash.  
    (integer) or (int): Representation is a big integer  
    (hexinteger) or (hexint) or (hex): Representation is a big integer in hexadecimal representation. Conversion to bytes is reverse order.  
    (int256) or (hex256): Represents a fixed length of 256-bit hexadecimal big integer.  
    (int160) or (hex160): Represents a fixed length of 160-bit hexadecimal big integer.  

[`Return Catalog`](#catalog)

----




### 2. Contract Writing(makeRawTransaction)
The smart contract is operated in write mode, which requires the wallet user to sign.

- Call restriction

Init method and login method must be executed first

- Call method
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

- Call parameters

|Parameter Name|Required|Type|Description|
|:----    |:---|:----- |-----   |
|sbParamJson |Yes  |Array |contract parameters   |
|sbPushString |Yes  |string |contract method name   |
|nnc |Yes  |string |contract hash address   |
|extString |Yes  |string |Transmission parameters  |

- Call return
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
// Anonymous callback function(res)
{
    "err": false,
    "info": {
        "txid": "0xbd651ad15de7f9b02249828edf606696805f810773641597d429c183482fdbbb"
    }
}
```

- Return data description

Return contract execution transaction ID(txid)

[`Return Catalog`](#catalog)

----



### 3. Confirm Notify(confirmAppNotify)
Confirm that transaction information has been received

- Call restriction

Init method and login method must be executed first

- Call method
```javascript
var params = {
	txid: "0xbd651ad15de7f9b02249828edf606696805f810773641597d429c183482fdbbb",
};
BlackCat.SDK.confirmAppNotify(params)
BlackCat.SDK.confirmAppNotify(params, function(res){ ... })
```

- Call parameters

|Parameter Name|Required|Type|Description|
|:----    |:---|:----- |-----   |
|txid |Yes  |string |transaction id   |

- Call return
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
// Anonymous callback function(res)
{
    "err": false,
    "info": {
        "txid": "0xbd651ad15de7f9b02249828edf606696805f810773641597d429c183482fdbbb"
    }
}
```

- Return data description

Returns the confirmed transaction ID(txid)

[`Return Catalog`](#catalog)

----






## SDK Transfer

### 1. Transfer(makeTransfer)
Transfer Interface

- Call restriction

Init method and login method must be executed first

- Call method
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

- Call parameters

|Parameter Name    | Required | Type | Description |
|:-----   |:-----|:-----|-----|
|type |Yes    |string |Transfer token type(gas/cgas/neo/cneo)   |
|toaddr |Yes  |String |Transfer Receipt Address   |
|count |Yes  |string |Transfer amount   |
|extString |Yes  |string |Transmission parameters  |

- Call return
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
// Anonymous callback function(res)
{
    "err": false,
    "info": "0xb2d628f858d8ae13b6e33d5488231368a611d328bba667ecf16eea6c540a90a1"
}
```

- Return data description

Return the transaction ID of the transfer execution

[`Return Catalog`](#catalog)

----



### 2. GAS Multiple Transfer(makeGasTransferMulti)
GAS multiple transfer

- Call restriction

Init method and login method must be executed first

- Call method
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

- Call parameters

|Parameter Name    | Required | Type | Description |
|:-----   |:-----|:-----|-----|
|toaddr |Yes  |String |receipt address   |
|count |Yes  |string |transfer amount   |
|extString |Yes  |string |Transmission parameters  |

- Call return
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
// Anonymous callback function(res)
{
    "err": false,
    "info": "0x0615da2c7279051b2535acd3caa50ba7782125faf2c8bc17716029bc95b44797"
}
```

- Return data description

Return the transaction ID of the transfer execution

[`Return Catalog`](#catalog)

----






## SDK Language
Set the SDK language
### 1. Set Language(setLang)
- Call restriction

The init method must be executed first

- Call method
```javascript
BlackCat.SDK.setLang(lang)
```

- Call parameters

|Parameter Name    | Required | Type | Description |
|:-----   |:-----|:-----|-----|
|lang     |Yes    |string   |SDK language, can change to cn. en. jp  |

- Call return

`Void`

[`Return Catalog`](#catalog)

----






## SDK ICON
Show or hide the SDK icon.

### 1. Show SDK Icon(showIcon)
Show the SDK icon, hide the main view.
- Call restriction

The init method must be executed first

- Call method
```javascript
BlackCat.SDK.showIcon()
```

- Call return

`Void`

[`Return Catalog`](#catalog)

----



### 2. Show Main View(showMain)
Show the main view, hide the SDK icon.
- Call restriction

The init method must be executed first

- Call method
```javascript
BlackCat.SDK.showMain()
```

- Call return

`Void`

[`Return Catalog`](#catalog)

----






## SDK Default Net Type

### 1. Set Default Net Type(setDefaultNetType)
Set the initial default network type
- Call restriction

The init method must be executed first

- Call method
```javascript
BlackCat.SDK.setDefaultNetType(netType)
```

- Call parameters

|Parameter Name    | Required | Type | Description |
|:-----   |:-----|:-----|-----|
|netType     |Yes    |number   |mainnet:1, testnet:2   |

- Call return

`Void`

[`Return Catalog`](#catalog)

----




## SDK Others

### 1. Dependent

* [`NEO_Block_API`](https://github.com/NewEconoLab/NEO_Block_API)
* [`NeoBlock-Mongo-Storage`](https://github.com/NewEconoLab/NeoBlock-Mongo-Storage)
* [`neo-cli`](https://github.com/neo-project/neo-cli)

### 2. Storage of Wallet Operation Records

> Current wallet operation records are stored in the browser's `LocalStorage`, which can be modified by yourself if there are other requirements.

[`Return Catalog`](#catalog)

----

