var langbase = {
    lang: "cn",
    getLang: function () {
        var language = sessionStorage.getItem("language");
        
        if (!language) {
            var lang = navigator.language;//常规浏览器语言和IE浏览器
            lang = lang.substr(0, 2);//截取lang前2位字符
            if (lang == 'zh') {
                langbase.setLang("cn")
            } else {
                langbase.setLang("en")
            }
        }
        else {
            langbase.setLang(language)
        }
        return langbase.lang
    },
    setLang: function (language) {
        if (language != langbase.lang) {
            switch (language) {
                case "en":
                    langbase.lang = "en";
                    break;
                case "jp":
                    langbase.lang = "jp"
                    break;
                default: // cn
                    langbase.lang = "cn"
                    break
            }
            sessionStorage.setItem("language", langbase.lang);
        }
    }
}

var langs = {
    cn: {
        title_ready: "使用准备",
        sdk_init: "初始化",
        sdk_lock_chain: "锁主链",
        sdk_lock_net: "锁网络",

        title_base: "基础功能",
        sdk_login: "登录",
        sdk_uinfo: "用户信息",
        sdk_net_type: "网络类型",
        sdk_balance: "代币余额",
        sdk_height: "钱包高度",

        title_advance: "进阶功能",
        sdk_invoke: "合约读取",
        sdk_makeraw: "合约交易",
        sdk_notify: "确认通知",

        title_pay: "转账",
        sdk_transfer: "转账",
        sdk_gasmulti: "Gas批量转账",

        title_lang: "辅助[界面语言]",
        sdk_langcn: "中文",
        sdk_langen: "英文",
        sdk_langjp: "日文",

        title_icon: "辅助[图标]",
        sdk_iconshow: "显示",
        sdk_iconhidden: "隐藏",

        title_net: "辅助[网络]",
        sdk_net_main: "默认主网",
        sdk_net_test: "默认测试网",


        div_invoke_nnc: "nnc（合约地址）:",
        div_invoke_sbParamJson: "sbParamJson（合约参数）:",
        div_invoke_sbPushString: "sbPushString（合约方法）:",
        div_invoke_extString: "extString（透传参数）:",
        div_invoke_do: "读取",

        div_makeraw_nnc: "nnc（合约地址）:",
        div_makeraw_sbParamJson: "sbParamJson（合约参数）:",
        div_makeraw_sbPushString: "sbPushString（合约方法）:",
        div_makeraw_extString: "extString（透传参数）:",
        div_makeraw_do: "交易",

        div_confirm_txid: "txid（链上交易ID）:",
        div_confirm_do: "确认",

        div_transfer_type: "type(gas/neo/cgas/cneo)：",
        div_transfer_toaddr: "toaddr（转账地址）:",
        div_transfer_count: "count（转账数量）:",
        div_transfer_extString: "extString（透传参数）:",
        div_transfer_do: "转账",

        div_gasmulti_toaddr: "toaddr（转账地址）:",
        div_gasmulti_count: "count（转账数量）:",
        div_gasmulti_extString: "extString（透传参数）:",
        div_gasmulti_do: "转账",


    },
    en: {
        title_ready: "Prepare",
        sdk_init: "Init",
        sdk_lock_net: "LockNet",

        title_base: "Basic",
        sdk_login: "Login",
        sdk_uinfo: "UserInfo",
        sdk_net_type: "NetType",
        sdk_balance: "CoinBalance",
        sdk_height: "NodeHeight",

        title_advance: "Advance",
        sdk_invoke: "InvokeScript",
        sdk_makeraw: "MakeTransaction",
        sdk_notify: "ConfirmNotify",

        title_pay: "Transfer",
        sdk_transfer: "Transfer",
        sdk_gasmulti: "GasTransferMulti",

        title_lang: "Language",
        sdk_langcn: "Simplified Chinese",
        sdk_langen: "English",
        sdk_langjp: "Japanese",

        title_icon: "Icon",
        sdk_iconshow: "Show",
        sdk_iconhidden: "Hide",

        title_net: "ChainNetType",
        sdk_net_main: "DefaultMainnet",
        sdk_net_test: "DefaultTestnet",
        

        div_invoke_nnc: "nnc(Contract hash):",
        div_invoke_sbParamJson: "sbParamJson(Contract parameters):",
        div_invoke_sbPushString: "sbPushString(Contract method):",
        div_invoke_extString: "extString(Transmission parameters):",
        div_invoke_do: "InvokeScript",

        div_makeraw_nnc: "nnc(Contract hash):",
        div_makeraw_sbParamJson: "sbParamJson(Contract parameters):",
        div_makeraw_sbPushString: "sbPushString(Contract method):",
        div_makeraw_extString: "extString(Transmission parameters):",
        div_makeraw_do: "RawTransaction",

        div_confirm_txid: "txid(Transaction id):",
        div_confirm_do: "Confirm",

        div_transfer_type: "type(gas/neo/cgas/cneo):",
        div_transfer_toaddr: "toaddr(Receiving wallet): ",
        div_transfer_count: "count(Amount):",
        div_transfer_extString: "extString(Transmission parameters):",
        div_transfer_do: "Transfer",

        div_gasmulti_toaddr: "toaddr(Receiving Wallet):",
        div_gasmulti_count: "count(Amount):",
        div_gasmulti_extString: "extString(Transmission parameters):",
        div_gasmulti_do: "Transfer",

    },
    jp: {
        title_ready: "使用准备",
        sdk_init: "初始化",
        sdk_lock_chain: "锁主链",
        sdk_lock_net: "锁网络",

        title_base: "基础功能",
        sdk_login: "登录",
        sdk_uinfo: "用户信息",
        sdk_net_type: "网络类型",
        sdk_balance: "代币余额",
        sdk_height: "钱包高度",

        title_advance: "进阶功能",
        sdk_invoke: "合约读取",
        sdk_makeraw: "合约交易",
        sdk_notify: "确认通知",

        title_pay: "转账",
        sdk_transfer: "转账",
        sdk_gasmulti: "Gas批量转账",

        title_lang: "辅助[界面语言]",
        sdk_langcn: "中文",
        sdk_langen: "英文",
        sdk_langjp: "日文",

        title_icon: "辅助[图标]",
        sdk_iconshow: "显示",
        sdk_iconhidden: "隐藏",

        title_net: "辅助[网络]",
        sdk_net_main: "默认主网",
        sdk_net_test: "默认测试网",


        div_invoke_nnc: "nnc（合约地址）:",
        div_invoke_sbParamJson: "sbParamJson（合约参数）:",
        div_invoke_sbPushString: "sbPushString（合约方法）:",
        div_invoke_extString: "extString（透传参数）:",
        div_invoke_do: "读取",

        div_makeraw_nnc: "nnc（合约地址）:",
        div_makeraw_sbParamJson: "sbParamJson（合约参数）:",
        div_makeraw_sbPushString: "sbPushString（合约方法）:",
        div_makeraw_extString: "extString（透传参数）:",
        div_makeraw_do: "交易",

        div_confirm_txid: "txid（链上交易ID）:",
        div_confirm_do: "确认",

        div_transfer_type: "type(gas/neo/cgas/cneo)：",
        div_transfer_toaddr: "toaddr（转账地址）:",
        div_transfer_count: "count（转账数量）:",
        div_transfer_extString: "extString（透传参数）:",
        div_transfer_do: "转账",

        div_gasmulti_toaddr: "toaddr（转账地址）:",
        div_gasmulti_count: "count（转账数量）:",
        div_gasmulti_extString: "extString（透传参数）:",
        div_gasmulti_do: "转账",
    }
}

var VueApp = new Vue({
	el: "#app",
	data: {
		lang: langs[langbase.getLang()],
    },
    mounted: function() {
        this.changelang(langbase.getLang())
	},
	methods: {
		changelang: function (lang) {
			langbase.setLang(lang)
			this.lang = langs[lang];
		}
	}
})