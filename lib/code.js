var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var BlackCat;
(function (BlackCat) {
    var BC_scriptSrc = document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1].src;
    var BC_scriptName = BC_scriptSrc.split('/')[BC_scriptSrc.split('/').length - 1];
    var BC_path = BC_scriptSrc.replace(BC_scriptName, '');
    class Main {
        constructor() {
            Main.netMgr = new BlackCat.NetMgr();
            Main.user = new BlackCat.User();
            Main.wallet = new BlackCat.tools.wallet();
            Main.viewMgr = new BlackCat.ViewMgr();
            Main.langMgr = new BlackCat.LangMgr();
            Main.randNumber = parseInt((Math.random() * 10000000).toString());
            Main.urlHead = Main.getUrlHead();
            Main.apprefer = Main.getUrlParam('refer');
            Main.reset(0);
            Main.update_timeout_max = 5000;
            Main.update_timeout_min = 300;
            Main.isCreated = false;
            Main.isStart = false;
            Neo.Cryptography.RandomNumberGenerator.startCollectors();
        }
        static reset(type = 0) {
            Main.appWalletLogId = 0;
            Main.appWalletNotifyId = 0;
            Main.appNotifyTxids = {};
            Main.platWalletLogId = 0;
            Main.platWalletNotifyId = 0;
            Main.platNotifyTxids = {};
            Main.clearTimeout();
            if (type == 0) {
                Main.needGetAppNotifys = false;
                Main.needGetPlatNotifys = false;
            }
            else {
                Main.needGetAppNotifys = true;
                Main.needGetPlatNotifys = true;
            }
        }
        static clearTimeout() {
            if (Main.s_update) {
                clearTimeout(Main.s_update);
                Main.update();
            }
        }
        static getCGASBalanceByAddress(id_CGAS, address) {
            return __awaiter(this, void 0, void 0, function* () {
                return Main.getNep5BalanceByAddressNeo(id_CGAS, address, 100000000);
            });
        }
        static getCGAS_OLDBalanceByAddress(id_CGAS, address) {
            return __awaiter(this, void 0, void 0, function* () {
                return Main.getNep5BalanceByAddressNeo(id_CGAS, address, 100000000);
            });
        }
        static getCNEOBalanceByAddress(id_CNEO, address) {
            return __awaiter(this, void 0, void 0, function* () {
                return Main.getNep5BalanceByAddressNeo(id_CNEO, address, 100000000);
            });
        }
        static getCNEO_OLDBalanceByAddress(id_CNEO, address) {
            return __awaiter(this, void 0, void 0, function* () {
                return Main.getNep5BalanceByAddressNeo(id_CNEO, address, 100000000);
            });
        }
        static getNep5BalanceByAddressNeo(id_hash, address, bits = 100000000) {
            return __awaiter(this, void 0, void 0, function* () {
                if (id_hash == "") {
                    return 0;
                }
                var params = {
                    sbParamJson: ["(addr)" + address],
                    sbPushString: "balanceOf",
                    nnc: id_hash
                };
                try {
                    let res = yield Main.wallet.invokescript(params);
                    if (res.err == false) {
                        let data = res.info;
                        if (data["stack"] && data["stack"].length > 0) {
                            let balances = data["stack"][0];
                            let balance = new Neo.BigInteger(balances.value.hexToBytes()).toString();
                            return Number(balance) / bits;
                        }
                    }
                }
                catch (e) {
                    console.log("[BlaCat]", '[main]', '[getNep5BalanceByAddressNeo]', 'id_hash =>', id_hash, ', e =>', e);
                }
                return 0;
            });
        }
        init(listener, lang) {
            Main.callback = listener;
            Main.langMgr.setType(lang);
        }
        start(callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                Main.isStart = true;
                Main.loginFunctionCallback = callback;
                Main.viewMgr.mainView.createMask();
                if (Main.isCreated == false) {
                    Main.netMgr.changeChain(() => {
                        Main.viewMgr.iconView.showSucc();
                        Main.viewMgr.iconView.removeState();
                        Main.viewMgr.mainView.changNetType();
                        Main.update();
                        Main.isCreated = true;
                        Main.validateLogin();
                    });
                    return;
                }
                Main.validateLogin();
            });
        }
        setLang(type) {
            if (Main.langMgr.setType(type) === true) {
                Main.viewMgr.update();
            }
        }
        setDefaultNetType(type) {
            Main.netMgr.setDefaultNet(type);
        }
        lockNet() {
            Main.netMgr.lockNet();
        }
        showMain() {
            if (Main.viewMgr.mainView.div.innerHTML == "") {
                return;
            }
            if (Main.viewMgr.iconView) {
                Main.viewMgr.iconView.hidden();
            }
            Main.viewMgr.mainView.show();
        }
        showIcon() {
            if (Main.viewMgr.mainView.div.innerHTML == "") {
                return;
            }
            Main.viewMgr.mainView.hidden();
            Main.viewMgr.change("IconView");
        }
        getBalance(params, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                var callback_data = {};
                if (params && params.hasOwnProperty('type')) {
                    callback_data[params.type] = Main.viewMgr.payView[params.type];
                }
                else {
                    callback_data = {};
                    Main.netMgr.getChainCoins(Main.netMgr.getCurrChain()).forEach(coin => {
                        callback_data[coin] = Main.viewMgr.payView[coin];
                    });
                }
                BlackCat.sdkCallback.succ(callback_data, BlackCat.sdkCallback.getBalance, params, callback);
            });
        }
        getUserInfo(params, callback) {
            BlackCat.sdkCallback.succ(Main.user.info, BlackCat.sdkCallback.getUserInfo, params, callback);
        }
        getNetType(params, callback) {
            let net = Main.netMgr.getCurrNet();
            BlackCat.sdkCallback.succ(net, BlackCat.sdkCallback.getNetType, params, callback);
        }
        getHeight(params, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Main.viewMgr.payView.getHeight("nodes");
                if (Main.netMgr.getWWW().api_clis && Main.netMgr.getWWW().api_clis != "") {
                    yield Main.viewMgr.payView.getHeight("clis");
                }
                var callback_data = {
                    node: Main.viewMgr.payView.height_nodes,
                    cli: Main.viewMgr.payView.height_clis
                };
                BlackCat.sdkCallback.succ(callback_data, BlackCat.sdkCallback.getHeight, params, callback);
            });
        }
        invokescript(params, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                let res = yield Main.wallet.invokescript(params);
                BlackCat.sdkCallback.res(res, BlackCat.sdkCallback.invoke, params, callback);
            });
        }
        makeRawTransaction(params, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                yield BlackCat.RawTransaction.make(params, callback);
            });
        }
        makeTransfer(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                yield BlackCat.Transfer.make(params, callback);
            });
        }
        makeGasTransferMulti(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                yield BlackCat.TransferMultiGas.make(params, callback);
            });
        }
        confirmAppNotify(params, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                yield BlackCat.AppNotify.confirm(params, callback);
            });
        }
        static loginCallback() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!Main.isLoginCallback) {
                    Main.app_trust = [];
                    Main.isLoginCallback = true;
                    Main.needGetAppNotifys = true;
                    Main.needGetPlatNotifys = true;
                    Main.listenerCallback("loginRes", Main.user.info.wallet);
                    if (Main.loginFunctionCallback)
                        Main.loginFunctionCallback(Main.user.info.wallet);
                    console.log("[BlaCat]", '[main]', '[loginCallback]', '轮询平台notify和应用notify');
                }
            });
        }
        static setGameInfo(param) {
            Main.appname = param.name;
            Main.appicon = param.icon;
            Main.applang = param.lang;
            Main.app_recharge_addr = param.recharge_addr;
            if (param.hasOwnProperty('region')) {
                var appname = {};
                var appicon = {};
                for (let region in param.region) {
                    if (region == Main.langMgr.type) {
                        appname[region] = param.region[region]['name'];
                        appicon[region] = param.region[region]['icon'];
                    }
                }
                if (appname != {}) {
                    Main.appname = JSON.stringify(appname);
                }
                if (appicon != {}) {
                    Main.appicon = JSON.stringify(appicon);
                }
            }
            if (param.hasOwnProperty('coin')) {
                var appcoin = {};
                for (let icon in param.coin) {
                    appcoin[icon] = param.coin[icon];
                }
                if (appcoin != {}) {
                    Main.appcoin = JSON.stringify(appcoin);
                }
            }
        }
        isLogined() {
            return Main.isLoginCallback;
        }
        static logoutCallback() {
            return __awaiter(this, void 0, void 0, function* () {
                Main.isLoginCallback = false;
                Main.listenerCallback("logoutRes", null);
                Main.reset();
                if (Main.platLoginType === 1) {
                    window.history.back();
                }
            });
        }
        static listenerCallback(cmd, data) {
            return __awaiter(this, void 0, void 0, function* () {
                var callback_data = {
                    cmd: cmd,
                    data: data
                };
                Main.callback(JSON.stringify(callback_data));
            });
        }
        static update() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield Main.getNotifys();
                }
                catch (e) {
                    console.log("[BlaCat]", '[main]', '[update]', 'Main.getNotifys() error => ', e.toString());
                }
                if (Main.viewMgr.payView && Main.viewMgr.payView.isCreated && !Main.viewMgr.payView.isHidden()) {
                    try {
                        Main.viewMgr.payView.flushListCtm();
                    }
                    catch (e) {
                        console.log("[BlaCat]", '[main]', '[update]', 'Main.viewMgr.payView.flushListCtm() error => ', e.toString());
                    }
                }
                if (Main.liveTime && Main.liveTime > 0 && Main.liveTimeMax != 0) {
                    if (Main.isWalletOpen() == true) {
                        var cur_ts = new Date().getTime();
                        if (cur_ts - Main.liveTime > Main.liveTimeMax) {
                            Main.wallet.closeWallet();
                        }
                    }
                }
                var timeout = Main.update_timeout_min;
                if (Main.isLoginCallback) {
                    timeout = Main.update_timeout_max;
                }
                Main.s_update = setTimeout(() => { this.update(); }, timeout);
            });
        }
        static getRawTransaction(txid) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this['txid_' + txid] == null) {
                    try {
                        this['txid_' + txid] = txid;
                        var r = yield Main.netMgr.getWWW().api_getrawtransaction(txid);
                        if (r) {
                            BlackCat.WalletListLogs.update(txid, { state: "1", blockindex: r['blockindex'] });
                            Main.viewMgr.payView.doGetWalletLists(1);
                            let log = BlackCat.WalletListLogs.get(txid);
                            if (log.state == "1") {
                                if (log['sdk'] == "1") {
                                    Main.listenerCallback("getAppNotifysRes", [log]);
                                }
                                else {
                                    Main.doPlatNotify([log]);
                                }
                            }
                        }
                    }
                    catch (e) { }
                    this['txid_' + txid] = null;
                }
            });
        }
        static getNotifys() {
            let process = 0;
            let logs = BlackCat.WalletListLogs.get();
            if (logs.length > 0) {
                for (let k = logs.length - 1; k >= 0; k--) {
                    let log = logs[k];
                    if (log.state == "0") {
                        this.getRawTransaction(log.txid);
                        process += 1;
                    }
                }
            }
            Main.viewMgr.iconView.flushProcess(process);
        }
        static doPlatNotify(params) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("[BlaCat]", '[main]', '[doPlatNotify]', 'params => ', params);
                var openTask = null;
                for (let k in params) {
                    switch (params[k].type) {
                        case "2":
                            if (params[k].state == "1") {
                                if (params[k].ext) {
                                    Main.doPlatNotifyRefundRes(params[k], params[k].ext);
                                }
                                else {
                                    if (!Main.isWalletOpen()) {
                                        console.log("[BlaCat]", '[main]', '[doPlatNotify]', '退款(2)，钱包未打开，收集数据，进入队列');
                                        if (!openTask) {
                                            openTask = new Array();
                                        }
                                        openTask.push(params[k]);
                                        break;
                                    }
                                    Main.doPlatNotiyRefund(params[k]);
                                }
                            }
                            else {
                                this.confirmPlatNotify(params[k]);
                            }
                            break;
                    }
                }
                if (openTask) {
                    BlackCat.ViewConfirm.callback_params = openTask;
                    BlackCat.ViewConfirm.callback = (params) => {
                        BlackCat.ViewWalletOpen.callback_params = params;
                        BlackCat.ViewWalletOpen.callback = (params) => {
                            this.doPlatNotify(params);
                        };
                        BlackCat.ViewWalletOpen.callback_cancel = (params) => {
                            BlackCat.ViewWalletOpen.addTask("getPlatNotifys", params);
                        };
                        Main.viewMgr.change("ViewWalletOpen");
                    };
                    BlackCat.ViewConfirm.callback_cancel = (params) => {
                        BlackCat.ViewWalletOpen.addTask("getPlatNotifys", params);
                    };
                    Main.showConFirm("main_need_open_wallet_confirm");
                }
            });
        }
        static continueWithOpenWallet() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ViewConfirm.callback = () => {
                    BlackCat.ViewWalletOpen.refer = null;
                    BlackCat.ViewWalletOpen.callback = null;
                    Main.viewMgr.change("ViewWalletOpen");
                };
                Main.showConFirm("main_need_open_wallet_confirm");
            });
        }
        static doPlatNotiyRefund(params) {
            return __awaiter(this, void 0, void 0, function* () {
                var key = "cgas";
                for (let k in BlackCat.PayTransferView.log_type_detail) {
                    if (BlackCat.PayTransferView.log_type_detail[k] == params.type_detail) {
                        key = k;
                    }
                }
                var id_asset = Main.netMgr.getCoinTool().id_GAS;
                if (key == "cneo") {
                    id_asset = Main.netMgr.getCoinTool().id_NEO;
                }
                var id_asset_name = key.toUpperCase();
                var id_asset_nep5 = Main.netMgr.getCoinTool()["id_" + id_asset_name];
                var utxo = new BlackCat.tools.UTXO();
                utxo.addr = Main.user.info.wallet;
                utxo.txid = params.txid;
                utxo.asset = id_asset;
                utxo.count = Neo.Fixed8.parse(params.cnts.toString());
                utxo.n = 0;
                var utxos_assets = {};
                utxos_assets[id_asset] = [];
                utxos_assets[id_asset].push(utxo);
                console.log("[BlaCat]", '[main]', '[doPlatNotiyRefund]', 'utxos_assets => ', utxos_assets);
                try {
                    let net_fee = "0";
                    try {
                        let p = JSON.parse(params.params);
                        if (p.hasOwnProperty("net_fee")) {
                            net_fee = p.net_fee;
                        }
                    }
                    catch (e) {
                    }
                    if (id_asset_name == "CGAS") {
                        var refundcounts = Number(params.cnts) - Number(net_fee);
                        if (refundcounts < Number(net_fee)) {
                            var makeTranRes = Main.netMgr.getCoinTool().makeTran(utxos_assets, Main.user.info.wallet, id_asset, Neo.Fixed8.fromNumber(Number(params.cnts)));
                        }
                        else {
                            var makeTranRes = Main.netMgr.getCoinTool().makeTran(utxos_assets, Main.user.info.wallet, id_asset, Neo.Fixed8.fromNumber(Number(params.cnts) - Number(net_fee)), Neo.Fixed8.Zero, 1);
                        }
                    }
                    else {
                        var makeTranRes = Main.netMgr.getCoinTool().makeTran(utxos_assets, Main.user.info.wallet, id_asset, Neo.Fixed8.fromNumber(Number(params.cnts)));
                        if (Number(net_fee) > 0 && Main.viewMgr.payView.gas >= Number(net_fee)) {
                            try {
                                var user_utxos_assets = yield Main.netMgr.getCoinTool().getassets();
                                console.log("[BlaCat]", '[PayView]', '[doPlatNotiyRefund], user_utxos_assets => ', user_utxos_assets);
                                var user_makeTranRes = Main.netMgr.getCoinTool().makeTran(user_utxos_assets, Main.user.info.wallet, Main.netMgr.getCoinTool().id_GAS, Neo.Fixed8.Zero, Neo.Fixed8.fromNumber(Number(net_fee)));
                                var user_tran = user_makeTranRes.info.tran;
                                for (let i = 0; i < user_tran.inputs.length; i++) {
                                    makeTranRes.info.tran.inputs.push(user_tran.inputs[i]);
                                }
                                for (let i = 0; i < user_tran.outputs.length; i++) {
                                    makeTranRes.info.tran.outputs.push(user_tran.outputs[i]);
                                }
                                var user_oldarr = user_makeTranRes.info.oldarr;
                                for (let i = 0; i < user_oldarr.length; i++) {
                                    makeTranRes.info.oldarr.push(user_oldarr[i]);
                                }
                                console.log("[BlaCat]", '[PayView]', '[doPlatNotiyRefund]', 'user_makeTranRes => ', user_makeTranRes);
                            }
                            catch (e) {
                                let errmsg = Main.langMgr.get(e.message);
                                if (errmsg) {
                                    Main.showErrMsg((e.message));
                                }
                                else {
                                    Main.showErrMsg(("pay_makeMintGasNotEnough"));
                                }
                                return;
                            }
                        }
                    }
                }
                catch (e) {
                    Main.showErrMsg(("main_refund_second_" + id_asset_name + "_fail"));
                    return;
                }
                var tran = makeTranRes.info.tran;
                var oldarr = makeTranRes.info.oldarr;
                tran.type = ThinNeo.TransactionType.ContractTransaction;
                tran.version = 0;
                try {
                    let params_decode = JSON.parse(params.params);
                    if (params_decode && params_decode.hasOwnProperty("nnc")) {
                        id_asset_nep5 = params_decode.nnc;
                    }
                }
                catch (e) { }
                var r = yield Main.netMgr.getWWW().api_getcontractstate(id_asset_nep5);
                if (r && r["script"]) {
                    var Script = r["script"].hexToBytes();
                    var sb = new ThinNeo.ScriptBuilder();
                    sb.EmitPushNumber(new Neo.BigInteger(0));
                    sb.EmitPushNumber(new Neo.BigInteger(0));
                    tran.AddWitnessScript(Script, sb.ToArray());
                    var txid = "0x" + tran.GetHash().clone().reverse().toHexString();
                    var trandata = tran.GetRawData();
                    r = yield Main.netMgr.getWWW().api_postRawTransaction(trandata);
                    if (r) {
                        console.log("[BlaCat]", '[main]', '[doPlatNotiyRefund]', 'api_postRawTransaction.r => ', r);
                        if (r["txid"] || r['sendrawtransactionresult']) {
                            if (!r["txid"] || r["txid"] == "") {
                                r["txid"] = txid;
                            }
                            console.log("[BlaCat]", '[main]', '[doPlatNotiyRefund]', 'txid => ', r.txid);
                            var res = yield Main.confirmPlatNotifyExt(params, r.txid);
                            this.doPlatNotifyRefundRes(params, r.txid);
                            var height = yield Main.netMgr.getWWW().api_getHeight_nodes();
                            oldarr.map(old => old.height = height);
                            BlackCat.tools.OldUTXO.oldutxosPush(oldarr);
                            Main.viewMgr.payView.doGetWalletLists(1);
                        }
                        else {
                            Main.showErrMsg(("main_refund_doFail"));
                        }
                    }
                    else {
                        Main.showErrMsg(("main_refund_sendRequest_err"));
                    }
                }
                else {
                    Main.showErrMsg(("main_refund_getScript_err"));
                }
            });
        }
        static doPlatNotifyTransferRes(params, txid) {
            return __awaiter(this, void 0, void 0, function* () {
                var r = yield Main.netMgr.getWWW().api_getrawtransaction(txid);
                if (r) {
                    console.log("[BlaCat]", '[main]', '[doPlatNotifyTransferRes]', 'txid: ' + txid + ", r => ", r);
                    yield Main.confirmPlatNotify(params);
                    Main.viewMgr.payView.doGetWalletLists();
                }
                else {
                    setTimeout(() => {
                        this.doPlatNotifyTransferRes(params, txid);
                    }, 10000);
                }
            });
        }
        static doPlatNotifyRefundRes(params, txid) {
            return __awaiter(this, void 0, void 0, function* () {
                var r = yield Main.netMgr.getWWW().api_getrawtransaction(txid);
                if (r) {
                    console.log("[BlaCat]", '[main]', '[doPlatNotifyRefundRes]', 'txid: ' + txid + ", r => ", r);
                    yield Main.confirmPlatNotify(params);
                    Main.viewMgr.payView.doGetWalletLists();
                }
                else {
                    setTimeout(() => {
                        this.doPlatNotifyRefundRes(params, txid);
                    }, 10000);
                }
            });
        }
        static confirmPlatNotify(params) {
            return __awaiter(this, void 0, void 0, function* () {
                var res = yield BlackCat.ApiTool.walletNotify(params.txid);
                return res;
            });
        }
        static confirmPlatNotifyExt(params, ext) {
            return __awaiter(this, void 0, void 0, function* () {
                var res = yield BlackCat.ApiTool.walletNotifyExt(params.txid, ext);
                return res;
            });
        }
        static changeNetType(type) {
            Main.netMgr.changeNet(() => {
                Main.listenerCallback('changeNetTypeRes', type);
                Main.viewMgr.mainView.changNetType();
                Main.viewMgr.update();
                Main.reset(1);
            }, type);
        }
        static changeChainType(type, callback = null) {
            Main.netMgr.changeChain((chain, net) => {
                Main.listenerCallback('changeChainTypeRes', { chain: chain, net: net });
                Main.viewMgr.mainView.changNetType();
                Main.viewMgr.update();
                Main.reset(1);
                if (callback) {
                    try {
                        callback();
                    }
                    catch (e) { }
                }
            }, type);
        }
        static getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        }
        static validateLogin() {
            return __awaiter(this, void 0, void 0, function* () {
                let login = BlackCat.tools.LoginInfo.getCurrentLogin();
                if (login) {
                    Main.user.info.wallet = login.address;
                    Main.viewMgr.change("PayView");
                }
                else {
                    Main.viewMgr.change("WalletView");
                }
            });
        }
        static showErrCode(errCode, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                var msgId = "errCode_" + errCode.toString();
                var msg = Main.langMgr.get(msgId);
                if (msg == "") {
                    msgId = "errCode_default";
                    msg = Main.langMgr.get("errCode_default") + errCode;
                    this.showErrMsg(msgId, callback, { errCode: errCode });
                    return;
                }
                if (errCode == 100701) {
                    this.showErrMsg(msgId, () => {
                        Main.viewMgr.removeAll();
                        Main.viewMgr.change("LoginView");
                    });
                    Main.user.logout();
                    Main.logoutCallback();
                    return;
                }
                this.showErrMsg(msgId, callback);
            });
        }
        static showErrMsg(errMsgKey, callback = null, content_ext = null) {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ViewAlert.content = errMsgKey;
                BlackCat.ViewAlert.content_ext = content_ext;
                BlackCat.ViewAlert.callback = callback;
                Main.viewMgr.change("ViewAlert");
            });
        }
        static showToast(msgKey, showTime = 1500) {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ViewToast.content = msgKey;
                BlackCat.ViewToast.showTime = showTime;
                Main.viewMgr.change("ViewToast");
            });
        }
        static showInfo(msgKey, callback = null, content_ext = null) {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ViewAlert.content = msgKey;
                BlackCat.ViewAlert.content_ext = content_ext;
                BlackCat.ViewAlert.callback = callback;
                Main.viewMgr.change("ViewAlert");
            });
        }
        static showConFirm(msgKey) {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ViewConfirm.content = msgKey;
                Main.viewMgr.change("ViewConfirm");
            });
        }
        static showLoading(msgKey) {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.ViewLoading.content = msgKey;
                Main.viewMgr.change("ViewLoading");
            });
        }
        static isWalletOpen() {
            if (Main.wallet.isOpen() && Main.user.info.wallet == Main.wallet.wallet_addr) {
                return true;
            }
            return false;
        }
        static isLoginInit() {
            if (Main.netMgr.getWWW().api_nodes) {
                return false;
            }
            return true;
        }
        static validateFormat(type, inputElement) {
            return __awaiter(this, void 0, void 0, function* () {
                var regex;
                switch (type) {
                    case "user":
                        regex = /^[a-zA-Z0-9_]{4,16}$/;
                        break;
                    case "email":
                        regex = /^([0-9A-Za-z\-_\.]+)@([0-9A-Za-z]+\.[a-zA-Z]{2,3}(\.[a-zA-Z]{2})?)$/g;
                        break;
                    case "phone":
                        regex = /^\d{4,}$/;
                        break;
                    case "vcode":
                        regex = /^\d{6}$/;
                        break;
                    case "ETHWallet":
                        if (inputElement.value.length == 42) {
                            return true;
                        }
                        break;
                    case "BTCWallet":
                        if (inputElement.value.length == 34) {
                            return true;
                        }
                        break;
                    case "NEOWallet":
                    case "walletaddr":
                        let isAddress = BlackCat.tools.NNSTool.verifyAddr(inputElement.value);
                        if (isAddress) {
                            try {
                                if (BlackCat.tools.neotools.verifyPublicKey(inputElement.value)) {
                                    return true;
                                }
                            }
                            catch (e) {
                            }
                        }
                        else {
                            let isDomain = BlackCat.tools.NNSTool.verifyDomain(inputElement.value);
                            if (isDomain) {
                                try {
                                    inputElement.value = inputElement.value.toLowerCase();
                                    let addr = yield BlackCat.tools.NNSTool.resolveData(inputElement.value);
                                    if (addr) {
                                        return addr;
                                    }
                                }
                                catch (e) {
                                }
                            }
                        }
                        break;
                }
                if (regex) {
                    if (regex.test(inputElement.value)) {
                        return true;
                    }
                }
                Main.showErrMsg('main_' + type + '_format_err', () => {
                    inputElement.focus();
                });
                return false;
            });
        }
        static getDate(timeString) {
            if (timeString != "0" && timeString != "") {
                var date = new Date(parseInt(timeString) * 1000);
                var fmt = "yyyy-MM-dd hh:mm:ss";
                var o = {
                    "M+": date.getMonth() + 1,
                    "d+": date.getDate(),
                    "h+": date.getHours(),
                    "m+": date.getMinutes(),
                    "s+": date.getSeconds(),
                    "q+": Math.floor((date.getMonth() + 3) / 3),
                    S: date.getMilliseconds()
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1
                            ? o[k]
                            : ("00" + o[k]).substr(("" + o[k]).length));
                return fmt;
            }
            return "";
        }
        static getObjectClass(obj) {
            if (obj && obj.constructor && obj.constructor.toString()) {
                if (obj.constructor.name) {
                    return obj.constructor.name;
                }
                var str = obj.constructor.toString();
                if (str.charAt(0) == '[') {
                    var arr = str.match(/\[\w+\s*(\w+)\]/);
                }
                else {
                    var arr = str.match(/function\s*(\w+)/);
                }
                if (arr && arr.length == 2) {
                    return arr[1];
                }
            }
            return undefined;
        }
        ;
        static getUnTrustNnc(params) {
            var result = [];
            if (params.hasOwnProperty('nnc')) {
                params = [params];
            }
            if (params instanceof Array) {
                for (let i = 0; i < params.length; i++) {
                    if (params[i].hasOwnProperty('nnc')) {
                        let nnc = params[i]['nnc'];
                        if (Main.app_trust.length == 0) {
                            result.push(nnc);
                        }
                        else {
                            var isTrust = false;
                            for (let m = 0; m < Main.app_trust.length; m++) {
                                if (Main.app_trust[m] && nnc == Main.app_trust[m]['nnc']) {
                                    isTrust = true;
                                    break;
                                }
                            }
                            if (isTrust == false) {
                                result.push(nnc);
                            }
                        }
                    }
                }
            }
            return result;
        }
        static setLiveTime() {
            Main.liveTime = new Date().getTime();
        }
        static setLiveTimeMax(minutes) {
            Main.liveTimeMax = minutes * 60 * 1000;
        }
        static getLiveTimeMax() {
            return Main.liveTimeMax;
        }
        static getStringNumber(num) {
            let num_str = num.toString();
            if (num_str.indexOf('-') >= 0) {
                num_str = '0' + (num + 1).toString().substr(1);
            }
            return num_str;
        }
        static setTsOffset(loginParam) {
            let curr_ts = Math.round((new Date()).getTime() / 1000);
            Main.tsOffset = (curr_ts - loginParam.time) * 1000;
            console.log("[BlaCat]", '[Main]', '[setTsOffset]', 'tsOffset时间偏移(s) => ', Main.tsOffset / 1000);
        }
        static getUrlHead() {
            if (Main.urlHead === undefined) {
                if (window.location.protocol == "file:") {
                    Main.urlHead = "http:";
                }
                else {
                    Main.urlHead = "";
                }
            }
            return Main.urlHead;
        }
        static randomSort(arr, newArr) {
            if (arr.length == 1) {
                newArr.push(arr[0]);
                return newArr;
            }
            var random = Math.ceil(Math.random() * arr.length) - 1;
            newArr.push(arr[random]);
            arr.splice(random, 1);
            return Main.randomSort(arr, newArr);
        }
        static check() {
            var dev = "";
            if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                dev = "mobile";
            }
            else {
                dev = "pc";
            }
            return dev;
        }
        static in_array(search, array) {
            for (let k = 0; k < array.length; k++) {
                if (array[k] === search) {
                    return true;
                }
            }
            return false;
        }
        static getFeeConfig(chain) {
            try {
                let service_charge = JSON.parse(Main.user.info.service_charge);
                if (service_charge.hasOwnProperty(chain)) {
                    if (chain == 1) {
                        if (service_charge[chain] instanceof Array) {
                            return service_charge[chain];
                        }
                    }
                    else {
                        return service_charge[chain];
                    }
                }
            }
            catch (e) {
                console.log("[BlaCat]", "[main]", "[getFee]", 'error => ', e);
            }
            return chain == 1 ? ["0", "0"] : "0";
        }
        static hasEnoughFee(params, net_fee, chain) {
            switch (chain) {
                case 2:
                    if (Number(net_fee) == 0 || Main.viewMgr.payView.gas > Number(net_fee)) {
                        return true;
                    }
                    break;
            }
            return false;
        }
    }
    Main.platName = "BlaCat";
    Main.platLoginType = 0;
    Main.resHost = BC_path + "../";
    Main.appname = "";
    Main.liveTimeMax = 60 * 60 * 1000;
    BlackCat.Main = Main;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ComponentBase {
        objCreate(tag) {
            var addElement = document.createElement(tag);
            return addElement;
        }
        ObjAppend(o, tag) {
            o.appendChild(tag);
        }
        objRemove(o, tag) {
            o.removeChild(tag);
        }
        parentAdd(tag) {
            this.ObjAppend(BlackCat.Main.viewMgr.mainView.div, tag);
        }
        parentRemove(tag) {
            this.objRemove(BlackCat.Main.viewMgr.mainView.div, tag);
        }
        bodyAppend(tag) {
            document.body.appendChild(tag);
        }
        bodyRemove(tag) {
            document.body.removeChild(tag);
        }
    }
    BlackCat.ComponentBase = ComponentBase;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class NetFeeComponent {
        constructor(parentDiv, callback) {
            this.chain = BlackCat.Main.netMgr.getCurrChain();
            console.log("[BlaCat]", "[NetFeeComponent]", "[constructor]", 'chain => ', this.chain);
            switch (this.chain) {
                case 2:
                    this.netFeeComponet = new BlackCat.NetFeeComponentNeo(parentDiv, callback);
                    break;
            }
        }
        setFeeDefault(net_fee = BlackCat.Main.user.info.service_charge) {
            this.netFeeComponet.setFeeDefault(net_fee);
        }
        setNetFeeShowRate(rate = 1) {
            this.netFeeComponet.setNetFeeShowRate(rate);
        }
        setGasLimitMin(value) {
        }
        createDiv() {
            this.netFeeComponet.createDiv();
        }
        hidden() {
            this.netFeeComponet.hidden();
        }
        show() {
            this.netFeeComponet.show();
        }
    }
    BlackCat.NetFeeComponent = NetFeeComponent;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class NetFeeComponentNeo extends BlackCat.ComponentBase {
        constructor(parentDiv, callback) {
            console.log("[BlaCat]", "[NetFeeComponentNeo]", "[constructor]", 'start ...');
            super();
            this.parentDiv = parentDiv;
            this.callback = callback;
            this.net_fees = ["0", "0.001", "0.002", "0.004", "0.006", "0.008", "0.01", "0.1", "1"];
            this.net_fee = "0";
            this.net_fee_show_rate = 1;
        }
        setFeeDefault() {
            let net_fee = BlackCat.Main.user.info.service_charge;
            try {
                let service_charge = JSON.parse(net_fee);
                if (service_charge.hasOwnProperty("2")) {
                    net_fee = service_charge["2"].toString();
                }
            }
            catch (e) {
                net_fee = null;
            }
            if (net_fee == "0") {
                this.net_fee = "0";
            }
            else {
                this.net_fee = this.net_fees[0];
                if (net_fee) {
                    for (let i = 0; i < this.net_fees.length; i++) {
                        if (this.net_fees[i] == net_fee) {
                            this.net_fee = net_fee;
                            break;
                        }
                    }
                }
            }
        }
        setNetFeeShowRate(rate = 1) {
            if (rate != this.net_fee_show_rate) {
                this.net_fee_show_rate = rate;
                this.showNetFee();
            }
        }
        createDiv() {
            this.mainDiv = this.objCreate("div");
            this.mainDiv.classList.add("pc_speed");
            this.ObjAppend(this.parentDiv, this.mainDiv);
            var divChargeLength = this.objCreate("div");
            divChargeLength.classList.add("pc_chargelength");
            divChargeLength.innerHTML = BlackCat.Main.langMgr.get("pay_exchange_refund_range_tips");
            this.ObjAppend(this.mainDiv, divChargeLength);
            this.divSpeedLength = this.objCreate("div");
            this.divSpeedLength.classList.add("pc_speedlength");
            this.ObjAppend(divChargeLength, this.divSpeedLength);
            this.inputcharge = this.objCreate("input");
            this.inputcharge.type = "range";
            this.inputcharge.value = '0';
            this.inputcharge.max = (this.net_fees.length - 1).toString();
            this.inputcharge.oninput = () => {
                this.dospeed();
            };
            this.inputcharge.onclick = () => {
                this.dospeed();
            };
            this.ObjAppend(divChargeLength, this.inputcharge);
            this.divSpeedtips = this.objCreate("p");
            this.divSpeedtips.classList.add("pc_speedtips");
            this.ObjAppend(this.mainDiv, this.divSpeedtips);
            if (this.net_fee == "0") {
                this.dofree();
            }
            else {
                this.dospeed(this.net_fee);
            }
        }
        hidden() {
            this.mainDiv.style.display = "none";
            this.callback(0);
        }
        show() {
            this.mainDiv.style.display = "block";
            this.callback(this.net_fee);
        }
        getNetFeesIdx(net_fee) {
            let idx = undefined;
            for (let i = 0; i < this.net_fees.length; i++) {
                if (this.net_fees[i] == net_fee) {
                    return i;
                }
            }
            return idx;
        }
        dofree() {
            this.net_fee = "0";
            this.inputcharge.classList.remove("pc_active");
            this.showNetFee();
            this.callback(this.net_fee);
        }
        dospeed(net_fee = undefined) {
            if (net_fee != undefined) {
                let idx = this.getNetFeesIdx(net_fee);
                if (idx != undefined) {
                    this.inputcharge.value = idx;
                }
            }
            else {
                var idx = parseInt(this.inputcharge.value);
                if (this.net_fees[idx]) {
                    this.net_fee = this.net_fees[idx];
                }
                else {
                    this.net_fee = this.net_fees[0];
                }
            }
            this.inputcharge.classList.add("pc_active");
            this.showNetFee();
            this.callback(this.net_fee);
        }
        showNetFee() {
            let showNetFee = BlackCat.floatNum.times(Number(this.net_fee), this.net_fee_show_rate).toString();
            let chargelength = BlackCat.floatNum.times(BlackCat.floatNum.divide(this.mainDiv.clientWidth, this.net_fees.length - 1), this.getNetFeesIdx(this.net_fee));
            this.divSpeedLength.style.width = chargelength + "px";
            this.divSpeedtips.innerHTML = BlackCat.Main.langMgr.get("pay_exchange_refund_fee_tips", { NetFee: showNetFee });
        }
    }
    BlackCat.NetFeeComponentNeo = NetFeeComponentNeo;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class LangBase {
        get(key) {
            if (this.lang.hasOwnProperty(key)) {
                return this.lang[key];
            }
            return "";
        }
    }
    BlackCat.LangBase = LangBase;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class LangCN extends BlackCat.LangBase {
        constructor() {
            super(...arguments);
            this.lang = {
                return: "返回",
                copy: "复制",
                ok: "确定",
                cancel: "取消",
                more: "更多",
                info: "提示",
                content: "内容",
                retry: "重试",
                cgas: "CGAS",
                gas: "GAS",
                neo: "NEO",
                cneo: "CNEO",
                main_walletaddr_format_err: "钱包地址格式不正确！",
                main_ETHWallet_format_err: "ETH钱包地址格式错误！",
                main_BTCWallet_format_err: "BTC钱包地址格式错误！",
                main_NEOWallet_format_err: "NEO钱包地址格式错误！",
                personalcenter: "个人中心",
                myinfo_security: "安全中心",
                myinfo_set: "设置",
                myinfo_logout: "退出账号",
                myinfo_logoutConfirm: "确定要退出登录么",
                modifyNet: "网络线路",
                modifyNet_succ: "网络线路修改成功",
                modifyNet_node_err: "该网络线路不可用，请选择其他线路！",
                security_title: "安全中心",
                security_walletOut: "自动登出钱包",
                security_walletOut_admin: "永不",
                security_walletOut_admin_m: "%minutes% 分钟",
                security_walletOut_admin_h: "%hours% 小时",
                security_walletOut_toast: "当超过一定时间未操作钱包，将会自动登出，需要重新输入密码",
                paylist_txid: "交易单号：",
                paylist_wallet: "我的钱包：",
                paylist_nnc: "合约地址：",
                paylist_sbParamJson: "合约参数：",
                paylist_sbPushString: "合约方法：",
                paylist_sbPushString_none: "无",
                paylist_ctm_year: "%year%年前",
                paylist_ctm_month: "%month%月前",
                paylist_ctm_day: "%day%天前",
                paylist_ctm_hour: "%hour%小时前",
                paylist_ctm_minute: "%minute%分钟前",
                paylist_ctm_recent: "刚刚",
                paylist_noMore: "没有记录了",
                paylist_getMore: "点击加载更多记录",
                paylist_noRecord: "没有记录信息",
                pay_received: "收款",
                pc_receivables_download: "下载二维码",
                pc_receivables_address: "钱包地址",
                pc_receivables_copy: "复制成功",
                pay_transfer: "转账",
                pay_transferType: "代币：",
                pay_transferBalance: "余额：",
                pay_transferToAddr: "转账地址",
                pay_transferCount: "转账金额",
                pay_transferToAddrError: "转账地址错误",
                pay_transferCountError: "转账金额错误",
                pay_transferDoSucc: "转账操作成功",
                pay_transferDoFail: "转账失败！",
                pay_transferDoFailErr: "转账失败！%err%",
                pay_transferGasNotEnough: "GAS余额不足！",
                pay_transferBCPNotEnough: "BCP余额不足！",
                pay_transferBCTNotEnough: "BCT余额不足！",
                pay_transferNEONotEnough: "NEO余额不足！",
                pay_transferCNEONotEnough: "CNEO余额不足！",
                pay_transferCGASNotEnough: "CGAS余额不足！",
                pay_transferETHNotEnough: "ETH余额不足！",
                pay_transferBTCNotEnough: "BTC余额不足！",
                pay_wallet: "我的钱包",
                pay_refresh: "刷新",
                pay_wallet_detail: "详情",
                pay_coin_name: "代币",
                pay_coin_old: "CGAS(old)兑换",
                pay_chain_1: "BlaCat",
                pay_chain_2: "NEO",
                pay_gas: "GAS",
                pay_gas_desc_2: "GAS是NEO链上的数字货币，可以通过交易所获取",
                pay_gas_desc_1: "GAS是BlaCat映射",
                pay_cgas: "CGAS",
                pay_cgas_desc: "CGAS是BlaCat提供给玩家消费用的通用筹码",
                pay_neo: "NEO",
                pay_neo_desc_2: "NEO是NEO链上的数字货币，可以通过交易所获取",
                pay_neo_desc_1: "NEO是BlaCat映射",
                pay_cneo: "CNEO",
                pay_cneo_desc: "CNEO是BlaCat提供给玩家消费用的通用筹码",
                pay_bct_desc: "平台的流通代币，按固定汇率挂接法币（美元）",
                pay_bcp_desc: "平台的流通代币，按浮动汇率映射一篮子数字币",
                pay_btc: "BTC",
                pay_btc_desc: "可在平台内流通的映射代币（NEP5）",
                pay_eth: "ETH",
                pay_eth_desc: "可在平台内流通的映射代币（NEP5）",
                pay_send: "转账",
                pay_purchase: "购买",
                pay_purchase_testnet_cant_buy: "请切换到主网购买GAS！",
                pay_makeMint: "兑换",
                pay_recentLists: "交易中",
                pay_more: "记录",
                pay_makeMintGasNotEnough: "GAS余额不足",
                pay_makeMintNeoNotEnough: "NEO余额不足",
                pay_makeMintDoFail: "充值CGAS失败！\r\n充值合约执行失败！\r\n请等待上次充值确认后再操作！",
                pay_makeMintDoFail2: "充值CGAS失败！\r\n发送充值请求失败！请检查网络，稍候重试！",
                pay_makeRefundCgasNotEnoughUtxo: "CGAS兑换繁忙，请稍后重试！",
                pay_makeRefundCneoNotEnoughUtxo: "CNEO兑换繁忙，请稍后重试！",
                pay_makeRefundCgasNotEnough: "CGAS余额不足",
                pay_makeRefundCneoNotEnough: "CNEO余额不足",
                pay_makeRefundGasFeeNotEnough: "GAS余额不足，无法支付手续费！",
                pay_makeRefundGasLessThanFee: "兑换GAS的金额不能小于手续费！",
                pay_makeRefundDoFail: "提取合约执行失败！请等待上个提现或兑换交易完成再操作！",
                pay_makeRefundDoFail2: "发送提取交易失败！请检查网络，稍候重试！",
                pay_makeRefundGetScriptFail: "获取提取合约失败！",
                pay_makeRefundCgasOldNotEnough: "CGAS(old)余额不足",
                pay_makeRefundCneoOldNotEnough: "CNEO(old)余额不足",
                pay_makeMintGasUtxoCountsLimit: "资产块超出规定数量，需要自己给自己钱包转入%gas%数量的GAS才能继续操作。",
                pay_makeMintNeoUtxoCountsLimit: "资产块超出规定数量，需要自己给自己钱包转入%neo%数量的NEO才能继续操作。",
                pay_walletbtn: "钱包",
                pay_assets: "虚拟资产",
                pay_get: "获取",
                pay_not_enough_money: "余额不足",
                pay_not_enough_utxo: "请等待上次交易完成再执行！",
                pay_nettype_1: "主网",
                pay_nettype_2: "测试网",
                payview_process: "当前有<font color='red'>%count%</font>交易正在处理中",
                pay_walletDetail: "钱包详情",
                pay_walletDetail_addr: "地址：",
                pay_walletDetail_key: "公钥：",
                pay_walletDetail_hex: "密钥HEX：",
                pay_walletDetail_wif: "密钥WIF：",
                pay_walletDetail_notice: "为避免财产损失，展开密钥时请防止泄露。",
                pay_walletDetail_export: "导出钱包",
                pay_makerawtrans_err: "交易发起失败",
                pay_makerawtrans_fee_less: "网络费不足！%reason%",
                pay_makerawtrans_fee_less_gaslimit: "gasLimit值不能低于%gasLimit%",
                addressbook_title: "通讯录",
                addressbook_search: "搜索",
                addressbook_det_title: "通讯录",
                addressbook_det_transfer: "转账",
                addressbook_det_address: "钱包地址",
                addressbook_det_download: "下载二维码",
                addressbook_det_describe: "描述",
                addressbook_det_empty: "空",
                addressbook_det_del: "删除联系人",
                addressbook_det_del_title: "删除",
                addressbook_det_del_tips: "您确认删除联系人？",
                addressbook_det_del_succ: "删除成功",
                addressbook_op_button: "完成",
                addressbook_op_name: "联系人",
                addressbook_op_inputName: "输入联系人",
                addressbook_op_inputName_err: "请输入联系人",
                addressbook_op_address: "钱包地址",
                addressbook_op_inputAddress: "输入钱包地址",
                addressbook_op_inputAddress_err: "请输入钱包地址",
                addressbook_op_describe: "描述",
                addressbook_op_inputDescribe: "输入描述",
                addressbook_op_inputDescribe_err: "请输入描述",
                addressbook_op_addSucc: "联系人添加成功",
                addressbook_op_updateSucc: "联系人修改成功",
                pay_exchange_bct: "获取BCT",
                pay_exchange_cgas: "购买CGAS",
                pay_exchange_purchase: "购买",
                pay_exchange_price: "最新价",
                pay_exchange_balance: "余额",
                pay_exchange_balance_not_enough: "余额不足！",
                pay_exchange_range: "24H涨跌",
                pay_exchange_buy_ok: "提交成功！",
                pay_exchange_consumption: "消耗：",
                pay_exchange_placeholderconfirm: "输入购买数量",
                pay_exchange_confirmbuy: "确认购买",
                pay_exchange_purchase_process: "购买流程",
                pay_exchange_processp1: "1.以下是平台提供%type%钱包地址，请去各大交易所转入所需要的%type1%数量，转账成功后上方会显示您的%type2%余额",
                pay_exchange_refund_transfer: "提款",
                pay_exchange_refund_all: "全部",
                pay_exchange_refund_transCount_cost: "手续费：0.0001(BTC)",
                pay_exchange_refund_address: "收款地址",
                pay_exchange_refund_address_error: "收款地址错误！",
                pay_exchange_refund_amount: "提款金额",
                pay_exchange_refund_amount_error: "提款金额错误！",
                pay_exchange_refund_not_enough: "余额不足！",
                pay_exchange_refund_gas_fee_error: "GAS不足，无法支付手续费！",
                pay_exchange_refund_do_succ: "提款申请提交成功！",
                pay_exchange_refund_do_fail: "提款申请提交失败！",
                pay_exchange_refund_range_tips: "向右滑动加速",
                pay_exchange_refund_fee_tips: "收取%NetFee%gas网络费",
                pay_exchange_bcp: "获取BCP",
                pay_exchange_create_wallet_fail: "创建交易钱包失败，请稍候重试！",
                pay_exchange_detail_buy_CGAS_fail: "购买CGAS失败！",
                pay_exchange_detail_buy_BCP_fail: "购买BCP失败！",
                pay_exchange_buyNEO: "输入支付数量",
                pay_exchange_spent_not_enough: "数量太小，请调整数量！",
                pay_exchange_getmore: "获取%type%>>",
                pay_makeRecharge: "充值",
                pay_trust_tips: "信任合约",
                pay_trust_Vice_tips: "本合约交易不再弹出此窗口,如需更改手续费请前往设置界面",
                pay_transfer_toaddr: "转账地址",
                pay_transfer_count: "转账金额",
                pay_transCount_count: "兑换",
                pay_transCount_inputCount: "请输入需要兑换的金额",
                pay_transCount_err: "请输入正确的金额",
                pay_transCountGAS: "GAS：",
                pay_transCountCGAS: "CGAS：",
                pay_transCountCGASOLD: "CGAS(old)：",
                pay_transCountCGAS2GAS: "GAS",
                pay_transCountGAS2CGAS: "CGAS",
                pay_transCountCGASOLD2OLD: "CGAS(old)",
                pay_transCountNEO: "NEO：",
                pay_transCountCNEO: "CNEO：",
                pay_transCountCNEOOLD: "CNEO(old)：",
                pay_transCountCNEO2NEO: "NEO",
                pay_transCountNEO2CNEO: "CNEO",
                pay_transCountCNEOOLD2OLD: "CNEO(old)",
                pay_transCountTips_free: "免费",
                pay_transCountTips_slow: "慢",
                pay_transCountTips_fast: "快",
                pay_transCount_speed: "交易速度",
                pay_transCount_cost: "手续费：",
                pay_transCount_tips: "选择您要兑换的代币",
                pay_transCount_tips_err: "选择您要兑换的代币",
                pay_walletOpen_password: "密码",
                pay_walletOpen_inputPassword: "请输入钱包密码",
                pay_walletOpen_inputPassword_err: "请输入钱包密码",
                pay_walletOpen_file_error: "钱包文件解析异常，请重新登录",
                pay_walletOpen_openFail: "打开钱包失败！请确认密码后重试！",
                walletCreate_create: "创建钱包",
                walletCreate_password: "输入密码",
                walletCreate_vpass: "确认密码",
                walletCreate_password_notice: "*密码若丢失将无法找回，请谨慎保管",
                walletCreate_doCreate: "创建",
                walletCreate_check_pass: "请检查输入密码",
                walletCreate_check_vpass: "请检查确认密码",
                walletCreate_check_exceed: "设置密码不能超过32个字符",
                walletImport_invalid_file: "请选择有效的钱包文件",
                walletImport_select_file: "请选择钱包文件",
                walletImport_import: "导入钱包",
                walletImport_password: "请输入密码",
                walletImport_doImport: "导入钱包",
                walletImport_bind_succ: "导入钱包成功！",
                walletView_info: "做不一样，但好玩的游戏！",
                walletView_create: "创建钱包",
                walletView_import: "导入钱包",
                walletCreate_download: "下载钱包",
                walletCreate_doDownload: "下载",
                main_wait_for_last_tran: "请先确认或者取消上个交易请求再执行",
                main_no_app_wallet: "应用没有配置收款钱包地址，无法充值",
                main_need_open_wallet_confirm: "提现操作需要打开钱包，是否立即打开？",
                main_refund_CGAS_second_fail: "生成转换请求（utxo->gas）失败",
                main_refund_CNEO_second_fail: "生成转换请求（utxo->neo）失败",
                main_refund_getScript_err: "获取转换合约失败！",
                main_refund_sendRequest_err: "发送转换请求失败！",
                main_refund_doFail: "转换合约执行失败！",
                main_broker_deposit_second_fail: "交易所充值失败！",
                errCode_default: "未知错误！错误码： %errCode%",
                wallet_open_check: "请核对钱包文件或密码！",
                wallet_open_check_otcgo: "请核对蓝鲸淘钱包文件！",
                wallet_open_check_otcgo_pwd: "请核对蓝鲸淘钱包密码！",
                netmgr_select_api_slow: "与服务器连接异常或缓慢，请检查网络后重试！",
                netmgr_select_node_slow: "与链上节点通讯异常或缓慢，请检查网络后重试！",
                netmgr_select_cli_slow: "与链上节点通讯异常，请检查网络后重试！",
                netmgr_connecting: "连接中，请稍候...",
                netmgr_connecting_fail: "连接失败，请检查网络后重试。",
            };
        }
    }
    BlackCat.LangCN = LangCN;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class LangEN extends BlackCat.LangBase {
        constructor() {
            super(...arguments);
            this.lang = {
                return: "Back",
                copy: "Copy",
                ok: "OK",
                cancel: "Cancel",
                more: "More",
                info: "Information",
                content: "Content",
                retry: "Retry",
                cgas: "CGAS",
                gas: "GAS",
                neo: "NEO",
                cneo: "CNEO",
                main_walletaddr_format_err: "Wallet address format is incorrect!",
                main_ETHWallet_format_err: "ETH Wallet address format is incorrect!",
                main_BTCWallet_format_err: "BTC Wallet address format is incorrect!",
                main_NEOWallet_format_err: "NEO Wallet address format is incorrect!",
                personalcenter: "My Info",
                myinfo_security: "Security Center",
                myinfo_set: "Set",
                myinfo_logout: "Logout",
                myinfo_logoutConfirm: "Are you sure to log out?",
                modifyNet: "Network line",
                modifyNet_succ: "Network line modified successfully!",
                modifyNet_node_err: "This network line is not available, please choose another line!",
                security_title: "Security Center",
                security_walletOut: "Automatically log out",
                security_walletOut_admin: "Never",
                security_walletOut_admin_m: "%minutes% minute(s)",
                security_walletOut_admin_h: "%hours% hour(s)",
                security_walletOut_toast: "When the wallet is not operated for more than a certain period of time, it will be automatically logged out and the password needs to be re-inputted",
                paylist_txid: "Trading order number:",
                paylist_wallet: "My wallet:",
                paylist_nnc: "Contract address:",
                paylist_sbParamJson: "Contract parameters:",
                paylist_sbPushString: "Contract method:",
                paylist_sbPushString_none: "None",
                paylist_ctm_year: "%year% year(s) ago",
                paylist_ctm_month: "%month% month(s) ago",
                paylist_ctm_day: "%day% day(s) ago",
                paylist_ctm_hour: "%hour% hour(s) ago",
                paylist_ctm_minute: "%minute% minute(s) ago",
                paylist_ctm_recent: "Just now",
                paylist_noMore: "No more records",
                paylist_getMore: "Click to load more records",
                paylist_noRecord: "No record",
                pay_received: "Receive",
                pc_receivables_download: "Download QR Code",
                pc_receivables_address: "Wallet address",
                pc_receivables_copy: "Copy success",
                pay_transfer: "SEND",
                pay_transferType: "Token：",
                pay_transferBalance: "Balance:",
                pay_transferToAddr: "Address",
                pay_transferCount: "Amounts",
                pay_transferToAddrError: "The SEND address is incorrect!",
                pay_transferCountError: "The number of SEND is incorrect!",
                pay_transferDoSucc: "SEND success",
                pay_transferDoFail: "SEND failed!",
                pay_transferDoFailErr: "SEND failed!%err%",
                pay_transferGasNotEnough: "GAS balance is insufficient!",
                pay_transferBCPNotEnough: "BCP balance is insufficient!",
                pay_transferBCTNotEnough: "BCT balance is insufficient!",
                pay_transferNEONotEnough: "NEO balance is insufficient!",
                pay_transferCNEONotEnough: "CNEO balance is insufficient!",
                pay_transferCGASNotEnough: "CGAS balance is insufficient!",
                pay_transferETHNotEnough: "ETH balance is insufficient!",
                pay_transferBTCNotEnough: "BTC balance is insufficient!",
                pay_wallet: "My Wallet",
                pay_refresh: "Refresh",
                pay_wallet_detail: "Details",
                pay_coin_name: "Token",
                pay_coin_old: "CGAS(old)Exchange",
                pay_chain_1: "BlaCat",
                pay_chain_2: "NEO",
                pay_gas: "GAS",
                pay_gas_desc_2: "GAS is a digital currency on NEO chain that can be obtained through exchanges",
                pay_gas_desc_1: "GAS是BlaCat映射",
                pay_cgas: "CGAS",
                pay_cgas_desc: "CGAS is a universal chip that BlaCat offers to players.",
                pay_neo: "NEO",
                pay_neo_desc_2: "NEO is the digital currency in NEO blockchain and can be bought in Exchange",
                pay_neo_desc_1: "NEO是BlaCat映射",
                pay_cneo: "CNEO",
                pay_cneo_desc: "CNEO is the universal token provided by BlaCat to player",
                pay_bct_desc: "The circulation token of the platform will be attached at the legal currency (US dollar) at a fixed exchange rate",
                pay_bcp_desc: "The circulation token of the platform will map a basket of digital currency at a floating exchange rate",
                pay_btc: "BTC",
                pay_btc_desc: "Mapping tokens (NEP5) that can be circulated within the platform",
                pay_eth: "ETH",
                pay_eth_desc: "Mapping tokens (NEP5) that can be circulated within the platform",
                pay_send: "SEND",
                pay_purchase: "Purchase",
                pay_purchase_testnet_cant_buy: "Please switch Mainnet to buy GAS!",
                pay_makeMint: "Exchange",
                pay_recentLists: "Pending",
                pay_more: "Records",
                pay_makeMintGasNotEnough: "GAS balance is insufficient",
                pay_makeMintNeoNotEnough: "NEO balance is insufficient",
                pay_makeMintDoFail: "Recharge CGAS failed!\r\n Recharge contract execution failed!\r\nPlease wait for the last recharge confirmation before proceeding!",
                pay_makeMintDoFail2: "Recharge CGAS failed! \r\nFailed to send recharge request! Please check network and try again later!",
                pay_makeRefundCgasNotEnoughUtxo: "CGAS exchange is busy, please try it again later!",
                pay_makeRefundCneoNotEnoughUtxo: "CNEO exchange is busy, please try it again later!",
                pay_makeRefundCgasNotEnough: "CGAS balance is insufficient",
                pay_makeRefundCneoNotEnough: "CNEO balance is insufficient",
                pay_makeRefundGasFeeNotEnough: "GAS balance is insufficient.",
                pay_makeRefundGasLessThanFee: "The amount of GAS cannot be less than the handling fee.",
                pay_makeRefundDoFail: "The extraction contract execution failed! Please wait for the last withdrawal or redemption transaction to complete!",
                pay_makeRefundDoFail2: "Sending an extraction transaction failed! Please check network and try again later!",
                pay_makeRefundGetScriptFail: "Getting extraction contract failed!",
                pay_makeRefundCgasOldNotEnough: "CGAS(old) balance is insufficient",
                pay_makeRefundCneoOldNotEnough: "CNEO(old) balance is insufficient",
                pay_makeMintGasUtxoCountsLimit: "Assets exceed the maximum, please input your wallet address then transfer %gas% GAS to your own wallet first.",
                pay_makeMintNeoUtxoCountsLimit: "Assets exceed the maximum, please input your wallet address then transfer %neo% NEO to your own wallet first.",
                pay_walletbtn: "Wallet",
                pay_assets: "Assets",
                pay_get: "Get",
                pay_not_enough_money: "Insufficient balance",
                pay_not_enough_utxo: "Please wait for the last transaction to complete before executing!",
                pay_nettype_1: "Mainnet",
                pay_nettype_2: "Testnet",
                payview_process: "<font color='red'>%count%</font> trans in progress",
                pay_walletDetail: "Wallet details",
                pay_walletDetail_addr: "Address:",
                pay_walletDetail_key: "Public Key:",
                pay_walletDetail_hex: "KEY HEX:",
                pay_walletDetail_wif: "KEY WIF:",
                pay_walletDetail_notice: "To avoid property damage, please prevent leakage when you open the key.",
                pay_walletDetail_export: "Export wallet",
                pay_makerawtrans_err: "Transaction failed!",
                pay_makerawtrans_fee_less: "Insufficient internet handling fee!%reason%",
                pay_makerawtrans_fee_less_gaslimit: "gasLimit no less than %gasLimit%",
                addressbook_title: "Mail list",
                addressbook_search: "Search",
                addressbook_det_title: "Mail list",
                addressbook_det_transfer: "Transfer",
                addressbook_det_address: "Wallet address",
                addressbook_det_download: "Download QR Code",
                addressbook_det_describe: "Describe",
                addressbook_det_empty: "Empty",
                addressbook_det_del: "Delete Contact",
                addressbook_det_del_title: "Delete",
                addressbook_det_del_tips: "Confirm to delete this contact?",
                addressbook_det_del_succ: "Delete success",
                addressbook_op_button: "Complete",
                addressbook_op_name: "Contacts",
                addressbook_op_inputName: "Please input Contacts",
                addressbook_op_inputName_err: "Please input Contacts",
                addressbook_op_address: "Wallet address",
                addressbook_op_inputAddress: "Please input wallet address",
                addressbook_op_inputAddress_err: "Please input wallet address",
                addressbook_op_describe: "Describe",
                addressbook_op_inputDescribe: "Please input Describe",
                addressbook_op_inputDescribe_err: "Please input Describe",
                addressbook_op_addSucc: "Contact added success",
                addressbook_op_updateSucc: "Contact modify success",
                pay_exchange_bct: "Get BCT",
                pay_exchange_cgas: "Get CGAS",
                pay_exchange_purchase: "Purchase",
                pay_exchange_price: "Latest price",
                pay_exchange_balance: "Balance",
                pay_exchange_balance_not_enough: "balance is insufficient!",
                pay_exchange_range: "24H Range",
                pay_exchange_buy_ok: "Succeeded!",
                pay_exchange_consumption: " consumption：",
                pay_exchange_placeholderconfirm: "Please confirm your purchase",
                pay_exchange_confirmbuy: "Confirm",
                pay_exchange_purchase_process: "Purchase process",
                pay_exchange_processp1: "1.%type% address provided by platform can be found below. Please transfer the corresponding %type1% to the account in Exchange then the system will show your %type2% balance.",
                pay_exchange_refund_transfer: "Withdraw",
                pay_exchange_refund_all: "All",
                pay_exchange_refund_transCount_cost: "Transfer Cost: 0.0001(NEO)",
                pay_exchange_refund_address: "Address",
                pay_exchange_refund_address_error: "Address is wrong！",
                pay_exchange_refund_amount: "Amount",
                pay_exchange_refund_amount_error: "The withdrawal amount is wrong！",
                pay_exchange_refund_not_enough: "Insufficient balance！",
                pay_exchange_refund_gas_fee_error: "Insufficient GAS for handling fee！",
                pay_exchange_refund_do_succ: "Application succeeded！",
                pay_exchange_refund_do_fail: "Application failed！",
                pay_exchange_refund_range_tips: "Slide to the right to accelerate",
                pay_exchange_refund_fee_tips: "%NetFee% GAS for handling fee",
                pay_exchange_bcp: "Get BCP",
                pay_exchange_create_wallet_fail: "Failed to create a trading wallet, please try it later!",
                pay_exchange_detail_buy_CGAS_fail: "Fail to buy CGAS!",
                pay_exchange_detail_buy_BCP_fail: "Fail to buy BCP!",
                pay_exchange_buyNEO: "Please input the purchase amount",
                pay_exchange_spent_not_enough: "Incorrect amount!",
                pay_exchange_getmore: "Get %type%>>",
                pay_makeRecharge: "Recharge",
                pay_trust_tips: "Trust contracts",
                pay_trust_Vice_tips: "Window will not pop up in this trade, please change handling fee in page My information.",
                pay_transfer_toaddr: "transfer address",
                pay_transfer_count: "Transfer amounts",
                pay_transCount_count: "Exchange",
                pay_transCount_inputCount: "Please input amount",
                pay_transCount_err: "Please input correct sums of amounts",
                pay_transCountGAS: "GAS:",
                pay_transCountCGAS: "CGAS:",
                pay_transCountCGASOLD: "CGAS(old):",
                pay_transCountCGAS2GAS: "GAS",
                pay_transCountGAS2CGAS: "CGAS",
                pay_transCountCGASOLD2OLD: "CGAS(old)",
                pay_transCountNEO: "NEO：",
                pay_transCountCNEO: "CNEO：",
                pay_transCountCNEOOLD: "CNEO(old)：",
                pay_transCountCNEO2NEO: "NEO",
                pay_transCountNEO2CNEO: "CNEO",
                pay_transCountCNEOOLD2OLD: "CNEO(old)",
                pay_transCountTips_free: "Free",
                pay_transCountTips_slow: "Slow",
                pay_transCountTips_fast: "Fast",
                pay_transCount_speed: "Trade SPD",
                pay_transCount_cost: "Fee：",
                pay_transCount_tips: "Choose the token you want to exchange",
                pay_transCount_tips_err: "Choose the token you want to exchange",
                pay_walletOpen_password: "password",
                pay_walletOpen_inputPassword: "wallet password",
                pay_walletOpen_inputPassword_err: "Please enter the wallet password",
                pay_walletOpen_file_error: "Wallet file parsing is abnormal, please log in again",
                pay_walletOpen_openFail: "Fail to open wallet!Please try it again!",
                walletCreate_create: "Create a wallet",
                walletCreate_password: "enter password",
                walletCreate_vpass: "confirm password",
                walletCreate_password_notice: "*Password can not be retrieved. Please keep it carefully.",
                walletCreate_doCreate: "Create",
                walletCreate_check_pass: "Please check the input password",
                walletCreate_check_vpass: "Please check the confirmation password",
                walletCreate_check_exceed: "Please set your password within 32 letters",
                walletImport_invalid_file: "Please select a valid wallet file",
                walletImport_select_file: "Please select the wallet file",
                walletImport_import: "Import wallet",
                walletImport_password: "Please enter the password",
                walletImport_doImport: "Import",
                walletImport_bind_succ: "Import the wallet successfully!",
                walletView_info: "Do a game different and fun!",
                walletView_create: "Create Wallet",
                walletView_import: "Import Wallet",
                walletCreate_download: "Download Wallet",
                walletCreate_doDownload: "download",
                main_wait_for_last_tran: "Please confirm or cancel the previous transaction request and then execute",
                main_no_app_wallet: "The app does not have a billing wallet address configured and cannot be recharged.",
                main_need_open_wallet_confirm: "The withdrawal operation needs to open the wallet, is it open immediately? ",
                main_refund_CGAS_second_fail: "Generate conversion request (utxo->gas) failed",
                main_refund_CNEO_second_fail: "Generate conversion request (utxo->neo) failed",
                main_refund_getScript_err: "Failed to get conversion contract!",
                main_refund_sendRequest_err: "Sending a conversion request failed!",
                main_refund_doFail: "Conversion contract execution failed!",
                main_broker_deposit_second_fail: "Recharge failed！",
                errCode_default: "Unknown error! Error code: %errCode%",
                wallet_open_check: "Please check your wallet file or password!",
                wallet_open_check_otcgo: "Please check the Otcgo wallet file!",
                wallet_open_check_otcgo_pwd: "Please check the Otcgo wallet password!",
                netmgr_select_api_slow: "Connection to the server is abnormal or slow, please check the network and try it again!",
                netmgr_select_node_slow: "Communication with the nodes on the chain is abnormal or slow, please check the network and try it later!",
                netmgr_select_cli_slow: "Communication with the nodes on the chain is abnormal, please check the network and try it later!",
                netmgr_connecting: "Connecting ...",
                netmgr_connecting_fail: "Connection failed. Please check the network and try it again!",
            };
        }
    }
    BlackCat.LangEN = LangEN;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class LangJP extends BlackCat.LangBase {
        constructor() {
            super(...arguments);
            this.lang = {
                return: "戻る",
                copy: "コピー",
                ok: "確認",
                cancel: "キャンセル",
                more: "モット",
                info: "インフォ",
                content: "内容",
                retry: "再び",
                cgas: "CGAS",
                gas: "GAS",
                neo: "NEO",
                cneo: "CNEO",
                main_walletaddr_format_err: "無効なウォレット！",
                main_ETHWallet_format_err: "無効ETHなウォレット！",
                main_BTCWallet_format_err: "無効BTCなウォレット！",
                main_NEOWallet_format_err: "無効NEOなウォレット！",
                personalcenter: "インフォセンター",
                myinfo_security: "安全センター",
                myinfo_set: "設定",
                myinfo_logout: "ログアウト",
                myinfo_logoutConfirm: "ログアウト確認",
                modifyNet: "ネットライン",
                modifyNet_succ: "設定完了",
                modifyNet_node_err: "ネットラインエラー、他のネットラインを選んでください！",
                security_title: "安全センター",
                security_walletOut: "自動ログアウト",
                security_walletOut_admin: "永遠",
                security_walletOut_admin_m: "%minutes% 分",
                security_walletOut_admin_h: "%hours% 時間",
                security_walletOut_toast: "一定時間、何も操作されないときに、ウォレットは自動的にログアウトされ、パスワードを再入力する必要があります",
                paylist_txid: "注文番号：",
                paylist_wallet: "マイウォレット：",
                paylist_nnc: "契約アドレス：",
                paylist_sbParamJson: "契約パラメータ：",
                paylist_sbPushString: "契約方法：",
                paylist_sbPushString_none: "無し",
                paylist_ctm_year: "%year%年前",
                paylist_ctm_month: "%month%月前",
                paylist_ctm_day: "%day%天前",
                paylist_ctm_hour: "%hour%時前",
                paylist_ctm_minute: "%minute%分前",
                paylist_ctm_recent: "さっき",
                paylist_noMore: "記録無し",
                paylist_getMore: "読み込む",
                paylist_noRecord: "記録無し",
                pay_received: "お預入れ",
                pc_receivables_download: "QRコード",
                pc_receivables_address: "ウォレットアドレス",
                pc_receivables_copy: "コピー完了",
                pay_transfer: "お引出し",
                pay_transferType: "トークン：",
                pay_transferBalance: "残高：",
                pay_transferToAddr: "アドレス",
                pay_transferCount: "金額",
                pay_transferToAddrError: "アドレスエラー",
                pay_transferCountError: "金額エラー",
                pay_transferDoSucc: "完了",
                pay_transferDoFail: "失敗!",
                pay_transferDoFailErr: "失敗!%err%",
                pay_transferGasNotEnough: "GAS残高不足!",
                pay_transferBCPNotEnough: "BCP残高不足!",
                pay_transferBCTNotEnough: "BCT残高不足!",
                pay_transferNEONotEnough: "NEO残高不足!",
                pay_transferCNEONotEnough: "CNEO残高不足!",
                pay_transferCGASNotEnough: "CGAS残高不足!",
                pay_transferETHNotEnough: "ETH残高不足!",
                pay_transferBTCNotEnough: "BTC残高不足!",
                pay_wallet: "マイウォレット",
                pay_refresh: "リフレッシュ",
                pay_wallet_detail: "詳しい",
                pay_coin_name: "トークン",
                pay_coin_old: "CGAS(old)為替",
                pay_chain_1: "BlaCat",
                pay_chain_2: "NEO",
                pay_gas: "GAS",
                pay_gas_desc_2: "GASはNEOブッロクチェーンの仮想通貨です、取引所から手に入れることができます",
                pay_gas_desc_1: "GAS是BlaCat映射",
                pay_cgas: "CGAS",
                pay_cgas_desc: "CGASはBlaCat提供されたトークンです",
                pay_neo: "NEO",
                pay_neo_desc_2: "NEOはNEOブロックチェーンのデジタル通貨であり、取引所で購入することができます",
                pay_neo_desc_1: "NEO是BlaCat映射",
                pay_cneo: "CNEO",
                pay_cneo_desc: "CNEOは、BlaCatがプレーヤーに提供するユニバーサルトークンです",
                pay_bct_desc: "プラットフォーム内のトークンは固定為替レートで合法通貨（USD）に両替されています",
                pay_bcp_desc: "プラットフォーム内のトークンは変動為替レートでバスケットのデジタル通貨をマッピングします",
                pay_btc: "BTC",
                pay_btc_desc: "プラットフォーム内で流通できるトークン（NEP5）",
                pay_eth: "ETH",
                pay_eth_desc: "プラットフォーム内で流通できるトークン（NEP5）",
                pay_send: "お引出し",
                pay_purchase: "買う",
                pay_purchase_testnet_cant_buy: "メインネットにスウィッチしてGASを買ってください！",
                pay_makeMint: "為替",
                pay_recentLists: "取引",
                pay_more: "記録",
                pay_makeMintGasNotEnough: "GAS残高不足",
                pay_makeMintNeoNotEnough: "NEO残高不足",
                pay_makeMintDoFail: "CGAリチャージ失敗！\r\nリチャージ契約エラー！\r\n前のリチャージを確認していて、少々お待ちください！",
                pay_makeMintDoFail2: "CGASリチャージ失敗！\r\nリチャージリクエストエラー！後でもう一度試してください！",
                pay_makeRefundCgasNotEnoughUtxo: "CGAS為替、後でもう一度試してください！",
                pay_makeRefundCneoNotEnoughUtxo: "CNEO為替、後でもう一度試してください！",
                pay_makeRefundCgasNotEnough: "CGAS残高不足",
                pay_makeRefundCneoNotEnough: "CNEO残高不足",
                pay_makeRefundGasFeeNotEnough: "GAS残高不足、手数料の支払いエラー！",
                pay_makeRefundGasLessThanFee: "GASの為替金額より少なくなることはできません！",
                pay_makeRefundDoFail: "引き抜き契約失敗！前のお引出しや為替を確認していて、少々お待ちください！",
                pay_makeRefundDoFail2: "引き抜き契約失敗！ネットをチェックして、もう一度試してください！",
                pay_makeRefundGetScriptFail: "引き抜き契約失敗！",
                pay_makeRefundCgasOldNotEnough: "CGAS(old)残高不足",
                pay_makeRefundCneoOldNotEnough: "CNEO(old)残高不足",
                pay_makeMintGasUtxoCountsLimit: "資産ブロックは規定量を超えて、自らで自分のウォレットに%gas%GASを引き出してください",
                pay_makeMintNeoUtxoCountsLimit: "資産ブロックは規定量を超えて、自らで自分のウォレットに%neo%NEOを引き出してください",
                pay_walletbtn: "ウォレット",
                pay_assets: "仮想資産",
                pay_get: "ゲット",
                pay_not_enough_money: "残高不足",
                pay_not_enough_utxo: "前の商売を成功した後でもう一度試してください！",
                pay_nettype_1: "メインネット",
                pay_nettype_2: "テストネット",
                payview_process: "当前有<font color='red'>%count%</font>交易正在处理中",
                pay_walletDetail: "詳しいウォレット",
                pay_walletDetail_addr: "アドレス：",
                pay_walletDetail_key: "公開鍵：",
                pay_walletDetail_hex: "秘密鍵HEX：",
                pay_walletDetail_wif: "秘密鍵WIF：",
                pay_walletDetail_notice: "秘密鍵を大切に保管しておく必要があります",
                pay_walletDetail_export: "ウォレットをダウンロードする",
                pay_makerawtrans_err: "商売失敗",
                pay_makerawtrans_fee_less: "インターネット料金は不足！%reason%",
                pay_makerawtrans_fee_less_gaslimit: "gasLimitの最低値は %gasLimit%",
                addressbook_title: "連絡先",
                addressbook_search: "捜査",
                addressbook_det_title: "連絡先",
                addressbook_det_transfer: "お預入れ",
                addressbook_det_address: "ウォレットアドレス",
                addressbook_det_download: "QRコード",
                addressbook_det_describe: "インフォ",
                addressbook_det_empty: "無し",
                addressbook_det_del: "削除する",
                addressbook_det_del_title: "削除する",
                addressbook_det_del_tips: "削除しますか？",
                addressbook_det_del_succ: "完了",
                addressbook_op_button: "完了",
                addressbook_op_name: "連絡先",
                addressbook_op_inputName: "連絡先を入力してください",
                addressbook_op_inputName_err: "連絡先を入力してください",
                addressbook_op_address: "ウォレットアドレス",
                addressbook_op_inputAddress: "ウォレットアドレスを入力してください",
                addressbook_op_inputAddress_err: "ウォレットアドレスを入力してください",
                addressbook_op_describe: "インフォ",
                addressbook_op_inputDescribe: "インフォを入力してください",
                addressbook_op_inputDescribe_err: "インフォを入力してください",
                addressbook_op_addSucc: "完了",
                addressbook_op_updateSucc: "完了",
                pay_exchange_bct: "ゲットBCT",
                pay_exchange_cgas: "ゲットCGAS",
                pay_exchange_purchase: "買う",
                pay_exchange_price: "今価格",
                pay_exchange_balance: "残高",
                pay_exchange_balance_not_enough: "残高不足！",
                pay_exchange_range: "24H価額",
                pay_exchange_buy_ok: "完了！",
                pay_exchange_consumption: " 消耗：",
                pay_exchange_placeholderconfirm: "取引数量を確認してください",
                pay_exchange_confirmbuy: "確認",
                pay_exchange_purchase_process: "取引プロセス",
                pay_exchange_processp1: "1.BlaCatによって提供される%type%ウォレットアドレスは以下にあります。 対応する%type1%を取引所のアカウントに転送してください。その後、システムは自動に%type2%の残高が表示されます。",
                pay_exchange_refund_transfer: "引き出し",
                pay_exchange_refund_all: "すべて",
                pay_exchange_refund_transCount_cost: "手数料：0.0001（BTC）",
                pay_exchange_refund_address: "アドレス",
                pay_exchange_refund_address_error: "アドレスが間違っています！",
                pay_exchange_refund_amount: "引き出し金額",
                pay_exchange_refund_amount_error: "引き出し金額が間違っています！",
                pay_exchange_refund_not_enough: "残高不足！",
                pay_exchange_refund_gas_fee_error: "手数料を支払うのにGASが足りません！",
                pay_exchange_refund_do_succ: "申し込みは成功しました！",
                pay_exchange_refund_do_fail: "申し込みが失敗しました！",
                pay_exchange_refund_range_tips: "右にスライドして加速する",
                pay_exchange_refund_fee_tips: "手数料は%NetFee% GASです",
                pay_exchange_bcp: "ゲットBCP",
                pay_exchange_create_wallet_fail: "取引ウォレットを作成できません。しばらくしてからもう一度お試しください！",
                pay_exchange_detail_buy_CGAS_fail: "CGAS購買に失敗した！",
                pay_exchange_detail_buy_BCP_fail: "BCP購買に失敗した！",
                pay_exchange_buyNEO: "購買数量を入力してください",
                pay_exchange_spent_not_enough: "正しい数量を入力してください！",
                pay_exchange_getmore: "%type%をゲット>>",
                pay_makeRecharge: "リチャージ",
                pay_trust_tips: "クレジット契約",
                pay_trust_Vice_tips: "この窓は打ち上げることがもうできません。セッティングで手数料を取り替えてください",
                pay_transfer_toaddr: "アドレス",
                pay_transfer_count: "金額",
                pay_transCount_count: "為替",
                pay_transCount_inputCount: "為替金額を入力してください",
                pay_transCount_err: "正しい金額を入力してください",
                pay_transCountGAS: "GAS：",
                pay_transCountCGAS: "CGAS：",
                pay_transCountCGASOLD: "CGAS(old)：",
                pay_transCountCGAS2GAS: "GAS",
                pay_transCountGAS2CGAS: "CGAS",
                pay_transCountCGASOLD2OLD: "CGAS(old)",
                pay_transCountNEO: "NEO：",
                pay_transCountCNEO: "CNEO：",
                pay_transCountCNEOOLD: "CNEO(old)：",
                pay_transCountCNEO2NEO: "NEO",
                pay_transCountNEO2CNEO: "CNEO",
                pay_transCountCNEOOLD2OLD: "CNEO(old)",
                pay_transCountTips_free: "フリー",
                pay_transCountTips_slow: "遅い",
                pay_transCountTips_fast: "早い",
                pay_transCount_speed: "商売\nスピード",
                pay_transCount_cost: "手数料：",
                pay_transCount_tips: "トークンを選んでください",
                pay_transCount_tips_err: "トークンを選んでください",
                pay_walletOpen_password: "パスワード",
                pay_walletOpen_inputPassword: "パスワード",
                pay_walletOpen_inputPassword_err: "パスワードを入力してください",
                pay_walletOpen_file_error: "ウォレットファイルエラー、もう一度ログインしてください",
                pay_walletOpen_openFail: "パスワードエラー！後でもう一度試してください！",
                walletCreate_create: "ウォレットを作成する",
                walletCreate_password: "パスワード",
                walletCreate_vpass: "確認してください",
                walletCreate_password_notice: "*パスワードを復元できなくて大切に保管してください",
                walletCreate_doCreate: "作成する",
                walletCreate_check_pass: "パスワードをチェックしてください",
                walletCreate_check_vpass: "パスワードをチェックしてください",
                walletCreate_check_exceed: "パスワードは32文字以内で入力して下さい",
                walletImport_invalid_file: "正しいウォレットファイルを選んでください",
                walletImport_select_file: "ウォレットファイル",
                walletImport_import: "ウォレットを加える",
                walletImport_password: "パスワード",
                walletImport_doImport: "縛る",
                walletImport_bind_succ: "完了！",
                walletView_info: "面白くて特別なゲーム！",
                walletView_create: "ウォレットを作成する",
                walletView_import: "ウォレットを加える",
                walletCreate_download: "Download Wallet",
                walletCreate_doDownload: "download",
                main_wait_for_last_tran: "前の商売を確認・キャンセルした後でもう一度試してください",
                main_no_app_wallet: "ウォレットアドレスを設置しなくならリチャージ出来ません",
                main_need_open_wallet_confirm: "ウォレットを開けますか？",
                main_refund_CGAS_second_fail: "転換契約リクエスト（utxo->gas）失敗",
                main_refund_CNEO_second_fail: "転換契約リクエスト（utxo->neo）失敗",
                main_refund_getScript_err: "転換契約失敗！",
                main_refund_sendRequest_err: "リクエスト失敗！",
                main_refund_doFail: "転換契約失敗！",
                main_broker_deposit_second_fail: "プリペイドが失敗しました！",
                errCode_default: "エラー！コード： %errCode%",
                wallet_open_check: "ウォレットファイルとパスワードを確認してください！",
                wallet_open_check_otcgo: "SEAウォレットファイルを確認してください！",
                wallet_open_check_otcgo_pwd: "SEAウォレットを確認してください！",
                netmgr_select_api_slow: "サーバー通信エラー、チェックしてください！",
                netmgr_select_node_slow: "ノード通信エラー、チェックしてください！",
                netmgr_select_cli_slow: "ノード通信エラー、チェックしてください！",
                netmgr_connecting: "通信中、お待ちしたください",
                netmgr_connecting_fail: "ネットエラー、チェックしてください",
            };
        }
    }
    BlackCat.LangJP = LangJP;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class LangMgr {
        constructor(type = "") {
        }
        setType(type) {
            console.log("[BlaCat]", "[LangMgr]", "[setType]", '设置语言type => ', type, ', this.type => ', this.type);
            if (this.type == type) {
                return false;
            }
            switch (type) {
                case "en":
                    this.lang = new BlackCat.LangEN();
                    this.type = type;
                    break;
                case "jp":
                    this.lang = new BlackCat.LangJP();
                    this.type = type;
                    break;
                default:
                    this.lang = new BlackCat.LangCN();
                    this.type = "cn";
                    break;
            }
            if (type == 'jp') {
                BlackCat.Main.viewMgr.mainView.div.classList.add("pc_jptype");
            }
            else {
                BlackCat.Main.viewMgr.mainView.div.classList.remove("pc_jptype");
            }
            return true;
        }
        get(key, ext = null) {
            var src = this.lang.get(key);
            if (ext) {
                for (let k in ext) {
                    let rk = '%' + k + '%';
                    src = src.replace(rk, ext[k]);
                }
            }
            return src;
        }
    }
    BlackCat.LangMgr = LangMgr;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class AppNotify {
        static confirm(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                yield BlackCat.ApiTool.walletNotify(params.txid);
                BlackCat.sdkCallback.succ("1", BlackCat.sdkCallback.confirmAppNotify, params, callback);
                console.log("[BlaCat]", '[AppNotify]', '[confirm]', '确认成功..');
            });
        }
    }
    BlackCat.AppNotify = AppNotify;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class RawTransaction {
        static make(params, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.isWalletOpen()) {
                    let loginInfo = BlackCat.tools.LoginInfo.getCurrentLogin();
                    let chain = BlackCat.Main.netMgr.getCurrChain();
                    let net_fee_config = BlackCat.Main.getFeeConfig(chain);
                    let hasEnoughFeeRes = BlackCat.Main.hasEnoughFee(params, net_fee_config, chain);
                    if (BlackCat.Main.viewMgr.mainView.isHidden()) {
                        BlackCat.Main.viewMgr.mainView.show();
                        BlackCat.Main.viewMgr.iconView.hidden();
                    }
                    if (this.transactionCallback) {
                        BlackCat.Main.showErrMsg("main_wait_for_last_tran");
                        BlackCat.sdkCallback.error('main_wait_for_last_tran', BlackCat.sdkCallback.makeRaw, params, callback);
                        return;
                    }
                    this.transactionCallback = callback;
                    var list = new BlackCat.walletLists();
                    list.params = JSON.stringify(params);
                    list.wallet = BlackCat.Main.user.info.wallet;
                    list.icon = BlackCat.Main.appicon;
                    list.name = BlackCat.Main.appname;
                    list.ctm = Math.round(new Date().getTime() / 1000).toString();
                    list.cnts = "0";
                    list.type = "5";
                    list.state = "0";
                    BlackCat.ViewTransactionConfirm.list = list;
                    BlackCat.ViewTransactionConfirm.refer = "";
                    BlackCat.ViewTransactionConfirm.callback_params = params;
                    BlackCat.ViewTransactionConfirm.callback = (params, trust, net_fee) => __awaiter(this, void 0, void 0, function* () {
                        console.log("[BlaCat]", '[RawTransaction]', '[make]', '交易确认..');
                        BlackCat.Main.viewMgr.change("ViewLoading");
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            try {
                                yield this._make(params, trust, net_fee, this.transactionCallback);
                            }
                            catch (e) {
                                console.log("[BlaCat]", '[RawTransaction]', '[make]', '_make(params, trust, net_fee, this.transactionCallback) error, params => ', params, 'trust =>', trust, 'net_fee =>', net_fee, 'error => ', e.toString());
                            }
                            BlackCat.Main.viewMgr.viewLoading.remove();
                        }), 300);
                    });
                    BlackCat.ViewTransactionConfirm.callback_cancel = () => {
                        console.log("[BlaCat]", '[RawTransaction]', '[make]', '交易取消..');
                        BlackCat.sdkCallback.error('cancel', BlackCat.sdkCallback.makeRaw, params, this.transactionCallback);
                        this.transactionCallback = null;
                    };
                    BlackCat.Main.viewMgr.change("ViewTransactionConfirm");
                }
                else {
                    if (BlackCat.Main.viewMgr.mainView.isHidden()) {
                        BlackCat.Main.viewMgr.mainView.show();
                        BlackCat.Main.viewMgr.iconView.hidden();
                    }
                    BlackCat.ViewWalletOpen.refer = "";
                    BlackCat.ViewWalletOpen.callback_params = params;
                    BlackCat.ViewWalletOpen.callback_callback = callback;
                    BlackCat.ViewWalletOpen.callback = (params, callback) => {
                        this.make(params, callback);
                    };
                    BlackCat.ViewWalletOpen.callback_cancel = (params, callback) => {
                        BlackCat.sdkCallback.error('cancel', BlackCat.sdkCallback.makeRaw, params, callback);
                    };
                    BlackCat.Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        static _make(params, trust = "0", net_fee, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.setLiveTime();
                try {
                    var res = yield BlackCat.Main.wallet.makeRawTransaction(params, trust, net_fee);
                }
                catch (e) {
                    var res = new BlackCat.Result();
                    res.err = true;
                    res.info = e.toString();
                    console.log("[BlaCat]", '[RawTransaction]', '[_make]', '_make(params, trust, net_fee) error, params => ', params, 'trust =>', trust, 'net_fee =>', net_fee, 'e => ', e.toString());
                }
                yield BlackCat.Main.viewMgr.payView.doGetWalletLists(1);
                BlackCat.sdkCallback.res(res, BlackCat.sdkCallback.makeRaw, params, callback);
                this.transactionCallback = null;
            });
        }
    }
    BlackCat.RawTransaction = RawTransaction;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class Transfer {
        static make(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                let coin_type = params.type;
                let coin_type_first = "";
                if (params.hasOwnProperty('type_first') && params['type_first'] == "1") {
                    coin_type_first = coin_type.charAt(0).toUpperCase() + coin_type.slice(1);
                }
                let coin_type_upper = coin_type.toUpperCase();
                params['nnc'] = BlackCat.Main.netMgr.getCoinTool()['id_' + coin_type_upper];
                if (!BlackCat.Main.viewMgr.payView.hasOwnProperty(coin_type)) {
                    BlackCat.sdkCallback.error("unsupport type " + coin_type, "make" + coin_type_first + "TransferRes", params, callback);
                    return;
                }
                if (BlackCat.Main.viewMgr.mainView.isHidden()) {
                    BlackCat.Main.viewMgr.mainView.show();
                    BlackCat.Main.viewMgr.iconView.hidden();
                }
                if (BlackCat.Main.viewMgr.payView && BlackCat.Main.viewMgr.payView[coin_type] < Number(params.count)) {
                    BlackCat.Main.showErrMsg('pay_not_enough_money');
                    BlackCat.sdkCallback.error("not_enough_" + coin_type, "make" + coin_type_first + "TransferRes", params, callback);
                    return;
                }
                if (BlackCat.Main.isWalletOpen()) {
                    if (this.transferCallback) {
                        BlackCat.Main.showErrMsg(("main_wait_for_last_tran"));
                        BlackCat.sdkCallback.error("wait_for_last_tran", "make" + coin_type_first + "TransferRes", params, callback);
                        return;
                    }
                    this.transferCallback = callback;
                    var list = new BlackCat.walletLists();
                    params['nnc'] = BlackCat.Main.netMgr.getCoinTool()['id_' + coin_type_upper];
                    list.params = JSON.stringify(params);
                    list.wallet = BlackCat.Main.user.info.wallet;
                    list.icon = BlackCat.Main.appicon;
                    list.name = BlackCat.Main.appname;
                    list.ctm = Math.round(new Date().getTime() / 1000).toString();
                    list.cnts = params.count.toString();
                    list.type = "6";
                    list.type_detail = BlackCat.PayTransferView.log_type_detail[coin_type];
                    BlackCat.ViewTransferConfirm.list = list;
                    BlackCat.ViewTransferConfirm.refer = "";
                    BlackCat.ViewTransferConfirm.callback_params = params;
                    BlackCat.ViewTransferConfirm.callback = (params, net_fee) => __awaiter(this, void 0, void 0, function* () {
                        console.log("[BlaCat]", '[Transfer]', '[make]', '交易确认..');
                        BlackCat.Main.viewMgr.change("ViewLoading");
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            try {
                                if (BlackCat.Main.netMgr.getCurrChain() == 2) {
                                    if (BlackCat.Main.in_array(coin_type, ["gas", "neo"])) {
                                        var res = yield BlackCat.Main.netMgr.getCoinTool().rawTransaction(params.toaddr, BlackCat.Main.netMgr.getCoinTool()["id_" + coin_type_upper], params.count, Neo.Fixed8.fromNumber(Number(net_fee)));
                                    }
                                    else {
                                        var res = yield BlackCat.Main.netMgr.getCoinTool().nep5Transaction(BlackCat.Main.user.info.wallet, params.toaddr, BlackCat.Main.netMgr.getCoinTool()["id_" + coin_type_upper], params.count, net_fee);
                                    }
                                }
                                if (res.err == false) {
                                    params.sbPushString = "transfer";
                                    var logRes = yield BlackCat.ApiTool.addUserWalletLogs(res.info, params.count.toString(), "6", JSON.stringify(params), net_fee, BlackCat.PayTransferView.log_type_detail[coin_type], "1");
                                    yield BlackCat.Main.viewMgr.payView.doGetWalletLists(1);
                                }
                            }
                            catch (e) {
                                var res = new BlackCat.Result();
                                res.err = true;
                                res.info = 'make trans err';
                                res['ext'] = e.toString();
                                console.log("[BlaCat]", '[Transfer]', '[make' + coin_type_first + 'Transfer]', 'ViewTransferConfirm.callback error, params => ', params, 'e => ', e.toString());
                            }
                            BlackCat.Main.viewMgr.viewLoading.remove();
                            BlackCat.sdkCallback.res(res, "make" + coin_type_first + "TransferRes", params, this.transferCallback);
                            this.transferCallback = null;
                        }), 300);
                    });
                    BlackCat.ViewTransferConfirm.callback_cancel = () => {
                        console.log("[BlaCat]", '[Transfer]', '[make' + coin_type_first + 'Transfer]', '交易取消..');
                        BlackCat.sdkCallback.error('cancel', "make" + coin_type_first + "TransferRes", params, this.transferCallback);
                        this.transferCallback = null;
                    };
                    BlackCat.Main.viewMgr.change("ViewTransferConfirm");
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "";
                    BlackCat.ViewWalletOpen.callback_params = params;
                    BlackCat.ViewWalletOpen.callback_callback = callback;
                    BlackCat.ViewWalletOpen.callback = (params, callback) => {
                        this["make" + coin_type_first + "Transfer"](params, callback);
                    };
                    BlackCat.ViewWalletOpen.callback_cancel = (params, callback) => {
                        BlackCat.sdkCallback.error('cancel', "make" + coin_type_first + "TransferRes", params, callback);
                    };
                    BlackCat.Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
    }
    BlackCat.Transfer = Transfer;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class TransferMultiGas {
        static make(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.viewMgr.mainView.isHidden()) {
                    BlackCat.Main.viewMgr.mainView.show();
                    BlackCat.Main.viewMgr.iconView.hidden();
                }
                var _count = 0;
                for (let i = 0; i < params.length; i++) {
                    _count = BlackCat.floatNum.plus(_count, Number(params[i].count));
                }
                params[0]['nnc'] = BlackCat.Main.netMgr.getCoinTool().id_GAS;
                if (BlackCat.Main.viewMgr.payView && BlackCat.Main.viewMgr.payView.gas < Number(_count)) {
                    BlackCat.Main.showErrMsg('pay_not_enough_money');
                    BlackCat.sdkCallback.error("not_enough_gas", BlackCat.sdkCallback.makeGasTransferMulti, params, callback);
                    return;
                }
                if (BlackCat.Main.isWalletOpen()) {
                    if (this.transferMultiCallback) {
                        BlackCat.Main.showErrMsg(("main_wait_for_last_tran"));
                        return;
                    }
                    this.transferMultiCallback = callback;
                    var list = new BlackCat.walletLists();
                    list.params = JSON.stringify(params);
                    list.wallet = BlackCat.Main.user.info.wallet;
                    list.icon = BlackCat.Main.appicon;
                    list.name = BlackCat.Main.appname;
                    list.ctm = Math.round(new Date().getTime() / 1000).toString();
                    list.cnts = _count.toString();
                    list.type = "6";
                    list.type_detail = BlackCat.PayTransferView.log_type_detail['gas'];
                    BlackCat.ViewTransferConfirm.list = list;
                    BlackCat.ViewTransferConfirm.refer = "";
                    BlackCat.ViewTransferConfirm.callback_params = params;
                    BlackCat.ViewTransferConfirm.callback = (params, net_fee) => __awaiter(this, void 0, void 0, function* () {
                        console.log("[BlaCat]", '[TransferMultiGas]', '[make]', '交易确认..');
                        BlackCat.Main.viewMgr.change("ViewLoading");
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            try {
                                var res = yield BlackCat.Main.netMgr.getCoinTool().rawTransactionMulti(params, BlackCat.Main.netMgr.getCoinTool().id_GAS, Neo.Fixed8.fromNumber(Number(net_fee)));
                                if (res.err == false) {
                                    params.map(item => (item.sbPushString = "transfer"));
                                    yield BlackCat.ApiTool.addUserWalletLogs(res.info, _count.toString(), "6", JSON.stringify(params), net_fee, "", "1");
                                    yield BlackCat.Main.viewMgr.payView.doGetWalletLists(1);
                                }
                            }
                            catch (e) {
                                var res = new BlackCat.Result();
                                res.err = true;
                                res.info = 'make trans err';
                                res['ext'] = e.toString();
                                console.log("[BlaCat]", '[TransferMultiGas]', '[make]', 'ViewTransferConfirm.callback error, params => ', params, 'e => ', e.toString());
                            }
                            BlackCat.Main.viewMgr.viewLoading.remove();
                            BlackCat.sdkCallback.res(res, BlackCat.sdkCallback.makeGasTransferMulti, params, this.transferMultiCallback);
                            this.transferMultiCallback = null;
                        }), 300);
                    });
                    BlackCat.ViewTransferConfirm.callback_cancel = () => {
                        console.log("[BlaCat]", '[TransferMultiGas]', '[make]', '交易取消..');
                        BlackCat.sdkCallback.error('cancel', BlackCat.sdkCallback.makeGasTransferMulti, params, this.transferMultiCallback);
                        this.transferMultiCallback = null;
                    };
                    BlackCat.Main.viewMgr.change("ViewTransferConfirm");
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "";
                    BlackCat.ViewWalletOpen.callback_params = params;
                    BlackCat.ViewWalletOpen.callback_callback = callback;
                    BlackCat.ViewWalletOpen.callback = (params, callback) => {
                        this.make(params, callback);
                    };
                    BlackCat.ViewWalletOpen.callback_cancel = (params, callback) => {
                        BlackCat.sdkCallback.error('cancel', BlackCat.sdkCallback.makeGasTransferMulti, params, callback);
                    };
                    BlackCat.Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
    }
    BlackCat.TransferMultiGas = TransferMultiGas;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class User {
        constructor() {
            this.info = new BlackCat.UserInfo();
            this.cacheKey = 'BC_userinfo';
        }
        _updateUserInfo(userinfo) {
            return __awaiter(this, void 0, void 0, function* () {
                for (let k in userinfo) {
                    this.info[k] = userinfo[k];
                }
                localStorage.setItem(this.cacheKey, JSON.stringify(this.info));
            });
        }
        getInfo() {
            var userinfo = localStorage.getItem(this.cacheKey);
            if (userinfo) {
                this.info = JSON.parse(userinfo);
            }
        }
        setInfo(key, value) {
            this.info[key] = value;
            localStorage.setItem(this.cacheKey, JSON.stringify(this.info));
        }
        isLogined() {
            return __awaiter(this, void 0, void 0, function* () {
                var api_userinfo = yield BlackCat.ApiTool.isLogined();
                if (api_userinfo.r) {
                    if (api_userinfo.data.wallet != this.info.wallet) {
                        var new_wallet_file = yield this.getWalletFile();
                        if (new_wallet_file != null) {
                            localStorage.removeItem(this.info.wallet);
                            this.info.wallet = api_userinfo.data.wallet;
                            this.setInfo('wallet', this.info.wallet);
                            localStorage.setItem(this.info.wallet, new_wallet_file);
                        }
                    }
                    this._updateUserInfo(api_userinfo.data);
                    return true;
                }
                else {
                    localStorage.removeItem(this.cacheKey);
                    localStorage.removeItem(this.info.wallet);
                    this.info = new BlackCat.UserInfo();
                    return false;
                }
            });
        }
        getWalletFile() {
            return __awaiter(this, void 0, void 0, function* () {
                return null;
            });
        }
        logout() {
            localStorage.removeItem(this.cacheKey);
            if (this.info.wallet) {
                localStorage.removeItem(this.info.wallet);
            }
            this.info = new BlackCat.UserInfo();
            BlackCat.Main.wallet.closeWallet();
        }
        getWalletFileCache() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.info) {
                    this.getInfo();
                }
                var walletFile = localStorage.getItem(this.info.wallet);
                if (walletFile) {
                    return walletFile;
                }
                return null;
            });
        }
        validateLogin() {
            return __awaiter(this, void 0, void 0, function* () {
                this.getInfo();
                var user_logined = yield this.isLogined();
                if (!user_logined) {
                    return 0;
                }
                else if (!this.info.wallet) {
                    return -1;
                }
                else {
                    return 1;
                }
            });
        }
    }
    BlackCat.User = User;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class WalletListLogs {
        static get_key() {
            return BlackCat.Main.wallet.wallet_addr + "_walletListLogs";
        }
        static get_array_key(txid) {
            for (let k = 0; k < this.logs.length; k++) {
                if (this.logs[k]['txid'] == txid) {
                    return k;
                }
            }
            return null;
        }
        static get(txid = "") {
            if (this.logs.length == 0) {
                let key = this.get_key();
                let log_str = localStorage.getItem(key);
                if (log_str) {
                    try {
                        this.logs = JSON.parse(log_str);
                    }
                    catch (e) {
                    }
                }
            }
            if (txid == "") {
                return this.logs;
            }
            for (let k = 0; k < this.logs.length; k++) {
                if (txid == this.logs[k]['txid']) {
                    return this.logs[k];
                }
            }
            return null;
        }
        static add(info) {
            this.logs = this.get();
            this.logs.push(info);
            localStorage.setItem(this.get_key(), JSON.stringify(this.logs));
        }
        static del(txid) {
            let k = this.get_array_key(txid);
            if (k != null) {
                this.logs.splice(k, 1);
                localStorage.setItem(this.get_key(), JSON.stringify(this.logs));
            }
        }
        static update(txid, info) {
            let key = this.get_array_key(txid);
            if (key != null) {
                for (let k in info) {
                    this.logs[key][k] = info[k];
                }
                localStorage.setItem(this.get_key(), JSON.stringify(this.logs));
            }
        }
    }
    WalletListLogs.logs = [];
    BlackCat.WalletListLogs = WalletListLogs;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class Connector {
        constructor(hosts, check_params, check_type = "") {
            this.hosts = hosts;
            this.check_params = check_params;
            this.check_type = check_type;
            this.fetch_error = [];
        }
        getOne(callback) {
            try {
                this.hosts.forEach(host => {
                    let url_head = host.substr(0, 2) === "//" ? BlackCat.Main.urlHead : "";
                    let url = url_head + host + this.check_params;
                    console.log("[BlaCat]", '[Connector]', '[getOne]', 'url =>', url);
                    fetch(url).then((response) => __awaiter(this, void 0, void 0, function* () {
                        if (response.ok) {
                            switch (this.check_type) {
                                case "node":
                                case "cli":
                                    try {
                                        let json = yield response.json();
                                        if (json["result"][0]["blockcount"]) {
                                            if (!this.first_host) {
                                                this.first_host = url_head + host;
                                                callback(this.first_host, json);
                                            }
                                            return;
                                        }
                                    }
                                    catch (e) { }
                                    this.fetch_error.push(host);
                                    return;
                                case "api":
                                default:
                                    let res = yield response.text();
                                    if (!this.first_host) {
                                        this.first_host = url_head + host;
                                        callback(this.first_host, res);
                                    }
                                    return;
                            }
                        }
                        else {
                            this.fetch_error.push(host);
                        }
                    }), error => {
                        this.fetch_error.push(host);
                        console.log("[BlaCat]", '[Connector]', '[getOne]', 'fetch err => ', error);
                    });
                });
            }
            catch (e) {
                console.log("[BlaCat]", '[Connector]', '[getOne]', 'error => ', e.toString());
            }
            this.check_results(callback);
        }
        check_results(callback) {
            console.log("[BlaCat]", '[Connector]', '[check_results]', '等待请求结果 ...');
            setTimeout(() => {
                if (!this.first_host) {
                    if (this.fetch_error.length == this.hosts.length) {
                        console.log("[BlaCat]", '[Connector]', '[check_results]', '所有请求失败 => ', this.fetch_error);
                        callback(false, null);
                    }
                    else {
                        this.check_results(callback);
                    }
                }
            }, 500);
        }
    }
    BlackCat.Connector = Connector;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class NetMgr {
        constructor() {
            this.support_chains = [2];
            this.default_chain = 2;
            this.default_net = 1;
            this.lock_chain = false;
            this.lock_net = false;
            this.chains = {};
        }
        setDefaultNet(net) {
            if (this.lock_net) {
                console.log("[BlaCat]", '[NetMgr]', '[setDefaultNet]', '网络锁定状态，当前默认net => ', this.default_net);
                return;
            }
            console.log("[BlaCat]", '[NetMgr]', '[setDefaultNet]', '设置默认网络[1:mainnet,2:testnet], net => ', net);
            this.default_net = net;
        }
        setDefaultChain(chain) {
            if (this.lock_chain) {
                console.log("[BlaCat]", '[NetMgr]', '[setDefaultChain]', '主链锁定状态，当前默认chain => ', this.default_chain);
                return;
            }
            console.log("[BlaCat]", '[NetMgr]', '[setDefaultChain]', '设置默认主链[2:NEO], chain => ', chain);
            this.default_chain = chain;
        }
        lockChain() {
            this.lock_chain = true;
        }
        lockNet() {
            this.lock_net = true;
        }
        getCurrNet() {
            return this.net;
        }
        getCurrChain() {
            return this.chain;
        }
        setChainInstance(chain) {
            if (!this.chains.hasOwnProperty(chain)) {
                switch (chain) {
                    case 2:
                        this.chains[chain] = new BlackCat.NetMgrNeo();
                        break;
                }
            }
        }
        changeNet(callback, net = null) {
            if (!net) {
                net = this.default_net;
            }
            else {
                if (this.lock_net) {
                    return;
                }
            }
            let chain = this.getCurrChain();
            this.chains[chain].changeNet(() => {
                this.chain = chain;
                this.net = net;
                callback();
            }, net);
        }
        changeChain(callback, chain = null) {
            if (chain && chain == this.chain) {
                return;
            }
            if (!chain) {
                chain = this.default_chain;
            }
            else {
                if (this.lock_chain) {
                    return;
                }
            }
            this.setChainInstance(chain);
            this.chains[chain].changeChain((net) => {
                this.chain = chain;
                this.net = net;
                callback(chain, net);
            }, this.default_net);
        }
        getChainCoins(chain = null) {
            if (!chain) {
                chain = this.default_chain;
            }
            else {
                if (this.lock_chain) {
                    if (chain !== this.chain) {
                        return new Array();
                    }
                }
            }
            return this.chains[chain].getChainCoins();
        }
        getChainCoinsOld(chain = null) {
            if (!chain) {
                chain = this.default_chain;
            }
            else {
                if (this.lock_chain) {
                    if (chain !== this.chain) {
                        return new Array();
                    }
                }
            }
            return this.chains[chain].getChainCoinsOld();
        }
        getSupportChains() {
            var res = [this.chain];
            if (!this.lock_chain) {
                for (let k = 0; k < this.support_chains.length; k++) {
                    if (this.support_chains[k] !== this.chain) {
                        res.push(this.support_chains[k]);
                    }
                }
            }
            return res;
        }
        getOtherNets() {
            if (this.lock_net) {
                return new Array();
            }
            return this.chains[this.chain].getOtherNets();
        }
        getCurrNodeInfo(type) {
            return this.chains[this.chain].getCurrNodeInfo(type);
        }
        getNodeLists(type) {
            return this.chains[this.chain].getNodeLists(type);
        }
        setNode(type, url) {
            this.chains[this.chain].setNode(type, url);
        }
        getWWW() {
            return this.chains[this.chain].getWWW();
        }
        getCoinTool() {
            return this.chains[this.chain].getCoinTool();
        }
        getNextBlockTs(last_ts) {
            return this.chains[this.chain].getNextBlockTs(last_ts);
        }
    }
    BlackCat.NetMgr = NetMgr;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class NetMgrNeo {
        constructor() {
            this.net_types = [1, 2];
            this.nodes = {
                1: [
                    ["CN", "https://api.nel.group/api/mainnet", "_NEL"],
                    ["HK", "https://mainnet_node_hk_02.blacat.org/api/mainnet"],
                ],
                2: [
                    ["CN", "https://api.nel.group/api/testnet", "_NEL"],
                    ["HK", "https://testnet_node_hk_02.blacat.org/api/testnet"],
                ]
            };
            this.clis = {
                1: [],
                2: []
            };
            this.curr_nodes = {};
            this.curr_clis = {};
            this.blockTs = 20000;
            this.blockTsMin = 10000;
            this.CoinTool = BlackCat.tools.CoinToolNeo;
            this.WWW = BlackCat.tools.WWWNeo;
        }
        getWWW() {
            return this.WWW;
        }
        getCoinTool() {
            return this.CoinTool;
        }
        getNextBlockTs(last_ts) {
            if (last_ts >= this.blockTs && last_ts < this.blockTs * 3) {
                return this.blockTsMin;
            }
            return this.blockTs;
        }
        _init_test() {
            this.CoinTool.id_CGAS = "0x74f2dc36a68fdc4682034178eb2220729231db76";
            this.CoinTool.id_CGAS_OLD = [];
            this.WWW.api_cgas = 'https://apiwallet.nel.group/api/testnet';
            this.CoinTool.id_CNEO = "0xc074a05e9dcf0141cbe6b4b3475dd67baf4dcb60";
            this.CoinTool.id_CNEO_OLD = [];
            this.WWW.api_cneo = '';
            this.chain_coins = ["gas", "cgas", "neo", "cneo"];
            this.chain_coins_old = ["cgas", "cneo"];
        }
        _init_main() {
            this.CoinTool.id_CGAS = "0x74f2dc36a68fdc4682034178eb2220729231db76";
            this.CoinTool.id_CGAS_OLD = [];
            this.WWW.api_cgas = 'https://apiwallet.nel.group/api/mainnet';
            this.CoinTool.id_CNEO = "0xc074a05e9dcf0141cbe6b4b3475dd67baf4dcb60";
            this.CoinTool.id_CNEO_OLD = [];
            this.WWW.api_cneo = '';
            this.chain_coins = ["gas", "cgas", "neo", "cneo"];
            this.chain_coins_old = ["cgas", "cneo"];
        }
        getHosts(hosts) {
            var res = [];
            hosts.forEach(host => {
                res.push(host[1]);
            });
            return res;
        }
        selectNode(callback, type, force = 0) {
            if (force == 0 && this.curr_nodes && this.curr_nodes.hasOwnProperty(type) && this.curr_nodes[type]) {
                this.curr_nodes_tmp = this.curr_nodes[type];
                this.selectCli(callback, type, force);
                return;
            }
            BlackCat.Main.viewMgr.change("ViewConnecting");
            BlackCat.ViewConnecting.callback_retry = () => {
                this._selectNode(callback, type, force);
            };
            this._selectNode(callback, type, force);
        }
        _selectNode(callback, type, force) {
            console.log("[BlaCat]", '[NetMgrNeo]', '[_selectNode]', 'start ...');
            BlackCat.Main.viewMgr.viewConnecting.showConnecting();
            BlackCat.Main.viewMgr.iconView.showState();
            var conn = new BlackCat.Connector(this.getHosts(this.nodes[type]), "?jsonrpc=2.0&id=1&method=getblockcount&params=[]", 'node');
            conn.getOne((res, response) => {
                if (res === false) {
                    BlackCat.ViewConnecting.content = "netmgr_select_node_slow";
                    var showReturn = !BlackCat.Main.isLoginInit();
                    BlackCat.Main.viewMgr.viewConnecting.showRetry(showReturn);
                    BlackCat.Main.viewMgr.iconView.hiddenState();
                    if (BlackCat.Main.isLoginInit() === true)
                        BlackCat.Main.viewMgr.iconView.showFail();
                    return;
                }
                console.log("[BlaCat]", '[NetMgrNeo]', '[_selectNode]', 'nelnode => ', res);
                console.log("[BlaCat]", '[NetMgrNeo]', '[_selectNode]', 'nelnode response => ', response);
                this.curr_nodes_tmp = res;
                this.selectCli(callback, type, force);
            });
        }
        selectCli(callback, type, force = 0) {
            if (!this.clis || !this.clis[type] || this.clis[type].length == 0) {
                this.curr_nodes[type] = this.curr_nodes_tmp;
                this.WWW.api_nodes = this.curr_nodes[type];
                this.curr_clis[type] = null;
                this.WWW.api_clis = null;
                callback();
                if (BlackCat.Main.viewMgr.viewConnecting.isCreated)
                    BlackCat.Main.viewMgr.viewConnecting.remove();
                BlackCat.Main.viewMgr.iconView.hiddenState();
                BlackCat.Main.viewMgr.iconView.showSucc();
                return;
            }
            if (force == 0 && this.curr_clis && this.curr_clis.hasOwnProperty(type) && this.curr_clis[type]) {
                this.curr_nodes[type] = this.curr_nodes_tmp;
                this.WWW.api_nodes = this.curr_nodes[type];
                this.WWW.api_clis = this.curr_clis[type];
                callback();
                if (BlackCat.Main.viewMgr.viewConnecting.isCreated)
                    BlackCat.Main.viewMgr.viewConnecting.remove();
                BlackCat.Main.viewMgr.iconView.hiddenState();
                BlackCat.Main.viewMgr.iconView.showSucc();
                return;
            }
            BlackCat.Main.viewMgr.change("ViewConnecting");
            BlackCat.ViewConnecting.callback_retry = () => {
                this._selectCli(callback, type);
            };
            this._selectCli(callback, type);
        }
        _selectCli(callback, type) {
            console.log("[BlaCat]", '[NetMgrNeo]', '[_selectCli]', 'start ...');
            BlackCat.Main.viewMgr.viewConnecting.showConnecting();
            BlackCat.Main.viewMgr.iconView.showState();
            var conn = new BlackCat.Connector(this.getHosts(this.clis[type]), "?jsonrpc=2.0&id=1&method=getblockcount&params=[]&uid=" + BlackCat.Main.randNumber, 'cli');
            conn.getOne((res, response) => {
                if (res === false) {
                    BlackCat.ViewConnecting.content = "netmgr_select_cli_slow";
                    var showReturn = !BlackCat.Main.isLoginInit();
                    BlackCat.Main.viewMgr.viewConnecting.showRetry(showReturn);
                    BlackCat.Main.viewMgr.iconView.hiddenState();
                    if (BlackCat.Main.isLoginInit() === true)
                        BlackCat.Main.viewMgr.iconView.showFail();
                    return;
                }
                console.log("[BlaCat]", '[NetMgrNeo]', '[_selectCli]', 'neo-cli => ', res);
                console.log("[BlaCat]", '[NetMgrNeo]', '[_selectCli]', 'neo-cli response => ', response);
                this.curr_nodes[type] = this.curr_nodes_tmp;
                this.WWW.api_nodes = this.curr_nodes[type];
                this.curr_clis[type] = res;
                this.WWW.api_clis = this.curr_clis[type];
                callback();
                if (BlackCat.Main.viewMgr.viewConnecting.isCreated)
                    BlackCat.Main.viewMgr.viewConnecting.remove();
                BlackCat.Main.viewMgr.iconView.hiddenState();
                BlackCat.Main.viewMgr.iconView.showSucc();
            });
        }
        change2test(callback) {
            return __awaiter(this, void 0, void 0, function* () {
                this.selectNode(() => {
                    this.curr_net = 2;
                    this._init_test();
                    callback(this.curr_net);
                }, 2);
            });
        }
        change2Main(callback) {
            return __awaiter(this, void 0, void 0, function* () {
                this.selectNode(() => {
                    this.curr_net = 1;
                    this._init_main();
                    callback(this.curr_net);
                }, 1);
            });
        }
        getOtherNets() {
            var res = new Array();
            for (let k = 0; k < this.net_types.length; k++) {
                if (this.net_types[k] !== this.curr_net) {
                    res.push(this.net_types[k]);
                }
            }
            return res;
        }
        changeNet(callback, net = null) {
            if (!net) {
                net = BlackCat.Main.netMgr.getCurrNet();
            }
            if (this.curr_net != net) {
                console.log("[BlaCat]", '[NetMgrNeo]', '[changeNet]', 'NEO切换网络，net => ', net);
                switch (net) {
                    case 1:
                        this.change2Main(callback);
                        break;
                    case 2:
                        this.change2test(callback);
                        break;
                }
            }
        }
        changeChain(callback, net) {
            if (this.curr_net) {
                net = this.curr_net;
            }
            else {
                if (!BlackCat.Main.in_array(net, this.net_types)) {
                    net = this.net_types[0];
                }
            }
            console.log("[BlaCat]", '[NetMgrNeo]', '[changeChain]', '主链切换成NEO，net[1:mainnet,2:testnet] => ', net);
            switch (net) {
                case 1:
                    this.change2Main(callback);
                    break;
                case 2:
                    this.change2test(callback);
                    break;
            }
        }
        getChainCoins() {
            return this.chain_coins;
        }
        getChainCoinsOld() {
            return this.chain_coins_old;
        }
        getCurrNodeInfo(type) {
            var info = null;
            if (this[type][this.curr_net].length > 0) {
                for (let i = 0; i < this[type][this.curr_net].length; i++) {
                    if (this[type][this.curr_net][i][1] == this["curr_" + type][this.curr_net]) {
                        return this[type][this.curr_net][i];
                    }
                }
            }
            return info;
        }
        getNodeLists(type) {
            var lists = [];
            if (this[type] && this[type][this.curr_net]) {
                return this[type][this.curr_net];
            }
            return lists;
        }
        setNode(type, url) {
            this["curr_" + type][this.curr_net] = url;
            this.WWW["api_" + type] = url;
        }
    }
    BlackCat.NetMgrNeo = NetMgrNeo;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewBase {
        constructor() {
            this.isCreated = false;
            this.reset();
        }
        create() { }
        toRefer() { }
        reset() { }
        key_esc() {
            this.return();
        }
        key_enter() { }
        start() {
            if (this.isCreated === false) {
                this.create();
                this.isCreated = true;
                this.parentAdd(this.div);
            }
            this.show();
        }
        remove(timeout = 0, fadeClass = "pc_fadeindown") {
            if (this.s_timeout_remove) {
                return;
            }
            if (timeout) {
                if (fadeClass)
                    this.div.classList.add("pc_fadeindown");
                this.s_timeout_remove = setTimeout(() => {
                    this._remove();
                }, timeout);
            }
            else {
                this._remove();
            }
        }
        _remove() {
            this.s_timeout_remove = null;
            this.parentRemove(this.div);
            this.isCreated = false;
            this.reset();
        }
        return(timeout = 0) {
            this.remove(timeout);
            this.toRefer();
        }
        hidden() {
            this.div.style.display = "none";
        }
        show() {
            this.div.style.display = "";
            this.div.onkeyup = (e) => {
                var code = e.charCode || e.keyCode;
                if (code == 13) {
                    this.key_enter();
                }
                else if (code == 27) {
                    this.key_esc();
                }
            };
            this.div.tabIndex = 0;
            this.div.focus();
        }
        isHidden() {
            if (this.div && this.div.style.display == "none") {
                return true;
            }
            return false;
        }
        update() {
            this.parentRemove(this.div);
            this.create();
            this.parentAdd(this.div);
        }
        objCreate(tag) {
            var addElement = document.createElement(tag);
            return addElement;
        }
        ObjAppend(o, tag) {
            o.appendChild(tag);
        }
        objRemove(o, tag) {
            o.removeChild(tag);
        }
        parentAdd(tag) {
            this.ObjAppend(BlackCat.Main.viewMgr.mainView.div, tag);
        }
        parentRemove(tag) {
            this.objRemove(BlackCat.Main.viewMgr.mainView.div, tag);
        }
        bodyAppend(tag) {
            document.body.appendChild(tag);
        }
        bodyRemove(tag) {
            document.body.removeChild(tag);
        }
    }
    BlackCat.ViewBase = ViewBase;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class AutoLogoutWalletView extends BlackCat.ViewBase {
        constructor() {
            super(...arguments);
            this.logoutTime = [1, 5, 10, 30, 60, 120, 0];
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_logoutwallet");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("security_title");
            this.ObjAppend(header, headerH1);
            var divSecurity = this.objCreate("div");
            divSecurity.classList.add("pc_myinfolist");
            this.ObjAppend(this.div, divSecurity);
            var ulSecurity = this.objCreate("ul");
            this.ObjAppend(divSecurity, ulSecurity);
            var liveTimeMax = BlackCat.Main.getLiveTimeMax();
            this.logoutTime.forEach(ts => {
                var liTime = this.objCreate("li");
                if (ts * 60 * 1000 == liveTimeMax) {
                    liTime.classList.add("pc_active");
                }
                liTime.textContent = BlackCat.Main.viewMgr.securityCenterView.getWalletOutTimeMaxMsg(ts * 60 * 1000);
                liTime.onclick = () => {
                    BlackCat.Main.setLiveTimeMax(ts);
                    ulSecurity.getElementsByClassName("pc_active")[0].classList.remove("pc_active");
                    liTime.classList.add("pc_active");
                    BlackCat.Main.viewMgr.securityCenterView.updateWalletOutTimeMaxMsg();
                    this.return();
                };
                this.ObjAppend(ulSecurity, liTime);
                var iTime = this.objCreate("i");
                iTime.classList.add("iconfont", "icon-bc-gou");
                this.ObjAppend(liTime, iTime);
            });
        }
        toRefer() {
            if (AutoLogoutWalletView.refer) {
                BlackCat.Main.viewMgr.change(AutoLogoutWalletView.refer);
                AutoLogoutWalletView.refer = null;
            }
        }
    }
    BlackCat.AutoLogoutWalletView = AutoLogoutWalletView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class IconView extends BlackCat.ViewBase {
        start() {
            if (this.isCreated === false) {
                this.create();
                this.isCreated = true;
                this.bodyAppend(this.div);
                this.onResize();
            }
            this.show();
        }
        show() {
            this.div.style.display = "";
        }
        reset() {
            this.doDragMove = false;
            if (this.div)
                this.flushProcess(0);
        }
        update() {
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_icon");
            this.showFail();
            this.div.onclick = () => {
                console.log("[BlaCat]", '[IconView]', '[onclick]', 'this.doDragMove => ', this.doDragMove);
                if (this.doDragMove == true) {
                    return false;
                }
                this.hidden();
                BlackCat.Main.viewMgr.mainView.div.classList.remove("pc_windowhide");
                BlackCat.Main.viewMgr.mainView.show();
                if (BlackCat.Main.viewMgr.payView && BlackCat.Main.viewMgr.payView.isCreated) {
                    BlackCat.Main.viewMgr.payView.getHeight("nodes");
                    if (BlackCat.Main.netMgr.getWWW().api_clis && BlackCat.Main.netMgr.getWWW().api_clis != "") {
                        BlackCat.Main.viewMgr.payView.getHeight("clis");
                    }
                }
                if (BlackCat.Main.isStart == false) {
                    BlackCat.SDK.login();
                }
            };
            this.div.onmousemove = () => {
                this.drag();
            };
            this.div.ontouchstart = (ev) => {
                this.dragTouch(ev);
            };
            this.processDiv = this.objCreate("div");
            this.ObjAppend(this.div, this.processDiv);
            this.showState();
        }
        remove() {
            this.bodyRemove(this.div);
        }
        showState() {
            if (!this.stateDiv) {
                this.stateDiv = this.objCreate("div");
                this.stateDiv.classList.add("pc_iconstate");
                var imgStateIcon = this.objCreate("img");
                imgStateIcon.src = BlackCat.Main.resHost + "res/img/BlackCaticon.gif";
                this.ObjAppend(this.stateDiv, imgStateIcon);
                this.ObjAppend(this.div, this.stateDiv);
            }
            this.stateDiv.style.display = "";
        }
        removeState() {
            if (this.stateDiv)
                this.objRemove(this.div, this.stateDiv);
        }
        hiddenState() {
            if (this.stateDiv)
                this.stateDiv.style.display = "none";
        }
        showFail() {
            this.div.classList.add("pc_iconfail");
        }
        showSucc() {
            this.div.classList.remove("pc_iconfail");
        }
        flushProcess(count) {
            console.log("[BlaCat]", '[IconView]', '[flushProcess]', 'count => ', count);
            if (count > 0) {
                this.div.classList.add("pc_iconRecord");
            }
            else {
                this.div.classList.remove("pc_iconRecord");
            }
        }
        dragTouch(ev) {
            var sent = {
                l: 0,
                r: window.innerWidth - this.div.offsetWidth,
                t: 0,
                b: window.innerHeight - this.div.offsetHeight
            };
            var dmW = document.documentElement.clientWidth || document.body.clientWidth;
            var dmH = document.documentElement.clientHeight || document.body.clientHeight;
            var l = sent.l || 0;
            var r = sent.r || dmW - this.div.offsetWidth;
            var t = sent.t || 0;
            var b = sent.b || dmH - this.div.offsetHeight;
            this.doDragMove = false;
            var oEvent = ev.touches[0];
            var sentX = oEvent.clientX - this.div.offsetLeft;
            var sentY = oEvent.clientY - this.div.offsetTop;
            document.ontouchmove = (ev) => {
                var mEvent = ev.touches[0];
                var slideLeft = mEvent.clientX - sentX;
                var slideTop = mEvent.clientY - sentY;
                if (slideLeft <= l) {
                    slideLeft = l;
                }
                if (slideLeft >= r) {
                    slideLeft = r;
                }
                if (slideTop <= t) {
                    slideTop = t;
                }
                if (slideTop >= b) {
                    slideTop = b;
                }
                this.div.style.left = slideLeft + 'px';
                this.div.style.top = slideTop + 'px';
                if (oEvent.clientX != mEvent.clientX || oEvent.clientY != mEvent.clientY) {
                    this.doDragMove = true;
                }
            };
            document.ontouchend = () => {
                document.ontouchmove = null;
            };
        }
        drag() {
            var sent = {
                l: 0,
                r: window.innerWidth - this.div.offsetWidth,
                t: 0,
                b: window.innerHeight - this.div.offsetHeight
            };
            var dmW = document.documentElement.clientWidth || document.body.clientWidth;
            var dmH = document.documentElement.clientHeight || document.body.clientHeight;
            var l = sent.l || 0;
            var r = sent.r || dmW - this.div.offsetWidth;
            var t = sent.t || 0;
            var b = sent.b || dmH - this.div.offsetHeight;
            this.div.onmousedown = (ev) => {
                this.doDragMove = false;
                var oEvent = ev;
                var sentX = oEvent.clientX - this.div.offsetLeft;
                var sentY = oEvent.clientY - this.div.offsetTop;
                document.onmousemove = (ev) => {
                    var mEvent = ev;
                    var slideLeft = mEvent.clientX - sentX;
                    var slideTop = mEvent.clientY - sentY;
                    if (slideLeft <= l) {
                        slideLeft = l;
                    }
                    if (slideLeft >= r) {
                        slideLeft = r;
                    }
                    if (slideTop <= t) {
                        slideTop = t;
                    }
                    if (slideTop >= b) {
                        slideTop = b;
                    }
                    this.div.style.left = slideLeft + 'px';
                    this.div.style.top = slideTop + 'px';
                    if (oEvent.clientX != mEvent.clientX || oEvent.clientY != mEvent.clientY) {
                        this.doDragMove = true;
                    }
                };
                document.onmouseup = () => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
                return false;
            };
        }
        onResize() {
            window.onresize = () => {
                var windowWidth = window.innerWidth;
                if (parseInt(this.div.style.left) + 64 >= windowWidth) {
                    this.div.style.left = "auto";
                }
            };
        }
    }
    BlackCat.IconView = IconView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class MainView extends BlackCat.ViewBase {
        start() {
            if (this.isCreated === false) {
                this.create();
                this.isCreated = true;
                this.bodyAppend(this.div);
            }
            if (/AppleWebKit.*mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
                if (window.location.href.indexOf("?mobile") < 0) {
                    try {
                        if (/iPad/i.test(navigator.userAgent)) {
                        }
                        else {
                            this.div.classList.add("pc_mobile");
                        }
                    }
                    catch (e) { }
                }
            }
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_window");
            this.div.style.display = "none";
            this.div.onclick = () => {
                event.stopPropagation();
                BlackCat.Main.setLiveTime();
            };
        }
        createMask() {
            if (!this.divMask) {
                BlackCat.Main.viewMgr.change("IconView");
                this.divMask = this.objCreate("div");
                this.divMask.classList.add("pc_window_mask");
                this.divMask.onclick = () => {
                    BlackCat.SDK.showIcon();
                };
                this.ObjAppend(this.div, this.divMask);
            }
        }
        changNetType() {
            switch (BlackCat.Main.netMgr.getCurrNet()) {
                case 1:
                    this.div.classList.remove("pc_windowtest2");
                    break;
                case 2:
                    this.div.classList.add("pc_windowtest2");
                    break;
            }
        }
        remove() {
            this.bodyRemove(this.div);
        }
        hidden() {
            this.div.classList.add("pc_windowhide");
            this.s_timeout_hidden = setTimeout(() => {
                this.div.style.display = "none";
            }, 300);
        }
        show() {
            if (this.s_timeout_hidden)
                clearTimeout(this.s_timeout_hidden);
            this.div.classList.remove("pc_windowhide");
            this.div.style.display = "";
        }
    }
    BlackCat.MainView = MainView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ModifyNetworkLineView extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_moifynet");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("modifyNet");
            this.ObjAppend(header, headerH1);
            this.divTypes = this.objCreate("div");
            this.divTypes.classList.add("pc_divnettype");
            this.netType_nodes = this.objCreate("button");
            this.netType_nodes.textContent = "API";
            this.netType_nodes.classList.add("pc_active");
            if (ModifyNetworkLineView.defaultType == "nodes") {
                this.netType_nodes.classList.add("pc_active");
            }
            this.netType_nodes.onclick = () => {
                this.showNodeInfo("nodes", 1);
            };
            this.ObjAppend(this.divTypes, this.netType_nodes);
            this.netType_clis = this.objCreate("button");
            this.netType_clis.textContent = "CLI";
            if (ModifyNetworkLineView.defaultType == "clis") {
                this.netType_nodes.classList.remove("pc_active");
                this.netType_clis.classList.add("pc_active");
            }
            this.netType_clis.onclick = () => {
                this.showNodeInfo("clis", 1);
            };
            this.ObjAppend(this.divTypes, this.netType_clis);
            this.ObjAppend(this.div, this.divTypes);
            this.divLists = this.objCreate("div");
            this.divLists.classList.add("pc_myinfolist");
            this.ObjAppend(this.div, this.divLists);
            this.showNodeInfo(ModifyNetworkLineView.defaultType);
        }
        toRefer() {
            if (ModifyNetworkLineView.refer) {
                BlackCat.Main.viewMgr.change(ModifyNetworkLineView.refer);
                ModifyNetworkLineView.refer = null;
            }
        }
        showNodeInfo(type, clear = 0) {
            var currNodeInfo = BlackCat.Main.netMgr.getCurrNodeInfo(type);
            if (currNodeInfo) {
                this.divTypes.getElementsByClassName("pc_active")[0].classList.remove("pc_active");
                this["netType_" + type].classList.add("pc_active");
                if (clear == 1) {
                    this.divLists.innerHTML = "";
                }
                var ulNet = this.objCreate("ul");
                this.ObjAppend(this.divLists, ulNet);
                var nodeLists = BlackCat.Main.netMgr.getNodeLists(type);
                nodeLists.forEach(nodelist => {
                    var li = this.objCreate("li");
                    if (nodelist[1] == currNodeInfo[1]) {
                        li.classList.add("pc_active");
                    }
                    this.ObjAppend(ulNet, li);
                    var divArea = this.objCreate("div");
                    divArea.classList.add("pc_mmyinfoarea");
                    divArea.textContent = this.getNodeName(nodelist);
                    this.ObjAppend(li, divArea);
                    var divHeight = this.objCreate("div");
                    if (type == "nodes") {
                        divHeight.classList.add("pc_payheighet", "iconfont", "icon-bc-blalian");
                    }
                    if (type == "clis") {
                        divHeight.classList.add("pc_payheighet", "iconfont", "icon-bc-neolian");
                    }
                    divHeight.textContent = "n/a";
                    this.ObjAppend(li, divHeight);
                    var iArea = this.objCreate("i");
                    iArea.classList.add("iconfont", "icon-bc-gou");
                    this.ObjAppend(li, iArea);
                    this.getHeight(type, nodelist, divHeight, li, currNodeInfo);
                });
            }
            else {
            }
        }
        doChange(type, nodelist, height) {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.netMgr.setNode(type, nodelist[1]);
                BlackCat.Main.showToast("modifyNet_succ");
                BlackCat.Main.viewMgr.payView.updateHeight(type, height);
                this.return();
            });
        }
        getNodeName(nodeInfo) {
            let content = BlackCat.Main.langMgr.get("area_code_" + nodeInfo[0]);
            if (!content) {
                content = nodeInfo[0];
            }
            if (nodeInfo[2]) {
                content += nodeInfo[2];
            }
            return content;
        }
        getHeight(type, nodelist, element, li, currNodeInfo) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let height = yield BlackCat.Main.netMgr.getWWW()["api_getHeight_" + type](nodelist[1]);
                    if (height > 0) {
                        element.textContent = height.toString();
                        if (nodelist[1] != currNodeInfo[1]) {
                            li.onclick = () => {
                                this.doChange(type, nodelist, height);
                            };
                        }
                        if (nodelist[1] == currNodeInfo[1]) {
                            BlackCat.Main.viewMgr.payView.updateHeight(type, height);
                        }
                        return;
                    }
                }
                catch (e) { }
                li.onclick = () => {
                    BlackCat.Main.showErrMsg("modifyNet_node_err");
                };
            });
        }
    }
    ModifyNetworkLineView.defaultType = "nodes";
    BlackCat.ModifyNetworkLineView = ModifyNetworkLineView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PayListDetailView extends BlackCat.ViewBase {
        constructor() {
            super();
            if (!PayListDetailView.list) {
                PayListDetailView.list = new BlackCat.walletLists();
            }
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_listdetail");
            if (PayListDetailView.list && PayListDetailView.list.hasOwnProperty("wallet")) {
                var headerObj = this.objCreate("div");
                headerObj.classList.add("pc_header");
                var returnBtn = this.objCreate("a");
                returnBtn.classList.add("iconfont", "icon-bc-fanhui");
                returnBtn.textContent = BlackCat.Main.langMgr.get("return");
                returnBtn.onclick = () => {
                    this.return();
                };
                this.ObjAppend(headerObj, returnBtn);
                var h1Obj = this.objCreate("h1");
                h1Obj.textContent = BlackCat.Main.platName;
                this.ObjAppend(headerObj, h1Obj);
                this.ObjAppend(this.div, headerObj);
                var contentObj = this.objCreate("div");
                contentObj.classList.add("pc_detail");
                contentObj.innerHTML
                    = '<ul>'
                        + '<li>'
                        + '<div class="pc_listimg">'
                        + '<img src="' + BlackCat.Main.viewMgr.payView.getListImg(PayListDetailView.list) + '">'
                        + '</div>'
                        + '<div class="pc_liftinfo">'
                        + '<div class="pc_listname">' + BlackCat.Main.viewMgr.payView.getListName(PayListDetailView.list) + '</div>'
                        + '<span class="pc_listdate">' + BlackCat.Main.viewMgr.payView.getListCtm(PayListDetailView.list) + '</span>'
                        + '</div>'
                        + '<div class="pc_cnts ' + BlackCat.Main.viewMgr.payView.getListCntsClass(PayListDetailView.list) + ' "><span>'
                        + this.getCnts()
                        + '</span>'
                        + '<div class="pc_payheighet iconfont icon-bc-diejia">' + BlackCat.Main.viewMgr.payView.getListBlockindex(PayListDetailView.list) + '</div>'
                        + BlackCat.Main.viewMgr.payView.getListState(PayListDetailView.list).outerHTML
                        + '</div>'
                        + '</li>'
                        + '<li><label>' + BlackCat.Main.langMgr.get("paylist_txid") + '</label><p>' + this.getTxid() + '</p></li>'
                        + '<li><label>' + BlackCat.Main.langMgr.get("paylist_wallet") + '</label><p>' + this.getWallet() + '</p></li>'
                        + this.getParams()
                        + '</ul>';
                this.ObjAppend(this.div, contentObj);
            }
        }
        toRefer() {
            if (PayListDetailView.refer) {
                BlackCat.Main.viewMgr.change(PayListDetailView.refer);
                PayListDetailView.refer = null;
            }
        }
        getCnts() {
            return PayListDetailView.list.cnts;
        }
        getTxid() {
            return PayListDetailView.list.txid;
        }
        getWallet() {
            switch (PayListDetailView.list.type) {
                case "9":
                case "10":
                    try {
                        var ext = JSON.parse(PayListDetailView.list.ext);
                        if (ext.hasOwnProperty("wallet")) {
                            return ext.wallet;
                        }
                    }
                    catch (e) {
                    }
                default:
                    return PayListDetailView.list.wallet;
            }
        }
        getParams() {
            var html = "";
            var params = PayListDetailView.list.params;
            if (params) {
                try {
                    params = JSON.parse(params);
                    if (params.hasOwnProperty("nnc") || params.hasOwnProperty("toaddr")) {
                        params = [params];
                    }
                    if (params instanceof Array) {
                        if (PayListDetailView.list.type == "6"
                            || PayListDetailView.list.type == "7"
                            || PayListDetailView.list.type == "8"
                            || PayListDetailView.list.type == "13") {
                            for (let k in params) {
                                html += '<li class="pc_contractAddress">'
                                    + '<div><label>' + BlackCat.Main.langMgr.get("pay_transfer_toaddr") + '</label><p>' + params[k].toaddr + '</p></div>'
                                    + '<div><label>' + BlackCat.Main.langMgr.get("pay_transfer_count") + '</label><p>' + params[k].count + '</p></div>'
                                    + '</li>';
                            }
                        }
                        else {
                            for (let k in params) {
                                html += '<li class="pc_contractAddress">'
                                    + '<div><label>' + BlackCat.Main.langMgr.get("paylist_nnc") + '</label><p>' + params[k].nnc + '</p></div>'
                                    + '<div><label>' + BlackCat.Main.langMgr.get("paylist_sbParamJson") + '</label><p>' + params[k].sbParamJson + '</p></div>'
                                    + '<div><label>' + BlackCat.Main.langMgr.get("paylist_sbPushString") + '</label><p>' + params[k].sbPushString + '</p></div>'
                                    + '</li>';
                            }
                        }
                    }
                }
                catch (e) {
                    console.log("[BlaCat]", '[PayListDetailView]', '[getParams]', 'error => ', e.toString());
                }
            }
            return html;
        }
    }
    BlackCat.PayListDetailView = PayListDetailView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PayListMoreView extends BlackCat.ViewBase {
        constructor() {
            super();
            this.page = 1;
            this.num = BlackCat.Main.viewMgr.payView.listPageNum;
            this.isLast = false;
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_paylist");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.platName;
            this.ObjAppend(header, headerH1);
            this.listsDiv = this.objCreate("ul");
            this.ObjAppend(this.div, this.listsDiv);
            this.getMoreDiv = this.objCreate("div");
            this.getMoreDiv.classList.add("pc_listmore");
            this.getMoreDiv.onclick = () => {
                this.doGetWalletLists();
            };
            this.ObjAppend(this.div, this.getMoreDiv);
            this.doGetWalletLists();
        }
        toRefer() {
            if (PayListMoreView.refer) {
                BlackCat.Main.viewMgr.change(PayListMoreView.refer);
                PayListMoreView.refer = null;
            }
        }
        reset() {
            this.page = 1;
            this.isLast = false;
        }
        doGetWalletLists() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.isLast) {
                    return;
                }
                var res = yield BlackCat.ApiTool.getWalletListss(this.page, this.num, 0);
                if (res.r) {
                    if (res.data && res.data.length >= 1) {
                        if (res.data.length < this.num) {
                            this.isLast = true;
                            this.getMoreDiv.textContent = BlackCat.Main.langMgr.get("paylist_noMore");
                        }
                        else {
                            this.page += 1;
                            this.getMoreDiv.textContent = BlackCat.Main.langMgr.get("paylist_getMore");
                        }
                        yield res.data.forEach(list => {
                            var listObj = this.objCreate("li");
                            listObj.onclick = () => {
                                for (var i in this.listsDiv.children) {
                                    if (this.listsDiv.children[i].className == "active") {
                                        this.listsDiv.children[i].classList.remove('active');
                                    }
                                }
                                listObj.classList.add("active");
                                this.hidden();
                                BlackCat.PayListDetailView.refer = "PayListMoreView";
                                BlackCat.PayListDetailView.list = list;
                                BlackCat.Main.viewMgr.change("PayListDetailView");
                            };
                            var img_div = this.objCreate("div");
                            img_div.classList.add("pc_listimg");
                            var img = this.objCreate("img");
                            img.src = BlackCat.Main.viewMgr.payView.getListImg(list);
                            this.ObjAppend(img_div, img);
                            this.ObjAppend(listObj, img_div);
                            var content_div = this.objCreate("div");
                            content_div.classList.add("pc_liftinfo");
                            var content_name_div = this.objCreate("div");
                            content_name_div.classList.add("pc_listname");
                            content_name_div.textContent = BlackCat.Main.viewMgr.payView.getListName(list);
                            this.ObjAppend(content_div, content_name_div);
                            var content_ctm_p = this.objCreate("p");
                            content_ctm_p.classList.add("pc_method");
                            content_ctm_p.textContent = BlackCat.Main.viewMgr.payView.getListParamMethods(list);
                            this.ObjAppend(content_div, content_ctm_p);
                            this.ObjAppend(listObj, content_div);
                            var state_cnts_div = this.objCreate("div");
                            state_cnts_div.classList.add("pc_cnts");
                            var content_ctm_span = this.objCreate("div");
                            content_ctm_span.classList.add("pc_listdate");
                            content_ctm_span.textContent = BlackCat.Main.viewMgr.payView.getListCtmMsg(list);
                            this.ObjAppend(state_cnts_div, content_ctm_span);
                            var cnts = BlackCat.Main.viewMgr.payView.getListCnts(list);
                            if (cnts) {
                                this.ObjAppend(state_cnts_div, cnts);
                                var cnts_class = BlackCat.Main.viewMgr.payView.getListCntsClass(list);
                                if (cnts_class)
                                    state_cnts_div.classList.add(cnts_class);
                            }
                            var state = BlackCat.Main.viewMgr.payView.getListState(list);
                            if (state)
                                this.ObjAppend(state_cnts_div, state);
                            this.ObjAppend(listObj, state_cnts_div);
                            this.ObjAppend(this.listsDiv, listObj);
                        });
                    }
                    else {
                        this.getMoreDiv.textContent = BlackCat.Main.langMgr.get("paylist_noRecord");
                    }
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
    }
    BlackCat.PayListMoreView = PayListMoreView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PayListProcessView extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_paylist");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.platName;
            this.ObjAppend(header, headerH1);
            var divListsMore = this.objCreate("div");
            divListsMore.classList.add("pc_paymore");
            divListsMore.textContent = BlackCat.Main.langMgr.get("pay_more");
            divListsMore.onclick = () => {
                this.hidden();
                BlackCat.PayListMoreView.refer = "PayListProcessView";
                BlackCat.Main.viewMgr.change("PayListMoreView");
            };
            var iListsMore = this.objCreate("i");
            iListsMore.classList.add("iconfont", "icon-bc-sanjiaoxing");
            this.ObjAppend(divListsMore, iListsMore);
            this.ObjAppend(header, divListsMore);
            this.listsDiv = this.objCreate("ul");
            this.ObjAppend(this.div, this.listsDiv);
            this.updateLists();
        }
        toRefer() {
            if (PayListProcessView.refer) {
                BlackCat.Main.viewMgr.change(PayListProcessView.refer);
                PayListProcessView.refer = null;
            }
        }
        updateLists() {
            this.listsDiv.innerHTML = "";
            PayListProcessView.lists.forEach(list => {
                var listObj = this.objCreate("li");
                listObj.onclick = () => {
                    this.hidden();
                    BlackCat.PayListDetailView.refer = "PayListProcessView";
                    BlackCat.PayListDetailView.list = list;
                    BlackCat.Main.viewMgr.change("PayListDetailView");
                };
                var img_div = this.objCreate("div");
                img_div.classList.add("pc_listimg");
                var img = this.objCreate("img");
                img.src = BlackCat.Main.viewMgr.payView.getListImg(list);
                this.ObjAppend(img_div, img);
                this.ObjAppend(listObj, img_div);
                var content_div = this.objCreate("div");
                content_div.classList.add("pc_liftinfo");
                var content_name_div = this.objCreate("div");
                content_name_div.classList.add("pc_listname");
                content_name_div.textContent = BlackCat.Main.viewMgr.payView.getListName(list);
                this.ObjAppend(content_div, content_name_div);
                var content_ctm_p = this.objCreate("p");
                content_ctm_p.classList.add("pc_method");
                content_ctm_p.textContent = BlackCat.Main.viewMgr.payView.getListParamMethods(list);
                this.ObjAppend(content_div, content_ctm_p);
                this.ObjAppend(listObj, content_div);
                var state_cnts_div = this.objCreate("div");
                state_cnts_div.classList.add("pc_cnts");
                var content_ctm_span = this.objCreate("div");
                content_ctm_span.classList.add("pc_listdate", "listCtm");
                content_ctm_span.textContent = BlackCat.Main.viewMgr.payView.getListCtmMsg(list);
                content_ctm_span.setAttribute("ctm", list.ctm);
                this.ObjAppend(state_cnts_div, content_ctm_span);
                var cnts = BlackCat.Main.viewMgr.payView.getListCnts(list);
                if (cnts) {
                    this.ObjAppend(state_cnts_div, cnts);
                    var cnts_class = BlackCat.Main.viewMgr.payView.getListCntsClass(list);
                    if (cnts_class)
                        state_cnts_div.classList.add(cnts_class);
                }
                var state = BlackCat.Main.viewMgr.payView.getListState(list);
                if (state)
                    this.ObjAppend(state_cnts_div, state);
                this.ObjAppend(listObj, state_cnts_div);
                this.ObjAppend(this.listsDiv, listObj);
            });
        }
    }
    BlackCat.PayListProcessView = PayListProcessView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PayReceivablesView extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_maillist");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("pay_received");
            this.ObjAppend(header, headerH1);
            var divObj = this.objCreate("div");
            divObj.classList.add("pc_qrcode");
            divObj.style.marginTop = "100px";
            this.ObjAppend(this.div, divObj);
            var qrObj = this.objCreate("img");
            QrCodeWithLogo.toImage({
                image: qrObj,
                content: BlackCat.Main.user.info.wallet
            }).then(() => {
                var url = URL.createObjectURL(this.base64ToBlob(qrObj.src));
                qr_download.setAttribute('href', url);
                qr_download.setAttribute("download", BlackCat.Main.user.info.wallet + ".png");
            });
            this.ObjAppend(divObj, qrObj);
            var qr_download = this.objCreate("a");
            qr_download.classList.add("iconfont", "icon-bc-xiazai");
            qr_download.textContent = BlackCat.Main.langMgr.get("pc_receivables_download");
            this.ObjAppend(divObj, qr_download);
            this.divAddress = this.objCreate("div");
            this.divAddress.classList.add("pc_receivables");
            this.divAddress.textContent = BlackCat.Main.user.info.wallet;
            this.ObjAppend(divObj, this.divAddress);
            var butCopy = this.objCreate("button");
            butCopy.classList.add("pc_receivablescopy");
            butCopy.textContent = BlackCat.Main.langMgr.get("copy");
            butCopy.onclick = () => {
                var inputCooy = this.objCreate("input");
                inputCooy.value = this.divAddress.innerText;
                this.ObjAppend(divObj, inputCooy);
                inputCooy.select();
                document.execCommand("Copy");
                inputCooy.remove();
                BlackCat.Main.showToast("pc_receivables_copy", 1500);
            };
            this.ObjAppend(divObj, butCopy);
        }
        toRefer() {
            if (PayReceivablesView.refer) {
                BlackCat.Main.viewMgr.change(PayReceivablesView.refer);
                PayReceivablesView.refer = null;
            }
        }
        base64ToBlob(code) {
            let parts = code.split(';base64,');
            let contentType = parts[0].split(':')[1];
            let raw = window.atob(parts[1]);
            let rawLength = raw.length;
            let uInt8Array = new Uint8Array(rawLength);
            for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], { type: contentType });
        }
    }
    BlackCat.PayReceivablesView = PayReceivablesView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PayTransferView extends BlackCat.ViewBase {
        constructor() {
            super(...arguments);
            this.Balances = {};
        }
        static get_log_type_detail_by_asset(asset) {
            for (let k in PayTransferView.log_type_detail) {
                let id = "id_" + k.toUpperCase();
                if (BlackCat.Main.netMgr.getCoinTool().hasOwnProperty(id) && BlackCat.Main.netMgr.getCoinTool()[id] == asset) {
                    return PayTransferView.log_type_detail[k];
                }
            }
            return "0";
        }
        reset() {
            for (let k in this.Balances) {
                this.Balances[k] = "0";
            }
            this.toaddress = "";
        }
        start() {
            this.getBalanceTypes();
            let firstKey = null;
            for (let k in this.Balances) {
                if (firstKey == null) {
                    firstKey = k;
                }
                this.Balances[k] = BlackCat.Main.getStringNumber(BlackCat.Main.viewMgr.payView[k]);
            }
            if (PayTransferView.transferType_default) {
                this.transferType = PayTransferView.transferType_default;
            }
            else {
                this.transferType = firstKey.toUpperCase();
            }
            super.start();
            if (!this.toaddress) {
                this.inputTransferAddr.focus();
            }
            else {
                this.inputTransferCount.focus();
            }
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_popup");
            var popupbox = this.objCreate('div');
            popupbox.classList.add("pc_popupbox", "pc_transfer");
            this.ObjAppend(this.div, popupbox);
            var popupTitle = this.objCreate('div');
            popupTitle.classList.add("pc_popup_title");
            popupTitle.innerText = BlackCat.Main.langMgr.get("pay_transfer");
            this.ObjAppend(popupbox, popupTitle);
            var divtransfer = this.objCreate("div");
            divtransfer.classList.add("pc_transferbox");
            this.ObjAppend(popupbox, divtransfer);
            var divtransferdiv = this.objCreate("div");
            divtransferdiv.classList.add("pc_transfertype");
            this.ObjAppend(divtransfer, divtransferdiv);
            var balancetype = this.objCreate("label");
            balancetype.innerHTML = BlackCat.Main.langMgr.get("pay_transferType");
            this.ObjAppend(divtransferdiv, balancetype);
            this.selectType = this.objCreate("select");
            this.selectType.classList.add("pc_transfertypes");
            this.ObjAppend(divtransferdiv, this.selectType);
            this.selectType.onchange = () => {
                this.transferType = this.selectType.value;
                var trans_type = this.transferType.toLowerCase();
                this.spanBalance.innerText = this.transferType + ": " + this.Balances[trans_type];
                this.inputTransferCount.value = "";
                if (!BlackCat.Main.in_array(this.transferType, ["BCT", "BCP"])) {
                    this.netFeeCom.setGasLimitMin(4200);
                }
                else {
                    this.netFeeCom.setGasLimitMin(1010);
                }
            };
            for (let k in this.Balances) {
                var option = this.objCreate("option");
                option.value = BlackCat.Main.langMgr.get(k);
                option.innerHTML = BlackCat.Main.langMgr.get(k);
                this.ObjAppend(this.selectType, option);
            }
            this.spanBalance = this.objCreate('span');
            this.spanBalance.classList.add('pc_gasbalancespan');
            var type_lowcase = this.transferType.toLowerCase();
            this.spanBalance.innerText = BlackCat.Main.langMgr.get(type_lowcase) + ": " + this.Balances[type_lowcase];
            this.ObjAppend(divtransferdiv, this.spanBalance);
            this.divTransferAddr = this.objCreate("div");
            this.divTransferAddr.classList.add("pc_transfertype");
            this.ObjAppend(divtransfer, this.divTransferAddr);
            this.labelName = this.objCreate("label");
            this.labelName.classList.add("pc_transfername");
            this.ObjAppend(this.divTransferAddr, this.labelName);
            this.inputTransferAddr = this.objCreate("input");
            this.inputTransferAddr.classList.add("pc_transaddress");
            this.inputTransferAddr.placeholder = BlackCat.Main.langMgr.get("pay_transferToAddr");
            this.inputTransferAddr.value = this.getAddress();
            this.inputTransferAddr.onfocus = () => {
                this.inputTransferAddr.select();
            };
            this.inputTransferAddr.onchange = () => {
                this.divTransferAddr.classList.remove("pc_transfer_active");
                this.inputTransferAddr.style.padding = "0 35px 0 5px";
                this.inputTransferAddr.style.width = "85%";
            };
            this.ObjAppend(this.divTransferAddr, this.inputTransferAddr);
            var divTransferCount = this.objCreate("div");
            divTransferCount.classList.add("pc_transfertype");
            this.ObjAppend(divtransfer, divTransferCount);
            this.inputTransferCount = this.objCreate("input");
            this.inputTransferCount.placeholder = BlackCat.Main.langMgr.get("pay_transferCount");
            this.ObjAppend(divTransferCount, this.inputTransferCount);
            this.inputTransferCount.onkeyup = () => {
                this.doinputchange();
            };
            this.divHaveAmounts = this.objCreate("div");
            this.divHaveAmounts.classList.add("pc_haveamounts");
            this.ObjAppend(popupbox, this.divHaveAmounts);
            this.divHaveBalanceAmounts = this.objCreate("div");
            this.divHaveBalanceAmounts.textContent = "";
            this.ObjAppend(this.divHaveAmounts, this.divHaveBalanceAmounts);
            this.netFeeCom = new BlackCat.NetFeeComponent(popupbox, (net_fee) => {
                this.netFeeChange(net_fee);
            });
            this.netFeeCom.setGasLimitMin(1010);
            this.netFeeCom.setFeeDefault();
            this.netFeeCom.createDiv();
            var popupbutbox = this.objCreate('div');
            popupbutbox.classList.add("pc_popupbutbox");
            this.ObjAppend(popupbox, popupbutbox);
            var popupClose = this.objCreate('button');
            popupClose.classList.add("pc_cancel");
            popupClose.textContent = BlackCat.Main.langMgr.get("cancel");
            popupClose.onclick = () => {
                this.remove(300);
            };
            this.ObjAppend(popupbutbox, popupClose);
            var transferObj = this.objCreate("button");
            transferObj.textContent = BlackCat.Main.langMgr.get("ok");
            transferObj.onclick = () => {
                this.doTransfer();
            };
            this.ObjAppend(popupbutbox, transferObj);
        }
        toRefer() {
            if (PayTransferView.refer) {
                BlackCat.Main.viewMgr.change(PayTransferView.refer);
                PayTransferView.refer = null;
            }
        }
        key_esc() {
        }
        getAddress() {
            if (PayTransferView.address) {
                this.toaddress = PayTransferView.address;
                PayTransferView.address = "";
            }
            return this.toaddress;
        }
        doinputchange() {
            let chain = BlackCat.Main.netMgr.getCurrChain();
            if (this.transferType == "NEO" && chain == 2) {
                var neo_int = parseInt(this.inputTransferCount.value);
                if (neo_int > 0) {
                    this.inputTransferCount.value = parseInt(this.inputTransferCount.value).toString();
                }
                else {
                    this.inputTransferCount.value = "";
                }
            }
            if (!BlackCat.Main.viewMgr.payView.checkTransCount(this.inputTransferCount.value)) {
                return;
            }
        }
        gatSelect() {
            this.divTransferAddr.classList.add("pc_transfer_active");
            this.labelName.textContent = PayTransferView.contact.address_name + ":";
            this.inputTransferAddr.value = PayTransferView.contact.address_wallet;
            var labelNameW = this.labelName.clientWidth + 10;
            var inputTransferAddrw = labelNameW + 35;
            this.inputTransferAddr.style.width = "calc( 100% - " + inputTransferAddrw + "px";
            this.inputTransferAddr.style.padding = "0 35px 0 " + labelNameW + "px";
            if (this.labelName) {
                this.inputTransferCount.focus();
            }
        }
        doTransfer() {
            return __awaiter(this, void 0, void 0, function* () {
                var wallet_res = yield BlackCat.Main.validateFormat("walletaddr", this.inputTransferAddr);
                if (wallet_res === false) {
                    return;
                }
                else if (wallet_res !== true) {
                    this.toaddress = wallet_res;
                }
                else {
                    this.toaddress = this.inputTransferAddr.value;
                }
                if (!BlackCat.Main.viewMgr.payView.checkTransCount(this.inputTransferCount.value)) {
                    BlackCat.Main.showErrMsg("pay_transferCountError", () => {
                        this.inputTransferCount.focus();
                    });
                    return;
                }
                var net_fee = this.net_fee;
                let chain = BlackCat.Main.netMgr.getCurrChain();
                let coin_type = this.transferType + "_" + chain;
                switch (coin_type) {
                    case 'GAS_2':
                        if (Number(this.inputTransferCount.value) + Number(net_fee) > Number(this.Balances.gas)) {
                            BlackCat.Main.showErrMsg("pay_transferGasNotEnough", () => {
                                this.inputTransferCount.focus();
                            });
                            return;
                        }
                        break;
                    case "NEO_2":
                    case "CNEO_2":
                    case "CGAS_2":
                        if (Number(net_fee) > Number(this.Balances.gas)) {
                            BlackCat.Main.showErrMsg("pay_transferGasNotEnough", () => {
                                this.inputTransferCount.focus();
                            });
                            return;
                        }
                        if (Number(this.inputTransferCount.value) > Number(this.Balances[this.transferType.toLowerCase()])) {
                            BlackCat.Main.showErrMsg("pay_transfer" + this.transferType + "NotEnough", () => {
                                this.inputTransferCount.focus();
                            });
                            return;
                        }
                        break;
                }
                BlackCat.Main.viewMgr.change("ViewLoading");
                try {
                    switch (coin_type) {
                        case 'GAS_2':
                        case "NEO_2":
                            var res = yield BlackCat.tools.CoinToolNeo.rawTransaction(this.toaddress, BlackCat.tools.CoinToolNeo["id_" + this.transferType], this.inputTransferCount.value, Neo.Fixed8.fromNumber(Number(net_fee)));
                            break;
                        case 'CGAS_2':
                        case "CNEO_2":
                            var res = yield BlackCat.tools.CoinToolNeo.nep5Transaction(BlackCat.Main.user.info.wallet, this.toaddress, BlackCat.tools.CoinToolNeo["id_" + this.transferType], this.inputTransferCount.value, net_fee);
                            break;
                    }
                }
                catch (e) {
                    var res = new BlackCat.Result();
                    res.err = true;
                    res.info = e.toString();
                    console.log("[BlaCat]", '[PayTransferView]', '[doTransfer]', 'this.transferType => ', this.transferType, 'error => ', e.toString());
                }
                BlackCat.Main.viewMgr.viewLoading.remove();
                if (res) {
                    console.log("[BlaCat]", '[PayTransferView]', '[doTransfer]', '转账结果 => ', res);
                    if (res.err == false) {
                        BlackCat.ApiTool.addUserWalletLogs(res.info, this.inputTransferCount.value, "6", '{"sbPushString":"transfer", "toaddr":"' + this.toaddress + '", "count": "' + this.inputTransferCount.value + '", "nnc": "' + BlackCat.Main.netMgr.getCoinTool()["id_" + this.transferType] + '"}', net_fee, PayTransferView.log_type_detail[this.transferType.toLowerCase()]);
                        BlackCat.Main.showInfo(("pay_transferDoSucc"));
                        this.remove();
                        if (PayTransferView.callback)
                            PayTransferView.callback();
                        PayTransferView.callback = null;
                    }
                    else {
                        if (BlackCat.Main.in_array(res.info, ["get_gasLimit_fail", "gasLimit_not_enough"])) {
                            let err = BlackCat.Main.langMgr.get(res.info, { gasLimit: res['gas_consumed'] });
                            BlackCat.Main.showErrMsg("pay_transferDoFailErr", null, { err: err });
                        }
                        else {
                            BlackCat.Main.showErrMsg("pay_transferDoFail");
                        }
                    }
                }
                else {
                    BlackCat.Main.showErrMsg("pay_transferDoFail");
                }
            });
        }
        netFeeChange(net_fee) {
            this.net_fee = net_fee;
        }
        updateBalance() {
            for (let k in this.Balances) {
                this.Balances[k] = BlackCat.Main.getStringNumber(BlackCat.Main.viewMgr.payView[k]);
            }
            let type_lowcase = this.transferType.toLowerCase();
            this.spanBalance.innerText = BlackCat.Main.langMgr.get(type_lowcase) + ": " + this.Balances[type_lowcase];
        }
        getBalanceTypes() {
            this.Balances = {};
            let chain = BlackCat.Main.netMgr.getCurrChain();
            BlackCat.Main.netMgr.getChainCoins(chain).forEach((coin) => {
                this.Balances[coin] = 0;
            });
        }
    }
    PayTransferView.log_type_detail = {
        gas: "1",
        neo: "2",
        cgas: "3",
        cneo: "4",
    };
    PayTransferView.address = "";
    BlackCat.PayTransferView = PayTransferView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PayView extends BlackCat.ViewBase {
        reset() {
            if (!this.chains) {
                this.chains = BlackCat.Main.netMgr.getSupportChains();
            }
            let chain = BlackCat.Main.netMgr.getCurrChain();
            BlackCat.Main.netMgr.getChainCoins(chain).forEach((coin) => {
                this[coin] = 0;
            });
            let coin_old = BlackCat.Main.netMgr.getChainCoinsOld(chain);
            coin_old.forEach((coin) => {
                if (BlackCat.Main.netMgr.getCoinTool()["id_" + coin.toUpperCase() + "_OLD"].length > 0) {
                    BlackCat.Main.netMgr.getCoinTool()["id_" + coin.toUpperCase() + "_OLD"].forEach((old) => {
                        this[coin + "_old" + old] = 0;
                        this["span" + coin.toUpperCase() + "_OLD" + old] = null;
                    });
                }
            });
            this.height_clis = 0;
            this.height_nodes = 0;
            this.listPageNum = 10;
            this.walletListsHash = null;
            this.WalletListsNeedConfirm = false;
            this.game_assets_update = 1000 * 5;
            this.allnep5_balance = {};
            this.game_assets_ts = null;
            this.clearTimeout();
        }
        start() {
            super.start();
            BlackCat.Main.loginCallback();
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_pay");
            var headerTitle = this.objCreate("div");
            headerTitle.classList.add("pc_header");
            this.ObjAppend(this.div, headerTitle);
            var myinfo_a = this.objCreate("a");
            myinfo_a.classList.add("iconfont", "icon-bc-touxiang");
            myinfo_a.onclick = () => {
                this.hidden();
                BlackCat.PersonalCenterView.refer = "PayView";
                BlackCat.Main.viewMgr.change("PersonalCenterView");
            };
            this.ObjAppend(headerTitle, myinfo_a);
            this.divHeight_nodes = this.objCreate("div");
            this.divHeight_nodes.classList.add("pc_payheighet", "iconfont", "icon-bc-blalian", "network");
            this.divHeight_nodes.style.top = "5px";
            this.divHeight_nodes.textContent = "n/a";
            this.divHeight_nodes.onclick = () => {
                this.hidden();
                BlackCat.ModifyNetworkLineView.refer = "PayView";
                BlackCat.ModifyNetworkLineView.defaultType = "nodes";
                BlackCat.Main.viewMgr.change("ModifyNetworkLineView");
            };
            this.ObjAppend(headerTitle, this.divHeight_nodes);
            this.divHeight_clis = this.objCreate("div");
            this.divHeight_clis.classList.add("pc_payheighet", "iconfont", "icon-bc-neolian", "network");
            this.divHeight_clis.textContent = "n/a";
            this.divHeight_clis.onclick = () => {
                if (BlackCat.Main.netMgr.getWWW().api_clis && BlackCat.Main.netMgr.getWWW().api_clis != "") {
                    this.hidden();
                    BlackCat.ModifyNetworkLineView.refer = "PayView";
                    BlackCat.ModifyNetworkLineView.defaultType = "clis";
                    BlackCat.Main.viewMgr.change("ModifyNetworkLineView");
                }
            };
            this.ObjAppend(headerTitle, this.divHeight_clis);
            var headerh1 = this.objCreate("h1");
            headerh1.textContent = BlackCat.Main.platName;
            this.ObjAppend(headerTitle, headerh1);
            var divNetType = this.objCreate("div");
            divNetType.classList.add("pc_net", "iconfont");
            divNetType.textContent = this.getNetTypeName();
            divNetType.onclick = () => {
                this.showChangeNetType();
            };
            this.ObjAppend(headerTitle, divNetType);
            this.divNetSelect = this.objCreate("div");
            this.divNetSelect.classList.add("pc_netbox");
            this.ObjAppend(headerTitle, this.divNetSelect);
            var aReturnGame = this.objCreate("i");
            aReturnGame.classList.add("pc_returngame", "iconfont", "icon-bc-fanhui1");
            aReturnGame.onclick = () => {
                BlackCat.SDK.showIcon();
            };
            if (!window.hasOwnProperty("BC_androidSDK")) {
                this.ObjAppend(headerTitle, aReturnGame);
            }
            var btnbox = this.objCreate("div");
            this.ObjAppend(this.div, btnbox);
            btnbox.classList.add("pc_btnbox");
            var paycard = this.objCreate("div");
            paycard.classList.add("pc_card");
            this.ObjAppend(this.div, paycard);
            var aWalletDetail = this.objCreate("a");
            aWalletDetail.classList.add("pc_mydetail", "iconfont", "icon-bc-xiangqing");
            aWalletDetail.onclick = () => {
                this.wallet_detail();
            };
            this.ObjAppend(paycard, aWalletDetail);
            var divWallet = this.objCreate("div");
            divWallet.classList.add("pc_cardcon");
            divWallet.textContent = BlackCat.Main.user.info.wallet.substr(0, 4) + "****" + BlackCat.Main.user.info.wallet.substr(BlackCat.Main.user.info.wallet.length - 4);
            this.ObjAppend(paycard, divWallet);
            var payRefresh = this.objCreate("div");
            payRefresh.classList.add("pc_cardrefresh");
            payRefresh.textContent = BlackCat.Main.langMgr.get("pay_refresh");
            payRefresh.onclick = () => __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.viewMgr.change("ViewLoading");
                yield this.doGetBalances();
                yield this.doGetWalletLists(1);
                BlackCat.Main.viewMgr.viewLoading.remove();
            });
            this.ObjAppend(paycard, payRefresh);
            var iRefresh = this.objCreate("i");
            iRefresh.classList.add("iconfont", "icon-bc-shuaxin");
            this.ObjAppend(payRefresh, iRefresh);
            var divWalletUser = this.objCreate("div");
            divWalletUser.classList.add("pc_cardtransaction");
            this.ObjAppend(paycard, divWalletUser);
            var butReceivables = this.objCreate("button");
            butReceivables.textContent = BlackCat.Main.langMgr.get("pay_received");
            butReceivables.onclick = () => {
                this.doMakeReceivables();
            };
            this.ObjAppend(divWalletUser, butReceivables);
            var makeTransferObj = this.objCreate("button");
            makeTransferObj.textContent = BlackCat.Main.langMgr.get("pay_send");
            makeTransferObj.onclick = () => {
                this.doMakeTransfer();
            };
            this.ObjAppend(divWalletUser, makeTransferObj);
            this.divLists = this.objCreate("div");
            this.divLists.classList.add("pc_processing");
            this.ObjAppend(this.div, this.divLists);
            this.spanRecord = this.objCreate("div");
            this.ObjAppend(this.divLists, this.spanRecord);
            this.spanRecord.onclick = () => {
                this.hidden();
                BlackCat.PayListProcessView.refer = "PayView";
                BlackCat.Main.viewMgr.change("PayListProcessView");
            };
            this.pendingListsElement = this.objCreate("div");
            this.ObjAppend(this.divLists, this.pendingListsElement);
            var iconfont = this.objCreate("i");
            iconfont.classList.add("iconfont", "icon-bc-sanjiaoxing");
            this.ObjAppend(this.divLists, iconfont);
            var divCurrency = this.objCreate("div");
            divCurrency.classList.add("pc_currency");
            this.ObjAppend(this.div, divCurrency);
            var divChainNav = this.objCreate("div");
            divChainNav.classList.add("pc_currencynumber");
            this.ObjAppend(divCurrency, divChainNav);
            let curr_chain_number = BlackCat.Main.netMgr.getCurrChain();
            let curr_chain = curr_chain_number.toString();
            let curr_net_number = BlackCat.Main.netMgr.getCurrNet();
            let curr_net = curr_net_number.toString();
            this.chains.forEach((chain_number) => {
                let chain = chain_number.toString();
                this["chain_" + chain] = this.objCreate("div");
                this["chain_" + chain].innerText = BlackCat.Main.langMgr.get("pay_chain_" + chain);
                this["chain_" + chain].onclick = () => {
                    BlackCat.Main.changeChainType(chain_number);
                };
                this.ObjAppend(divChainNav, this["chain_" + chain]);
            });
            this["chain_" + curr_chain].classList.add('active');
            this["coin_list_" + curr_chain] = this.objCreate("div");
            this["coin_list_" + curr_chain].classList.add("pc_currencylist");
            this["coin_list_" + curr_chain].classList.add("active");
            this.ObjAppend(divCurrency, this["coin_list_" + curr_chain]);
            let chain_coins = BlackCat.Main.netMgr.getChainCoins(curr_chain_number);
            chain_coins.forEach((coin) => {
                let coinElement = this.objCreate("div");
                coinElement.innerHTML = BlackCat.Main.langMgr.get(coin);
                this.ObjAppend(this["coin_list_" + curr_chain], coinElement);
                let logoElement = this.objCreate("img");
                logoElement.src = BlackCat.Main.resHost + "res/img/" + coin + ".png";
                logoElement.classList.add("coinlogo");
                this.ObjAppend(coinElement, logoElement);
                let labelElement = this.objCreate("label");
                labelElement.classList.add("iconfont", "icon-bc-help");
                this.ObjAppend(coinElement, labelElement);
                let descText = "";
                if (BlackCat.Main.in_array(coin, ["gas", "neo"])) {
                    descText = BlackCat.Main.langMgr.get("pay_" + coin + "_desc" + "_" + curr_chain);
                }
                else {
                    descText = BlackCat.Main.langMgr.get("pay_" + coin + "_desc");
                }
                if (descText != "") {
                    let descElement = this.objCreate("div");
                    descElement.classList.add("pc_coincon");
                    descElement.textContent = descText;
                    this.ObjAppend(labelElement, descElement);
                }
                else {
                    labelElement.style.display = "none";
                }
                let moreElement = this.objCreate("i");
                moreElement.classList.add("iconfont", "icon-bc-gengduo");
                this.ObjAppend(coinElement, moreElement);
                this["span" + coin.toUpperCase()] = this.objCreate("span");
                this["span" + coin.toUpperCase()].textContent = "0";
                this.ObjAppend(coinElement, this["span" + coin.toUpperCase()]);
                coinElement.onclick = () => {
                    this["doExchange" + coin.toUpperCase()]();
                };
            });
            let coins_old = BlackCat.Main.netMgr.getChainCoinsOld(curr_chain_number);
            coins_old.forEach((coin) => {
                let coin_upcase = coin.toUpperCase() + "_OLD";
                if (BlackCat.Main.netMgr.getCoinTool()["id_" + coin_upcase].length > 0) {
                    BlackCat.Main.netMgr.getCoinTool()["id_" + coin_upcase].forEach((old) => {
                        let coinElement = this.objCreate("div");
                        coinElement.innerHTML = BlackCat.Main.langMgr.get("pay_" + coin);
                        this.ObjAppend(this["coin_list_" + curr_chain], coinElement);
                        let logoElement = this.objCreate("img");
                        logoElement.src = BlackCat.Main.resHost + "res/img/old" + coin + ".png";
                        logoElement.classList.add("coinlogo");
                        this.ObjAppend(coinElement, logoElement);
                        let labelElement = this.objCreate("label");
                        labelElement.classList.add("iconfont", "icon-bc-help");
                        this.ObjAppend(coinElement, labelElement);
                        let descElement = this.objCreate("div");
                        descElement.classList.add("pc_coincon");
                        descElement.textContent = old;
                        this.ObjAppend(labelElement, descElement);
                        let moreElement = this.objCreate("i");
                        moreElement.classList.add("iconfont", "icon-bc-gengduo");
                        this.ObjAppend(coinElement, moreElement);
                        this["span" + coin_upcase + old] = this.objCreate("span");
                        this["span" + coin_upcase + old].textContent = "0";
                        this.ObjAppend(coinElement, this["span" + coin_upcase + old]);
                        coinElement.onclick = () => {
                            this.doMakeRefundOld(old, coin_upcase);
                        };
                    });
                }
            });
            this.doGetBalances();
            this.doGetWalletLists(1);
            this.getHeight("nodes");
            this.getHeight("clis");
        }
        update() {
            var isHidden = this.isHidden();
            this.reset();
            super.update();
            if (isHidden)
                this.hidden();
        }
        key_esc() {
        }
        clearTimeout() {
            if (this.s_doGetWalletLists)
                clearTimeout(this.s_doGetWalletLists);
        }
        doGetBalances() {
            return __awaiter(this, void 0, void 0, function* () {
                let chain = BlackCat.Main.netMgr.getCurrChain();
                switch (chain) {
                    case 2:
                        yield this._doGetBalances_neo();
                        break;
                }
            });
        }
        _doGetBalances_neo() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.netMgr.getCoinTool().initAllAsset();
                var balances = (yield BlackCat.Main.netMgr.getWWW().api_getBalance(BlackCat.Main.user.info.wallet));
                if (balances) {
                    balances.map(item => (item.names = BlackCat.Main.netMgr.getCoinTool().assetID2name[item.asset]));
                    yield balances.forEach(balance => {
                        if (balance.asset == BlackCat.Main.netMgr.getCoinTool().id_GAS) {
                            this.gas = balance.balance;
                            this["spanGAS"].textContent = BlackCat.Main.getStringNumber(this.gas);
                        }
                        else if (balance.asset == BlackCat.Main.netMgr.getCoinTool().id_NEO) {
                            this.neo = balance.balance;
                            this["spanNEO"].textContent = BlackCat.Main.getStringNumber(this.neo);
                        }
                    });
                }
                else {
                    this.gas = 0;
                    this.neo = 0;
                    this["spanGAS"].textContent = "0";
                    this["spanNEO"].textContent = "0";
                }
                BlackCat.Main.netMgr.getChainCoins(BlackCat.Main.netMgr.getCurrChain()).forEach(coin => {
                    if (coin != "gas" && coin != "neo") {
                        this.getNep5Balance(coin.toUpperCase());
                    }
                });
                BlackCat.Main.netMgr.getChainCoinsOld(BlackCat.Main.netMgr.getCurrChain()).forEach(coin => {
                    this.getNep5BalanceOld(coin.toUpperCase() + "_OLD");
                });
            });
        }
        getNep5BalanceOld(coin) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let coin_lowcase = coin.toLowerCase();
                    yield BlackCat.Main.netMgr.getCoinTool()["id_" + coin].forEach((old) => __awaiter(this, void 0, void 0, function* () {
                        this[coin_lowcase + old] = yield BlackCat.Main["get" + coin + "BalanceByAddress"](old, BlackCat.Main.user.info.wallet);
                        this["span" + coin + old].textContent = BlackCat.Main.getStringNumber(this[coin_lowcase + old]);
                    }));
                }
                catch (e) { }
            });
        }
        getNep5Balance(coin) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let coin_lowcase = coin.toLowerCase();
                    this[coin_lowcase] = yield BlackCat.Main["get" + coin + "BalanceByAddress"](BlackCat.Main.netMgr.getCoinTool()["id_" + coin], BlackCat.Main.user.info.wallet);
                    this["span" + coin].textContent = BlackCat.Main.getStringNumber(this[coin_lowcase]);
                    BlackCat.Main.viewMgr.updateBalance();
                }
                catch (e) { }
            });
        }
        doMakeRefundOld(id_old, type = "CGAS_OLD") {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.isWalletOpen()) {
                    let id_OLD = id_old;
                    let balance = yield BlackCat.Main["get" + type + "BalanceByAddress"](id_OLD, BlackCat.Main.user.info.wallet);
                    let id_balance = balance.toString();
                    BlackCat.ViewTransferCount.transType = "refund";
                    BlackCat.ViewTransferCount.transNncOld = id_OLD;
                    if (type == "CGAS_OLD") {
                        BlackCat.ViewTransferCount.coinType = "CGAS";
                    }
                    else if (type == "CNEO_OLD") {
                        BlackCat.ViewTransferCount.coinType = "CNEO";
                    }
                    BlackCat.ViewTransferCount.refer = "PayView";
                    BlackCat.ViewTransferCount.callback = () => {
                        this.makeRefundTransaction(id_old, type);
                    };
                    BlackCat.Main.viewMgr.change("ViewTransferCount");
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "PayView";
                    BlackCat.ViewWalletOpen.callback = () => {
                        this.doMakeRefundOld(id_old, type);
                    };
                    BlackCat.Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        doExchangeGAS() {
            return __awaiter(this, void 0, void 0, function* () {
                this.doExchangeToken("CGAS", "refund");
            });
        }
        doExchangeCNEO() {
            return __awaiter(this, void 0, void 0, function* () {
                this.doExchangeToken("CNEO", "mint");
            });
        }
        doExchangeCGAS() {
            return __awaiter(this, void 0, void 0, function* () {
                this.doExchangeToken("CGAS", "mint");
            });
        }
        doExchangeToken(coinType = "CGAS", transType = "") {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.isWalletOpen()) {
                    BlackCat.ViewTransferCount.coinType = coinType;
                    BlackCat.ViewTransferCount.transType = transType;
                    BlackCat.ViewTransferCount.transNncOld = "";
                    BlackCat.ViewTransferCount.refer = "PayView";
                    BlackCat.ViewTransferCount.callback = () => {
                        switch (BlackCat.ViewTransferCount.transType) {
                            case "mint":
                                this.makeMintTokenTransaction(coinType);
                                break;
                            case "refund":
                                this.makeRefundTransaction(BlackCat.Main.netMgr.getCoinTool()["id_" + coinType], coinType);
                                break;
                        }
                    };
                    BlackCat.Main.viewMgr.change("ViewTransferCount");
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "PayView";
                    BlackCat.ViewWalletOpen.callback = () => {
                        this.doExchangeToken(coinType, transType);
                    };
                    BlackCat.Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        doExchangeNEO() {
            return __awaiter(this, void 0, void 0, function* () {
                this.doExchangeToken("CNEO", "refund");
            });
        }
        divLists_recreate() {
            this.pendingListsElement.innerHTML = "";
        }
        doGetWalletLists(force = 0) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("[BlaCat]", '[PayView]', '[doGetWalletLists]', '获取交易记录，force => ', force);
                if (!BlackCat.Main.user.info.wallet) {
                    console.log("[BlaCat]", '[PayView]', '[doGetWalletLists]', '已退出登录，本次请求取消');
                    return;
                }
                if (force == 0 && this.WalletListsNeedConfirm) {
                    console.log("[BlaCat]", '[PayView]', '[doGetWalletLists]', '有定时刷新，本次请求取消');
                    return;
                }
                if (this.s_doGetWalletLists) {
                    clearTimeout(this.s_doGetWalletLists);
                    this.s_doGetWalletLists = null;
                }
                var res = BlackCat.ApiTool.getWalletListss(1, this.listPageNum, 1);
                if (res.r) {
                    this.divLists_recreate();
                    BlackCat.Main.viewMgr.iconView.flushProcess(res.data.length);
                    this.spanRecord.innerHTML = BlackCat.Main.langMgr.get('payview_process', { count: res.data.length });
                    BlackCat.PayListProcessView.lists = res.data;
                    if (BlackCat.Main.viewMgr.payListProcessView && !BlackCat.Main.viewMgr.payListProcessView.isHidden()) {
                        BlackCat.Main.viewMgr.payListProcessView.updateLists();
                    }
                    if (res.data && res.data.length > 0) {
                        var next_timeout = 0;
                        var curr_ts = Math.round((new Date()).getTime() / 1000);
                        yield res.data.forEach(list => {
                            let last_ts = (curr_ts - list.ctm) * 1000 - BlackCat.Main.tsOffset;
                            let next_timeout_tmp = BlackCat.Main.netMgr.getNextBlockTs(last_ts);
                            if (next_timeout === 0) {
                                next_timeout = next_timeout_tmp;
                            }
                            else if (next_timeout > next_timeout_tmp) {
                                next_timeout = next_timeout_tmp;
                            }
                        });
                        console.log("[BlaCat]", '[PayView]', '[doGetWalletLists]', next_timeout / 1000, "(s)后再次获取");
                        this.s_doGetWalletLists = setTimeout(() => { this.doGetWalletLists(1); }, next_timeout);
                        this.WalletListsNeedConfirm = true;
                    }
                    let walletListsHash_tmp = JSON.stringify(res.data);
                    if (this.walletListsHash != null && walletListsHash_tmp != this.walletListsHash) {
                        console.log("[BlaCat]", '[PayView]', '[doGetWalletLists]', '更新余额');
                        this.doGetBalances();
                    }
                    this.walletListsHash = walletListsHash_tmp;
                }
                else {
                    BlackCat.Main.showErrCode(res.errCode);
                }
            });
        }
        getCoinIcon(v, coin_type) {
            try {
                var params = JSON.parse(v.params);
                if (params.hasOwnProperty("nnc")) {
                    params = [params];
                }
                if (params instanceof Array) {
                    for (let k in params) {
                        let this_nnc = null;
                        if (params[k].hasOwnProperty('asset')) {
                            this_nnc = params[k]['asset'];
                        }
                        else if (params[k].hasOwnProperty('nnc')) {
                            this_nnc = params[k]['nnc'];
                        }
                        if (this_nnc) {
                            if (v.chain_type == "2") {
                                if (this_nnc == BlackCat.Main.netMgr.getCoinTool()["id_" + coin_type.toUpperCase()]) {
                                    return BlackCat.Main.resHost + "res/img/" + coin_type.toLowerCase() + ".png";
                                }
                            }
                            else {
                                if (this_nnc == BlackCat.Main.netMgr.getCoinTool()["id_" + coin_type.toUpperCase()]) {
                                    return BlackCat.Main.resHost + "res/img/" + coin_type.toLowerCase() + ".png";
                                }
                            }
                        }
                    }
                }
            }
            catch (e) {
                console.log("[BlaCat]", '[PayView]', '[getCoinIcon]', 'v.type=' + v.type + ', error => ', e);
            }
            return BlackCat.Main.resHost + "res/img/old" + coin_type.toLowerCase() + ".png";
        }
        getListImg(v) {
            if (v.state == "0" && v.type == "5") {
                return BlackCat.Main.resHost + "res/img/transconfirm.png";
            }
            switch (v.type) {
                case "1":
                case "2":
                case "3":
                case "4":
                    if (v.type_detail == "0") {
                        return this.getCoinIcon(v, 'cgas');
                    }
                    for (let k in BlackCat.PayTransferView.log_type_detail) {
                        if (BlackCat.PayTransferView.log_type_detail[k] == v.type_detail) {
                            return this.getCoinIcon(v, k);
                        }
                    }
                    break;
                case "5":
                    var nep5Type = null;
                    var coinTool = null;
                    nep5Type = ['gas', 'cgas', 'neo', 'cneo'];
                    coinTool = 'CoinTool';
                    try {
                        var params = JSON.parse(v.params);
                        if (params.hasOwnProperty("nnc")) {
                            params = [params];
                        }
                        if (params instanceof Array) {
                            for (let k in params) {
                                if (params[k].hasOwnProperty('nnc')) {
                                    for (let i = 0; i < nep5Type.length; i++) {
                                        if (params[k].nnc == BlackCat.tools[coinTool]["id_" + nep5Type[i].toUpperCase()]) {
                                            return BlackCat.Main.resHost + "res/img/" + nep5Type[i] + ".png";
                                        }
                                    }
                                    if (v.chain_type == "2") {
                                        for (let m = 0; m < BlackCat.Main.netMgr.getCoinTool().id_CGAS_OLD.length; m++) {
                                            if (params[k].nnc == BlackCat.Main.netMgr.getCoinTool().id_CGAS_OLD[m]) {
                                                return BlackCat.Main.resHost + "res/img/oldcgas.png";
                                            }
                                        }
                                        for (let m = 0; m < BlackCat.Main.netMgr.getCoinTool().id_CNEO_OLD.length; m++) {
                                            if (params[k].nnc == BlackCat.Main.netMgr.getCoinTool().id_CNEO_OLD[m]) {
                                                return BlackCat.Main.resHost + "res/img/oldcneo.png";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    catch (e) {
                        console.log("[BlaCat]", '[PayView]', '[getListImg]', 'v.type=5, error => ', e);
                    }
                    return this.getListGameIcon(v);
                case "6":
                    if (v.type_detail == "0") {
                        return BlackCat.Main.resHost + "res/img/gas.png";
                    }
                    for (let k in BlackCat.PayTransferView.log_type_detail) {
                        if (BlackCat.PayTransferView.log_type_detail[k] == v.type_detail) {
                            return this.getCoinIcon(v, k);
                        }
                    }
                    break;
            }
            return BlackCat.Main.resHost + "res/img/game0.png";
        }
        getListGameIcon(v) {
            try {
                var iconObj = JSON.parse(v.icon);
                if (iconObj.hasOwnProperty(BlackCat.Main.langMgr.type) && iconObj[BlackCat.Main.langMgr.type] != "") {
                    return iconObj[BlackCat.Main.langMgr.type];
                }
                else if (iconObj.hasOwnProperty(BlackCat.Main.applang) && iconObj[BlackCat.Main.applang] != "") {
                    return iconObj[BlackCat.Main.applang];
                }
            }
            catch (e) {
                console.log("[BlaCat]", '[PayView]', '[getListGameIcon]', 'v => ', v, 'error => ', e.toString());
            }
            return v.icon;
        }
        getAppName(v) {
            var name = v.name;
            try {
                var nameObj = JSON.parse(name);
                if (nameObj.hasOwnProperty(BlackCat.Main.langMgr.type)) {
                    return nameObj[BlackCat.Main.langMgr.type];
                }
                else if (nameObj.hasOwnProperty(v.lang)) {
                    return nameObj[v.lang];
                }
            }
            catch (e) {
                console.log("[BlaCat]", '[PayView]', '[getAppName]', 'name =>', name, 'error => ', e.toString());
            }
            return name;
        }
        getListName(v) {
            if (v.g_id == "0") {
                return BlackCat.Main.platName;
            }
            return this.getAppName(v);
        }
        getListCtm(v) {
            return BlackCat.Main.getDate(v.ctm);
        }
        getListCtmMsg(v) {
            var str = "";
            var timestamp = (new Date()).getTime();
            var ts = Math.round(timestamp / 1000);
            var last = ts - Number(v.ctm);
            var year = 60 * 60 * 24 * 365;
            var month = 60 * 60 * 24 * 30;
            var day = 60 * 60 * 24;
            var hour = 60 * 60;
            var minute = 60;
            if (last >= year) {
                var n = Math.floor(last / year);
                return BlackCat.Main.langMgr.get("paylist_ctm_year", { "year": n });
            }
            else if (last >= month) {
                var n = Math.floor(last / month);
                return BlackCat.Main.langMgr.get("paylist_ctm_month", { "month": n });
            }
            else if (last >= day) {
                var n = Math.floor(last / day);
                return BlackCat.Main.langMgr.get("paylist_ctm_day", { "day": n });
            }
            else if (last >= hour) {
                var n = Math.floor(last / hour);
                return BlackCat.Main.langMgr.get("paylist_ctm_hour", { "hour": n });
            }
            else if (last >= minute) {
                var n = Math.floor(last / minute);
                return BlackCat.Main.langMgr.get("paylist_ctm_minute", { "minute": n });
            }
            else if (last >= 0) {
                return BlackCat.Main.langMgr.get("paylist_ctm_recent");
            }
            else {
                return BlackCat.Main.langMgr.get("paylist_ctm_recent");
            }
        }
        getListParamMethods(v) {
            try {
                var params = JSON.parse(v.params);
                if (params.hasOwnProperty("sbPushString")) {
                    params = [params];
                }
                if (params instanceof Array) {
                    var method = new Array();
                    for (let k in params) {
                        if (params[k].hasOwnProperty("sbPushString")) {
                            method.push(params[k].sbPushString);
                        }
                    }
                    if (method.length > 1) {
                        return method[0] + ', ...';
                    }
                    else {
                        return method.toString();
                    }
                }
            }
            catch (e) {
                console.log("[BlaCat]", '[PayView]', '[getListParamMethods]', 'v => ', v, 'error => ', e.toString());
            }
            return BlackCat.Main.langMgr.get("paylist_sbPushString_none");
        }
        getListCnts(v) {
            if (v.cnts && Number(v.cnts) != 0) {
                var state_cnts_span = this.objCreate("span");
                state_cnts_span.textContent = v.cnts;
                return state_cnts_span;
            }
        }
        getListCntsClass(v) {
            if (v.type == "1"
                || (v.type == "5" && v.type_detail == "2")
                || v.type == "9"
                || v.type == "11"
                || v.type == "12"
                || v.type == "13"
                || v.type == "15") {
                return 'pc_income';
            }
            else if (Number(v.cnts) > 0) {
                return 'pc_expenditure';
            }
            return "";
        }
        getListState(v) {
            var state = v.state;
            var pct = "50%";
            var i = 1;
            switch (v.type) {
                case "2":
                    pct = "25%";
                    if (v.state == "1") {
                        state = '0';
                        pct = '50%';
                        if (v.ext != "") {
                            state = '0';
                            pct = "75%";
                            if (v.client_notify == "1") {
                                state = '1';
                            }
                        }
                        else {
                            if (!BlackCat.Main.isWalletOpen()) {
                                i = 2;
                            }
                        }
                    }
                    break;
            }
            switch (state) {
                case '0':
                    var state_button0 = this.objCreate("div");
                    state_button0.classList.add("pc_verification");
                    if (i == 1) {
                        state_button0.classList.add("iconfont", "icon-bc-dengdai");
                        state_button0.innerHTML = "<label>" + pct + "</label>";
                    }
                    else {
                        var obja = this.objCreate("a");
                        obja.classList.add("iconfont", "icon-bc-jinhangzhong");
                        obja.innerHTML = '<label>' + pct + '</label>';
                        obja.onclick = () => {
                            BlackCat.Main.continueWithOpenWallet();
                            event.stopPropagation();
                        };
                        this.ObjAppend(state_button0, obja);
                    }
                    return state_button0;
                case '1':
                    var state_a1 = this.objCreate("a");
                    state_a1.classList.add("iconfont", "icon-bc-gou");
                    return state_a1;
                case '2':
                    var state_a2 = this.objCreate("a");
                    state_a2.classList.add("iconfont", "icon-bc-chacha");
                    return state_a2;
            }
        }
        getListBlockindex(v) {
            if (v.hasOwnProperty('blockindex')) {
                return v["blockindex"];
            }
            return 0;
        }
        wallet_detail() {
            if (BlackCat.Main.isWalletOpen()) {
                BlackCat.PayWalletDetailView.refer = "PayView";
                BlackCat.Main.viewMgr.change("PayWalletDetailView");
                this.hidden();
            }
            else {
                BlackCat.ViewWalletOpen.refer = "PayView";
                BlackCat.ViewWalletOpen.callback = () => {
                    this.wallet_detail();
                };
                BlackCat.Main.viewMgr.change("ViewWalletOpen");
            }
        }
        makeMintTokenTransaction(coinType = "CGAS") {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.viewMgr.change("ViewLoading");
                var mintCount = BlackCat.Main.viewMgr.viewTransferCount.inputCount.value;
                var net_fee = BlackCat.Main.viewMgr.viewTransferCount.net_fee;
                console.log("[BlaCat]", '[PayView]', '[makeMintTokenTransaction]', '充值' + coinType + '，数量 => ', mintCount, '手续费netfee =>', net_fee);
                var login = BlackCat.tools.LoginInfo.getCurrentLogin();
                try {
                    var utxos_assets = yield BlackCat.Main.netMgr.getCoinTool().getassets();
                    console.log("[BlaCat]", '[PayView]', '[makeMintTokenTransaction]', 'utxos_assets => ', utxos_assets);
                    if (coinType == "CGAS") {
                        var scriptaddress = BlackCat.Main.netMgr.getCoinTool().id_CGAS.hexToBytes().reverse();
                        var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                        var makeTranRes = BlackCat.Main.netMgr.getCoinTool().makeTran(utxos_assets, nepAddress, BlackCat.Main.netMgr.getCoinTool().id_GAS, Neo.Fixed8.fromNumber(Number(mintCount)), Neo.Fixed8.fromNumber(Number(net_fee)), 0, true);
                    }
                    else {
                        var scriptaddress = BlackCat.Main.netMgr.getCoinTool().id_CNEO.hexToBytes().reverse();
                        var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                        var makeTranRes = BlackCat.Main.netMgr.getCoinTool().makeTran(utxos_assets, nepAddress, BlackCat.Main.netMgr.getCoinTool().id_NEO, Neo.Fixed8.fromNumber(Number(mintCount)), Neo.Fixed8.Zero, 0, false);
                        if (Number(net_fee) > 0) {
                            try {
                                var user_makeTranRes = BlackCat.Main.netMgr.getCoinTool().makeTran(utxos_assets, BlackCat.Main.user.info.wallet, BlackCat.Main.netMgr.getCoinTool().id_GAS, Neo.Fixed8.Zero, Neo.Fixed8.fromNumber(Number(net_fee)));
                                var user_tran = user_makeTranRes.info.tran;
                                for (let i = 0; i < user_tran.inputs.length; i++) {
                                    makeTranRes.info.tran.inputs.push(user_tran.inputs[i]);
                                }
                                for (let i = 0; i < user_tran.outputs.length; i++) {
                                    makeTranRes.info.tran.outputs.push(user_tran.outputs[i]);
                                }
                                var user_oldarr = user_makeTranRes.info.oldarr;
                                for (let i = 0; i < user_oldarr.length; i++) {
                                    makeTranRes.info.oldarr.push(user_oldarr[i]);
                                }
                                console.log("[BlaCat]", '[PayView]', '[makeMintTokenTransaction]', 'user_makeTranRes => ', user_makeTranRes);
                            }
                            catch (e) {
                                BlackCat.Main.viewMgr.viewLoading.remove();
                                let errmsg = BlackCat.Main.langMgr.get(e.message);
                                if (errmsg) {
                                    BlackCat.Main.showErrMsg((e.message));
                                }
                                else {
                                    BlackCat.Main.showErrMsg(("pay_makeMintGasNotEnough"));
                                }
                                return;
                            }
                        }
                    }
                }
                catch (e) {
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    let errmsg = BlackCat.Main.langMgr.get(e.message);
                    if (errmsg) {
                        BlackCat.Main.showErrMsg((e.message));
                    }
                    else {
                        if (coinType == "CGAS") {
                            BlackCat.Main.showErrMsg("pay_makeMintGasNotEnough");
                        }
                        else {
                            BlackCat.Main.showErrMsg("pay_makeMintNeoNotEnough");
                        }
                    }
                    return;
                }
                var inputs_counts = makeTranRes.info.tran.hasOwnProperty("inputs") ? makeTranRes.info.tran.inputs.length : 0;
                var outputs_counts = makeTranRes.info.tran.hasOwnProperty("outputs") ? makeTranRes.info.tran.outputs.length : 0;
                var utxo_counts = inputs_counts + outputs_counts;
                if (utxo_counts >= 50) {
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    if (coinType == "CGAS") {
                        BlackCat.Main.showErrMsg("pay_makeMintGasUtxoCountsLimit", () => {
                            BlackCat.PayTransferView.transferType_default = "GAS";
                            BlackCat.PayTransferView.callback = null;
                            BlackCat.PayTransferView.address = BlackCat.Main.user.info.wallet;
                            BlackCat.Main.viewMgr.change("PayTransferView");
                            BlackCat.Main.viewMgr.payTransferView.inputTransferCount.value = mintCount;
                        }, { gas: mintCount });
                    }
                    else {
                        BlackCat.Main.showErrMsg("pay_makeMintNeoUtxoCountsLimit", () => {
                            BlackCat.PayTransferView.transferType_default = "NEO";
                            BlackCat.PayTransferView.callback = null;
                            BlackCat.PayTransferView.address = BlackCat.Main.user.info.wallet;
                            BlackCat.Main.viewMgr.change("PayTransferView");
                            BlackCat.Main.viewMgr.payTransferView.inputTransferCount.value = mintCount;
                        }, { neo: mintCount });
                    }
                    return;
                }
                var sb = new ThinNeo.ScriptBuilder();
                sb.EmitParamJson([]);
                sb.EmitPushString("mintTokens");
                sb.EmitAppCall(scriptaddress);
                var tran = makeTranRes.info.tran;
                var oldarr = makeTranRes.info.oldarr;
                tran.type = ThinNeo.TransactionType.InvocationTransaction;
                tran.extdata = new ThinNeo.InvokeTransData();
                tran.extdata.script = sb.ToArray();
                tran.extdata.gas = Neo.Fixed8.fromNumber(Number(net_fee));
                var msg = tran.GetMessage();
                var signdata = ThinNeo.Helper.Sign(msg, login.prikey);
                tran.AddWitness(signdata, login.pubkey, login.address);
                var txid = "0x" + tran.GetHash().clone().reverse().toHexString();
                var data = tran.GetRawData();
                var r = yield BlackCat.Main.netMgr.getWWW().api_postRawTransaction(data);
                if (r) {
                    if (r["txid"] || r["sendrawtransactionresult"]) {
                        if (!r["txid"] || r["txid"] == "") {
                            r["txid"] = txid;
                        }
                        var log_type = "1";
                        var log_nnc = BlackCat.Main.netMgr.getCoinTool()["id_" + coinType];
                        var logRes = yield BlackCat.ApiTool.addUserWalletLogs(r["txid"], mintCount, log_type, '{"sbParamJson":"[]", "sbPushString": "mintTokens", "nnc": "' + log_nnc + '"}', net_fee, BlackCat.PayTransferView.log_type_detail[coinType.toLowerCase()]);
                        var height = yield BlackCat.Main.netMgr.getWWW().api_getHeight_nodes();
                        oldarr.map(old => old.height = height);
                        BlackCat.tools.OldUTXO.oldutxosPush(oldarr);
                        BlackCat.Main.viewMgr.viewLoading.remove();
                        this.doGetWalletLists(1);
                    }
                    else {
                        BlackCat.Main.viewMgr.viewLoading.remove();
                        BlackCat.Main.showErrMsg("pay_makeMintDoFail");
                    }
                }
                else {
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    BlackCat.Main.showErrMsg("pay_makeMintDoFail2");
                }
            });
        }
        makeRefundTransaction(id_ASSET = BlackCat.Main.netMgr.getCoinTool().id_CGAS, coinType = "CGAS") {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.viewMgr.change("ViewLoading");
                var refundCount = BlackCat.Main.viewMgr.viewTransferCount.inputCount.value;
                var sendCount = Neo.Fixed8.fromNumber(Number(refundCount));
                var net_fee = BlackCat.Main.viewMgr.viewTransferCount.net_fee;
                console.log("[BlaCat]", '[PayView]', '[makeRefundTransaction]', '退到gas/neo，数量 => ', refundCount, '手续费netfee =>', net_fee);
                var scriptaddress = id_ASSET.hexToBytes().reverse();
                var login = BlackCat.tools.LoginInfo.getCurrentLogin();
                if (id_ASSET == '0x74f2dc36a68fdc4682034178eb2220729231db76') {
                    var utxos_assets = yield BlackCat.Main.netMgr.getCoinTool().getCgasAssets(id_ASSET, Number(refundCount));
                }
                else {
                    var utxos_assets = yield BlackCat.Main.netMgr.getCoinTool().getNep5Assets(id_ASSET);
                }
                var log_type = "2";
                var coinType_asset = BlackCat.Main.netMgr.getCoinTool().id_GAS;
                var not_enough_utxo_err = "pay_makeRefundCgasNotEnoughUtxo";
                var not_enough_err = "pay_makeRefundCgasNotEnough";
                if (coinType == "CNEO" || coinType == "CNEO_OLD") {
                    coinType_asset = BlackCat.Main.netMgr.getCoinTool().id_NEO;
                    not_enough_utxo_err = "pay_makeRefundCneoNotEnoughUtxo";
                    not_enough_err = "pay_makeRefundCneoNotEnough";
                }
                var us = utxos_assets[coinType_asset];
                if (us == undefined) {
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    BlackCat.Main.showErrMsg(not_enough_utxo_err);
                    return;
                }
                let us_random = [];
                BlackCat.Main.randomSort(us, us_random);
                us = us_random;
                console.log("[BlaCat]", '[payView]', '[makeRefundTransaction]', 'us.before => ', us);
                var us_parse = [];
                var count = Neo.Fixed8.Zero;
                for (var i = us.length - 1; i >= 0; i--) {
                    if (count.compareTo(sendCount) > 0) {
                        console.log("[BlaCat]", '[payView]', '[makeRefundTransaction]', 'enough us[' + i + '].delete => ', us[i]);
                        continue;
                    }
                    if (us[i].n > 0) {
                        count = count.add(us[i].count);
                        us_parse.push(us[i]);
                        continue;
                    }
                    var sb = new ThinNeo.ScriptBuilder();
                    sb.EmitParamJson(["(hex256)" + us[i].txid.toString()]);
                    sb.EmitPushString("getRefundTarget");
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    var r = yield BlackCat.Main.netMgr.getWWW().api_getInvokescript(data);
                    if (r) {
                        var stack = r["stack"];
                        var value = stack[0]["value"].toString();
                        if (value.length > 0) {
                            console.log("[BlaCat]", '[payView]', '[makeRefundTransaction]', 'us[' + i + '].delete => ', us[i]);
                        }
                        else {
                            count = count.add(us[i].count);
                            us_parse.push(us[i]);
                        }
                    }
                }
                us = us_parse;
                console.log("[BlaCat]", '[payView]', '[makeRefundTransaction]', 'us.after => ', us);
                utxos_assets[coinType_asset] = us;
                console.log("[BlaCat]", '[payView]', '[makeRefundTransaction]', 'utxos_assets.after => ', utxos_assets);
                try {
                    var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                    var makeTranRes = BlackCat.Main.netMgr.getCoinTool().makeTran(utxos_assets, nepAddress, coinType_asset, Neo.Fixed8.fromNumber(Number(refundCount)));
                    if (Number(net_fee) > 0) {
                        try {
                            var user_utxos_assets = yield BlackCat.Main.netMgr.getCoinTool().getassets();
                            console.log("[BlaCat]", '[PayView]', '[makeRefundTransaction]', 'user_utxos_assets => ', user_utxos_assets);
                            var user_makeTranRes = BlackCat.Main.netMgr.getCoinTool().makeTran(user_utxos_assets, BlackCat.Main.user.info.wallet, BlackCat.Main.netMgr.getCoinTool().id_GAS, Neo.Fixed8.Zero, Neo.Fixed8.fromNumber(Number(net_fee)));
                            var user_tran = user_makeTranRes.info.tran;
                            for (let i = 0; i < user_tran.inputs.length; i++) {
                                makeTranRes.info.tran.inputs.push(user_tran.inputs[i]);
                            }
                            for (let i = 0; i < user_tran.outputs.length; i++) {
                                makeTranRes.info.tran.outputs.push(user_tran.outputs[i]);
                            }
                            var user_oldarr = user_makeTranRes.info.oldarr;
                            for (let i = 0; i < user_oldarr.length; i++) {
                                makeTranRes.info.oldarr.push(user_oldarr[i]);
                            }
                            console.log("[BlaCat]", '[PayView]', '[makeRefundTransaction]', 'user_makeTranRes => ', user_makeTranRes);
                        }
                        catch (e) {
                            BlackCat.Main.viewMgr.viewLoading.remove();
                            let errmsg = BlackCat.Main.langMgr.get(e.message);
                            if (errmsg) {
                                BlackCat.Main.showErrMsg((e.message));
                            }
                            else {
                                BlackCat.Main.showErrMsg(("pay_makeMintGasNotEnough"));
                            }
                            return;
                        }
                    }
                }
                catch (e) {
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    BlackCat.Main.showErrMsg(not_enough_err);
                    return;
                }
                console.log("[BlaCat]", "[payView]", "[makeRefundTransaction]", "makeTranRes => ", makeTranRes);
                var r = yield BlackCat.Main.netMgr.getWWW().api_getcontractstate(id_ASSET);
                if (r && r["script"]) {
                    var Script = r["script"].hexToBytes();
                    var scriptHash = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(login.address);
                    var sb = new ThinNeo.ScriptBuilder();
                    sb.EmitParamJson(["(bytes)" + scriptHash.toHexString()]);
                    sb.EmitPushString("refund");
                    sb.EmitAppCall(scriptaddress);
                    var tran = makeTranRes.info.tran;
                    var oldarr = makeTranRes.info.oldarr;
                    tran.type = ThinNeo.TransactionType.InvocationTransaction;
                    tran.extdata = new ThinNeo.InvokeTransData();
                    tran.extdata.script = sb.ToArray();
                    if (Number(net_fee) > 0)
                        tran.extdata.gas = Neo.Fixed8.fromNumber(Number(net_fee));
                    tran.attributes = new Array(1);
                    tran.attributes[0] = new ThinNeo.Attribute();
                    tran.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
                    tran.attributes[0].data = scriptHash;
                    var wsb = new ThinNeo.ScriptBuilder();
                    wsb.EmitPushString("whatever");
                    wsb.EmitPushNumber(new Neo.BigInteger(250));
                    tran.AddWitnessScript(Script, wsb.ToArray());
                    var signdata = ThinNeo.Helper.Sign(tran.GetMessage(), login.prikey);
                    tran.AddWitness(signdata, login.pubkey, login.address);
                    var txid = "0x" + tran.GetHash().clone().reverse().toHexString();
                    var trandata = tran.GetRawData();
                    console.log("[BlaCat]", '[payView]', '[makeRefundTransaction]', 'tran => ', tran);
                    r = yield BlackCat.Main.netMgr.getWWW().api_postRawTransaction(trandata);
                    if (r) {
                        if (r.txid || r['sendrawtransactionresult']) {
                            if (!r["txid"] || r["txid"] == "") {
                                r["txid"] = txid;
                            }
                            var paramJson_tmp = "(bytes)" + scriptHash.toHexString();
                            var logRes = yield BlackCat.ApiTool.addUserWalletLogs(r.txid, refundCount, log_type, '{"sbParamJson":"' + paramJson_tmp + '", "sbPushString": "refund", "nnc": "' + id_ASSET + '", "net_fee": "' + net_fee + '"}', "", BlackCat.PayTransferView.log_type_detail[coinType.toLowerCase()]);
                            var height = yield BlackCat.Main.netMgr.getWWW().api_getHeight_nodes();
                            oldarr.map(old => old.height = height);
                            BlackCat.tools.OldUTXO.oldutxosPush(oldarr);
                            BlackCat.Main.viewMgr.viewLoading.remove();
                            this.doGetWalletLists(1);
                        }
                        else {
                            BlackCat.Main.viewMgr.viewLoading.remove();
                            BlackCat.Main.showErrMsg(("pay_makeRefundDoFail"));
                        }
                        console.log("[BlaCat]", '[payView]', '[makeRefundTransaction]', 'api_postRawTransaction结果 => ', r);
                    }
                    else {
                        BlackCat.Main.viewMgr.viewLoading.remove();
                        BlackCat.Main.showErrMsg("pay_makeRefundDoFail2");
                    }
                }
                else {
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    BlackCat.Main.showErrMsg("pay_makeRefundGetScriptFail");
                }
            });
        }
        doMakeReceivables() {
            return __awaiter(this, void 0, void 0, function* () {
                this.hidden();
                BlackCat.PayReceivablesView.refer = "PayView";
                BlackCat.Main.viewMgr.change("PayReceivablesView");
            });
        }
        doMakeTransfer() {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.isWalletOpen()) {
                    BlackCat.PayTransferView.refer = "PayView";
                    BlackCat.PayTransferView.callback = () => {
                        this.doGetWalletLists(1);
                    };
                    BlackCat.Main.viewMgr.change("PayTransferView");
                }
                else {
                    BlackCat.ViewWalletOpen.refer = "PayView";
                    BlackCat.ViewWalletOpen.callback = () => {
                        this.doMakeTransfer();
                    };
                    BlackCat.Main.viewMgr.change("ViewWalletOpen");
                }
            });
        }
        flushListCtm() {
            var ctms = document.getElementsByClassName("listCtm");
            if (ctms && ctms.length > 0) {
                for (let k = 0; k < ctms.length; k++) {
                    var list = {
                        ctm: ctms[k].getAttribute("ctm")
                    };
                    ctms[k].textContent = this.getListCtmMsg(list);
                }
            }
        }
        getNetTypeName() {
            return BlackCat.Main.langMgr.get("pay_nettype_" + BlackCat.Main.netMgr.getCurrNet());
        }
        showChangeNetType() {
            if (this.divNetSelect.innerHTML.length > 0) {
                this.divNetSelect.innerHTML = "";
            }
            else {
                var other = BlackCat.Main.netMgr.getOtherNets();
                for (let i = 0; i < other.length; i++) {
                    this.ObjAppend(this.divNetSelect, this.getDivNetSelectType(other[i]));
                }
            }
        }
        getDivNetSelectType(type) {
            var divObj = this.objCreate("div");
            divObj.textContent = BlackCat.Main.langMgr.get("pay_nettype_" + type);
            divObj.onclick = () => {
                BlackCat.Main.changeNetType(type);
            };
            return divObj;
        }
        checkTransCount(count) {
            var regex = /(?!^0*(\.0{1,2})?$)^\d{1,14}(\.\d{1,8})?$/;
            if (!regex.test(count)) {
                return false;
            }
            if (Number(count) <= 0) {
                return false;
            }
            return true;
        }
        getHeight(type, chain = null) {
            return __awaiter(this, void 0, void 0, function* () {
                let height = "";
                height = yield BlackCat.Main.netMgr.getWWW()["api_getHeight_" + type]();
                if (height) {
                    this.updateHeight(type, height);
                }
            });
        }
        updateHeight(type, height) {
            this["divHeight_" + type].textContent = height.toString();
            this["height_" + type] = height;
        }
        parseTypeDetailType10(type_detail) {
            var res = { type: "0", type_src: "0" };
            var detail = parseInt(type_detail);
            res.type_src = Math.floor(detail / 1000).toString();
            res.type = (detail % 1000).toString();
            return res;
        }
    }
    BlackCat.PayView = PayView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PayWalletDetailView extends BlackCat.ViewBase {
        reset() {
            this.private_wif = "";
            this.private_hex = "";
        }
        create() {
            this.getWalletInfo();
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_walletdetail");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("pay_walletDetail");
            this.ObjAppend(header, headerH1);
            var content = this.objCreate("div");
            content.classList.add("pc_paydetail");
            content.innerHTML
                = "<ul><li>" + BlackCat.Main.langMgr.get("pay_walletDetail_addr") + "<p>" + this.wallet_addr + "</p></li>"
                    + "<li>" + BlackCat.Main.langMgr.get("pay_walletDetail_key") + "<p>" + this.public_key + "</p></li>"
                    + "<li class='pc_detailhide'>" + BlackCat.Main.langMgr.get("pay_walletDetail_hex") + "<p>" + this.private_hex + "</p></li>"
                    + "<li class='pc_detailhide'>" + BlackCat.Main.langMgr.get("pay_walletDetail_wif") + "<p>" + this.private_wif + "</p></li>";
            this.ObjAppend(this.div, content);
            var divNotes = this.objCreate("div");
            divNotes.classList.add("pc_paydetailnotes");
            divNotes.innerText = BlackCat.Main.langMgr.get("pay_walletDetail_notice");
            this.ObjAppend(content, divNotes);
            var iMoreshow = this.objCreate("i");
            iMoreshow.classList.add("iconfont", "icon-bc-gengduo1");
            iMoreshow.onclick = () => {
                content.classList.add("pc_paydetailshow");
                iMoreshow.style.display = "none";
                iMorehide.style.display = "block";
            };
            this.ObjAppend(divNotes, iMoreshow);
            var iMorehide = this.objCreate("i");
            iMorehide.style.display = "none";
            iMorehide.classList.add("iconfont", "icon-bc-gengduo1");
            iMorehide.onclick = () => {
                content.classList.remove("pc_paydetailshow");
                iMorehide.style.display = "none";
                iMoreshow.style.display = "block";
            };
            this.ObjAppend(divNotes, iMorehide);
            this.walletExport = this.objCreate("a");
            this.walletExport.classList.add("pc_walletExport");
            this.walletExport.textContent = BlackCat.Main.langMgr.get("pay_walletDetail_export");
            this.walletExport.setAttribute("download", this.wallet_addr + ".json");
            this.ObjAppend(this.div, this.walletExport);
            this.exportWallet();
            var iWalletExport = this.objCreate("i");
            iWalletExport.classList.add("iconfont", "icon-bc-daochuqianbao");
            this.ObjAppend(this.walletExport, iWalletExport);
        }
        toRefer() {
            if (PayWalletDetailView.refer) {
                BlackCat.Main.viewMgr.change(PayWalletDetailView.refer);
                PayWalletDetailView.refer = null;
            }
        }
        getWalletInfo() {
            var login = BlackCat.tools.LoginInfo.getCurrentLogin();
            this.wallet_addr = BlackCat.tools.LoginInfo.getCurrentAddress();
            this.public_key = login.pubkey.toHexString();
            this.private_wif = ThinNeo.Helper.GetWifFromPrivateKey(login.prikey);
            this.private_hex = login.prikey.toHexString();
        }
        exportWallet() {
            return __awaiter(this, void 0, void 0, function* () {
                if (BlackCat.Main.wallet.filestr || (yield BlackCat.Main.wallet.readWalletFile(1))) {
                    var blob = new Blob([ThinNeo.Helper.String2Bytes(BlackCat.Main.wallet.filestr)]);
                    var url = URL.createObjectURL(blob);
                    this.walletExport.setAttribute('href', url);
                }
            });
        }
    }
    BlackCat.PayWalletDetailView = PayWalletDetailView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class PersonalCenterView extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_myinfo");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("personalcenter");
            this.ObjAppend(header, headerH1);
            var myinfo = this.objCreate("div");
            myinfo.classList.add("pc_myinfolist");
            var ulMyinfo = this.objCreate("ul");
            this.ObjAppend(myinfo, ulMyinfo);
            var liMyinfoNet = this.objCreate("li");
            liMyinfoNet.textContent = BlackCat.Main.langMgr.get("modifyNet");
            liMyinfoNet.onclick = () => {
                this.hidden();
                BlackCat.ModifyNetworkLineView.refer = "PersonalCenterView";
                BlackCat.ModifyNetworkLineView.defaultType = "nodes";
                BlackCat.Main.viewMgr.change("ModifyNetworkLineView");
            };
            this.ObjAppend(ulMyinfo, liMyinfoNet);
            var iMyinfoNet = this.objCreate("i");
            iMyinfoNet.classList.add("iconfont", "icon-bc-gengduo");
            this.ObjAppend(liMyinfoNet, iMyinfoNet);
            var spanNet_nodes = this.objCreate("span");
            this.ObjAppend(liMyinfoNet, spanNet_nodes);
            spanNet_nodes.classList.add("pc_spannet");
            this.myNet_nodes = this.objCreate("div");
            this.myNet_nodes.textContent = "API";
            this.ObjAppend(spanNet_nodes, this.myNet_nodes);
            this.divHeight_nodes = this.objCreate("div");
            this.divHeight_nodes.classList.add("iconfont", "icon-bc-blalian");
            this.divHeight_nodes.textContent = "n/a";
            this.ObjAppend(spanNet_nodes, this.divHeight_nodes);
            var spanNet_clis = this.objCreate("span");
            this.ObjAppend(liMyinfoNet, spanNet_clis);
            spanNet_clis.classList.add("pc_spannet", "pc_spannet_clis");
            this.myNet_clis = this.objCreate("div");
            this.myNet_clis.textContent = "CLI";
            this.ObjAppend(spanNet_clis, this.myNet_clis);
            this.divHeight_clis = this.objCreate("div");
            this.divHeight_clis.classList.add("iconfont", "icon-bc-neolian");
            this.divHeight_clis.textContent = "n/a";
            this.ObjAppend(spanNet_clis, this.divHeight_clis);
            var liMyinfoTrust = this.objCreate("li");
            liMyinfoTrust.textContent = BlackCat.Main.langMgr.get("myinfo_security");
            liMyinfoTrust.onclick = () => {
                this.hidden();
                BlackCat.SecurityCenterView.refer = "PersonalCenterView";
                BlackCat.Main.viewMgr.change("SecurityCenterView");
            };
            this.ObjAppend(ulMyinfo, liMyinfoTrust);
            var iMyinfoTrust = this.objCreate("i");
            iMyinfoTrust.classList.add("iconfont", "icon-bc-gengduo");
            this.ObjAppend(liMyinfoTrust, iMyinfoTrust);
            var spanMyinfoTrust = this.objCreate("span");
            spanMyinfoTrust.textContent = BlackCat.Main.langMgr.get("myinfo_set");
            this.ObjAppend(liMyinfoTrust, spanMyinfoTrust);
            var logout = this.objCreate("button");
            logout.textContent = BlackCat.Main.langMgr.get("myinfo_logout");
            logout.onclick = () => {
                this.doLogout();
            };
            this.ObjAppend(myinfo, logout);
            this.ObjAppend(this.div, myinfo);
            this.getNodeHeight("nodes");
            this.getNodeHeight("clis");
        }
        toRefer() {
            if (PersonalCenterView.refer) {
                BlackCat.Main.viewMgr.change(PersonalCenterView.refer);
                PersonalCenterView.refer = null;
            }
        }
        doLogout() {
            BlackCat.ViewConfirm.callback = () => {
                this.makeLogout();
            };
            BlackCat.Main.showConFirm("myinfo_logoutConfirm");
        }
        makeLogout() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.user.logout();
                BlackCat.Main.viewMgr.removeAll();
                BlackCat.Main.viewMgr.change("WalletView");
                BlackCat.Main.logoutCallback();
            });
        }
        getNodeHeight(type) {
            return __awaiter(this, void 0, void 0, function* () {
                let height = BlackCat.Main.viewMgr.payView["height_" + type].toString();
                if (height > 0) {
                    this["divHeight_" + type].textContent = height == 0 ? "n/a" : height;
                }
            });
        }
        updateNodeInfo() {
            this.getNodeHeight("nodes");
            if (BlackCat.Main.netMgr.getWWW().api_clis && BlackCat.Main.netMgr.getWWW().api_clis != "") {
                this.getNodeHeight("clis");
            }
        }
    }
    BlackCat.PersonalCenterView = PersonalCenterView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class SecurityCenterView extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_security");
            var header = this.objCreate("div");
            header.classList.add("pc_header");
            this.ObjAppend(this.div, header);
            var returnA = this.objCreate("a");
            returnA.classList.add("iconfont", "icon-bc-fanhui");
            returnA.textContent = BlackCat.Main.langMgr.get("return");
            returnA.onclick = () => {
                this.return();
            };
            this.ObjAppend(header, returnA);
            var headerH1 = this.objCreate("h1");
            headerH1.textContent = BlackCat.Main.langMgr.get("security_title");
            this.ObjAppend(header, headerH1);
            var divSecurity = this.objCreate("div");
            divSecurity.classList.add("pc_myinfolist");
            this.ObjAppend(this.div, divSecurity);
            var ulSecurity = this.objCreate("ul");
            this.ObjAppend(divSecurity, ulSecurity);
            var liSignOut = this.objCreate("li");
            liSignOut.style.cursor = "pointer";
            liSignOut.textContent = BlackCat.Main.langMgr.get("security_walletOut");
            liSignOut.onclick = () => {
                this.hidden();
                BlackCat.AutoLogoutWalletView.refer = "SecurityCenterView";
                BlackCat.Main.viewMgr.change("AutoLogoutWalletView");
            };
            this.ObjAppend(ulSecurity, liSignOut);
            var iSignOut = this.objCreate("i");
            iSignOut.classList.add("iconfont", "icon-bc-gengduo");
            this.ObjAppend(liSignOut, iSignOut);
            this.spanSignOut = this.objCreate("span");
            this.spanSignOut.textContent = this.getWalletOutTimeMaxMsg(BlackCat.Main.getLiveTimeMax());
            this.ObjAppend(liSignOut, this.spanSignOut);
            var divwalletOutTips = this.objCreate("div");
            divwalletOutTips.classList.add("pc_signout_tips");
            divwalletOutTips.textContent = BlackCat.Main.langMgr.get("security_walletOut_toast");
            this.ObjAppend(liSignOut, divwalletOutTips);
        }
        toRefer() {
            if (SecurityCenterView.refer) {
                BlackCat.Main.viewMgr.change(SecurityCenterView.refer);
                SecurityCenterView.refer = null;
            }
        }
        getWalletOutTimeMaxMsg(liveTimeMax) {
            if (liveTimeMax >= (60 * 60 * 1000)) {
                let hour = liveTimeMax / (60 * 60 * 1000);
                return BlackCat.Main.langMgr.get("security_walletOut_admin_h", { hours: hour });
            }
            else if (liveTimeMax > 0) {
                let minute = liveTimeMax / (60 * 1000);
                return BlackCat.Main.langMgr.get("security_walletOut_admin_m", { minutes: minute });
            }
            return BlackCat.Main.langMgr.get("security_walletOut_admin");
        }
        updateWalletOutTimeMaxMsg() {
            this.spanSignOut.textContent = this.getWalletOutTimeMaxMsg(BlackCat.Main.getLiveTimeMax());
        }
    }
    BlackCat.SecurityCenterView = SecurityCenterView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewAlert extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_alter");
            var alter = this.objCreate('div');
            alter.classList.add("pc_alterbox");
            this.ObjAppend(this.div, alter);
            var popupTitle = this.objCreate('div');
            popupTitle.classList.add("pc_altertitle");
            popupTitle.innerText = BlackCat.Main.langMgr.get("info");
            this.ObjAppend(alter, popupTitle);
            var alterText = this.objCreate("div");
            alterText.classList.add("pc_altertext");
            var lang_content = BlackCat.Main.langMgr.get(ViewAlert.content, ViewAlert.content_ext);
            if (!lang_content) {
                lang_content = ViewAlert.content;
            }
            alterText.textContent = lang_content;
            this.ObjAppend(alter, alterText);
            var popupbutbox = this.objCreate('div');
            popupbutbox.classList.add("pc_popupbutbox");
            this.ObjAppend(alter, popupbutbox);
            var butConfirm = this.objCreate("button");
            butConfirm.textContent = BlackCat.Main.langMgr.get("ok");
            butConfirm.onclick = () => {
                this.doConfirm();
            };
            this.ObjAppend(popupbutbox, butConfirm);
        }
        key_esc() {
            this.doConfirm();
        }
        key_enter() {
            this.doConfirm();
        }
        toRefer() {
            if (ViewAlert.refer) {
                BlackCat.Main.viewMgr.change(ViewAlert.refer);
                ViewAlert.refer = null;
            }
        }
        doConfirm() {
            this.remove(300);
            if (ViewAlert.callback) {
                ViewAlert.callback();
                ViewAlert.callback = null;
            }
        }
    }
    BlackCat.ViewAlert = ViewAlert;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewConfirm extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_alter", "pc_confirm");
            var alter = this.objCreate('div');
            alter.classList.add("pc_alterbox");
            this.ObjAppend(this.div, alter);
            var popupTitle = this.objCreate('div');
            popupTitle.classList.add("pc_altertitle");
            popupTitle.innerText = BlackCat.Main.langMgr.get("info");
            this.ObjAppend(alter, popupTitle);
            var alterText = this.objCreate("div");
            alterText.classList.add("pc_altertext");
            var lang_content = BlackCat.Main.langMgr.get(ViewConfirm.content);
            if (!lang_content) {
                lang_content = ViewConfirm.content;
            }
            alterText.textContent = lang_content;
            this.ObjAppend(alter, alterText);
            var popupbutbox = this.objCreate('div');
            popupbutbox.classList.add("pc_popupbutbox");
            this.ObjAppend(alter, popupbutbox);
            var popupClose = this.objCreate("button");
            popupClose.classList.add("pc_cancel");
            popupClose.textContent = BlackCat.Main.langMgr.get("cancel");
            popupClose.onclick = () => {
                this.doCancel();
            };
            this.ObjAppend(popupbutbox, popupClose);
            var butConfirm = this.objCreate("button");
            butConfirm.textContent = BlackCat.Main.langMgr.get("ok");
            butConfirm.onclick = () => {
                this.doConfirm();
            };
            this.ObjAppend(popupbutbox, butConfirm);
        }
        toRefer() {
            if (ViewConfirm.refer) {
                BlackCat.Main.viewMgr.change(ViewConfirm.refer);
                ViewConfirm.refer = null;
            }
        }
        key_esc() {
            this.doCancel();
        }
        doConfirm() {
            this.remove(300);
            ViewConfirm.callback(ViewConfirm.callback_params);
            ViewConfirm.callback_params = null;
        }
        doCancel() {
            this.remove(300);
            if (ViewConfirm.callback_cancel) {
                ViewConfirm.callback_cancel(ViewConfirm.callback_params);
            }
            ViewConfirm.callback_params = null;
        }
    }
    BlackCat.ViewConfirm = ViewConfirm;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewConnecting extends BlackCat.ViewBase {
        constructor() {
            super(...arguments);
            this.showReturn = false;
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_connecting");
            if (this.showType == "connecting") {
                this.showConnecting();
            }
            else if (this.showType == "retry") {
                this.showRetry(this.showReturn);
            }
        }
        key_esc() {
        }
        showConnecting() {
            this.showType = "connecting";
            this.div.innerHTML = "";
            this.div.classList.add("pc_loading");
            var divConnecting = this.objCreate("div");
            divConnecting.classList.add("pc_loadingbox");
            divConnecting.innerHTML =
                "<div class='pc_loading1'></div>"
                    + "<div class='pc_loading2'></div>"
                    + "<div class='pc_loading3'></div>"
                    + "<div class='pc_loading4'></div>"
                    + "<div class='pc_loading5'></div>"
                    + "<div class='pc_loading6'></div>"
                    + "<div class='pc_loading7'></div>"
                    + "<div class='pc_loading8'></div>"
                    + "<div class='pc_loading9'></div>"
                    + "<div class='pc_loading10'></div>"
                    + "<div class='pc_loading11'></div>"
                    + "<div class='pc_loading12'></div>"
                    + "<p id='pc_loadingtext'>" + BlackCat.Main.langMgr.get("netmgr_connecting") + "</p>";
            this.ObjAppend(this.div, divConnecting);
        }
        showRetry(showReturn) {
            this.showType = "retry";
            this.showReturn = showReturn;
            this.div.innerHTML = "";
            var divRetry = this.objCreate("div");
            divRetry.classList.add("pc_connectingtext");
            var descDiv = this.objCreate("div");
            var lang_key = "netmgr_connecting_fail";
            if (ViewConnecting.content) {
                lang_key = ViewConnecting.content;
            }
            descDiv.textContent = BlackCat.Main.langMgr.get(lang_key);
            this.ObjAppend(divRetry, descDiv);
            if (showReturn) {
                var returnObj = this.objCreate("button");
                returnObj.classList.add("pc_cancel");
                returnObj.textContent = BlackCat.Main.langMgr.get("return");
                returnObj.onclick = () => {
                    this.return();
                };
                this.ObjAppend(divRetry, returnObj);
            }
            var retryObj = this.objCreate("button");
            retryObj.textContent = BlackCat.Main.langMgr.get("retry");
            retryObj.onclick = () => {
                if (ViewConnecting.callback_retry)
                    ViewConnecting.callback_retry();
            };
            this.ObjAppend(divRetry, retryObj);
            this.ObjAppend(this.div, divRetry);
        }
    }
    BlackCat.ViewConnecting = ViewConnecting;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewLoading extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_loading");
            var divLoading = this.objCreate("div");
            divLoading.classList.add("pc_loadingbox");
            var lang_content = BlackCat.Main.langMgr.get(ViewLoading.content);
            if (!lang_content) {
                lang_content = ViewLoading.content;
            }
            divLoading.innerHTML =
                "<div class='pc_loading1'></div>"
                    + "<div class='pc_loading2'></div>"
                    + "<div class='pc_loading3'></div>"
                    + "<div class='pc_loading4'></div>"
                    + "<div class='pc_loading5'></div>"
                    + "<div class='pc_loading6'></div>"
                    + "<div class='pc_loading7'></div>"
                    + "<div class='pc_loading8'></div>"
                    + "<div class='pc_loading9'></div>"
                    + "<div class='pc_loading10'></div>"
                    + "<div class='pc_loading11'></div>"
                    + "<div class='pc_loading12'></div>"
                    + "<p id='pc_loadingtext'>" + lang_content + "</p>";
            this.ObjAppend(this.div, divLoading);
        }
        key_esc() {
        }
    }
    ViewLoading.content = "";
    BlackCat.ViewLoading = ViewLoading;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewMgr {
        constructor() {
            this.mainView = new BlackCat.MainView();
            this.mainView.start();
            this.views = {};
        }
        change(type) {
            switch (type) {
                case "ViewWalletOpen":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示打开钱包输入密码界面(' + type + ') ...');
                    if (!this.viewWalletOpen) {
                        this.viewWalletOpen = new BlackCat.ViewWalletOpen();
                        this.views[type] = this.viewWalletOpen;
                    }
                    this.viewWalletOpen.start();
                    break;
                case "ViewTransferCount":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示输入交易数量界面(' + type + ') ...');
                    if (!this.viewTransferCount) {
                        this.viewTransferCount = new BlackCat.ViewTransferCount();
                        this.views[type] = this.viewTransferCount;
                    }
                    this.viewTransferCount.start();
                    break;
                case "ViewTransactionConfirm":
                    console.log("[BlaCat]", '[viewMgr]', '[change]', '显示确认交易界面(' + type + ') ...');
                    if (!this.viewTransactionConfirm) {
                        this.viewTransactionConfirm = new BlackCat.ViewTransactionConfirm();
                        this.views[type] = this.viewTransactionConfirm;
                    }
                    this.viewTransactionConfirm.start();
                    break;
                case "IconView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示SDK图标(' + type + ') ...');
                    if (!this.iconView) {
                        this.iconView = new BlackCat.IconView();
                        this.views[type] = this.iconView;
                    }
                    this.iconView.start();
                    break;
                case "WalletView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示绑定&导入钱包(' + type + ') ...');
                    if (!this.walletView) {
                        this.walletView = new BlackCat.WalletView();
                        this.views[type] = this.walletView;
                    }
                    this.walletView.start();
                    break;
                case "WalletCreateView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示新建钱包(' + type + ') ...');
                    if (!this.walletCreateView) {
                        this.walletCreateView = new BlackCat.WalletCreateView();
                        this.views[type] = this.walletCreateView;
                    }
                    this.walletCreateView.start();
                    break;
                case "WalletCreateDownloadView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示新建钱包下载(' + type + ') ...');
                    if (!this.walletCreateDownloadView) {
                        this.walletCreateDownloadView = new BlackCat.WalletCreateDownloadView();
                        this.views[type] = this.walletCreateDownloadView;
                    }
                    this.walletCreateDownloadView.start();
                    break;
                case "WalletImportView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示导入钱包(' + type + ') ...');
                    if (!this.walletImportView) {
                        this.walletImportView = new BlackCat.WalletImportView();
                        this.views[type] = this.walletImportView;
                    }
                    this.walletImportView.start();
                    break;
                case "PayView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示钱包页(' + type + ') ...');
                    if (!this.payView) {
                        this.payView = new BlackCat.PayView();
                        this.views[type] = this.payView;
                    }
                    this.payView.start();
                    break;
                case "PayListDetailView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示交易详情(' + type + ') ...');
                    if (!this.payListDetailView) {
                        this.payListDetailView = new BlackCat.PayListDetailView();
                        this.views[type] = this.payListDetailView;
                    }
                    this.payListDetailView.start();
                    break;
                case "PayListMoreView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示更多记录(' + type + ') ...');
                    if (!this.payListMoreView) {
                        this.payListMoreView = new BlackCat.PayListMoreView();
                        this.views[type] = this.payListMoreView;
                    }
                    this.payListMoreView.start();
                    break;
                case "PayListProcessView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示处理中记录(' + type + ') ...');
                    if (!this.payListProcessView) {
                        this.payListProcessView = new BlackCat.PayListProcessView();
                        this.views[type] = this.payListProcessView;
                    }
                    this.payListProcessView.start();
                    break;
                case "PersonalCenterView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示个人中心(' + type + ') ...');
                    if (!this.personalCenterView) {
                        this.personalCenterView = new BlackCat.PersonalCenterView();
                        this.views[type] = this.personalCenterView;
                    }
                    this.personalCenterView.start();
                    break;
                case "PayWalletDetailView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示钱包详情(' + type + ') ...');
                    if (!this.payWalletDetailView) {
                        this.payWalletDetailView = new BlackCat.PayWalletDetailView();
                        this.views[type] = this.payWalletDetailView;
                    }
                    this.payWalletDetailView.start();
                    break;
                case "PayReceivablesView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示收款(' + type + ') ...');
                    if (!this.payReceivablesView) {
                        this.payReceivablesView = new BlackCat.PayReceivablesView();
                        this.views[type] = this.payReceivablesView;
                    }
                    this.payReceivablesView.start();
                    break;
                case "PayTransferView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示转账(' + type + ') ...');
                    if (!this.payTransferView) {
                        this.payTransferView = new BlackCat.PayTransferView();
                        this.views[type] = this.payTransferView;
                    }
                    this.payTransferView.start();
                    break;
                case "ViewAlert":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示提示(' + type + ') ...');
                    if (!this.viewAlert) {
                        this.viewAlert = new BlackCat.ViewAlert();
                        this.views[type] = this.viewAlert;
                    }
                    this.viewAlert.start();
                    break;
                case "ViewConfirm":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示确认(' + type + ') ...');
                    if (!this.viewConfirm) {
                        this.viewConfirm = new BlackCat.ViewConfirm();
                        this.views[type] = this.viewConfirm;
                    }
                    this.viewConfirm.start();
                    break;
                case "ViewToast":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示Toast(' + type + ') ...');
                    if (!this.viewToast) {
                        this.viewToast = new BlackCat.ViewToast();
                    }
                    this.viewToast.start();
                    break;
                case "ViewLoading":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示Loading(' + type + ') ...');
                    if (!this.viewLoading) {
                        this.viewLoading = new BlackCat.ViewLoading();
                        this.views[type] = this.viewLoading;
                    }
                    this.viewLoading.start();
                    break;
                case "ViewTransferConfirm":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示转账确认(' + type + ') ...');
                    if (!this.viewTransferConfirm) {
                        this.viewTransferConfirm = new BlackCat.ViewTransferConfirm();
                        this.views[type] = this.viewTransferConfirm;
                    }
                    this.viewTransferConfirm.start();
                    break;
                case "ModifyNetworkLineView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示修改网络线路(' + type + ') ...');
                    if (!this.modifyNetworkLineView) {
                        this.modifyNetworkLineView = new BlackCat.ModifyNetworkLineView();
                        this.views[type] = this.modifyNetworkLineView;
                    }
                    this.modifyNetworkLineView.start();
                    break;
                case "SecurityCenterView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示安全中心(' + type + ') ...');
                    if (!this.securityCenterView) {
                        this.securityCenterView = new BlackCat.SecurityCenterView();
                        this.views[type] = this.securityCenterView;
                    }
                    this.securityCenterView.start();
                    break;
                case "AutoLogoutWalletView":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示自动登出钱包(' + type + ') ...');
                    if (!this.autoLogoutWalletView) {
                        this.autoLogoutWalletView = new BlackCat.AutoLogoutWalletView();
                        this.views[type] = this.autoLogoutWalletView;
                    }
                    this.autoLogoutWalletView.start();
                    break;
                case "ViewConnecting":
                    console.log("[BlaCat]", '[ViewMgr]', '[change]', '显示连接中(' + type + ') ...');
                    if (!this.viewConnecting) {
                        this.viewConnecting = new BlackCat.ViewConnecting();
                        this.views[type] = this.viewConnecting;
                    }
                    this.viewConnecting.start();
                    break;
            }
        }
        removeAll() {
            for (let className in this.views) {
                let v = this.views[className];
                console.log("[BlaCat]", '[ViewMgr]', '[removeAll]', 'view => ', v);
                switch (className) {
                    case "IconView":
                        v.reset();
                        break;
                    default:
                        if (v.isCreated) {
                            v.remove();
                        }
                        break;
                }
            }
        }
        update() {
            console.log("[BlaCat]", '[ViewMgr]', '[update]', 'start ...');
            for (let className in this.views) {
                let v = this.views[className];
                console.log("[BlaCat]", '[ViewMgr]', '[update]', 'v =>', v);
                switch (className) {
                    case "PayView":
                        if (v.isCreated) {
                            v.update();
                        }
                        break;
                    default:
                        if (v.isCreated && !v.isHidden()) {
                            v.update();
                        }
                        break;
                }
            }
        }
        updateBalance() {
            console.log("[BlaCat]", '[ViewMgr]', '[updateBalance]', 'start ...');
            for (let className in this.views) {
                let v = this.views[className];
                if (v.__proto__["updateBalance"]) {
                    v.updateBalance();
                }
            }
        }
    }
    BlackCat.ViewMgr = ViewMgr;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewToast extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_alter", "pc_toast");
            var toast = this.objCreate("div");
            toast.classList.add("pc_alterbox");
            this.ObjAppend(this.div, toast);
            var alterText = this.objCreate("div");
            alterText.classList.add("pc_altertext");
            var lang_content = BlackCat.Main.langMgr.get(ViewToast.content);
            if (!lang_content) {
                lang_content = ViewToast.content;
            }
            alterText.textContent = lang_content;
            this.ObjAppend(toast, alterText);
        }
        show() {
            super.show();
            this.remove(ViewToast.showTime, null);
        }
        key_esc() {
        }
    }
    ViewToast.showTime = 2500;
    BlackCat.ViewToast = ViewToast;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewTransactionConfirm extends BlackCat.ViewBase {
        constructor() {
            super();
            if (!ViewTransactionConfirm.list) {
                ViewTransactionConfirm.list = new BlackCat.walletLists();
            }
        }
        start() {
            if (this.isCreated) {
                this.remove();
            }
            super.start();
            if (this.div.clientHeight < 667) {
                this.divConfirmSelect.style.top = "auto";
                this.divConfirmSelect.style.bottom = "0";
            }
            this.trust = "0";
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_listdetail", "pc_tradeconfirm", "pc_trust");
            if (ViewTransactionConfirm.list && ViewTransactionConfirm.list.hasOwnProperty("wallet")) {
                var headerTitle = this.objCreate("div");
                headerTitle.classList.add("pc_header");
                var returnBtn = this.objCreate("a");
                returnBtn.classList.add("iconfont", "icon-bc-fanhui");
                returnBtn.textContent = BlackCat.Main.langMgr.get("return");
                returnBtn.onclick = () => {
                    this.return();
                    if (ViewTransactionConfirm.callback_cancel) {
                        ViewTransactionConfirm.callback_cancel();
                        ViewTransactionConfirm.callback_cancel = null;
                    }
                    BlackCat.Main.viewMgr.mainView.hidden();
                    BlackCat.Main.viewMgr.change("IconView");
                };
                this.ObjAppend(headerTitle, returnBtn);
                var h1Obj = this.objCreate("h1");
                h1Obj.textContent = BlackCat.Main.platName;
                this.ObjAppend(headerTitle, h1Obj);
                this.ObjAppend(this.div, headerTitle);
                var contentObj = this.objCreate("div");
                contentObj.classList.add("pc_detail");
                contentObj.style.paddingBottom = "160px";
                contentObj.innerHTML
                    = '<ul>'
                        + '<li>'
                        + '<div class="pc_listimg">'
                        + '<img src="' + BlackCat.Main.viewMgr.payView.getListImg(ViewTransactionConfirm.list) + '">'
                        + '</div>'
                        + '<div class="pc_liftinfo">'
                        + '<div class="pc_listname">' + BlackCat.Main.viewMgr.payView.getListName(ViewTransactionConfirm.list) + '</div>'
                        + '<span class="pc_listdate">' + BlackCat.Main.viewMgr.payView.getListCtm(ViewTransactionConfirm.list) + '</span>'
                        + '</div>'
                        + '<div class="pc_cnts ' + BlackCat.Main.viewMgr.payView.getListCntsClass(ViewTransactionConfirm.list) + ' ">'
                        + this.getCnts()
                        + '</div>'
                        + '</li>'
                        + '<li><label>' + BlackCat.Main.langMgr.get("paylist_wallet") + '</label><p>' + this.getWallet() + '</p></li>'
                        + this.getParams()
                        + '</ul>';
                this.ObjAppend(this.div, contentObj);
                this.divConfirmSelect = this.objCreate("div");
                this.divConfirmSelect.classList.add("pc_tradeconfirmbut");
                this.ObjAppend(this.div, this.divConfirmSelect);
                this.netFeeCom = new BlackCat.NetFeeComponent(this.divConfirmSelect, (net_fee) => {
                    this.net_fee = net_fee;
                });
                if (ViewTransactionConfirm.callback_params.hasOwnProperty('minGasLimit')) {
                    this.netFeeCom.setGasLimitMin(ViewTransactionConfirm.callback_params.minGasLimit);
                }
                this.netFeeCom.setFeeDefault();
                this.netFeeCom.createDiv();
                var cancelObj = this.objCreate("button");
                cancelObj.classList.add("pc_cancel");
                cancelObj.textContent = BlackCat.Main.langMgr.get("cancel");
                cancelObj.onclick = () => {
                    console.log("[BlaCat]", '[ViewTransactionConfirm]', '[onclick]', '交易取消..');
                    if (ViewTransactionConfirm.callback_cancel) {
                        ViewTransactionConfirm.callback_cancel(ViewTransactionConfirm.callback_params);
                        ViewTransactionConfirm.callback_cancel = null;
                    }
                    this.remove();
                    BlackCat.Main.viewMgr.mainView.hidden();
                    BlackCat.Main.viewMgr.change("IconView");
                };
                this.ObjAppend(this.divConfirmSelect, cancelObj);
                var confirmObj = this.objCreate("button");
                if (ViewTransactionConfirm.list.type == "3") {
                    confirmObj.textContent = BlackCat.Main.langMgr.get("pay_makeRecharge");
                }
                else {
                    confirmObj.textContent = BlackCat.Main.langMgr.get("ok");
                }
                confirmObj.onclick = () => {
                    if (Number(this.net_fee) > BlackCat.Main.viewMgr.payView.gas) {
                        BlackCat.Main.showErrMsg('pay_makerawtrans_fee_less', null, { reason: "" });
                        return;
                    }
                    console.log("[BlaCat]", '[ViewTransactionConfirm]', '[onclick]', '交易确认..');
                    ViewTransactionConfirm.callback(ViewTransactionConfirm.callback_params, this.trust, this.net_fee);
                    ViewTransactionConfirm.callback = null;
                    this.remove(300);
                    BlackCat.Main.viewMgr.mainView.hidden();
                    BlackCat.Main.viewMgr.change("IconView");
                };
                this.ObjAppend(this.divConfirmSelect, confirmObj);
            }
        }
        toRefer() {
            if (ViewTransactionConfirm.refer) {
                BlackCat.Main.viewMgr.change(ViewTransactionConfirm.refer);
                ViewTransactionConfirm.refer = null;
            }
        }
        key_esc() {
        }
        getCnts() {
            return ViewTransactionConfirm.list.cnts != '0' ? ViewTransactionConfirm.list.cnts : "";
        }
        getWallet() {
            return ViewTransactionConfirm.list.wallet;
        }
        getParams() {
            var html = "";
            var params = ViewTransactionConfirm.list.params;
            console.log("[BlaCat]", '[ViewTransactionConfirm]', '[getParams]', 'params => ', params);
            if (params) {
                try {
                    params = JSON.parse(params);
                    if (params.hasOwnProperty("nnc")) {
                        params = [params];
                    }
                    if (params instanceof Array) {
                        for (let k in params) {
                            html += '<li class="pc_contractAddress">'
                                + '<div><label>' + BlackCat.Main.langMgr.get("paylist_nnc") + '</label><p>' + params[k].nnc + '</p></div>'
                                + '<div><label>' + BlackCat.Main.langMgr.get("paylist_sbParamJson") + '</label><p>' + params[k].sbParamJson + '</p></div>'
                                + '<div><label>' + BlackCat.Main.langMgr.get("paylist_sbPushString") + '</label><p>' + params[k].sbPushString + '</p></div>'
                                + '</li>';
                        }
                    }
                }
                catch (e) {
                    console.log("[BlaCat]", '[ViewTransactionConfirm]', '[getParams]', 'error => ', e.toString());
                }
            }
            return html;
        }
    }
    BlackCat.ViewTransactionConfirm = ViewTransactionConfirm;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewTransferConfirm extends BlackCat.ViewBase {
        constructor() {
            super();
            if (!ViewTransferConfirm.list) {
                ViewTransferConfirm.list = new BlackCat.walletLists();
            }
        }
        start() {
            if (this.isCreated) {
                this.remove();
            }
            super.start();
            if (this.div.clientHeight < 667) {
                this.divConfirmSelect.style.top = "auto";
                this.divConfirmSelect.style.bottom = "0";
            }
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_listdetail", "pc_tradeconfirm");
            if (ViewTransferConfirm.list && ViewTransferConfirm.list.hasOwnProperty("wallet")) {
                var headerTitle = this.objCreate("div");
                headerTitle.classList.add("pc_header");
                var returnBtn = this.objCreate("a");
                returnBtn.classList.add("iconfont", "icon-bc-fanhui");
                returnBtn.textContent = BlackCat.Main.langMgr.get("return");
                returnBtn.onclick = () => {
                    this.return();
                    if (ViewTransferConfirm.callback_cancel) {
                        ViewTransferConfirm.callback_cancel();
                        ViewTransferConfirm.callback_cancel = null;
                    }
                    BlackCat.Main.viewMgr.mainView.hidden();
                    BlackCat.Main.viewMgr.change("IconView");
                };
                this.ObjAppend(headerTitle, returnBtn);
                var h1Obj = this.objCreate("h1");
                h1Obj.textContent = BlackCat.Main.platName;
                this.ObjAppend(headerTitle, h1Obj);
                this.ObjAppend(this.div, headerTitle);
                var contentObj = this.objCreate("div");
                contentObj.classList.add("pc_detail");
                contentObj.style.paddingBottom = "160px";
                contentObj.innerHTML
                    = '<ul>'
                        + '<li>'
                        + '<div class="pc_listimg">'
                        + '<img src="' + BlackCat.Main.viewMgr.payView.getListImg(ViewTransferConfirm.list) + '">'
                        + '</div>'
                        + '<div class="pc_liftinfo">'
                        + '<div class="pc_listname">' + BlackCat.Main.viewMgr.payView.getListName(ViewTransferConfirm.list) + '</div>'
                        + '<span class="pc_listdate">' + BlackCat.Main.viewMgr.payView.getListCtm(ViewTransferConfirm.list) + '</span>'
                        + '</div>'
                        + '<div class="pc_cnts ' + BlackCat.Main.viewMgr.payView.getListCntsClass(ViewTransferConfirm.list) + ' ">'
                        + this.getCnts()
                        + '</div>'
                        + '</li>'
                        + '<li><label>' + BlackCat.Main.langMgr.get("paylist_wallet") + '</label><p>' + this.getWallet() + '</p></li>'
                        + this.getParams()
                        + '</ul>';
                this.ObjAppend(this.div, contentObj);
                this.divConfirmSelect = this.objCreate("div");
                this.divConfirmSelect.classList.add("pc_tradeconfirmbut");
                this.ObjAppend(this.div, this.divConfirmSelect);
                this.netFeeCom = new BlackCat.NetFeeComponent(this.divConfirmSelect, (net_fee) => {
                    this.net_fee = net_fee;
                });
                if (ViewTransferConfirm.callback_params.hasOwnProperty('minGasLimit')) {
                    this.netFeeCom.setGasLimitMin(ViewTransferConfirm.callback_params.minGasLimit);
                }
                this.netFeeCom.setFeeDefault();
                this.netFeeCom.createDiv();
                var cancelObj = this.objCreate("button");
                cancelObj.classList.add("pc_cancel");
                cancelObj.textContent = BlackCat.Main.langMgr.get("cancel");
                cancelObj.onclick = () => {
                    console.log("[BlaCat]", '[ViewTransferConfirm]', '[onclick]', '交易取消..');
                    if (ViewTransferConfirm.callback_cancel) {
                        ViewTransferConfirm.callback_cancel(ViewTransferConfirm.callback_params);
                        ViewTransferConfirm.callback_cancel = null;
                    }
                    this.remove();
                    BlackCat.Main.viewMgr.mainView.hidden();
                    BlackCat.Main.viewMgr.change("IconView");
                };
                this.ObjAppend(this.divConfirmSelect, cancelObj);
                var confirmObj = this.objCreate("button");
                if (ViewTransferConfirm.list.type == "3") {
                    confirmObj.textContent = BlackCat.Main.langMgr.get("pay_makeRecharge");
                }
                else {
                    confirmObj.textContent = BlackCat.Main.langMgr.get("ok");
                }
                confirmObj.onclick = () => {
                    console.log("[BlaCat]", '[ViewTransferConfirm]', '[onclick]', '交易确认..');
                    ViewTransferConfirm.callback(ViewTransferConfirm.callback_params, this.net_fee);
                    ViewTransferConfirm.callback = null;
                    this.remove(300);
                    BlackCat.Main.viewMgr.mainView.hidden();
                    BlackCat.Main.viewMgr.change("IconView");
                };
                this.ObjAppend(this.divConfirmSelect, confirmObj);
            }
        }
        toRefer() {
            if (ViewTransferConfirm.refer) {
                BlackCat.Main.viewMgr.change(ViewTransferConfirm.refer);
                ViewTransferConfirm.refer = null;
            }
        }
        key_esc() {
        }
        getCnts() {
            return ViewTransferConfirm.list.cnts != '0' ? ViewTransferConfirm.list.cnts : "";
        }
        getWallet() {
            return ViewTransferConfirm.list.wallet;
        }
        getParams() {
            var html = "";
            var params = ViewTransferConfirm.list.params;
            console.log("[BlaCat]", '[ViewTransferConfirm]', '[getParams]', 'params => ', params);
            if (params) {
                try {
                    params = JSON.parse(params);
                    if (params.hasOwnProperty("toaddr")) {
                        params = [params];
                    }
                    if (params instanceof Array) {
                        for (let k in params) {
                            html += '<li class="pc_contractAddress">'
                                + '<div><label>' + BlackCat.Main.langMgr.get("pay_transfer_toaddr") + '</label><p>' + params[k].toaddr + '</p></div>'
                                + '<div><label>' + BlackCat.Main.langMgr.get("pay_transfer_count") + '</label><p>' + params[k].count + '</p></div>'
                                + '</li>';
                        }
                    }
                }
                catch (e) {
                    console.log("[BlaCat]", '[ViewTransferConfirm]', '[getParams]', 'error => ', e.toString());
                }
            }
            return html;
        }
    }
    BlackCat.ViewTransferConfirm = ViewTransferConfirm;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewTransferCount extends BlackCat.ViewBase {
        start() {
            super.start();
            if (ViewTransferCount.transNncOld != "") {
                this.inputCount.focus();
            }
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_popup");
            var popupbox = this.objCreate('div');
            popupbox.classList.add("pc_popupbox");
            this.ObjAppend(this.div, popupbox);
            var popupTitle = this.objCreate('div');
            popupTitle.classList.add("pc_popup_title");
            popupTitle.innerText = BlackCat.Main.langMgr.get("pay_transCount_count");
            this.ObjAppend(popupbox, popupTitle);
            var divtransfertype = this.objCreate("div");
            divtransfertype.classList.add("pc_transfertype", "pc_token");
            this.ObjAppend(popupbox, divtransfertype);
            if (ViewTransferCount.transNncOld != "") {
                this.getCoinTypeLang();
                this.divtransfername = this.objCreate("div");
                this.ObjAppend(divtransfertype, this.divtransfername);
                this.labeltransfername1 = this.objCreate("label");
                this.labeltransfername1.textContent = this.coinTypeLang.src;
                this.ObjAppend(this.divtransfername, this.labeltransfername1);
                var itransfertype = this.objCreate("i");
                itransfertype.classList.add("iconfont", "icon-bc-jiantou1");
                this.ObjAppend(this.divtransfername, itransfertype);
                this.labeltransfername2 = this.objCreate("label");
                this.labeltransfername2.textContent = this.coinTypeLang.tat;
                this.ObjAppend(this.divtransfername, this.labeltransfername2);
            }
            else if (ViewTransferCount.transType == "") {
                this.selectTransfertype = this.objCreate("select");
                this.selectTransfertype.classList.add("iconfont");
                this.selectTransfertype.onchange = () => {
                    this.dotransfertype();
                };
                this.ObjAppend(divtransfertype, this.selectTransfertype);
                var optionTips = this.objCreate("option");
                optionTips.innerHTML = BlackCat.Main.langMgr.get("pay_transCount_tips");
                optionTips.selected = true;
                optionTips.disabled = true;
                optionTips.style.display = "none";
                this.ObjAppend(this.selectTransfertype, optionTips);
                this.getSelectOptions();
            }
            else {
                this.selectTransfertype = this.objCreate("select");
                this.selectTransfertype.classList.add("iconfont");
                this.selectTransfertype.disabled = true;
                this.ObjAppend(divtransfertype, this.selectTransfertype);
                this.getSelectOptions(ViewTransferCount.transType);
            }
            this.inputCount = this.objCreate("input");
            this.inputCount.type = "text";
            this.inputCount.style.margin = "0 auto 10px";
            this.inputCount.style.width = "80%";
            this.inputCount.placeholder = BlackCat.Main.langMgr.get("pay_transCount_inputCount");
            this.inputCount.onkeyup = () => {
                this.doinputchange();
            };
            this.ObjAppend(popupbox, this.inputCount);
            this.divHaveAmounts = this.objCreate("div");
            this.divHaveAmounts.classList.add("pc_haveamounts");
            this.ObjAppend(popupbox, this.divHaveAmounts);
            this.getCoinBalanceLang();
            this.getCoinBalance();
            this.divHaveNep5Amounts = this.objCreate("div");
            this.divHaveNep5Amounts.textContent = this.coinBalanceLang.tat + ": " + BlackCat.Main.getStringNumber(this.coinBalance.tat);
            this.ObjAppend(this.divHaveAmounts, this.divHaveNep5Amounts);
            this.spanHaveNep5Amounts = this.objCreate("span");
            this.ObjAppend(this.divHaveNep5Amounts, this.spanHaveNep5Amounts);
            this.divHaveUtxoAmounts = this.objCreate("div");
            this.divHaveUtxoAmounts.textContent = this.coinBalanceLang.src + ": " + BlackCat.Main.getStringNumber(this.coinBalance.src);
            this.ObjAppend(this.divHaveAmounts, this.divHaveUtxoAmounts);
            this.spanHaveUtxoAmounts = this.objCreate("span");
            this.ObjAppend(this.divHaveUtxoAmounts, this.spanHaveUtxoAmounts);
            this.netFeeCom = new BlackCat.NetFeeComponent(popupbox, (net_fee) => {
                this.netFeeChange(net_fee);
            });
            this.netFeeCom.setFeeDefault();
            this.netFeeCom.createDiv();
            var popupbutbox = this.objCreate('div');
            popupbutbox.classList.add("pc_popupbutbox");
            this.ObjAppend(popupbox, popupbutbox);
            var popupClose = this.objCreate('button');
            popupClose.classList.add("pc_cancel");
            popupClose.textContent = BlackCat.Main.langMgr.get("cancel");
            popupClose.onclick = () => {
                this.remove(300);
            };
            this.ObjAppend(popupbutbox, popupClose);
            var confirmObj = this.objCreate("button");
            confirmObj.textContent = BlackCat.Main.langMgr.get("ok");
            confirmObj.onclick = () => {
                this.doConfirm();
            };
            this.ObjAppend(popupbutbox, confirmObj);
            this.configNetFee();
        }
        toRefer() {
            if (ViewTransferCount.refer) {
                BlackCat.Main.viewMgr.change(ViewTransferCount.refer);
                ViewTransferCount.refer = null;
            }
        }
        key_esc() {
        }
        doinputchange() {
            if (ViewTransferCount.coinType == "CNEO") {
                var neo_int = parseInt(this.inputCount.value);
                if (neo_int > 0) {
                    this.inputCount.value = parseInt(this.inputCount.value).toString();
                }
                else {
                    this.inputCount.value = "";
                }
            }
            if (!BlackCat.Main.viewMgr.payView.checkTransCount(this.inputCount.value)) {
                this.divHaveUtxoAmounts.classList.remove("pc_income", "pc_expenditure");
                this.divHaveNep5Amounts.classList.remove("pc_income", "pc_expenditure");
                this.spanHaveNep5Amounts.textContent = "";
                this.spanHaveUtxoAmounts.textContent = "";
                return;
            }
            if (this.checkBalance()) {
                switch (ViewTransferCount.transType) {
                    case "mint":
                        this.divHaveUtxoAmounts.classList.add("pc_expenditure");
                        this.divHaveNep5Amounts.classList.add("pc_income");
                        switch (ViewTransferCount.coinType) {
                            case "CGAS":
                                this.spanHaveUtxoAmounts.textContent = BlackCat.Main.getStringNumber(BlackCat.floatNum.plus(Number(this.inputCount.value), Number(this.net_fee)));
                                break;
                            case "CNEO":
                                this.spanHaveUtxoAmounts.textContent = this.inputCount.value;
                                break;
                        }
                        break;
                    case "refund":
                        this.divHaveUtxoAmounts.classList.add("pc_income");
                        this.divHaveNep5Amounts.classList.add("pc_expenditure");
                        switch (ViewTransferCount.coinType) {
                            case "CGAS":
                                this.spanHaveUtxoAmounts.textContent = BlackCat.Main.getStringNumber(BlackCat.floatNum.minus(Number(this.inputCount.value), Number(this.net_fee) * 2));
                                break;
                            case "CNEO":
                                this.spanHaveUtxoAmounts.textContent = this.inputCount.value;
                                break;
                        }
                        break;
                }
                this.spanHaveNep5Amounts.textContent = this.inputCount.value;
            }
        }
        doConfirm() {
            if (!this.inputCount.value) {
                this.inputCount.focus();
                return;
            }
            if (!BlackCat.Main.viewMgr.payView.checkTransCount(this.inputCount.value)) {
                BlackCat.Main.showErrMsg('pay_transCount_err', () => {
                    this.inputCount.focus();
                });
                return;
            }
            if (ViewTransferCount.transNncOld != "" && ViewTransferCount.transType != "refund") {
                BlackCat.Main.showErrMsg('pay_transCount_tips_err', () => {
                    this.inputCount.focus();
                });
                return;
            }
            if (this.checkBalance()) {
                this.remove(300);
                ViewTransferCount.callback();
                ViewTransferCount.callback = null;
            }
        }
        netFeeChange(net_fee) {
            this.net_fee = net_fee;
            var v = this.inputCount.value;
            if (v.length == 0 || v.replace(/(^s*)|(s*$)/g, "").length == 0) {
                return;
            }
            if (ViewTransferCount.coinType == "CGAS") {
                if (ViewTransferCount.transType == "refund") {
                    if (Number(v) - Number(this.net_fee) * 2 <= 0) {
                        BlackCat.Main.showErrMsg('pay_makeRefundGasLessThanFee', () => {
                            this.inputCount.focus();
                            this.divHaveUtxoAmounts.classList.remove("pc_income");
                            this.divHaveNep5Amounts.classList.remove("pc_expenditure");
                            this.spanHaveNep5Amounts.textContent = "";
                            this.spanHaveUtxoAmounts.textContent = "";
                        });
                        return;
                    }
                    this.divHaveUtxoAmounts.classList.add("pc_income");
                    this.divHaveNep5Amounts.classList.add("pc_expenditure");
                    this.spanHaveNep5Amounts.textContent = this.inputCount.value;
                    this.spanHaveUtxoAmounts.textContent = BlackCat.Main.getStringNumber(BlackCat.floatNum.minus(Number(this.inputCount.value), Number(this.net_fee) * 2));
                }
                else {
                    this.spanHaveUtxoAmounts.textContent = BlackCat.Main.getStringNumber(BlackCat.floatNum.plus(Number(v), Number(this.net_fee)));
                }
            }
            else {
                if (ViewTransferCount.transType == "refund") {
                    this.divHaveUtxoAmounts.classList.add("pc_income");
                    this.divHaveNep5Amounts.classList.add("pc_expenditure");
                }
                else {
                    this.divHaveUtxoAmounts.classList.add("pc_expenditure");
                    this.divHaveNep5Amounts.classList.add("pc_income");
                }
                this.spanHaveUtxoAmounts.textContent = this.inputCount.value;
                this.spanHaveNep5Amounts.textContent = this.inputCount.value;
            }
        }
        updateBalance() {
            this.getCoinBalance();
            this.divHaveNep5Amounts.textContent = this.coinBalanceLang.tat + BlackCat.Main.getStringNumber(this.coinBalance.tat);
            this.divHaveUtxoAmounts.textContent = this.coinBalanceLang.src + BlackCat.Main.getStringNumber(this.coinBalance.src);
        }
        getSelectOptions(transType = null) {
            var options = [];
            switch (ViewTransferCount.coinType) {
                case "CGAS":
                    if (transType) {
                        switch (transType) {
                            case "mint":
                                options = [["mint", "gas", "cgas"]];
                                break;
                            case "refund":
                                options = [["refund", "cgas", "gas"]];
                                break;
                        }
                    }
                    else {
                        options = [["mint", "gas", "cgas"], ["refund", "cgas", "gas"]];
                    }
                    break;
                case "CNEO":
                    if (transType) {
                        switch (transType) {
                            case "mint":
                                options = [["mint", "neo", "cneo"]];
                                break;
                            case "refund":
                                options = [["refund", "cneo", "neo"]];
                                break;
                        }
                    }
                    else {
                        options = [["mint", "neo", "cneo"], ["refund", "cneo", "neo"]];
                    }
                    break;
            }
            for (let i = 0; i < options.length; i++) {
                var option_ele = this.objCreate("option");
                option_ele.value = options[i][0];
                option_ele.innerHTML = BlackCat.Main.langMgr.get(options[i][1]) + " &#8594; " + BlackCat.Main.langMgr.get(options[i][2]);
                this.ObjAppend(this.selectTransfertype, option_ele);
            }
        }
        getCoinBalance() {
            this.coinBalance = {
                src: 0,
                tat: 0,
            };
            switch (ViewTransferCount.coinType) {
                case "CGAS":
                    this.coinBalance.src = BlackCat.Main.viewMgr.payView.gas;
                    break;
                case "CNEO":
                    this.coinBalance.src = BlackCat.Main.viewMgr.payView.neo;
                    break;
            }
            var coinType_lowcase = ViewTransferCount.coinType.toLowerCase();
            if (ViewTransferCount.transNncOld == "") {
                this.coinBalance.tat = BlackCat.Main.viewMgr.payView[coinType_lowcase];
            }
            else {
                this.coinBalance.tat = BlackCat.Main.viewMgr.payView[coinType_lowcase + "_old" + ViewTransferCount.transNncOld];
            }
        }
        getCoinBalanceLang() {
            this.coinBalanceLang = {
                src: "",
                tat: "",
            };
            switch (ViewTransferCount.coinType) {
                case "CGAS":
                    this.coinBalanceLang.src = BlackCat.Main.langMgr.get("gas");
                    this.coinBalanceLang.tat = BlackCat.Main.langMgr.get("cgas");
                    break;
                case "CNEO":
                    this.coinBalanceLang.src = BlackCat.Main.langMgr.get("neo");
                    this.coinBalanceLang.tat = BlackCat.Main.langMgr.get("cneo");
                    break;
            }
            if (ViewTransferCount.transNncOld != "" && this.coinBalanceLang.tat != "") {
                this.coinBalanceLang.tat += "(old)";
            }
        }
        getCoinTypeLang() {
            this.coinTypeLang = {
                src: "",
                tat: "",
            };
            switch (ViewTransferCount.transType) {
                case "mint":
                    switch (ViewTransferCount.coinType) {
                        case "CGAS":
                            this.coinTypeLang.src = BlackCat.Main.langMgr.get("gas");
                            this.coinTypeLang.tat = BlackCat.Main.langMgr.get("cgas");
                            break;
                        case "CNEO":
                            this.coinTypeLang.src = BlackCat.Main.langMgr.get("neo");
                            this.coinTypeLang.tat = BlackCat.Main.langMgr.get("cneo");
                            break;
                    }
                    break;
                case "refund":
                    switch (ViewTransferCount.coinType) {
                        case "CGAS":
                            this.coinTypeLang.src = BlackCat.Main.langMgr.get("cgas");
                            this.coinTypeLang.tat = BlackCat.Main.langMgr.get("gas");
                            break;
                        case "CNEO":
                            this.coinTypeLang.src = BlackCat.Main.langMgr.get("cneo");
                            this.coinTypeLang.tat = BlackCat.Main.langMgr.get("neo");
                            break;
                    }
                    break;
            }
            if (ViewTransferCount.transNncOld != "" && this.coinTypeLang.src != "") {
                this.coinTypeLang.src += "(old)";
            }
        }
        dotransfertype() {
            this.divHaveUtxoAmounts.classList.remove("pc_income", "pc_expenditure");
            this.divHaveNep5Amounts.classList.remove("pc_income", "pc_expenditure");
            this.spanHaveNep5Amounts.textContent = "";
            this.spanHaveUtxoAmounts.textContent = "";
            this.inputCount.value = "";
            this.inputCount.focus();
            ViewTransferCount.transType = this.selectTransfertype.value;
            this.configNetFee();
        }
        configNetFee() {
            var showNetFee = true;
            if (ViewTransferCount.transType != "") {
                switch (ViewTransferCount.coinType) {
                    case "CGAS":
                        if (ViewTransferCount.transNncOld && ViewTransferCount.transNncOld == "0x961e628cc93d61bf636dc0443cf0548947a50dbe") {
                            showNetFee = false;
                        }
                        break;
                    case "CNEO":
                        if (ViewTransferCount.transType == "refund") {
                            showNetFee = false;
                        }
                        break;
                }
            }
            if (showNetFee) {
                this.netFeeCom.show();
                if (ViewTransferCount.transType == "refund") {
                    this.netFeeCom.setNetFeeShowRate(2);
                }
                else {
                    this.netFeeCom.setNetFeeShowRate(1);
                }
            }
            else {
                this.netFeeCom.hidden();
            }
        }
        checkBalance() {
            switch (ViewTransferCount.transType) {
                case "mint":
                    switch (ViewTransferCount.coinType) {
                        case "CGAS":
                            if (BlackCat.Main.viewMgr.payView.gas < Number(this.inputCount.value) + Number(this.net_fee)) {
                                BlackCat.Main.showErrMsg('pay_makeMintGasNotEnough', () => {
                                    this.inputCount.focus();
                                });
                                return false;
                            }
                            return true;
                        case "CNEO":
                            if (BlackCat.Main.viewMgr.payView.gas < Number(this.net_fee)) {
                                BlackCat.Main.showErrMsg('pay_makeMintGasNotEnough', () => {
                                    this.inputCount.focus();
                                });
                                return false;
                            }
                            if (BlackCat.Main.viewMgr.payView.neo < Number(this.inputCount.value)) {
                                BlackCat.Main.showErrMsg('pay_makeMintNeoNotEnough', () => {
                                    this.inputCount.focus();
                                });
                                return false;
                            }
                            return true;
                    }
                    break;
                case "refund":
                    switch (ViewTransferCount.coinType) {
                        case "CGAS":
                            if (this.coinBalance.tat < Number(this.inputCount.value)) {
                                BlackCat.Main.showErrMsg('pay_makeRefundCgasNotEnough', () => {
                                    this.inputCount.focus();
                                });
                                return false;
                            }
                            if (Number(this.net_fee) > 0) {
                                if (BlackCat.Main.viewMgr.payView.gas < Number(this.net_fee)) {
                                    BlackCat.Main.showErrMsg("pay_makeRefundGasFeeNotEnough", () => {
                                        this.inputCount.focus();
                                    });
                                    return false;
                                }
                                if (Number(this.inputCount.value) - Number(this.net_fee) <= 0) {
                                    BlackCat.Main.showErrMsg('pay_makeRefundGasLessThanFee', () => {
                                        this.inputCount.focus();
                                    });
                                    return false;
                                }
                            }
                            return true;
                        case "CNEO":
                            if (this.coinBalance.tat < Number(this.inputCount.value)) {
                                BlackCat.Main.showErrMsg('pay_makeRefundCneoNotEnough', () => {
                                    this.inputCount.focus();
                                });
                                return false;
                            }
                            if (Number(this.net_fee) > 0) {
                                BlackCat.Main.showErrMsg("pay_makeRefundGasFeeNotEnough", () => {
                                    this.inputCount.focus();
                                });
                                return false;
                            }
                            return true;
                    }
                    break;
            }
            return false;
        }
    }
    ViewTransferCount.coinType = "CGAS";
    ViewTransferCount.transType = "";
    ViewTransferCount.transNncOld = "";
    BlackCat.ViewTransferCount = ViewTransferCount;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ViewWalletOpen extends BlackCat.ViewBase {
        start() {
            super.start();
            this.inputPassword.focus();
        }
        create() {
            this.doReadWalletFile();
            this.div = this.objCreate("div");
            this.div.classList.add("pc_popup");
            var popupbox = this.objCreate('div');
            popupbox.classList.add("pc_popupbox");
            this.ObjAppend(this.div, popupbox);
            var popupTitle = this.objCreate('div');
            popupTitle.classList.add("pc_popup_title");
            popupTitle.innerText = BlackCat.Main.langMgr.get("pay_walletOpen_password");
            this.ObjAppend(popupbox, popupTitle);
            this.inputPassword = this.objCreate("input");
            this.inputPassword.type = "password";
            this.inputPassword.style.marginTop = "40px";
            this.inputPassword.style.width = "60%";
            this.inputPassword.placeholder = BlackCat.Main.langMgr.get("pay_walletOpen_inputPassword");
            this.ObjAppend(popupbox, this.inputPassword);
            var popupbutbox = this.objCreate('div');
            popupbutbox.classList.add("pc_popupbutbox");
            this.ObjAppend(popupbox, popupbutbox);
            var popupClose = this.objCreate('button');
            popupClose.classList.add("pc_cancel");
            popupClose.textContent = BlackCat.Main.langMgr.get("cancel");
            popupClose.onclick = () => {
                this.doCancel();
            };
            this.ObjAppend(popupbutbox, popupClose);
            var confirmObj = this.objCreate("button");
            confirmObj.textContent = BlackCat.Main.langMgr.get("ok");
            confirmObj.onclick = () => {
                this.doConfirm();
            };
            this.ObjAppend(popupbutbox, confirmObj);
        }
        toRefer() {
            if (ViewWalletOpen.refer) {
                BlackCat.Main.viewMgr.change(ViewWalletOpen.refer);
                ViewWalletOpen.refer = null;
            }
        }
        key_enter() {
            this.doConfirm();
        }
        key_esc() {
            this.doCancel();
        }
        doConfirm() {
            if (!this.inputPassword.value) {
                BlackCat.Main.showErrMsg('pay_walletOpen_inputPassword_err', () => {
                    this.inputPassword.focus();
                });
                return;
            }
            this.doOpenWallet();
        }
        doCancel() {
            this.remove(300);
            if (ViewWalletOpen.callback_cancel) {
                if (ViewWalletOpen.callback_callback) {
                    ViewWalletOpen.callback_cancel(ViewWalletOpen.callback_params, ViewWalletOpen.callback_callback);
                }
                else {
                    ViewWalletOpen.callback_cancel(ViewWalletOpen.callback_params);
                }
            }
            ViewWalletOpen.callback_cancel = null;
            ViewWalletOpen.callback_params = null;
            ViewWalletOpen.callback_callback = null;
        }
        doReadWalletFile() {
            return __awaiter(this, void 0, void 0, function* () {
                var readfile = yield BlackCat.Main.wallet.readWalletFile(1);
                if (!readfile) {
                    BlackCat.Main.showErrMsg(("pay_walletOpen_file_error"));
                    return;
                }
            });
        }
        doOpenWallet() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.viewMgr.change("ViewLoading");
                var open = yield BlackCat.Main.wallet.open(this.inputPassword.value);
                BlackCat.Main.viewMgr.viewLoading.remove();
                if (!open) {
                    BlackCat.Main.showErrMsg(("pay_walletOpen_openFail"));
                    return;
                }
                this.remove();
                if (ViewWalletOpen.callback) {
                    if (ViewWalletOpen.callback_callback) {
                        ViewWalletOpen.callback(ViewWalletOpen.callback_params, ViewWalletOpen.callback_callback);
                    }
                    else {
                        ViewWalletOpen.callback(ViewWalletOpen.callback_params);
                    }
                }
                ViewWalletOpen.callback = null;
                ViewWalletOpen.callback_params = null;
                ViewWalletOpen.callback_callback = null;
                if (ViewWalletOpen.tasks) {
                    this.doOpenTasks();
                }
            });
        }
        static addTask(type, params) {
            if (!ViewWalletOpen.tasks) {
                ViewWalletOpen.tasks = {};
            }
            if (ViewWalletOpen.tasks[type]) {
                for (let k in params) {
                    ViewWalletOpen.tasks[type].push(params[k]);
                }
            }
            else {
                ViewWalletOpen.tasks[type] = params;
            }
            console.log("[BlaCat]", '[ViewWalletOpen]', '[addTask]', 'tasks => ', ViewWalletOpen.tasks);
        }
        static removeTask(type) {
            delete ViewWalletOpen.tasks[type];
        }
        doOpenTasks() {
            console.log("[BlaCat]", '[ViewWalletOpen]', '[doOpenTasks]', 'tasks => ', ViewWalletOpen.tasks);
            for (let k in ViewWalletOpen.tasks) {
                if (ViewWalletOpen.tasks[k]) {
                    switch (k) {
                        case "getPlatNotifys":
                            for (let i in ViewWalletOpen.tasks[k]) {
                                let params = ViewWalletOpen.tasks[k][i];
                                delete BlackCat.Main.platNotifyTxids[params.txid];
                            }
                            BlackCat.Main.needGetPlatNotifys = true;
                            break;
                    }
                }
            }
        }
    }
    BlackCat.ViewWalletOpen = ViewWalletOpen;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class WalletCreateDownloadView extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate('div');
            this.div.classList.add("pc_popup");
            var popupbox = this.objCreate('div');
            popupbox.classList.add("pc_popupbox");
            this.ObjAppend(this.div, popupbox);
            var popupTitle = this.objCreate('div');
            popupTitle.classList.add("pc_popup_title");
            popupTitle.innerText = BlackCat.Main.langMgr.get("walletCreate_download");
            this.ObjAppend(popupbox, popupTitle);
            var walletExportDiv = this.objCreate("div");
            walletExportDiv.classList.add("pc_walletdownload");
            this.ObjAppend(popupbox, walletExportDiv);
            this.walletExport = this.objCreate("a");
            this.walletExport.textContent = BlackCat.Main.langMgr.get("walletCreate_doDownload");
            this.walletExport.setAttribute("download", WalletCreateDownloadView.addr + ".json");
            this.ObjAppend(walletExportDiv, this.walletExport);
            this.exportWallet();
            var iWalletExport = this.objCreate("i");
            iWalletExport.classList.add("iconfont", "icon-bc-daochuqianbao");
            this.ObjAppend(this.walletExport, iWalletExport);
        }
        key_esc() {
        }
        exportWallet() {
            return __awaiter(this, void 0, void 0, function* () {
                if (WalletCreateDownloadView.filestr) {
                    var blob = new Blob([ThinNeo.Helper.String2Bytes(WalletCreateDownloadView.filepass)]);
                    var url = URL.createObjectURL(blob);
                    this.walletExport.setAttribute('href', url);
                    this.walletExport.onclick = () => {
                        this.doDownload();
                    };
                }
            });
        }
        doDownload() {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.viewMgr.change("ViewLoading");
                yield BlackCat.Main.wallet.setWalletStr(WalletCreateDownloadView.filestr);
                yield BlackCat.Main.wallet.open(WalletCreateDownloadView.filepass);
                WalletCreateDownloadView.filestr = null;
                WalletCreateDownloadView.filepass = null;
                WalletCreateDownloadView.addr = null;
                BlackCat.Main.viewMgr.viewLoading.remove();
                BlackCat.Main.validateLogin();
                this.remove();
                BlackCat.Main.viewMgr.walletView.remove();
            });
        }
    }
    BlackCat.WalletCreateDownloadView = WalletCreateDownloadView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class WalletCreateView extends BlackCat.ViewBase {
        constructor() {
            super();
            this.wallet = new ThinNeo.nep6wallet();
        }
        create() {
            this.div = this.objCreate('div');
            this.div.classList.add("pc_popup");
            var popupbox = this.objCreate('div');
            popupbox.classList.add("pc_popupbox");
            this.ObjAppend(this.div, popupbox);
            var popupTitle = this.objCreate('div');
            popupTitle.classList.add("pc_popup_title");
            popupTitle.innerText = BlackCat.Main.langMgr.get("walletCreate_create");
            this.ObjAppend(popupbox, popupTitle);
            this.inputPwd = this.objCreate("input");
            this.inputPwd.type = "password";
            this.inputPwd.placeholder = BlackCat.Main.langMgr.get("walletCreate_password");
            this.ObjAppend(popupbox, this.inputPwd);
            this.inputVwd = this.objCreate("input");
            this.inputVwd.type = "password";
            this.inputVwd.placeholder = BlackCat.Main.langMgr.get("walletCreate_vpass");
            this.ObjAppend(popupbox, this.inputVwd);
            var createPrompt = this.objCreate("div");
            createPrompt.classList.add("pc_prompt");
            createPrompt.textContent = BlackCat.Main.langMgr.get("walletCreate_password_notice");
            this.ObjAppend(popupbox, createPrompt);
            var popupbutbox = this.objCreate('div');
            popupbutbox.classList.add("pc_popupbutbox");
            this.ObjAppend(popupbox, popupbutbox);
            var popupClose = this.objCreate('button');
            popupClose.classList.add("pc_cancel");
            popupClose.textContent = BlackCat.Main.langMgr.get("cancel");
            popupClose.onclick = () => {
                this.remove(300);
            };
            this.ObjAppend(popupbutbox, popupClose);
            var doCreate = this.objCreate("button");
            doCreate.textContent = BlackCat.Main.langMgr.get("walletCreate_doCreate");
            doCreate.onclick = () => {
                this.doCreate();
            };
            this.ObjAppend(popupbutbox, doCreate);
        }
        show() {
            super.show();
            this.inputPwd.focus();
        }
        key_esc() {
        }
        createVerifyPwd() {
            var pwd = this.inputPwd.value;
            if (!pwd || pwd.toString().length == 0) {
                return false;
            }
            return true;
        }
        createVerifyVwd() {
            var pwd = this.inputPwd.value;
            var vwd = this.inputVwd.value;
            if (!vwd || vwd.toString().length == 0 || pwd != vwd) {
                return false;
            }
            return true;
        }
        doCreate() {
            if (!this.createVerifyPwd()) {
                BlackCat.Main.showErrMsg(("walletCreate_check_pass"), () => {
                    this.inputPwd.focus();
                });
                return;
            }
            if (!this.createVerifyVwd()) {
                BlackCat.Main.showErrMsg(("walletCreate_check_vpass"), () => {
                    this.inputVwd.focus();
                });
                return;
            }
            if (this.inputPwd.value.length > 32) {
                BlackCat.Main.showErrMsg(("walletCreate_check_exceed"), () => {
                    this.inputPwd.focus();
                });
                return;
            }
            BlackCat.Main.viewMgr.change("ViewLoading");
            setTimeout(() => {
                var array = new Uint8Array(32);
                var key = Neo.Cryptography.RandomNumberGenerator.getRandomValues(array);
                var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(key);
                var addr = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                this.wallet.scrypt = new ThinNeo.nep6ScryptParameters();
                this.wallet.scrypt.N = 16384;
                this.wallet.scrypt.r = 8;
                this.wallet.scrypt.p = 1;
                this.wallet.accounts = [];
                this.wallet.accounts[0] = new ThinNeo.nep6account();
                this.wallet.accounts[0].address = addr;
                try {
                    ThinNeo.Helper.GetNep2FromPrivateKey(key, this.inputPwd.value, this.wallet.scrypt.N, this.wallet.scrypt.r, this.wallet.scrypt.p, (info, result) => __awaiter(this, void 0, void 0, function* () {
                        if (info == "finish") {
                            this.wallet.accounts[0].nep2key = result;
                            this.wallet.accounts[0].contract = new ThinNeo.contract();
                            var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(key);
                            this.wallet.accounts[0].contract.script = ThinNeo.Helper.GetAddressCheckScriptFromPublicKey(pubkey).toHexString();
                            var jsonstr = JSON.stringify(this.wallet.toJson());
                            this.remove();
                            BlackCat.WalletCreateDownloadView.filestr = jsonstr;
                            BlackCat.WalletCreateDownloadView.filepass = this.inputPwd.value;
                            BlackCat.WalletCreateDownloadView.addr = addr;
                            BlackCat.Main.viewMgr.change("WalletCreateDownloadView");
                        }
                        BlackCat.Main.viewMgr.viewLoading.remove();
                    }));
                }
                catch (e) {
                    BlackCat.Main.viewMgr.viewLoading.remove();
                    console.log("[BlaCat]", '[WalletCreateView]', '[doCreate]', 'ThinNeo.Helper.GetNep2FromPrivateKey error => ', e.toString());
                }
            }, 300);
        }
    }
    BlackCat.WalletCreateView = WalletCreateView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    var tools;
    (function (tools) {
        class LoginInfo {
            static ArrayToString(array) {
                var obj = [];
                for (var i = 0; i < array.length; i++) {
                    obj.push({});
                    obj[i].pubkey = array[i].pubkey.toHexString();
                    obj[i].prikey = array[i].prikey.toHexString();
                    obj[i].address = array[i].address;
                }
                return JSON.stringify(obj);
            }
            static StringToArray(str) {
                var obj = JSON.parse(str);
                var arr = [];
                for (var i = 0; i < obj.length; i++) {
                    arr.push(new LoginInfo());
                    var str = obj[i].prikey;
                    var str2 = obj[i].pubkey;
                    arr[i].prikey = str.hexToBytes();
                    arr[i].pubkey = str2.hexToBytes();
                    arr[i].address = obj[i].address;
                }
                return arr;
            }
            static getCurrentLogin() {
                var address = LoginInfo.getCurrentAddress();
                var arr = tools.StorageTool.getLoginArr();
                try {
                    var n = arr.findIndex(info => info.address == address);
                }
                catch (e) {
                    var n;
                    for (let i = 0; i < arr.length; i++) {
                        if (address == arr[i].address) {
                            n = i;
                            break;
                        }
                    }
                }
                return arr[n];
            }
            static getCurrentAddress() {
                return tools.StorageTool.getStorage("current-address");
            }
            static setCurrentAddress(str) {
                tools.StorageTool.setStorage("current-address", str);
            }
        }
        tools.LoginInfo = LoginInfo;
        class BalanceInfo {
            static jsonToArray(json) {
                let arr = new Array();
                for (const i in json) {
                    if (json.hasOwnProperty(i)) {
                        const element = json[i];
                        let balance = new BalanceInfo();
                        balance.asset = element["asset"];
                        balance.balance = element["balance"];
                        balance.name = element["balance"];
                        balance.names = element["names"];
                        balance.type = element["type"];
                        arr.push(balance);
                    }
                }
                return arr;
            }
            static getBalancesByArr(balances, nep5balances, height) {
                let balancearr = [];
                if (balances) {
                    balances.map((item) => {
                        item.names = tools.CoinToolNeo.assetID2name[item.asset];
                        let a = tools.StorageTool.getStorage(item.asset);
                        if (a) {
                            let obj = JSON.parse(a);
                            let h = obj["height"];
                            height - h > 1 ? tools.StorageTool.delStorage(item.asset) : item.balance = obj["balance"]["balance"];
                        }
                    });
                    balancearr = balances;
                }
                if (nep5balances) {
                    for (let index = 0; index < nep5balances.length; index++) {
                        const nep5 = nep5balances[index];
                        var nep5b = new BalanceInfo();
                        let id = nep5.assetid.replace("0x", "");
                        id = id.substring(0, 4) + '...' + id.substring(id.length - 4);
                        nep5b.asset = nep5.assetid;
                        nep5b.balance = nep5.balance;
                        nep5b.names = nep5.symbol + "(" + id + ")";
                        nep5b.type = "nep5";
                        balancearr.push(nep5b);
                    }
                }
                return balancearr;
            }
            static setBalanceSotre(balance, height) {
                tools.StorageTool.setStorage(balance.asset, JSON.stringify({ height, balance }));
                console.log(tools.StorageTool.getStorage(balance.asset));
            }
        }
        tools.BalanceInfo = BalanceInfo;
        class Nep5Balance {
        }
        tools.Nep5Balance = Nep5Balance;
        class Result {
        }
        tools.Result = Result;
        let AssetEnum;
        (function (AssetEnum) {
            AssetEnum["NEO"] = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
            AssetEnum["GAS"] = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
        })(AssetEnum = tools.AssetEnum || (tools.AssetEnum = {}));
        class NeoAsset {
        }
        tools.NeoAsset = NeoAsset;
        class OldUTXO {
            constructor(txid, n, asset = "") {
                this.n = n;
                this.txid = txid;
                this.asset = asset;
            }
            static oldutxosPush(olds) {
                let arr = this.getOldutxos();
                tools.StorageTool.setStorage("old-utxos", JSON.stringify(arr.concat(olds)));
            }
            static setOldutxos(olds) {
                tools.StorageTool.setStorage("old-utxos", JSON.stringify(olds));
            }
            static getOldutxos() {
                var arr = new Array();
                var str = tools.StorageTool.getStorage("old-utxos");
                if (str)
                    arr = JSON.parse(str);
                return arr;
            }
            compareUtxo(utxo) {
                return this.txid == utxo.txid && this.n == utxo.n && this.asset == utxo.asset;
            }
        }
        tools.OldUTXO = OldUTXO;
        class UTXO {
            static ArrayToString(utxos) {
                var str = "";
                var obj = [];
                for (var i = 0; i < utxos.length; i++) {
                    obj.push({});
                    obj[i].n = utxos[i].n;
                    obj[i].addr = utxos[i].addr;
                    obj[i].txid = utxos[i].txid;
                    obj[i].asset = utxos[i].asset;
                    obj[i].count = utxos[i].count.toString();
                }
                return obj;
            }
            static StringToArray(obj) {
                var utxos = new Array();
                for (var i = 0; i < obj.length; i++) {
                    utxos.push(new UTXO);
                    var str = obj[i].count;
                    utxos[i].n = obj[i].n;
                    utxos[i].addr = obj[i].addr;
                    utxos[i].txid = obj[i].txid;
                    utxos[i].asset = obj[i].asset;
                    utxos[i].count = Neo.Fixed8.parse(str);
                }
                return utxos;
            }
            static setAssets(assets) {
                var obj = {};
                for (var asset in assets) {
                    let arr = UTXO.ArrayToString(assets[asset]);
                    obj[asset] = arr;
                }
                sessionStorage.setItem("current-assets-utxos", JSON.stringify(obj));
            }
            static getAssets() {
                let assets = null;
                var str = sessionStorage.getItem("current-assets-utxos");
                if (str !== null && str != undefined && str != '') {
                    assets = JSON.parse(str);
                    for (const asset in assets) {
                        assets[asset] = UTXO.StringToArray(assets[asset]);
                    }
                }
                return assets;
            }
        }
        tools.UTXO = UTXO;
        class Consts {
        }
        Consts.baseContract = "954f285a93eed7b4aed9396a7806a5812f1a5950";
        Consts.registerContract = "d6a5e965f67b0c3e5bec1f04f028edb9cb9e3f7c";
        tools.Consts = Consts;
        class DomainInfo {
        }
        tools.DomainInfo = DomainInfo;
        class RootDomainInfo extends DomainInfo {
            constructor() {
                super();
            }
        }
        tools.RootDomainInfo = RootDomainInfo;
        class Transactionforaddr {
        }
        tools.Transactionforaddr = Transactionforaddr;
        class History {
            static setHistoryStore(history, height) {
                let arr = this.getHistoryStore();
                arr.push({ height, history });
                tools.StorageTool.setStorage("history-txs", JSON.stringify(arr));
            }
            static getHistoryStore() {
                let str = tools.StorageTool.getStorage("history-txs");
                let arr = !!str ? JSON.parse(str) : [];
                return arr;
            }
            static delHistoryStoreByHeight(height) {
                let arr = this.getHistoryStore();
                if (arr.length > 0) {
                    let newarr = [];
                    arr.map(his => {
                        let h = parseInt(his.height);
                        if (height - h < 2) {
                            newarr.push(his);
                        }
                    });
                    tools.StorageTool.setStorage("history-txs", JSON.stringify(newarr));
                }
            }
        }
        tools.History = History;
        class Claim {
            constructor(json) {
                this.addr = json['addr'];
                this.asset = json['asset'];
                this.claimed = json['claimed'];
                this.createHeight = json['createHeight'];
                this.n = json['n'];
                this.txid = json['txid'];
                this.useHeight = json['useHeight'];
                this.used = json['used'];
                this.value = json['value'];
            }
            static strToClaimArray(arr) {
                let claimarr = new Array();
                for (const i in arr) {
                    if (arr.hasOwnProperty(i)) {
                        claimarr.push(new Claim(arr[i]));
                    }
                }
                return claimarr;
            }
        }
        tools.Claim = Claim;
        class Domainmsg {
        }
        tools.Domainmsg = Domainmsg;
        class DomainStatus {
            static setStatus(domain) {
                let str = sessionStorage.getItem("domain-status");
                var arr = {};
                if (str) {
                    arr = JSON.parse(str);
                    let msg = arr[domain.domainname];
                    msg ? msg : msg = new DomainStatus();
                    domain.await_mapping ? msg["await_mapping"] = domain.await_mapping : "";
                    domain.await_register ? msg["await_register"] = domain.await_register : "";
                    domain.await_resolver ? msg["await_resolver"] = domain.await_resolver : "";
                    domain.mapping ? msg["mapping"] = domain.mapping : "";
                    domain.resolver ? msg["resolver"] = domain.resolver.replace("0x", "") : "";
                    arr[domain.domainname] = msg;
                }
                else {
                    arr[domain.domainname] = domain;
                }
                sessionStorage.setItem("domain-status", JSON.stringify(arr));
            }
            static getStatus() {
                let str = sessionStorage.getItem("domain-status");
                let obj = {};
                str ? obj = JSON.parse(sessionStorage.getItem("domain-status")) : {};
                return obj;
            }
        }
        tools.DomainStatus = DomainStatus;
        class WalletOtcgo {
            fromJsonStr(str) {
                let json = JSON.parse(str);
                let otcgo = new WalletOtcgo();
                this.address = json["address"];
                this.publicKey = json["publicKey"];
                this.publicKeyCompressed = json["publicKeyCompressed"];
                this.privateKeyEncrypted = json["privateKeyEncrypted"];
            }
            otcgoDecrypt(pwd) {
                try {
                    this.privatekey = CryptoJS.AES.decrypt(this.privateKeyEncrypted, pwd).toString(CryptoJS.enc.Utf8);
                    this.prikey = this.privatekey.hexToBytes();
                    this.pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(this.prikey);
                }
                catch (error) {
                    console.log(error);
                }
            }
            doSign(prvkey, msg) {
                const sig = new KJUR.crypto.Signature({ 'alg': 'SHA256withECDSA' });
                sig.initSign({
                    'ecprvhex': prvkey,
                    'eccurvename': 'secp256r1'
                });
                sig.updateString(msg);
                return sig.sign();
            }
            doVerify(pubkey, msg, sigval) {
                const sig = new KJUR.crypto.Signature({
                    'alg': 'SHA256withECDSA',
                    'prov': 'cryptojs/jsrsa'
                });
                sig.initVerifyByPublicKey({
                    'ecpubhex': pubkey,
                    'eccurvename': 'secp256r1'
                });
                sig.updateString(msg);
                return sig.verify(sigval);
            }
            doValidatePwd() {
                if (this.prikey.length === 0)
                    return false;
                const msg = 'aaa';
                const sigval = this.doSign(this.privatekey, msg);
                return this.doVerify(this.publicKey, msg, sigval);
            }
        }
        tools.WalletOtcgo = WalletOtcgo;
        class MyAuction {
        }
        tools.MyAuction = MyAuction;
    })(tools = BlackCat.tools || (BlackCat.tools = {}));
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class WalletImportView extends BlackCat.ViewBase {
        constructor() {
            super();
            this.filename = "";
            this.reader = new FileReader();
            this.reader.onload = () => __awaiter(this, void 0, void 0, function* () {
                var res = yield BlackCat.Main.wallet.setWalletStr(this.reader.result);
                if (!res) {
                    BlackCat.Main.showErrMsg(("walletImport_invalid_file"));
                    this.filename = "";
                    this.inputFileText.placeholder = BlackCat.Main.langMgr.get("walletImport_select_file");
                }
                else {
                    this.inputFileText.placeholder = this.filename;
                }
            });
            this.filepass = "";
        }
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_popup");
            var popupbox = this.objCreate('div');
            popupbox.classList.add("pc_popupbox");
            this.ObjAppend(this.div, popupbox);
            var popupTitle = this.objCreate('div');
            popupTitle.classList.add("pc_popup_title");
            popupTitle.innerText = BlackCat.Main.langMgr.get("walletImport_import");
            this.ObjAppend(popupbox, popupTitle);
            this.inputFileText = this.objCreate("input");
            this.inputFileText.classList.add("pc_filetitle");
            this.inputFileText.type = "text";
            this.inputFileText.placeholder = BlackCat.Main.langMgr.get("walletImport_select_file");
            this.ObjAppend(popupbox, this.inputFileText);
            var inputFileI = this.objCreate("i");
            inputFileI.classList.add("pc_upload", "iconfont", "icon-bc-wenjianjia");
            this.ObjAppend(popupbox, inputFileI);
            this.inputFile = this.objCreate("input");
            this.inputFile.type = "file";
            this.inputFile.onchange = () => {
                if (this.inputFile.files && this.inputFile.files.length > 0) {
                    this.filename = this.inputFile.files[0].name;
                    this.reader.readAsText(this.inputFile.files[0]);
                }
                else {
                    this.inputFileText.placeholder = BlackCat.Main.langMgr.get("walletImport_select_file");
                    this.filename = "";
                }
            };
            this.ObjAppend(popupbox, this.inputFile);
            this.inputPwd = this.objCreate("input");
            this.inputPwd.placeholder = BlackCat.Main.langMgr.get("walletImport_password");
            this.inputPwd.type = "password";
            this.ObjAppend(popupbox, this.inputPwd);
            var popupbutbox = this.objCreate('div');
            popupbutbox.classList.add("pc_popupbutbox");
            this.ObjAppend(popupbox, popupbutbox);
            var popupClose = this.objCreate('button');
            popupClose.classList.add("pc_cancel");
            popupClose.textContent = BlackCat.Main.langMgr.get("cancel");
            popupClose.onclick = () => {
                this.remove(300);
            };
            this.ObjAppend(popupbutbox, popupClose);
            var bindobj = this.objCreate("button");
            bindobj.textContent = BlackCat.Main.langMgr.get("walletImport_doImport");
            bindobj.onclick = () => {
                this.doBindWallet();
            };
            this.ObjAppend(popupbutbox, bindobj);
        }
        key_esc() {
        }
        doBindWallet() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.filename) {
                    BlackCat.Main.showErrMsg(("walletImport_select_file"));
                    return;
                }
                this.filepass = this.inputPwd.value;
                if (!this.filepass || this.filepass.toString().length == 0) {
                    BlackCat.Main.showErrMsg(("walletImport_password"), () => {
                        this.inputPwd.focus();
                    });
                    return;
                }
                BlackCat.Main.viewMgr.change("ViewLoading");
                var res = yield BlackCat.Main.wallet.open(this.filepass);
                if (res) {
                    this.bindWallet(BlackCat.Main.wallet.filestr);
                }
                BlackCat.Main.viewMgr.viewLoading.remove();
            });
        }
        bindWallet(walletStr) {
            return __awaiter(this, void 0, void 0, function* () {
                BlackCat.Main.showToast("walletImport_bind_succ");
                BlackCat.Main.viewMgr.walletView.remove();
                this.remove();
                BlackCat.Main.validateLogin();
            });
        }
    }
    BlackCat.WalletImportView = WalletImportView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class WalletView extends BlackCat.ViewBase {
        create() {
            this.div = this.objCreate("div");
            this.div.classList.add("pc_bj", "pc_wallet");
            var walletTitle = this.objCreate("div");
            walletTitle.classList.add("pc_wallet_title");
            this.ObjAppend(this.div, walletTitle);
            var walletTitleH1 = this.objCreate("h1");
            walletTitleH1.classList.add("iconfont", "icon-bc-blacat");
            this.ObjAppend(walletTitle, walletTitleH1);
            var walletTitleP = this.objCreate("p");
            walletTitleP.innerText = BlackCat.Main.langMgr.get("walletView_info");
            this.ObjAppend(walletTitle, walletTitleP);
            var createWallet = this.objCreate("button");
            createWallet.textContent = BlackCat.Main.langMgr.get("walletView_create");
            createWallet.classList.add("pc_createWallet");
            createWallet.onclick = () => {
                BlackCat.Main.viewMgr.change("WalletCreateView");
            };
            this.ObjAppend(this.div, createWallet);
            var iCreateWallet = this.objCreate("i");
            iCreateWallet.classList.add("iconfont", "icon-bc-chuangjian1");
            this.ObjAppend(createWallet, iCreateWallet);
            var importWallet = this.objCreate("button");
            importWallet.textContent = BlackCat.Main.langMgr.get("walletView_import");
            importWallet.classList.add("pc_importWallet");
            importWallet.onclick = () => {
                BlackCat.Main.viewMgr.change("WalletImportView");
            };
            this.ObjAppend(this.div, importWallet);
            var iImportWallet = this.objCreate("i");
            iImportWallet.classList.add("iconfont", "icon-bc-daoru1");
            this.ObjAppend(importWallet, iImportWallet);
        }
        key_esc() {
        }
    }
    BlackCat.WalletView = WalletView;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class ApiTool {
        static isLogined() {
            return __awaiter(this, void 0, void 0, function* () {
                let login = BlackCat.tools.LoginInfo.getCurrentLogin();
                if (login) {
                    return true;
                }
                return false;
            });
        }
        static addUserWalletLogs(txid, cnts, type, params, net_fee = "", type_detail = "0", sdk = "0") {
            let log = new BlackCat.walletLists();
            log.ctm = (Date.parse(new Date().toString()) / 1000).toString();
            log.state = "0";
            log.type = type;
            log.type_detail = type_detail;
            log.params = params;
            log.txid = txid;
            log.cnts = cnts;
            log.net_fee = net_fee;
            log.wallet = BlackCat.Main.user.info.wallet;
            log['sdk'] = sdk;
            BlackCat.WalletListLogs.add(log);
        }
        static getWalletListss(page, num, pedding) {
            let res = { r: "1", data: [] };
            let logs = BlackCat.WalletListLogs.get();
            if (logs.length > 0) {
                if (pedding == 1) {
                    for (let k = logs.length - 1; k >= 0; k--) {
                        let log = logs[k];
                        if (log['state'] != "1") {
                            res.data.push(log);
                        }
                    }
                }
                else {
                    let nums_end_idx = logs.length - page * num;
                    let nums_start_idx = nums_end_idx + num - 1;
                    if (nums_end_idx < 0) {
                        nums_end_idx = 0;
                    }
                    if (nums_start_idx < 0) {
                        nums_start_idx = 0;
                    }
                    for (let k = nums_start_idx; k >= nums_end_idx; k--) {
                        let log = logs[k];
                        if (log['state'] == "1") {
                            res.data.push(log);
                        }
                    }
                }
            }
            return res;
        }
        static walletNotify(txid) {
            return __awaiter(this, void 0, void 0, function* () {
                let log = BlackCat.WalletListLogs.get(txid);
                if (log != null) {
                    BlackCat.WalletListLogs.update(txid, { client_notify: "1" });
                }
            });
        }
        static getAppWalletNotifys() {
            return __awaiter(this, void 0, void 0, function* () {
                let res = { r: "1", data: [] };
                let logs = BlackCat.WalletListLogs.get();
                if (logs.length > 0) {
                    for (let k = logs.length - 1; k >= 0; k--) {
                        let log = logs[k];
                        if (log['sdk'] == "1" && log.client_notify == "0" && log.state != "0") {
                            res.data.push(log);
                        }
                    }
                }
                return res;
            });
        }
        static getPlatWalletNotifys(uid, token) {
            return __awaiter(this, void 0, void 0, function* () {
            });
        }
        static walletNotifyExt(txid, ext) {
            return __awaiter(this, void 0, void 0, function* () {
                let log = BlackCat.WalletListLogs.get(txid);
                if (log) {
                    BlackCat.WalletListLogs.update(txid, { ext: ext });
                }
            });
        }
    }
    ApiTool.api_version = "3";
    ApiTool.base_url = '';
    BlackCat.ApiTool = ApiTool;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    var tools;
    (function (tools) {
        class CoinToolNeo {
            static initAllAsset() {
                return __awaiter(this, void 0, void 0, function* () {
                    var allassets = yield tools.WWWNeo.api_getAllAssets();
                    for (var a in allassets) {
                        var asset = allassets[a];
                        var names = asset.name;
                        var id = asset.id;
                        var name = "";
                        if (id == CoinToolNeo.id_GAS) {
                            name = "GAS";
                        }
                        else if (id == CoinToolNeo.id_NEO) {
                            name = "NEO";
                        }
                        else {
                            for (var i in names) {
                                name = names[i].name;
                                if (names[i].lang == "en")
                                    break;
                            }
                        }
                        CoinToolNeo.assetID2name[id] = name;
                        CoinToolNeo.name2assetID[name] = id;
                    }
                });
            }
            static getassets() {
                return __awaiter(this, void 0, void 0, function* () {
                    var height = yield tools.WWWNeo.api_getHeight_nodes();
                    var utxos = yield tools.WWWNeo.api_getUTXO(tools.StorageTool.getStorage("current-address"));
                    var olds = tools.OldUTXO.getOldutxos();
                    var olds2 = new Array();
                    for (let n = 0; n < olds.length; n++) {
                        const old = olds[n];
                        let findutxo = false;
                        for (let i = 0; i < utxos.length; i++) {
                            let utxo = utxos[i];
                            if (utxo.txid == old.txid && old.n == utxo.n && height - old.height <= 2) {
                                findutxo = true;
                                utxos.splice(i, 1);
                            }
                        }
                        if (findutxo) {
                            olds2.push(old);
                        }
                    }
                    tools.OldUTXO.setOldutxos(olds2);
                    var assets = {};
                    for (var i in utxos) {
                        var item = utxos[i];
                        var asset = item.asset;
                        if (assets[asset] == undefined || assets[asset] == null) {
                            assets[asset] = [];
                        }
                        let utxo = new tools.UTXO();
                        utxo.addr = item.addr;
                        utxo.asset = item.asset;
                        utxo.n = item.n;
                        utxo.txid = item.txid;
                        utxo.count = Neo.Fixed8.parse(item.value);
                        assets[asset].push(utxo);
                    }
                    return assets;
                });
            }
            static makeTran(utxos, targetaddr, assetid, sendcount, net_fee = Neo.Fixed8.Zero, left_fee = 0, split = false) {
                var split_num = 10;
                var split_min = 1;
                var res = new tools.Result();
                var us = utxos[assetid];
                if (us == undefined) {
                    throw new Error("pay_not_enough_utxo");
                }
                var tran = new ThinNeo.Transaction();
                tran.type = ThinNeo.TransactionType.ContractTransaction;
                tran.version = 0;
                tran.extdata = null;
                tran.attributes = [];
                tran.inputs = [];
                var scraddr = "";
                utxos[assetid].sort((a, b) => {
                    return a.count.compareTo(b.count);
                });
                var count = Neo.Fixed8.Zero;
                var clonearr = [].concat(us);
                var old = [];
                var sendcounts = sendcount.add(net_fee);
                for (var i = 0; i < us.length; i++) {
                    var input = new ThinNeo.TransactionInput();
                    input.hash = us[i].txid.hexToBytes().reverse();
                    input.index = us[i].n;
                    input["_addr"] = us[i].addr;
                    tran.inputs.push(input);
                    count = count.add(us[i].count);
                    scraddr = us[i].addr;
                    clonearr.shift();
                    old.push(new tools.OldUTXO(us[i].txid, us[i].n, assetid));
                    if (split) {
                        if (us.length >= split_num) {
                            if (count.compareTo(sendcount) > 0) {
                                break;
                            }
                        }
                    }
                    else {
                        if (count.compareTo(sendcount) > 0) {
                            break;
                        }
                    }
                    if (us.length >= split_num && count.compareTo(sendcounts) > 0) {
                        break;
                    }
                }
                if (count.compareTo(sendcounts) >= 0) {
                    tran.outputs = [];
                    if (sendcount.compareTo(Neo.Fixed8.Zero) > 0) {
                        var output = new ThinNeo.TransactionOutput();
                        output.assetId = assetid.hexToBytes().reverse();
                        output.value = sendcount;
                        output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(targetaddr);
                        tran.outputs.push(output);
                    }
                    if (left_fee == 0) {
                        var change = count.subtract(sendcounts);
                        if (change.compareTo(Neo.Fixed8.Zero) > 0) {
                            if (split && change.compareTo(Neo.Fixed8.fromNumber(split_min)) > 0 && us.length < split_num) {
                                var change_num = change.getData().toNumber() / 100000000;
                                var change_int = Math.trunc(change_num);
                                var change_1 = change_int / split_num;
                                for (let i = 0; i < split_num; i++) {
                                    var outputchange = new ThinNeo.TransactionOutput();
                                    outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                                    outputchange.value = Neo.Fixed8.fromNumber(change_1);
                                    outputchange.assetId = assetid.hexToBytes().reverse();
                                    tran.outputs.push(outputchange);
                                }
                                var litt = change.subtract(Neo.Fixed8.fromNumber(change_int));
                                if (litt.compareTo(Neo.Fixed8.Zero) > 0) {
                                    var outputchange = new ThinNeo.TransactionOutput();
                                    outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                                    outputchange.value = litt;
                                    outputchange.assetId = assetid.hexToBytes().reverse();
                                    tran.outputs.push(outputchange);
                                }
                                console.log("[BlaCat]", "[cointool]", "[makeTran]", "拆分utxo, change_1 =>", change_1, "litt =>", litt.getData().toNumber());
                            }
                            else {
                                var outputchange = new ThinNeo.TransactionOutput();
                                outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                                outputchange.value = change;
                                outputchange.assetId = assetid.hexToBytes().reverse();
                                tran.outputs.push(outputchange);
                            }
                        }
                    }
                    res.err = false;
                    res.info = { "tran": tran, "oldarr": old };
                }
                else {
                    throw new Error("pay_not_enough_money");
                }
                return res;
            }
            static makeTranMulti(utxos, targets, assetid, net_fee = Neo.Fixed8.Zero) {
                var _count = 0;
                for (let i = 0; i < targets.length; i++) {
                    _count += Number(targets[i].count);
                }
                if (_count <= 0) {
                    throw new Error("can_not_send_zero");
                }
                var sendcount = Neo.Fixed8.fromNumber(_count);
                var res = new tools.Result();
                var us = utxos[assetid];
                if (us == undefined) {
                    throw new Error("pay_not_enough_utxo");
                }
                var tran = new ThinNeo.Transaction();
                tran.type = ThinNeo.TransactionType.ContractTransaction;
                tran.version = 0;
                tran.extdata = null;
                tran.attributes = [];
                tran.inputs = [];
                var scraddr = "";
                utxos[assetid].sort((a, b) => {
                    return a.count.compareTo(b.count);
                });
                var count = Neo.Fixed8.Zero;
                var clonearr = [].concat(us);
                var old = [];
                var sendcounts = sendcount.add(net_fee);
                for (var i = 0; i < us.length; i++) {
                    var input = new ThinNeo.TransactionInput();
                    input.hash = us[i].txid.hexToBytes().reverse();
                    input.index = us[i].n;
                    input["_addr"] = us[i].addr;
                    tran.inputs.push(input);
                    count = count.add(us[i].count);
                    scraddr = us[i].addr;
                    clonearr.shift();
                    old.push(new tools.OldUTXO(us[i].txid, us[i].n, assetid));
                    if (count.compareTo(sendcounts) > 0) {
                        break;
                    }
                }
                if (count.compareTo(sendcounts) >= 0) {
                    tran.outputs = [];
                    if (sendcount.compareTo(Neo.Fixed8.Zero) > 0) {
                        for (let k = 0; k < targets.length; k++) {
                            var output = new ThinNeo.TransactionOutput();
                            output.assetId = assetid.hexToBytes().reverse();
                            output.value = Neo.Fixed8.parse(targets[k].count + "");
                            output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(targets[k].toaddr);
                            tran.outputs.push(output);
                        }
                    }
                    var change = count.subtract(sendcounts);
                    if (change.compareTo(Neo.Fixed8.Zero) > 0) {
                        var outputchange = new ThinNeo.TransactionOutput();
                        outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                        outputchange.value = change;
                        outputchange.assetId = assetid.hexToBytes().reverse();
                        tran.outputs.push(outputchange);
                    }
                    res.err = false;
                    res.info = { "tran": tran, "oldarr": old };
                }
                else {
                    throw new Error("pay_not_enough_money");
                }
                return res;
            }
            static rawTransaction(targetaddr, asset, count, net_fee = Neo.Fixed8.Zero) {
                return __awaiter(this, void 0, void 0, function* () {
                    var arr = tools.StorageTool.getLoginArr();
                    var add = tools.StorageTool.getStorage("current-address");
                    try {
                        var n = arr.findIndex(login => login.address == add);
                    }
                    catch (e) {
                        var n;
                        for (let i = 0; i < arr.length; i++) {
                            if (add == arr[i].address) {
                                n = i;
                                break;
                            }
                        }
                    }
                    var _count = Neo.Fixed8.parse(count + "");
                    var utxos = yield CoinToolNeo.getassets();
                    if (asset == tools.CoinToolNeo.id_GAS) {
                        try {
                            var tranres = CoinToolNeo.makeTran(utxos, targetaddr, asset, _count, net_fee, 0);
                            var tran = tranres.info['tran'];
                            if (tran.witnesses == null)
                                tran.witnesses = [];
                            let txid = "0x" + tran.GetHash().clone().reverse().toHexString();
                            var msg = tran.GetMessage().clone();
                            var pubkey = arr[n].pubkey.clone();
                            var prekey = arr[n].prikey.clone();
                            var addr = arr[n].address;
                            var signdata = ThinNeo.Helper.Sign(msg, prekey);
                            tran.AddWitness(signdata, pubkey, addr);
                            var data = tran.GetRawData();
                            var res = new tools.Result();
                            var height = yield tools.WWWNeo.api_getHeight_nodes();
                            var result = yield tools.WWWNeo.api_postRawTransaction(data);
                            if (result["sendrawtransactionresult"]) {
                                res.err = !result;
                                res.info = txid;
                                let olds = tranres.info['oldarr'];
                                olds.map(old => old.height = height);
                                tools.OldUTXO.oldutxosPush(olds);
                            }
                            else {
                                res.err = true;
                                res.info = "no txid";
                            }
                            return res;
                        }
                        catch (error) {
                            throw error;
                        }
                    }
                    else {
                        try {
                            var tranres = CoinToolNeo.makeTran(utxos, targetaddr, asset, _count, Neo.Fixed8.Zero, 0);
                            if (net_fee.compareTo(Neo.Fixed8.Zero) > 0) {
                                var user_makeTranRes = tools.CoinToolNeo.makeTran(utxos, add, tools.CoinToolNeo.id_GAS, Neo.Fixed8.Zero, net_fee);
                                var user_tran = user_makeTranRes.info.tran;
                                for (let i = 0; i < user_tran.inputs.length; i++) {
                                    tranres.info.tran.inputs.push(user_tran.inputs[i]);
                                }
                                for (let i = 0; i < user_tran.outputs.length; i++) {
                                    tranres.info.tran.outputs.push(user_tran.outputs[i]);
                                }
                                var user_oldarr = user_makeTranRes.info.oldarr;
                                for (let i = 0; i < user_oldarr.length; i++) {
                                    tranres.info.oldarr.push(user_oldarr[i]);
                                }
                            }
                            var tran = tranres.info['tran'];
                            if (tran.witnesses == null)
                                tran.witnesses = [];
                            let txid = "0x" + tran.GetHash().clone().reverse().toHexString();
                            var msg = tran.GetMessage().clone();
                            var pubkey = arr[n].pubkey.clone();
                            var prekey = arr[n].prikey.clone();
                            var addr = arr[n].address;
                            var signdata = ThinNeo.Helper.Sign(msg, prekey);
                            tran.AddWitness(signdata, pubkey, addr);
                            var data = tran.GetRawData();
                            var res = new tools.Result();
                            var height = yield tools.WWWNeo.api_getHeight_nodes();
                            var result = yield tools.WWWNeo.api_postRawTransaction(data);
                            if (result["sendrawtransactionresult"]) {
                                res.err = !result;
                                res.info = txid;
                                let olds = tranres.info['oldarr'];
                                olds.map(old => old.height = height);
                                tools.OldUTXO.oldutxosPush(olds);
                            }
                            else {
                                res.err = true;
                                res.info = "no txid";
                            }
                            return res;
                        }
                        catch (error) {
                            throw error;
                        }
                    }
                });
            }
            static rawTransactionMulti(targets, asset, net_fee = Neo.Fixed8.Zero) {
                return __awaiter(this, void 0, void 0, function* () {
                    var arr = tools.StorageTool.getLoginArr();
                    var add = tools.StorageTool.getStorage("current-address");
                    try {
                        var n = arr.findIndex(login => login.address == add);
                    }
                    catch (e) {
                        var n;
                        for (let i = 0; i < arr.length; i++) {
                            if (add == arr[i].address) {
                                n = i;
                                break;
                            }
                        }
                    }
                    var utxos = yield CoinToolNeo.getassets();
                    try {
                        var tranres = CoinToolNeo.makeTranMulti(utxos, targets, asset, net_fee);
                        var tran = tranres.info['tran'];
                        if (tran.witnesses == null)
                            tran.witnesses = [];
                        let txid = "0x" + tran.GetHash().clone().reverse().toHexString();
                        var msg = tran.GetMessage().clone();
                        var pubkey = arr[n].pubkey.clone();
                        var prekey = arr[n].prikey.clone();
                        var addr = arr[n].address;
                        var signdata = ThinNeo.Helper.Sign(msg, prekey);
                        tran.AddWitness(signdata, pubkey, addr);
                        var data = tran.GetRawData();
                        var res = new tools.Result();
                        var height = yield tools.WWWNeo.api_getHeight_nodes();
                        var result = yield tools.WWWNeo.api_postRawTransaction(data);
                        if (result["sendrawtransactionresult"]) {
                            res.err = !result;
                            res.info = txid;
                            let olds = tranres.info['oldarr'];
                            olds.map(old => old.height = height);
                            tools.OldUTXO.oldutxosPush(olds);
                        }
                        else {
                            res.err = true;
                            res.info = "no txid";
                        }
                        return res;
                    }
                    catch (error) {
                        throw error;
                    }
                });
            }
            static contractInvokeTrans_attributes(script, net_fee = "0", not_send = false) {
                return __awaiter(this, void 0, void 0, function* () {
                    let current = tools.LoginInfo.getCurrentLogin();
                    var addr = current.address;
                    var tran;
                    if (Number(net_fee) > 0) {
                        try {
                            var user_utxos_assets = yield tools.CoinToolNeo.getassets();
                            console.log("[BlaCat]", '[cointool]', '[contractInvokeTrans_attributes]', 'user_utxos_assets => ', user_utxos_assets);
                            var user_makeTranRes = tools.CoinToolNeo.makeTran(user_utxos_assets, BlackCat.Main.user.info.wallet, tools.CoinToolNeo.id_GAS, Neo.Fixed8.Zero, Neo.Fixed8.fromNumber(Number(net_fee)));
                            var tran = user_makeTranRes.info.tran;
                            var oldarr = user_makeTranRes.info.oldarr;
                            console.log("[BlaCat]", '[cointool]', '[contractInvokeTrans_attributes]', 'user_makeTranRes => ', user_makeTranRes);
                        }
                        catch (e) {
                            var res = new tools.Result();
                            res.err = true;
                            res.info = e.toString();
                            return res;
                        }
                    }
                    else {
                        tran = new ThinNeo.Transaction();
                        tran.inputs = [];
                        tran.outputs = [];
                    }
                    tran.type = ThinNeo.TransactionType.InvocationTransaction;
                    tran.extdata = new ThinNeo.InvokeTransData();
                    tran.extdata.script = script;
                    tran.attributes = new Array(1);
                    tran.attributes[0] = new ThinNeo.Attribute();
                    tran.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
                    tran.attributes[0].data = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(addr);
                    if (tran.witnesses == null)
                        tran.witnesses = [];
                    var msg = tran.GetMessage().clone();
                    var pubkey = current.pubkey.clone();
                    var prekey = current.prikey.clone();
                    var signdata = ThinNeo.Helper.Sign(msg, prekey);
                    tran.AddWitness(signdata, pubkey, addr);
                    var data = tran.GetRawData();
                    let txid = "0x" + tran.GetHash().clone().reverse().toHexString();
                    var res = new tools.Result();
                    if (not_send) {
                        res.err = false;
                        res.info = txid;
                        res['data'] = data;
                        if (Number(net_fee) > 0 && oldarr) {
                            var height = yield tools.WWWNeo.api_getHeight_nodes();
                            oldarr.map(old => old.height = height);
                            res['oldarr'] = oldarr;
                        }
                        return res;
                    }
                    var result = yield tools.WWWNeo.api_postRawTransaction(data);
                    if (result["sendrawtransactionresult"]) {
                        if (!result["txid"]) {
                            result["txid"] = txid;
                        }
                        if (Number(net_fee) > 0 && oldarr) {
                            var height = yield tools.WWWNeo.api_getHeight_nodes();
                            oldarr.map(old => old.height = height);
                            tools.OldUTXO.oldutxosPush(oldarr);
                        }
                    }
                    res.err = !result["sendrawtransactionresult"];
                    res.info = result["txid"];
                    return res;
                });
            }
            static contractInvokeTrans(script) {
                return __awaiter(this, void 0, void 0, function* () {
                    let current = tools.LoginInfo.getCurrentLogin();
                    var addr = current.address;
                    let assetid = CoinToolNeo.id_GAS;
                    var utxos = yield CoinToolNeo.getassets();
                    let tranmsg = CoinToolNeo.makeTran(utxos, current.address, assetid, Neo.Fixed8.Zero);
                    let tran = tranmsg.info['tran'];
                    tran.type = ThinNeo.TransactionType.InvocationTransaction;
                    tran.extdata = new ThinNeo.InvokeTransData();
                    tran.extdata.script = script;
                    if (tran.witnesses == null)
                        tran.witnesses = [];
                    var msg = tran.GetMessage().clone();
                    var pubkey = current.pubkey.clone();
                    var prekey = current.prikey.clone();
                    var signdata = ThinNeo.Helper.Sign(msg, prekey);
                    tran.AddWitness(signdata, pubkey, addr);
                    var data = tran.GetRawData();
                    console.log(data);
                    var res = new tools.Result();
                    var result = yield tools.WWWNeo.api_postRawTransaction(data);
                    res.err = !result;
                    res.info = "成功";
                    return res;
                });
            }
            static nep5Transaction(address, tatgeraddr, asset, amount, net_fee = "0", not_send = false) {
                return __awaiter(this, void 0, void 0, function* () {
                    let res = yield tools.WWWNeo.api_getNep5Asset(asset);
                    var decimals = res["decimals"];
                    var numarr = amount.split(".");
                    decimals -= (numarr.length == 1 ? 0 : numarr[1].length);
                    var v = 1;
                    for (var i = 0; i < decimals; i++)
                        v *= 10;
                    var bnum = new Neo.BigInteger(amount.replace(".", ""));
                    var intv = bnum.multiply(v).toString();
                    var sb = new ThinNeo.ScriptBuilder();
                    var scriptaddress = asset.hexToBytes().reverse();
                    var random_int;
                    try {
                        var random_uint8 = Neo.Cryptography.RandomNumberGenerator.getRandomValues(new Uint8Array(32));
                        random_int = Neo.BigInteger.fromUint8Array(random_uint8);
                    }
                    catch (e) {
                        var math_rand = parseInt((Math.random() * 10000000).toString());
                        console.log("[BlaCat]", '[cointool]', '[nep5Transaction]', 'random_int from js random => ', math_rand);
                        random_int = new Neo.BigInteger(math_rand);
                    }
                    sb.EmitPushNumber(random_int);
                    sb.Emit(ThinNeo.OpCode.DROP);
                    sb.EmitParamJson(["(address)" + address, "(address)" + tatgeraddr, "(integer)" + intv]);
                    sb.EmitPushString("transfer");
                    sb.EmitAppCall(scriptaddress);
                    var result = yield CoinToolNeo.contractInvokeTrans_attributes(sb.ToArray(), net_fee, not_send);
                    return result;
                });
            }
            static getNep5Assets(id_hash) {
                return __awaiter(this, void 0, void 0, function* () {
                    var height = yield tools.WWWNeo.api_getHeight_nodes();
                    var scriptHash = ThinNeo.Helper.GetAddressFromScriptHash(id_hash.hexToBytes().reverse());
                    var utxos = yield tools.WWWNeo.api_getUTXO(scriptHash);
                    var olds = tools.OldUTXO.getOldutxos();
                    var olds2 = new Array();
                    for (let n = 0; n < olds.length; n++) {
                        const old = olds[n];
                        let findutxo = false;
                        for (let i = 0; i < utxos.length; i++) {
                            let utxo = utxos[i];
                            if (utxo.txid == old.txid && old.n == utxo.n && height - old.height <= 2 && utxo.asset == old.asset) {
                                findutxo = true;
                                utxos.splice(i, 1);
                            }
                        }
                        if (findutxo) {
                            olds2.push(old);
                        }
                    }
                    tools.OldUTXO.setOldutxos(olds2);
                    var assets = {};
                    for (var i in utxos) {
                        var item = utxos[i];
                        var asset = item.asset;
                        if (assets[asset] == undefined || assets[asset] == null) {
                            assets[asset] = [];
                        }
                        let utxo = new tools.UTXO();
                        utxo.addr = item.addr;
                        utxo.asset = item.asset;
                        utxo.n = item.n;
                        utxo.txid = item.txid;
                        utxo.count = Neo.Fixed8.parse(item.value);
                        assets[asset].push(utxo);
                    }
                    return assets;
                });
            }
            static getCgasAssets(id_CGAS = this.id_CGAS, amount) {
                return __awaiter(this, void 0, void 0, function* () {
                    var scriptHash = ThinNeo.Helper.GetAddressFromScriptHash(id_CGAS.hexToBytes().reverse());
                    var utxos = yield tools.WWWNeo.api_getAvailableUTXOS(scriptHash, amount);
                    var assets = {};
                    for (var i in utxos) {
                        var item = utxos[i];
                        var asset = CoinToolNeo.id_GAS;
                        if (assets[asset] == undefined || assets[asset] == null) {
                            assets[asset] = [];
                        }
                        let utxo = new tools.UTXO();
                        utxo.addr = scriptHash;
                        utxo.asset = item.asset;
                        utxo.n = item.n;
                        utxo.txid = item.txid;
                        utxo.count = Neo.Fixed8.parse(item.value);
                        assets[asset].push(utxo);
                    }
                    return assets;
                });
            }
        }
        CoinToolNeo.id_GAS = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
        CoinToolNeo.id_NEO = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
        CoinToolNeo.id_CGAS = "";
        CoinToolNeo.id_CGAS_OLD = [];
        CoinToolNeo.id_CNEO = "";
        CoinToolNeo.id_CNEO_OLD = [];
        CoinToolNeo.id_BCT = "";
        CoinToolNeo.id_BCP = "";
        CoinToolNeo.id_BCT_DESTROY = "";
        CoinToolNeo.id_BTC = "";
        CoinToolNeo.id_BTC_DESTROY = "";
        CoinToolNeo.id_ETH = "";
        CoinToolNeo.id_ETH_DESTROY = "";
        CoinToolNeo.id_CNEO_DESTROY = "";
        CoinToolNeo.id_bancor = "";
        CoinToolNeo.BUY_VIP_ADDR = "";
        CoinToolNeo.id_broker = "";
        CoinToolNeo.assetID2name = {};
        CoinToolNeo.name2assetID = {};
        tools.CoinToolNeo = CoinToolNeo;
    })(tools = BlackCat.tools || (BlackCat.tools = {}));
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class floatNum {
        static strip(num, precision = 12) {
            return +parseFloat(num.toPrecision(precision));
        }
        static digitLength(num) {
            const eSplit = num.toString().split(/[eE]/);
            const len = (eSplit[0].split('.')[1] || '').length - (+(eSplit[1] || 0));
            return len > 0 ? len : 0;
        }
        static float2Fixed(num) {
            if (num.toString().indexOf('e') === -1) {
                return Number(num.toString().replace('.', ''));
            }
            const dLen = floatNum.digitLength(num);
            return dLen > 0 ? num * Math.pow(10, dLen) : num;
        }
        static checkBoundary(num) {
            if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
                console.warn(`${num} is beyond boundary when transfer to integer, the results may not be accurate`);
            }
        }
        static times(num1, num2, ...others) {
            if (others.length > 0) {
                return floatNum.times(floatNum.times(num1, num2), others[0], ...others.slice(1));
            }
            const num1Changed = floatNum.float2Fixed(num1);
            const num2Changed = floatNum.float2Fixed(num2);
            const baseNum = floatNum.digitLength(num1) + floatNum.digitLength(num2);
            const leftValue = num1Changed * num2Changed;
            floatNum.checkBoundary(leftValue);
            return leftValue / Math.pow(10, baseNum);
        }
        static plus(num1, num2, ...others) {
            if (others.length > 0) {
                return floatNum.plus(floatNum.plus(num1, num2), others[0], ...others.slice(1));
            }
            const baseNum = Math.pow(10, Math.max(floatNum.digitLength(num1), floatNum.digitLength(num2)));
            return (floatNum.times(num1, baseNum) + floatNum.times(num2, baseNum)) / baseNum;
        }
        static minus(num1, num2, ...others) {
            if (others.length > 0) {
                return floatNum.minus(floatNum.minus(num1, num2), others[0], ...others.slice(1));
            }
            const baseNum = Math.pow(10, Math.max(floatNum.digitLength(num1), floatNum.digitLength(num2)));
            return (floatNum.times(num1, baseNum) - floatNum.times(num2, baseNum)) / baseNum;
        }
        static divide(num1, num2, ...others) {
            if (others.length > 0) {
                return floatNum.divide(floatNum.divide(num1, num2), others[0], ...others.slice(1));
            }
            const num1Changed = floatNum.float2Fixed(num1);
            const num2Changed = floatNum.float2Fixed(num2);
            floatNum.checkBoundary(num1Changed);
            floatNum.checkBoundary(num2Changed);
            return floatNum.times((num1Changed / num2Changed), Math.pow(10, floatNum.digitLength(num2) - floatNum.digitLength(num1)));
        }
        static round(num, ratio) {
            const base = Math.pow(10, ratio);
            return floatNum.divide(Math.round(floatNum.times(num, base)), base);
        }
        static addZero(num, ratio) {
            var s_x = num.toString();
            var pos_decimal = s_x.indexOf('.');
            if (pos_decimal < 0) {
                pos_decimal = s_x.length;
                s_x += '.';
            }
            while (s_x.length <= pos_decimal + ratio) {
                s_x += '0';
            }
            return s_x;
        }
    }
    BlackCat.floatNum = floatNum;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    var tools;
    (function (tools) {
        class neotools {
            constructor() { }
            static verifyAddress(addr) {
                var verify = /^[a-zA-Z0-9]{34,34}$/;
                var res = verify.test(addr) ? neotools.verifyPublicKey(addr) : verify.test(addr);
                return res;
            }
            static verifyPublicKey(publicKey) {
                var array = Neo.Cryptography.Base58.decode(publicKey);
                var check = array.subarray(21, 21 + 4);
                var checkdata = array.subarray(0, 21);
                var hashd = Neo.Cryptography.Sha256.computeHash(checkdata);
                hashd = Neo.Cryptography.Sha256.computeHash(hashd);
                var hashd = hashd.slice(0, 4);
                var checked = new Uint8Array(hashd);
                var error = false;
                for (var i = 0; i < 4; i++) {
                    if (checked[i] != check[i]) {
                        error = true;
                        break;
                    }
                }
                return !error;
            }
            static wifDecode(wif) {
                let result = new tools.Result();
                let login = new tools.LoginInfo();
                try {
                    login.prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
                }
                catch (e) {
                    result.err = true;
                    result.info = e.message;
                    return result;
                }
                try {
                    login.pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(login.prikey);
                }
                catch (e) {
                    result.err = true;
                    result.info = e.message;
                    return result;
                }
                try {
                    login.address = ThinNeo.Helper.GetAddressFromPublicKey(login.pubkey);
                }
                catch (e) {
                    result.err = true;
                    result.info = e.message;
                    return result;
                }
                result.info = login;
                return result;
            }
            static nep2FromWif(wif, password) {
                var prikey;
                var pubkey;
                var address;
                let res = new tools.Result();
                try {
                    prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
                    var n = 16384;
                    var r = 8;
                    var p = 8;
                    ThinNeo.Helper.GetNep2FromPrivateKey(prikey, password, n, r, p, (info, result) => {
                        res.err = false;
                        res.info.nep2 = result;
                        pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                        var hexstr = pubkey.toHexString();
                        address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                        res.info.address = address;
                        return res;
                    });
                }
                catch (e) {
                    res.err = true;
                    res.info = e.message;
                    return res;
                }
            }
            static nep2ToWif(nep2, password) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = new tools.Result();
                    let login = new tools.LoginInfo();
                    let promise = new Promise((resolve, reject) => {
                        let n = 16384;
                        var r = 8;
                        var p = 8;
                        ThinNeo.Helper.GetPrivateKeyFromNep2(nep2, password, n, r, p, (info, result) => {
                            login.prikey = result;
                            if (login.prikey != null) {
                                login.pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(login.prikey);
                                login.address = ThinNeo.Helper.GetAddressFromPublicKey(login.pubkey);
                                res.err = false;
                                res.info = login;
                                resolve(res);
                            }
                            else {
                                res.err = true;
                                reject(res);
                            }
                        });
                    });
                    return promise;
                });
            }
            static nep6Load(wallet, password) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        var istart = 0;
                        let res = new tools.Result();
                        let arr = new Array();
                        if (wallet.accounts) {
                            for (let keyindex = 0; keyindex < wallet.accounts.length; keyindex++) {
                                let account = wallet.accounts[keyindex];
                                if (account.nep2key == null) {
                                    continue;
                                }
                                try {
                                    let result = yield neotools.getPriKeyfromAccount(wallet.scrypt, password, account);
                                    arr.push(result.info);
                                    return arr;
                                }
                                catch (error) {
                                    throw error;
                                }
                            }
                        }
                        else {
                            throw console.error("The account cannot be empty");
                        }
                    }
                    catch (e) {
                        throw e.result;
                    }
                });
            }
            static getPriKeyfromAccount(scrypt, password, account) {
                return __awaiter(this, void 0, void 0, function* () {
                    let res = new tools.Result();
                    let promise = new Promise((resolve, reject) => {
                        account.getPrivateKey(scrypt, password, (info, result) => {
                            if (info == "finish") {
                                var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(result);
                                var address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                                var wif = ThinNeo.Helper.GetWifFromPrivateKey(result);
                                var hexkey = result.toHexString();
                                res.err = false;
                                res.info = { pubkey: pubkey, address: address, prikey: result };
                                resolve(res);
                            }
                            else {
                                reject({ err: true, result: result });
                            }
                        });
                    });
                    return promise;
                });
            }
        }
        tools.neotools = neotools;
    })(tools = BlackCat.tools || (BlackCat.tools = {}));
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    var tools;
    (function (tools) {
        class NNSTool {
            static initRootDomain() {
                return __awaiter(this, void 0, void 0, function* () {
                    var test = new tools.RootDomainInfo();
                    test.roothash = NNSTool.nameHash("test");
                    test.rootname = "test";
                    var scriptaddress = tools.Consts.baseContract.hexToBytes().reverse();
                    var domain = yield NNSTool.getOwnerInfo(test.roothash, scriptaddress);
                    test.owner = domain.owner;
                    test.register = domain.register;
                    test.resolver = domain.resolver;
                    test.ttl = domain.ttl;
                    NNSTool.root_test = test;
                });
            }
            static queryDomainInfo(doamin) {
                return __awaiter(this, void 0, void 0, function* () {
                    var domainarr = doamin.split('.');
                    var subdomain = domainarr[0];
                    var nnshash = NNSTool.nameHashArray(domainarr);
                    let doamininfo = yield NNSTool.getOwnerInfo(nnshash, tools.Consts.baseContract.hexToBytes().reverse());
                    var owner = doamininfo.owner.toHexString();
                    return doamininfo;
                });
            }
            static registerDomain(doamin) {
                return __awaiter(this, void 0, void 0, function* () {
                    var nnshash = NNSTool.nameHash(NNSTool.root_test.rootname);
                    var address = tools.LoginInfo.getCurrentAddress();
                    var sb = new ThinNeo.ScriptBuilder();
                    var scriptaddress = NNSTool.root_test.register;
                    let random_uint8 = Neo.Cryptography.RandomNumberGenerator.getRandomValues(new Uint8Array(32));
                    let random_int = Neo.BigInteger.fromUint8Array(random_uint8);
                    sb.EmitPushNumber(random_int);
                    sb.Emit(ThinNeo.OpCode.DROP);
                    sb.EmitParamJson(["(addr)" + address, "(bytes)" + nnshash.toHexString(), "(str)" + doamin]);
                    sb.EmitPushString("requestSubDomain");
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    var res = yield tools.CoinToolNeo.contractInvokeTrans_attributes(data);
                    if (!res.err) {
                    }
                    return res;
                });
            }
            static getRootName() {
                return __awaiter(this, void 0, void 0, function* () {
                    let name = "";
                    var sb = new ThinNeo.ScriptBuilder();
                    sb.EmitParamJson(JSON.parse("[]"));
                    sb.EmitPushString("rootName");
                    var scriptaddress = tools.Consts.baseContract.hexToBytes().reverse();
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    let result = yield tools.WWWNeo.api_getInvokescript(data);
                    try {
                        var state = result.state;
                        if (state.includes("HALT, BREAK")) {
                        }
                        var stack = result.stack;
                        if (stack[0].type == "Array") {
                            length = stack[0].lenght;
                        }
                        else if (stack[0].type == "ByteArray") {
                            var bs = stack[0].value.hexToBytes();
                            name = ThinNeo.Helper.Bytes2String(bs);
                        }
                        return name;
                    }
                    catch (e) {
                        return e.message;
                    }
                });
            }
            static getRootNameHash() {
                return __awaiter(this, void 0, void 0, function* () {
                    let nameHash;
                    var sb = new ThinNeo.ScriptBuilder();
                    sb.EmitParamJson(JSON.parse("[]"));
                    sb.EmitPushString("rootNameHash");
                    var scriptaddress = tools.Consts.baseContract.hexToBytes().reverse();
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    let result = yield tools.WWWNeo.api_getInvokescript(data);
                    try {
                        var state = result["state"];
                        if (state.includes("HALT, BREAK")) {
                        }
                        var stack = result["stack"];
                        if (stack[0].type == "ByteArray") {
                            nameHash = stack[0]["value"].hexToBytes();
                        }
                        return nameHash;
                    }
                    catch (e) {
                        return e.message;
                    }
                });
            }
            static getOwnerInfo(domain, scriptaddress) {
                return __awaiter(this, void 0, void 0, function* () {
                    let info = new tools.DomainInfo();
                    var sb = new ThinNeo.ScriptBuilder();
                    sb.EmitParamJson(["(bytes)" + domain.toHexString()]);
                    sb.EmitPushString("getOwnerInfo");
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    let result = yield tools.WWWNeo.api_getInvokescript(data);
                    try {
                        var state = result.state;
                        if (state.includes("HALT, BREAK")) {
                        }
                        var stackarr = result["stack"];
                        if (stackarr[0].type == "Array") {
                            var stack = stackarr[0].value;
                            if (stack[0].type == "ByteArray") {
                                info.owner = stack[0].value.hexToBytes();
                            }
                            if (stack[1].type == "ByteArray") {
                                info.register = stack[1].value.hexToBytes();
                            }
                            if (stack[2].type == "ByteArray") {
                                info.resolver = stack[2].value.hexToBytes();
                            }
                            if (stack[3].type == "Integer") {
                                info.ttl = new Neo.BigInteger(stack[3].value).toString();
                            }
                            if (stack[3].type = "ByteArray") {
                                let bt = stack[3].value.hexToBytes();
                                info.ttl = Neo.BigInteger.fromUint8ArrayAutoSign(bt.clone()).toString();
                            }
                            if (stack[4].type = "ByteArray") {
                                let parentOwner = stack[5].value.hexToBytes();
                            }
                            if (stack[5].type = "String") {
                                let domainstr = stack[5].value;
                            }
                            if (stack[6].type = "ByteArray") {
                                let parentHash = stack[6].value.hexToBytes();
                            }
                            if (stack[7].type = "ByteArray") {
                                let bt = stack[7].value.hexToBytes();
                                let root = Neo.BigInteger.fromUint8ArrayAutoSign(bt);
                            }
                            if (stack[7].type = "Integer") {
                                let a = new Neo.BigInteger(stack[7].value);
                            }
                        }
                    }
                    catch (e) {
                    }
                    return info;
                });
            }
            static getNameHash(domain) {
                return __awaiter(this, void 0, void 0, function* () {
                    let namehash;
                    var domainarr = domain.split('.');
                    var subdomain = domainarr[0];
                    var root = yield NNSTool.getRootName();
                    domainarr.shift();
                    domainarr.push(root);
                    var nnshash = NNSTool.nameHashArray(domainarr);
                    return nnshash;
                });
            }
            static setResolve(nnshash, resolverhash) {
                return __awaiter(this, void 0, void 0, function* () {
                    let current = tools.LoginInfo.getCurrentLogin();
                    let hash = ThinNeo.Helper.GetPublicKeyScriptHashFromPublicKey(current.pubkey);
                    let hashstr = hash.reverse().toHexString();
                    let nnshashstr = nnshash.reverse().toHexString();
                    let resolvestr = resolverhash.reverse().toHexString();
                    var scriptaddress = tools.Consts.baseContract.hexToBytes().reverse();
                    var sb = new ThinNeo.ScriptBuilder();
                    let random_uint8 = Neo.Cryptography.RandomNumberGenerator.getRandomValues(new Uint8Array(32));
                    let random_int = Neo.BigInteger.fromUint8Array(random_uint8);
                    sb.EmitPushNumber(random_int);
                    sb.Emit(ThinNeo.OpCode.DROP);
                    sb.EmitParamJson([
                        "(hex160)0x" + hashstr,
                        "(hex256)0x" + nnshashstr,
                        "(hex160)0x" + resolvestr
                    ]);
                    sb.EmitPushString("owner_SetResolver");
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    console.log(data.toHexString());
                    let res = yield tools.CoinToolNeo.contractInvokeTrans_attributes(data);
                    return res;
                });
            }
            static setResolveData(nnshash, str, resolve) {
                return __awaiter(this, void 0, void 0, function* () {
                    let namehash;
                    let current = tools.LoginInfo.getCurrentLogin();
                    let hash = ThinNeo.Helper.GetPublicKeyScriptHashFromPublicKey(current.pubkey);
                    let hashstr = hash.reverse().toHexString();
                    let nnshashstr = nnshash.reverse().toHexString();
                    var scriptaddress = resolve.hexToBytes();
                    var sb = new ThinNeo.ScriptBuilder();
                    let random_uint8 = Neo.Cryptography.RandomNumberGenerator.getRandomValues(new Uint8Array(32));
                    let random_int = Neo.BigInteger.fromUint8Array(random_uint8);
                    sb.EmitPushNumber(random_int);
                    sb.Emit(ThinNeo.OpCode.DROP);
                    sb.EmitParamJson([
                        "(hex160)0x" + hashstr,
                        "(hex256)0x" + nnshashstr,
                        "(str)1",
                        "(str)addr",
                        "(str)" + str
                    ]);
                    sb.EmitPushString("setResolveData");
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    let res = yield tools.CoinToolNeo.contractInvokeTrans_attributes(data);
                    return;
                });
            }
            static resolveData(domain) {
                return __awaiter(this, void 0, void 0, function* () {
                    var scriptaddress = tools.Consts.baseContract.hexToBytes().reverse();
                    let arr = domain.split(".");
                    let nnshash = NNSTool.nameHashArray(arr);
                    let nnshashstr = nnshash.reverse().toHexString();
                    var sb = new ThinNeo.ScriptBuilder();
                    sb.EmitParamJson([
                        "(str)addr",
                        "(hex256)0x" + nnshashstr,
                        "(str)1"
                    ]);
                    sb.EmitPushString("resolve");
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    let res = yield tools.WWWNeo.api_getInvokescript(data);
                    let addr = "";
                    try {
                        var state = res.state;
                        if (state.includes("HALT, BREAK")) {
                            var stack = res.stack;
                            if (stack[0].type == "ByteArray") {
                                if (stack[0].value != "00") {
                                    let value = stack[0].value.hexToBytes();
                                    addr = ThinNeo.Helper.Bytes2String(value);
                                }
                            }
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                    return addr;
                });
            }
            static resolveFull(protocol, nameArray) {
                return __awaiter(this, void 0, void 0, function* () { });
            }
            static getSubOwner(nnshash, subdomain, scriptaddress) {
                return __awaiter(this, void 0, void 0, function* () {
                    let owner = "";
                    var sb = new ThinNeo.ScriptBuilder();
                    sb.EmitParamJson(["(bytes)" + nnshash.toHexString(), "(str)" + subdomain]);
                    sb.EmitPushString("getSubOwner");
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    let result = yield tools.WWWNeo.api_getInvokescript(data);
                    try {
                        var state = result.state;
                        if (state.includes("HALT, BREAK")) {
                            var stack = result.stack;
                            if (stack[0].type == "ByteArray") {
                                if (stack[0].value != "00") {
                                    owner = ThinNeo.Helper.GetAddressFromScriptHash(stack[0].value.hexToBytes());
                                }
                            }
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                    return owner;
                });
            }
            static nameHash(domain) {
                var domain_bytes = ThinNeo.Helper.String2Bytes(domain);
                var hashd = Neo.Cryptography.Sha256.computeHash(domain_bytes);
                var namehash = new Uint8Array(hashd);
                return namehash.clone();
            }
            static nameHashSub(roothash, subdomain) {
                var bs = ThinNeo.Helper.String2Bytes(subdomain);
                if (bs.length == 0)
                    return roothash;
                var domain = Neo.Cryptography.Sha256.computeHash(bs);
                var domain_bytes = new Uint8Array(domain);
                var domainUint8arry = domain_bytes.concat(roothash);
                var sub = Neo.Cryptography.Sha256.computeHash(domainUint8arry);
                var sub_bytes = new Uint8Array(sub);
                return sub_bytes.clone();
            }
            static nameHashArray(domainarray) {
                domainarray.reverse();
                var hash = NNSTool.nameHash(domainarray[0]);
                for (var i = 1; i < domainarray.length; i++) {
                    hash = NNSTool.nameHashSub(hash, domainarray[i]);
                }
                return hash;
            }
            static verifyDomain(domain) {
                var reg = /^(.+\.)(test|TEST|[a-z][a-z])$/;
                if (!reg.test(domain)) {
                    return false;
                }
                else {
                    return true;
                }
            }
            static verifyAddr(addr) {
                var reg = /^[a-zA-Z0-9]{34,34}$/;
                if (!reg.test(addr)) {
                    return false;
                }
                else {
                    return true;
                }
            }
            static setDomainStatus() {
            }
            static initStatus() {
                NNSTool.domainStatus = tools.DomainStatus.getStatus();
            }
        }
        tools.NNSTool = NNSTool;
    })(tools = BlackCat.tools || (BlackCat.tools = {}));
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class UserInfo {
        constructor() {
            this.wallet = '';
            this.service_charge = "";
        }
    }
    BlackCat.UserInfo = UserInfo;
    class TransInfo {
        constructor() {
            this.assetid = "";
            this.targetaddr = "";
            this.amount = "";
        }
    }
    BlackCat.TransInfo = TransInfo;
    class RawTransInfo {
    }
    BlackCat.RawTransInfo = RawTransInfo;
    class RefundTransInfo {
    }
    BlackCat.RefundTransInfo = RefundTransInfo;
    class MintTokenTransInfo {
    }
    BlackCat.MintTokenTransInfo = MintTokenTransInfo;
    class getMintTokenTransInfo {
    }
    BlackCat.getMintTokenTransInfo = getMintTokenTransInfo;
    class invokescriptInfo {
    }
    BlackCat.invokescriptInfo = invokescriptInfo;
    class walletLists {
        constructor() {
            this.id = "";
            this.g_id = "";
            this.state_gameplay = "";
            this.state_gameplay_detail = "";
            this.vdata = "";
            this.nnc = "";
            this.icon = "";
            this.name = "";
            this.ext = "";
            this.ctm = "";
            this.type = "";
            this.type_detail = "";
            this.state = "";
            this.txid = "";
            this.wallet = "";
            this.cnts = "0";
            this.params = "";
            this.client_notify = "";
            this.net_fee = "";
            this.blockindex = "";
        }
    }
    BlackCat.walletLists = walletLists;
    class contact {
        constructor() {
            this.id = "";
            this.ctm = "";
            this.uid = "";
            this.address_name = "";
            this.address_wallet = "";
            this.address_desc = "";
        }
    }
    BlackCat.contact = contact;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class SDK {
        static init(listener, lang = "cn") {
            console.log("[BlaCat]", '[SDK]', '[init]', 'start ...');
            if (SDK.is_init === false) {
                SDK.main = new BlackCat.Main();
                SDK.main.init(listener, lang);
            }
            SDK.is_init = true;
        }
        static setLang(type) {
            console.log("[BlaCat]", '[SDK]', '[setLang]', 'start ...');
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[setLang]', '请先初始化init');
                return;
            }
            this.main.setLang(type);
        }
        static showMain() {
            console.log("[BlaCat]", '[SDK]', '[showMain]', 'start ...');
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[showMain]', '请先初始化init');
                return;
            }
            this.main.showMain();
        }
        static showIcon() {
            console.log("[BlaCat]", '[SDK]', '[showIcon]', 'start ...');
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[showIcon]', '请先初始化init');
                return;
            }
            this.main.showIcon();
        }
        static login(callback = null) {
            console.log("[BlaCat]", '[SDK]', '[login]', 'start ...');
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[login]', '请先初始化init');
                return;
            }
            SDK.main.start(callback);
        }
        static invokescript(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("[BlaCat]", '[SDK]', '[invokescript]', 'start ...');
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '[invokescript]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log("[BlaCat]", '[SDK]', '[invokescript]', '请先登录');
                    this.showMain();
                    return;
                }
                yield SDK.main.invokescript(params, callback);
            });
        }
        static makeRawTransaction(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("[BlaCat]", '[SDK]', '[makeRawTransaction]', 'start ...');
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '[makeRawTransaction]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log("[BlaCat]", '[SDK]', '[makeRawTransaction]', '请先登录');
                    this.showMain();
                    return;
                }
                yield SDK.main.makeRawTransaction(params, callback);
            });
        }
        static confirmAppNotify(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("[BlaCat]", '[SDK]', '[confirmAppNotify]', 'start ...');
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '[confirmAppNotify]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log("[BlaCat]", '[SDK]', '[confirmAppNotify]', '请先登录');
                    return;
                }
                yield SDK.main.confirmAppNotify(params, callback);
            });
        }
        static getBalance(callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("[BlaCat]", '[SDK]', '[getBalance]', 'start ...');
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '[getBalance]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log("[BlaCat]", '[SDK]', '[getBalance]', '请先登录');
                    return;
                }
                yield SDK.main.getBalance(null, callback);
            });
        }
        static getHeight(callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("[BlaCat]", '[SDK]', '[getHeight]', 'start ...');
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '[getHeight]', '请先初始化init');
                    return;
                }
                yield SDK.main.getHeight(null, callback);
            });
        }
        static getUserInfo(callback = null) {
            console.log("[BlaCat]", '[SDK]', '[getUserInfo]', 'start ...');
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[getUserInfo]', '请先初始化init');
            }
            if (!SDK.main.isLogined()) {
                console.log("[BlaCat]", '[SDK]', '[getUserInfo]', '请先登录');
            }
            SDK.main.getUserInfo(null, callback);
        }
        static makeTransfer(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("[BlaCat]", '[SDK]', '[makeTransfer]', 'start ...');
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '[makeTransfer]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log("[BlaCat]", '[SDK]', '[makeTransfer]', '请先登录');
                    this.showMain();
                    return;
                }
                yield SDK.main.makeTransfer(params, callback);
            });
        }
        static makeGasTransferMulti(params, callback = null) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("[BlaCat]", '[SDK]', '[makeGasTransferMulti]', 'start ...');
                if (SDK.is_init === false) {
                    console.log("[BlaCat]", '[SDK]', '[makeGasTransferMulti]', '请先初始化init');
                    return;
                }
                if (!SDK.main.isLogined()) {
                    console.log("[BlaCat]", '[SDK]', '[makeGasTransferMulti]', '请先登录');
                    this.showMain();
                    return;
                }
                yield SDK.main.makeGasTransferMulti(params, callback);
            });
        }
        static getNetType(callback = null) {
            console.log("[BlaCat]", '[SDK]', '[getNetType]', 'start ...');
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[getNetType]', '请先初始化init');
                return;
            }
            SDK.main.getNetType(null, callback);
        }
        static setDefaultNetType(type) {
            console.log("[BlaCat]", '[SDK]', '[setDefaultNetType]', 'start ...');
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[setDefaultNetType]', '请先初始化init');
                return;
            }
            SDK.main.setDefaultNetType(type);
        }
        static lockNet() {
            console.log("[BlaCat]", '[SDK]', '[lockNet]', 'start ...');
            if (SDK.is_init === false) {
                console.log("[BlaCat]", '[SDK]', '[lockNet]', '请先初始化init');
                return;
            }
            if (SDK.main.isLogined()) {
                console.log("[BlaCat]", '[SDK]', '[lockNet]', '请在登录前操作');
                return;
            }
            SDK.main.lockNet();
        }
    }
    SDK.is_init = false;
    BlackCat.SDK = SDK;
    class Result {
    }
    BlackCat.Result = Result;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    class sdkCallback {
        static error(error, type, params, callback = null) {
            let error_res = new BlackCat.Result();
            error_res.err = true;
            error_res.info = error;
            let callback_data = {
                params: params,
                res: error_res
            };
            sdkCallback.callback(error_res, type, callback_data, callback);
        }
        static succ(info, type, params, callback = null) {
            let succ_res = new BlackCat.Result();
            succ_res.err = false;
            succ_res.info = info;
            let callback_data = {
                params: params,
                res: succ_res
            };
            sdkCallback.callback(succ_res, type, callback_data, callback);
        }
        static res(res, type, params, callback = null) {
            let callback_data = {
                params: params,
                res: res
            };
            sdkCallback.callback(res, type, callback_data, callback);
        }
        static callback(res, type, callback_data, callback) {
            try {
                BlackCat.Main.listenerCallback(type, callback_data);
            }
            catch (e) {
                console.log("[BlaCat]", '[sdkCallback]', '[callback]', 'sdk listener callback error, type =>', type, ', res =>', res, ', e =>', e);
            }
            try {
                if (callback)
                    callback(res);
            }
            catch (e) {
                console.log("[BlaCat]", '[sdkCallback]', '[callback]', 'sdk function callback error, type =>', type, ', res =>', res, ', e =>', e);
            }
        }
    }
    sdkCallback.getBalance = 'getBalanceRes';
    sdkCallback.getHeight = 'getHeightRes';
    sdkCallback.getUserInfo = 'getUserInfoRes';
    sdkCallback.getNetType = 'getNetTypeRes';
    sdkCallback.makeRaw = 'makeRawTransactionRes';
    sdkCallback.invoke = 'invokescriptRes';
    sdkCallback.makeGasTransferMulti = 'makeGasTransferMultiRes';
    sdkCallback.confirmAppNotify = 'confirmAppNotifyRes';
    BlackCat.sdkCallback = sdkCallback;
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    var tools;
    (function (tools) {
        class StorageTool {
            static getLoginArr() {
                var message = sessionStorage.getItem("login-info-arr");
                var arr = message ? tools.LoginInfo.StringToArray(message) : [];
                return arr;
            }
            static setLoginArr(value) {
                sessionStorage.setItem('login-info-arr', tools.LoginInfo.ArrayToString(value));
            }
            static setStorage(key, value) {
                sessionStorage.setItem(key, value);
            }
            static getStorage(key) {
                return sessionStorage.getItem(key);
            }
            static delStorage(key) {
                sessionStorage.removeItem(key);
            }
            static heightRefresh() {
                return __awaiter(this, void 0, void 0, function* () {
                    let oldheight = StorageTool.getStorage("block-height");
                    let height = yield tools.WWWNeo.api_getHeight_nodes();
                    if (oldheight == undefined || oldheight == null || oldheight == "") {
                        StorageTool.setStorage("block-height", height.toString());
                    }
                    if (height - parseInt(oldheight) >= 2) {
                        StorageTool.utxosRefresh();
                        StorageTool.setStorage('block-height', height.toString());
                    }
                });
            }
            static utxosRefresh() {
                return __awaiter(this, void 0, void 0, function* () {
                    let assets = yield tools.CoinToolNeo.getassets();
                    tools.UTXO.setAssets(assets);
                });
            }
        }
        tools.StorageTool = StorageTool;
        class StaticStore {
            static setAsset(asset) {
                StaticStore.choiceAsset = asset;
            }
        }
        StaticStore.choiceAsset = "";
        tools.StaticStore = StaticStore;
    })(tools = BlackCat.tools || (BlackCat.tools = {}));
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    var tools;
    (function (tools) {
        class DateTool {
            static dateFtt(fmt, date) {
                var o = {
                    "M+": date.getMonth() + 1,
                    "d+": date.getDate(),
                    "h+": date.getHours(),
                    "m+": date.getMinutes(),
                    "s+": date.getSeconds(),
                    "q+": Math.floor((date.getMonth() + 3) / 3),
                    "S": date.getMilliseconds()
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }
        }
        tools.DateTool = DateTool;
    })(tools = BlackCat.tools || (BlackCat.tools = {}));
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    var tools;
    (function (tools) {
        class wallet {
            constructor() {
                this.wallet = new ThinNeo.nep6wallet();
                this.otcgo = new tools.WalletOtcgo();
                this.filestr = "";
                this.isotc = false;
                this.wallet_addr = tools.LoginInfo.getCurrentAddress();
            }
            setWalletStr(filestr) {
                return __awaiter(this, void 0, void 0, function* () {
                    this.filestr = filestr;
                    return yield this.readWalletFile(0);
                });
            }
            readWalletFile(type = 0) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (type == 1) {
                        this.filestr = yield BlackCat.Main.user.getWalletFileCache();
                    }
                    if (this.filestr) {
                        try {
                            this.isotc = !this.filestr.includes("accounts");
                            if (this.isotc) {
                                this.wallet.accounts = undefined;
                                this.otcgo.fromJsonStr(this.filestr);
                                return true;
                            }
                            else {
                                this.otcgo.address = undefined;
                                this.wallet.fromJsonStr(this.filestr);
                                return true;
                            }
                        }
                        catch (e) {
                            console.log("[BlaCat]", '[wallet]', '[readWalletFile]', '钱包文件解析异常', this.filestr);
                            return false;
                        }
                    }
                    return false;
                });
            }
            open(filepass) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!!this.wallet.accounts) {
                        try {
                            let loginarray = yield tools.neotools.nep6Load(this.wallet, filepass);
                            yield tools.StorageTool.setLoginArr(loginarray);
                            yield tools.LoginInfo.setCurrentAddress(loginarray[0].address);
                            this.wallet_addr = loginarray[0].address;
                            return true;
                        }
                        catch (e) {
                            BlackCat.Main.showErrMsg("wallet_open_check");
                            return false;
                        }
                    }
                    if (!!this.otcgo.address) {
                        console.log("[BlaCat]", '[wallet]', '[open]', '打开蓝鲸淘钱包文件');
                        try {
                            this.otcgo.otcgoDecrypt(filepass);
                            const result = this.otcgo.doValidatePwd();
                            if (result) {
                                var loginarray = new Array();
                                loginarray.push(new tools.LoginInfo());
                                loginarray[0].address = this.otcgo.address;
                                loginarray[0].prikey = this.otcgo.prikey;
                                loginarray[0].pubkey = this.otcgo.pubkey;
                                tools.StorageTool.setLoginArr(loginarray);
                                tools.LoginInfo.setCurrentAddress(loginarray[0].address);
                                this.wallet_addr = this.otcgo.address;
                                return true;
                            }
                            else {
                                BlackCat.Main.showErrMsg("wallet_open_check_otcgo_pwd");
                                return false;
                            }
                        }
                        catch (e) {
                            BlackCat.Main.showErrMsg(("wallet_open_check_otcgo"));
                            return false;
                        }
                    }
                    console.log("[BlaCat]", '[wallet]', '[open]', '无有效的钱包文件');
                    return false;
                });
            }
            isOpen() {
                var logined_addr = tools.LoginInfo.getCurrentAddress();
                this.wallet_addr = logined_addr;
                if (!logined_addr) {
                    return false;
                }
                return true;
            }
            invokescript(params) {
                return __awaiter(this, void 0, void 0, function* () {
                    let chain = BlackCat.Main.netMgr.getCurrChain();
                    let res = null;
                    switch (chain) {
                        case 2:
                            res = yield BlackCat.Main.wallet._invokescriptNeo(params);
                            break;
                    }
                    return res;
                });
            }
            _invokescriptNeo(params) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = new tools.Result();
                    var sb = new ThinNeo.ScriptBuilder();
                    var scriptaddress = params.nnc.hexToBytes().reverse();
                    sb.EmitParamJson(params.sbParamJson);
                    if (params.hasOwnProperty('sbPushString'))
                        sb.EmitPushString(params.sbPushString);
                    sb.EmitAppCall(scriptaddress);
                    var data = sb.ToArray();
                    var r = yield tools.WWWNeo.cli_getInvokescript(data);
                    if (r) {
                        res.err = false;
                        res.info = r;
                    }
                    else {
                        res.err = true;
                        res.info = { error: "rpc getInvokescript error" };
                    }
                    return res;
                });
            }
            makeRawTransaction(params, trust = "0", net_fee, upload_log = true) {
                return __awaiter(this, void 0, void 0, function* () {
                    let chain = BlackCat.Main.netMgr.getCurrChain();
                    switch (chain) {
                        case 2:
                            return yield this._makeRawTransactionNeo(params, trust, net_fee, upload_log);
                    }
                });
            }
            _makeRawTransactionNeo(params, trust = "0", net_fee, upload_log = true) {
                return __awaiter(this, void 0, void 0, function* () {
                    var res = new tools.Result();
                    var login = tools.LoginInfo.getCurrentLogin();
                    var addr = login.address;
                    var tran = new ThinNeo.Transaction();
                    tran.inputs = [];
                    tran.outputs = [];
                    tran.type = ThinNeo.TransactionType.InvocationTransaction;
                    tran.extdata = new ThinNeo.InvokeTransData();
                    if (Number(net_fee) > 0) {
                        tran.extdata.gas = Neo.Fixed8.fromNumber(Number(net_fee));
                        try {
                            var user_utxos_assets = yield tools.CoinToolNeo.getassets();
                            console.log("[BlaCat]", '[wallet]', '[makeRawTransaction]', 'user_utxos_assets => ', user_utxos_assets);
                            var user_makeTranRes = tools.CoinToolNeo.makeTran(user_utxos_assets, addr, tools.CoinToolNeo.id_GAS, Neo.Fixed8.Zero, Neo.Fixed8.fromNumber(Number(net_fee)), 0, true);
                            var user_tran = user_makeTranRes.info.tran;
                            var oldarr = user_makeTranRes.info.oldarr;
                            tran.inputs = user_tran.inputs;
                            tran.outputs = user_tran.outputs;
                            console.log("[BlaCat]", '[wallet]', '[makeRawTransaction]', 'user_makeTranRes => ', user_makeTranRes);
                        }
                        catch (e) {
                            res.err = true;
                            res.info = { error: "get_net_fee error" };
                            return res;
                        }
                    }
                    var sb = new ThinNeo.ScriptBuilder();
                    var random_int;
                    try {
                        var array = new Uint8Array(2333);
                        var random_uint8 = Neo.Cryptography.RandomNumberGenerator.getRandomValues(array);
                        random_int = Neo.BigInteger.fromUint8Array(random_uint8);
                    }
                    catch (e) {
                        var math_rand = parseInt((Math.random() * 10000000).toString());
                        console.log("[BlaCat]", '[wallet]', '[makerawtransaction]', 'math_rand => ', math_rand);
                        random_int = new Neo.BigInteger(math_rand);
                    }
                    sb.EmitPushNumber(random_int);
                    sb.Emit(ThinNeo.OpCode.DROP);
                    if (params instanceof Array) {
                        if (params.length > 2) {
                            res.err = true;
                            res.info = { error: "post raw transaction error, too many data params, only 2 " };
                            return res;
                        }
                        else {
                            var scriptaddress = params[0].nnc.hexToBytes().reverse();
                            sb.EmitParamJson(params[0].sbParamJson);
                            sb.EmitPushString(params[0].sbPushString);
                            sb.EmitAppCall(scriptaddress);
                            sb.EmitSysCall("System.ExecutionEngine.GetScriptContainer");
                            sb.EmitSysCall("Neo.Transaction.GetHash");
                            sb.EmitPushBytes(ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(addr));
                            sb.EmitPushNumber(new Neo.BigInteger(2));
                            sb.Emit(ThinNeo.OpCode.PACK);
                            var scriptaddress_next = params[1].nnc.hexToBytes().reverse();
                            sb.EmitPushString(params[1].sbPushString);
                            sb.EmitAppCall(scriptaddress_next);
                        }
                    }
                    else {
                        var scriptaddress = params.nnc.hexToBytes().reverse();
                        sb.EmitParamJson(params.sbParamJson);
                        sb.EmitPushString(params.sbPushString);
                        sb.EmitAppCall(scriptaddress);
                    }
                    let script = sb.ToArray();
                    tran.extdata.script = script;
                    tran.attributes = new Array(1);
                    tran.attributes[0] = new ThinNeo.Attribute();
                    tran.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
                    tran.attributes[0].data = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(addr);
                    if (tran.witnesses == null)
                        tran.witnesses = [];
                    var msg = tran.GetMessage().clone();
                    var pubkey = login.pubkey.clone();
                    var prekey = login.prikey.clone();
                    var signdata = ThinNeo.Helper.Sign(msg, prekey);
                    tran.AddWitness(signdata, pubkey, addr);
                    let txid = "0x" + tran.GetHash().clone().reverse().toHexString();
                    var data = tran.GetRawData();
                    var r = yield tools.WWWNeo.cli_postRawTransaction(data);
                    if (r) {
                        if (r["txid"] || r["sendrawtransactionresult"]) {
                            if (!r["txid"] || r["txid"] == "") {
                                r["txid"] = txid;
                            }
                            res.err = false;
                            res.info = { txid: r["txid"] };
                            if (upload_log) {
                                var logRes = yield BlackCat.ApiTool.addUserWalletLogs(r["txid"], "", "5", JSON.stringify(params), net_fee, "", "1");
                            }
                            if (Number(net_fee) > 0) {
                                var height = yield tools.WWWNeo.api_getHeight_nodes();
                                oldarr.map(old => old.height = height);
                                tools.OldUTXO.oldutxosPush(oldarr);
                            }
                        }
                        else {
                            res.err = true;
                            res.info = { error: "post raw transaction error, no txid" };
                        }
                    }
                    else {
                        res.err = true;
                        res.info = {
                            error: "post raw transaction error, maybe network err"
                        };
                    }
                    return res;
                });
            }
            closeWallet() {
                tools.StorageTool.delStorage("current-address");
                tools.StorageTool.delStorage("login-info-arr");
                console.log("[BlaCat]", '[wallet]', '[closeWallet]', 'start ...');
                if (BlackCat.Main.viewMgr.payWalletDetailView && BlackCat.Main.viewMgr.payWalletDetailView.isCreated && BlackCat.Main.viewMgr.payWalletDetailView.isHidden() == false) {
                    BlackCat.Main.viewMgr.payWalletDetailView.return();
                }
            }
        }
        tools.wallet = wallet;
    })(tools = BlackCat.tools || (BlackCat.tools = {}));
})(BlackCat || (BlackCat = {}));
var BlackCat;
(function (BlackCat) {
    var tools;
    (function (tools) {
        class WWWNeo {
            static makeRpcUrl(url, method, ..._params) {
                var urlout = url + "?jsonrpc=2.0&id=1&method=" + method + "&params=[";
                for (var i = 0; i < _params.length; i++) {
                    urlout += JSON.stringify(_params[i]);
                    if (i != _params.length - 1)
                        urlout += ",";
                }
                urlout += "]";
                return urlout;
            }
            static makeRpcPostBody(method, ..._params) {
                var body = {};
                body["jsonrpc"] = "2.0";
                body["id"] = 1;
                body["method"] = method;
                var params = [];
                for (var i = 0; i < _params.length; i++) {
                    params.push(_params[i]);
                }
                body["params"] = params;
                return body;
            }
            static api_getHeight_nodes(nodes_url = this.api_nodes) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = this.makeRpcUrl(nodes_url, "getblockcount");
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    var r = json["result"];
                    var height = parseInt(r[0]["blockcount"]) - 1;
                    return height;
                });
            }
            static api_getAllAssets() {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = this.makeRpcUrl(this.api_nodes, "getallasset");
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    var r = json["result"];
                    return r;
                });
            }
            static api_getAllNep5AssetBalanceOfAddress(address) {
                return __awaiter(this, void 0, void 0, function* () {
                    var postdata = this.makeRpcPostBody("getallnep5assetofaddress", address, 1);
                    var result = yield fetch(this.api_nodes, { "method": "post", "body": JSON.stringify(postdata) });
                    var json = yield result.json();
                    var r = json["result"];
                    return r;
                });
            }
            static api_getUTXO(address) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = this.makeRpcUrl(this.api_nodes, "getutxo", address);
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    var r = json["result"];
                    return r;
                });
            }
            static api_getAvailableUTXOS(address, amount) {
                return __awaiter(this, void 0, void 0, function* () {
                    var postdata = this.makeRpcPostBody("getavailableutxos", address, amount);
                    var result = yield fetch(this.api_cgas, { "method": "post", "body": JSON.stringify(postdata) });
                    var json = yield result.json();
                    var r = json["result"];
                    return r;
                });
            }
            static api_getBalance(address) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = this.makeRpcUrl(this.api_nodes, "getbalance", address);
                    var value = yield fetch(str, { "method": "get" });
                    var json = yield value.json();
                    var r = json["result"];
                    return r;
                });
            }
            static api_getNep5Asset(asset) {
                return __awaiter(this, void 0, void 0, function* () {
                    var postdata = this.makeRpcPostBody("getnep5asset", asset);
                    var result = yield fetch(this.api_nodes, { "method": "post", "body": JSON.stringify(postdata) });
                    var json = yield result.json();
                    var r = json["result"][0];
                    return r;
                });
            }
            static api_getrawtransaction(txid) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = this.makeRpcUrl(this.api_nodes, "getrawtransaction", txid);
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    if (!json["result"])
                        return null;
                    var r = json["result"][0];
                    return r;
                });
            }
            static api_getcontractstate(scriptaddr) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = this.makeRpcUrl(this.api_nodes, "getcontractstate", scriptaddr);
                    var value = yield fetch(str, { "method": "get" });
                    var json = yield value.json();
                    var r = json["result"][0];
                    return r;
                });
            }
            static api_postRawTransaction(data) {
                return __awaiter(this, void 0, void 0, function* () {
                    var postdata = this.makeRpcPostBody("sendrawtransaction", data.toHexString());
                    var result = yield fetch(this.api_nodes, { "method": "post", "body": JSON.stringify(postdata) });
                    var json = yield result.json();
                    var r = json["result"][0];
                    return r;
                });
            }
            static api_getInvokescript(scripthash) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = this.makeRpcUrl(this.api_nodes, "invokescript", scripthash.toHexString());
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    if (json["result"] == null)
                        return null;
                    var r = json["result"][0];
                    return r;
                });
            }
            static api_getHeight_clis(clis_url = this.api_clis) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!clis_url) {
                        return null;
                    }
                    var str = this.makeRpcUrl(clis_url, "getblockcount");
                    str += "&uid=" + BlackCat.Main.randNumber;
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    var r = json["result"];
                    var height = parseInt(r[0]["blockcount"]) - 1;
                    return height;
                });
            }
            static cli_postRawTransaction(data) {
                return __awaiter(this, void 0, void 0, function* () {
                    var cli = 0;
                    if (this.api_clis && this.api_clis != "") {
                        cli = 1;
                    }
                    var api_url = this.api_nodes;
                    if (cli == 1) {
                        api_url = this.api_clis;
                    }
                    var postdata = this.makeRpcPostBody("sendrawtransaction", data.toHexString());
                    if (cli == 1)
                        postdata["uid"] = BlackCat.Main.randNumber;
                    var result = yield fetch(api_url, { "method": "post", "body": JSON.stringify(postdata) });
                    var json = yield result.json();
                    var r = json["result"][0];
                    return r;
                });
            }
            static cli_getInvokescript(scripthash) {
                return __awaiter(this, void 0, void 0, function* () {
                    var cli = 0;
                    if (this.api_clis && this.api_clis != "") {
                        cli = 1;
                    }
                    var api_url = this.api_nodes;
                    if (cli == 1) {
                        api_url = this.api_clis;
                    }
                    var str = this.makeRpcUrl(api_url, "invokescript", scripthash.toHexString());
                    if (cli == 1) {
                        str += "&uid=" + BlackCat.Main.randNumber;
                    }
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    if (json["result"] == null)
                        return null;
                    var r = json["result"][0];
                    return r;
                });
            }
        }
        tools.WWWNeo = WWWNeo;
    })(tools = BlackCat.tools || (BlackCat.tools = {}));
})(BlackCat || (BlackCat = {}));
//# sourceMappingURL=code.js.map