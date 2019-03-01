
declare const QrCodeWithLogo

namespace BlackCat {

    var BC_scriptSrc = document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1].src;
    var BC_scriptName = BC_scriptSrc.split('/')[BC_scriptSrc.split('/').length - 1];
    var BC_path = BC_scriptSrc.replace(BC_scriptName, '');

    export class Main {

        private static isCreated: boolean;
        static isStart: boolean;

        static readonly platName = "BlaCat"
        static platLoginType = 0; // 0，SDK；1：PAGE
        static randNumber: number; // 随机数
        static tsOffset: number; // 和服务器时间差
        static urlHead: string; // url的主机头, 当是本地访问有效，取值http: 或者https

        // 资源图标前缀路径
        static resHost = BC_path + "../"

        // SDK相关
        static appname: string = "";             // appname
        static appicon: string;             // appicon
        static appcoin: string;             // appcoin
        static applang: string;             // app默认语言
        static apprefer: string;            // app来源refer
        static app_recharge_addr: string;   // app充值地址
        private static app_trust: Array<any>; // app信任合约

        static user: User;
        static wallet: tools.wallet;
        static viewMgr: ViewMgr;
        static langMgr: LangMgr;
        static netMgr: NetMgr;


        // wallet钱包记录更新相关
        static walletLogId: number; // 当前logid最大值(walletLists获取到的)

        static appWalletLogId: number; // 应用相关的logId最大值（makeRawTransaction/makeRecharge)
        static appWalletNotifyId: number; // 应用相关的notifyId最大值
        static needGetAppNotifys: boolean; // 是否需要获取notify数据
        static appNotifyTxids: any; // 已经通知应用的txids列表

        static platWalletLogId: number; // 平台相关logid最大值（makeRefund）
        static platWalletNotifyId: number; // 平台相关notifyid最大值（主要是退款功能）
        static needGetPlatNotifys: boolean; // 平台是否需要获取notify数据
        static platNotifyTxids: any; // 平台已经通知的txids列表（refund)


        // SDK回调相关
        private static callback: Function; // 统一sdk调用回调接口，即sdk的listener

        private static loginFunctionCallback: Function; // 接口login的回调函数
        private static isLoginCallback: boolean;


        // main定时任务相关
        private static s_update: any;
        private static update_timeout_max: number;
        private static update_timeout_min: number;

        // 存活时间
        private static liveTime: number;
        private static liveTimeMax: number = 60 * 60 * 1000; // 1小时未操作钱包，退出钱包登录

        constructor() {
            // 初始化
            Main.netMgr = new NetMgr();
            Main.user = new User();
            Main.wallet = new tools.wallet();
            Main.viewMgr = new ViewMgr();
            Main.langMgr = new LangMgr();
            Main.randNumber = parseInt((Math.random() * 10000000).toString())
            Main.urlHead = Main.getUrlHead()
            Main.apprefer = Main.getUrlParam('refer')

            Main.reset(0)

            Main.update_timeout_max = 5000;
            Main.update_timeout_min = 300;

            Main.isCreated = false;
            Main.isStart = false;

            // NEO的随机数生成器
            Neo.Cryptography.RandomNumberGenerator.startCollectors();
        }

        // 复位
        static reset(type = 0): void {
            Main.appWalletLogId = 0;
            Main.appWalletNotifyId = 0;
            Main.appNotifyTxids = {};

            Main.platWalletLogId = 0;
            Main.platWalletNotifyId = 0;
            Main.platNotifyTxids = {};

            Main.clearTimeout()

            if (type == 0) {
                Main.needGetAppNotifys = false;
                Main.needGetPlatNotifys = false;
            }
            else {
                Main.needGetAppNotifys = true;
                Main.needGetPlatNotifys = true;
            }
        }

        // 清理定时任务
        static clearTimeout(): void {
            if (Main.s_update) {
                clearTimeout(Main.s_update)
                Main.update()
            }
        }
        

        // 获取cgas余额
        static async getCGASBalanceByAddress(id_CGAS: string, address: string) {
            return Main.getNep5BalanceByAddressNeo(id_CGAS, address, 100000000)
        }
        // 获取cgas_old余额
        static async getCGAS_OLDBalanceByAddress(id_CGAS: string, address: string) {
            return Main.getNep5BalanceByAddressNeo(id_CGAS, address, 100000000)
        }
        // 获取cneo余额
        static async getCNEOBalanceByAddress(id_CNEO: string, address: string) {
            return Main.getNep5BalanceByAddressNeo(id_CNEO, address, 100000000)
        }
        // 获取cneo_old余额
        static async getCNEO_OLDBalanceByAddress(id_CNEO: string, address: string) {
            return Main.getNep5BalanceByAddressNeo(id_CNEO, address, 100000000)
        }

        // NEO获取nep5余额信息
        static async getNep5BalanceByAddressNeo(id_hash: string, address: string, bits: number = 100000000) {
            if (id_hash == "") {
                return 0
            }
            var params = {
                sbParamJson: ["(addr)" + address],
                sbPushString: "balanceOf",
                nnc: id_hash
            }
            try {
                let res = await Main.wallet.invokescript(params)
                if (res.err == false) {
                    let data = res.info
                    if (data["stack"] && data["stack"].length > 0) {
                        let balances = data["stack"][0]
                        let balance = new Neo.BigInteger(balances.value.hexToBytes()).toString()
                        return Number(balance) / bits
                    }
                }
            }
            catch (e) {
                console.log("[BlaCat]", '[main]', '[getNep5BalanceByAddressNeo]', 'id_hash =>', id_hash, ', e =>', e)
            }
            return 0
        }

        // 对外接口：SDK初始化
        init(listener: Function, lang: string): void {
            Main.callback = listener;
            Main.langMgr.setType(lang);
        }
        
        // 对外接口：SDK登录
        async start(callback: Function = null) {
            Main.isStart = true;
            Main.loginFunctionCallback = callback;

            // 创建遮罩层
            Main.viewMgr.mainView.createMask()
            if (Main.isCreated == false) {
                Main.netMgr.changeChain(() => {
                    // icon颜色
                    Main.viewMgr.iconView.showSucc()
                    // icon状态
                    Main.viewMgr.iconView.removeState()
                    // 底色
                    Main.viewMgr.mainView.changNetType()
                    // 创建定时器
                    Main.update();
                    Main.isCreated = true;
                    // 检查登录
                    Main.validateLogin();
                })
                return
            }
            // 检查登录
            Main.validateLogin();
            
        }



        // 对外接口：SDK设置语言(type: cn/en)
        setLang(type: string): void {
            if (Main.langMgr.setType(type) === true) {
                Main.viewMgr.update()
            }
        }
        // 对外接口：设置初始网络
        setDefaultNetType(type: number): void {
            Main.netMgr.setDefaultNet(type)
        }
        // 对外接口：锁定网络
        lockNet(): void {
            Main.netMgr.lockNet()
        }
        // 对外接口：显示SDK界面
        showMain(): void {
            if (Main.viewMgr.mainView.div.innerHTML == "") {
                return;
            }
            if (Main.viewMgr.iconView) {
                Main.viewMgr.iconView.hidden();
            }
            Main.viewMgr.mainView.show()
        }
        // 对外接口：显示icon界面
        showIcon(): void {
            if (Main.viewMgr.mainView.div.innerHTML == "") {
                return;
            }
            Main.viewMgr.mainView.hidden()
            Main.viewMgr.change("IconView")
        }



        // 对外接口：SDK获取余额
        async getBalance(params, callback) {
            var callback_data  = {}
            if (params && params.hasOwnProperty('type')) {
                callback_data[params.type] = Main.viewMgr.payView[params.type]
            }
            else {
                callback_data = {}
                Main.netMgr.getChainCoins(Main.netMgr.getCurrChain()).forEach(coin => {
                    callback_data[coin] = Main.viewMgr.payView[coin]
                })
            }            
            sdkCallback.succ(callback_data, sdkCallback.getBalance, params, callback)
        }

        // 对外接口：SDK获取用户信息
        getUserInfo(params, callback) {
            sdkCallback.succ(Main.user.info, sdkCallback.getUserInfo, params, callback)
        }
        // 对外接口：SDK获取网络类型
        getNetType(params, callback) {
            let net = Main.netMgr.getCurrNet();
            sdkCallback.succ(net, sdkCallback.getNetType, params, callback)
        }
        // 对外接口：SDK获取高度
        async getHeight(params, callback) {
            await Main.viewMgr.payView.getHeight("nodes")
            if (Main.netMgr.getWWW().api_clis && Main.netMgr.getWWW().api_clis != "") {
                await Main.viewMgr.payView.getHeight("clis")
            }
            var callback_data = {
                node: Main.viewMgr.payView.height_nodes,
                cli: Main.viewMgr.payView.height_clis
            }
            sdkCallback.succ(callback_data, sdkCallback.getHeight, params, callback)
        }



        // 对外接口：SDK合约读取
        // {chainHash, nnc, sbParamJson, sbPushString, extString}
        async invokescript(params, callback) {
            let res = await Main.wallet.invokescript(params)
            sdkCallback.res(res, sdkCallback.invoke, params, callback)
        }
        // 对外接口：SDK合约交易
        // {nnc, sbParamJson, sbPushString, extString, minGasLimit}
        async makeRawTransaction(params, callback) {
            await RawTransaction.make(params, callback)
        }
        // 对外接口：转账，支持（gas/cgas/neo/cneo/bcp/bct/btc/eth)
        // {type, toaddr, count, extString}
        // 兼容老接口：makeGasTransfer，makeNeoTransfer, params带上参数type_first = 1
        async makeTransfer(params, callback = null) {
            await Transfer.make(params, callback)
        }
        // 对外接口：gas转账（批量）
        // [{toaddr, count, extString}, {toaddr, count, extString}, ...]
        async makeGasTransferMulti(params, callback = null) {
            await TransferMultiGas.make(params, callback)
        }
        // 对外接口：SDK客户端合约确认回调
        // {txid}
        async confirmAppNotify(params, callback) {
            await AppNotify.confirm(params, callback)
        }


        // SDK登录回调
        static async loginCallback() {
            if (!Main.isLoginCallback) {

                Main.app_trust = []


                Main.isLoginCallback = true;
                // 首次登录，获取应用notify
                Main.needGetAppNotifys = true;
                // 首次登录，获取平台notify
                Main.needGetPlatNotifys = true;

                // listener回调
                Main.listenerCallback("loginRes", Main.user.info.wallet)
                // function回调
                if (Main.loginFunctionCallback) Main.loginFunctionCallback(Main.user.info.wallet)

                console.log("[BlaCat]", '[main]', '[loginCallback]', '轮询平台notify和应用notify')
                
            }
        }
        // SDK设置游戏信息
        private static setGameInfo(param) {
            Main.appname = param.name;
            Main.appicon = param.icon;
            Main.applang = param.lang;
            Main.app_recharge_addr = param.recharge_addr;

            // 新数据格式
            if (param.hasOwnProperty('region')) {
                var appname = {}
                var appicon = {}
                for (let region in param.region) {
                    if (region == Main.langMgr.type) {
                        appname[region] = param.region[region]['name']
                        appicon[region] = param.region[region]['icon']
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
                var appcoin = {}
                for (let icon in param.coin) {
                    appcoin[icon] = param.coin[icon]
                }
                if (appcoin != {}) {
                    Main.appcoin = JSON.stringify(appcoin)
                }
            }
        }
        // SDK判断是否登录
        isLogined() {
            return Main.isLoginCallback;
        }
        // SDK登出回调
        static async logoutCallback() {
            Main.isLoginCallback = false;

            Main.listenerCallback("logoutRes", null);

            // 信息清理
            Main.reset()

            // 页面登录的退回
            if (Main.platLoginType === 1) {
                window.history.back();
            }
        }
        // SDK回调
        static async listenerCallback(cmd, data) {
            var callback_data = {
                cmd: cmd,
                data: data
            }
            Main.callback(JSON.stringify(callback_data));
        }



        // 主定时器
        static async update() {
            // console.log("[BlaCat]", '[main]', '[update]', 'start ...')

            // 获取交易notify
            try {
                await Main.getNotifys();
            }
            catch (e) {
                console.log("[BlaCat]", '[main]', '[update]', 'Main.getNotifys() error => ', e.toString())
            }

            // 更新payView的List时间
            if (Main.viewMgr.payView && Main.viewMgr.payView.isCreated && !Main.viewMgr.payView.isHidden()) {
                try {
                    Main.viewMgr.payView.flushListCtm()
                }
                catch (e) {
                    console.log("[BlaCat]", '[main]', '[update]', 'Main.viewMgr.payView.flushListCtm() error => ', e.toString())
                }
            }

            // 存活时间判定，过期就退出钱包
            if (Main.liveTime && Main.liveTime > 0 && Main.liveTimeMax != 0) {
                if (Main.isWalletOpen() == true) {
                    // 钱包已经打开
                    var cur_ts = new Date().getTime();
                    if (cur_ts - Main.liveTime > Main.liveTimeMax) {
                        Main.wallet.closeWallet()
                    }
                }
            }

            // update间隔时间判定
            var timeout = Main.update_timeout_min;
            if (Main.isLoginCallback) {
                timeout = Main.update_timeout_max;
            }

            Main.s_update = setTimeout(() => { this.update() }, timeout);
        }

        static async getRawTransaction(txid) {
            if (this['txid_' + txid] == null) {
                try {
                    this['txid_' + txid] = txid
                    var r = await Main.netMgr.getWWW().api_getrawtransaction(txid)
                    if (r) {
                        // await Main.confirmPlatNotify(log.params)
                        WalletListLogs.update(txid, {state: "1", blockindex: r['blockindex']})
                        // 刷新
                        Main.viewMgr.payView.doGetWalletLists(1)
                        // notify
                        let log = WalletListLogs.get(txid)
                        if (log.state == "1" ) {
                            if (log['sdk'] == "1") {
                                // appnotify
                                Main.listenerCallback("getAppNotifysRes", [log]);
                            }
                            else {
                                // platnotify
                                Main.doPlatNotify([log])
                            }
                        }
                    }
                }
                catch(e) {}
                this['txid_' + txid] = null
            }
        }

        // main获取记录执行情况
        static getNotifys() {

            let process = 0
            let logs = WalletListLogs.get()
            if (logs.length > 0) {
                for (let k=logs.length-1;k>=0;k--) {
                    let log = logs[k]
                    if (log.state == "0") {
                        // 异步执行订单状态检查
                        this.getRawTransaction(log.txid)
                        process += 1
                    }
                }
            }
            Main.viewMgr.iconView.flushProcess(process)
        }

        // 完成状态的plat_notify处理
        private static async doPlatNotify(params: Array<any>) {
            console.log("[BlaCat]", '[main]', '[doPlatNotify]', 'params => ', params)
            var openTask = null; // 打开钱包任务
            for (let k in params) {
                switch (params[k].type) {
                    case "2": // cgas->gas、cneo->neo退款
                        if (params[k].state == "1") {
                            if (params[k].ext) {
                                // utxo->gas提交成功，循环获取结果，不需要开钱包
                                Main.doPlatNotifyRefundRes(params[k], params[k].ext)
                            }
                            else {
                                if (!Main.isWalletOpen()) {
                                    console.log("[BlaCat]", '[main]', '[doPlatNotify]', '退款(2)，钱包未打开，收集数据，进入队列')

                                    if (!openTask) {
                                        openTask = new Array();
                                    }
                                    openTask.push(params[k]);
                                    break;
                                }
                                // cgas->utxo确定，发起utxo->gas请求，需要打开钱包
                                Main.doPlatNotiyRefund(params[k])
                            }
                        }
                        else {
                            // 失败的，直接回调
                            this.confirmPlatNotify(params[k])
                        }
                        break;
                }
            }

            if (openTask) {
                // 钱包未打开，有需要打开钱包的操作
                ViewConfirm.callback_params = openTask;
                ViewConfirm.callback = (params) => {
                    // 确认打开钱包，去打开钱包
                    ViewWalletOpen.callback_params = params;
                    ViewWalletOpen.callback = (params) => {
                        // 打开钱包完成
                        this.doPlatNotify(params)
                    }
                    ViewWalletOpen.callback_cancel = (params) => {
                        // 打开钱包取消
                        // 不打开钱包，记录一个钱包打开任务标识
                        ViewWalletOpen.addTask("getPlatNotifys", params)
                    }
                    Main.viewMgr.change("ViewWalletOpen")
                }
                ViewConfirm.callback_cancel = (params) => {
                    // 不打开钱包，记录一个钱包打开任务标识
                    ViewWalletOpen.addTask("getPlatNotifys", params)
                }
                // Main.showConFirm("提现操作需要打开钱包，是否立即打开？")
                Main.showConFirm("main_need_open_wallet_confirm")
            }
        }
        static async continueWithOpenWallet() {
            // 钱包未打开，有需要打开钱包的操作
            ViewConfirm.callback = () => {
                // 确认打开钱包，去打开钱包
                ViewWalletOpen.refer = null
                ViewWalletOpen.callback = null
                Main.viewMgr.change("ViewWalletOpen")
            }
            // Main.showConFirm("提现操作需要打开钱包，是否立即打开？")
            Main.showConFirm("main_need_open_wallet_confirm")
        }
        
        private static async doPlatNotiyRefund(params) {

            var key = "cgas"
            for (let k in PayTransferView.log_type_detail) {
                if (PayTransferView.log_type_detail[k] == params.type_detail) {
                    key = k
                }
            }

            var id_asset = Main.netMgr.getCoinTool().id_GAS
            if (key == "cneo") {
                id_asset = Main.netMgr.getCoinTool().id_NEO
            }
            var id_asset_name = key.toUpperCase() //'CGAS'
            var id_asset_nep5 = Main.netMgr.getCoinTool()["id_" + id_asset_name];

            //tx的第一个utxo就是给自己的
            var utxo: tools.UTXO = new tools.UTXO();
            utxo.addr = Main.user.info.wallet;
            utxo.txid = params.txid;
            utxo.asset = id_asset;
            utxo.count = Neo.Fixed8.parse(params.cnts.toString());
            utxo.n = 0;

            // 生成转换请求
            var utxos_assets = {};
            utxos_assets[id_asset] = [];
            utxos_assets[id_asset].push(utxo);

            console.log("[BlaCat]", '[main]', '[doPlatNotiyRefund]', 'utxos_assets => ', utxos_assets);

            try {
                let net_fee = "0"
                try {
                    let p = JSON.parse(params.params)
                    if (p.hasOwnProperty("net_fee")) {
                        net_fee = p.net_fee
                    }
                }
                catch (e) {

                }

                if (id_asset_name == "CGAS") {
                    var refundcounts = Number(params.cnts) - Number(net_fee)
                    if (refundcounts < Number(net_fee)) {
                        // 不够支付手续
                        var makeTranRes: Result = Main.netMgr.getCoinTool().makeTran(
                            utxos_assets,
                            Main.user.info.wallet,
                            id_asset,
                            Neo.Fixed8.fromNumber(Number(params.cnts)),
                        );
                    }
                    else {
                        var makeTranRes: Result = Main.netMgr.getCoinTool().makeTran(
                            utxos_assets,
                            Main.user.info.wallet,
                            id_asset,
                            Neo.Fixed8.fromNumber(Number(params.cnts) - Number(net_fee)),
                            Neo.Fixed8.Zero,
                            // 余额作为手续费
                            1
                        );
                    }
                }
                else {
                    // NEO
                    var makeTranRes: Result = Main.netMgr.getCoinTool().makeTran(
                        utxos_assets,
                        Main.user.info.wallet,
                        id_asset,
                        Neo.Fixed8.fromNumber(Number(params.cnts)),
                    );
                    
                    // ***************** CNEO退款暂时不支持支付GAS手续费 ****************************
                    if (Number(net_fee) > 0 && Main.viewMgr.payView.gas >= Number(net_fee)) {
                        // 有足够GAS支付手续费
                        try {
                            // 获取用户utxo
                            var user_utxos_assets = await Main.netMgr.getCoinTool().getassets();
                            console.log("[BlaCat]", '[PayView]', '[doPlatNotiyRefund], user_utxos_assets => ', user_utxos_assets)
    
                            var user_makeTranRes: Result = Main.netMgr.getCoinTool().makeTran(
                                user_utxos_assets,
                                Main.user.info.wallet,
                                Main.netMgr.getCoinTool().id_GAS,
                                Neo.Fixed8.Zero,
                                Neo.Fixed8.fromNumber(Number(net_fee)),
                            );
    
                            // inputs、outputs、oldarr塞入
                            var user_tran = user_makeTranRes.info.tran
                            for (let i = 0; i < user_tran.inputs.length; i++) {
                                makeTranRes.info.tran.inputs.push(user_tran.inputs[i])
                            }
                            for (let i = 0; i < user_tran.outputs.length; i++) {
                                makeTranRes.info.tran.outputs.push(user_tran.outputs[i])
                            }
                            var user_oldarr = user_makeTranRes.info.oldarr
                            for (let i = 0; i < user_oldarr.length; i++) {
                                makeTranRes.info.oldarr.push(user_oldarr[i])
                            }
                            console.log("[BlaCat]", '[PayView]', '[doPlatNotiyRefund]', 'user_makeTranRes => ', user_makeTranRes)
                        }
                        catch (e) {
                            let errmsg = Main.langMgr.get(e.message);
                            if (errmsg) {
                                Main.showErrMsg((e.message)); // "GAS余额不足"
                            }
                            else {
                                Main.showErrMsg(("pay_makeMintGasNotEnough"))
                            }
    
                            return;
                        }

                    }
                }

            }
            catch (e) {
                // Main.showErrMsg("生成转换请求（utxo->gas）失败");
                Main.showErrMsg(("main_refund_second_"+ id_asset_name +"_fail"))
                return;
            }

            var tran: any = makeTranRes.info.tran;
            var oldarr: Array<tools.OldUTXO> = makeTranRes.info.oldarr;

            tran.type = ThinNeo.TransactionType.ContractTransaction;
            tran.version = 0;

            //sign and broadcast
            //做智能合约的签名
            // 考虑到老的cgas合约，这里合约地址应该是记录的合约地址
            try {
                let params_decode = JSON.parse(params.params)
                if (params_decode && params_decode.hasOwnProperty("nnc")) {
                    id_asset_nep5 = params_decode.nnc
                }
            }
            catch (e) { }
            var r = await Main.netMgr.getWWW().api_getcontractstate(id_asset_nep5);

            if (r && r["script"]) {
                var Script = r["script"].hexToBytes();

                var sb = new ThinNeo.ScriptBuilder();
                sb.EmitPushNumber(new Neo.BigInteger(0));
                sb.EmitPushNumber(new Neo.BigInteger(0));
                tran.AddWitnessScript(Script, sb.ToArray());

                var txid = "0x" + tran.GetHash().clone().reverse().toHexString();

                var trandata = tran.GetRawData();

                // 发送转换请求
                r = await Main.netMgr.getWWW().api_postRawTransaction(trandata);
                if (r) {
                    console.log("[BlaCat]", '[main]', '[doPlatNotiyRefund]', 'api_postRawTransaction.r => ', r);

                    // 成功
                    if (r["txid"] || r['sendrawtransactionresult']) {
                        if (!r["txid"] || r["txid"] == "") {
                            r["txid"] = txid
                        }
                        console.log("[BlaCat]", '[main]', '[doPlatNotiyRefund]', 'txid => ', r.txid);
                        // 确认转换请求
                        // this.confirmPlatNotifyExt(params)
                        var res = await Main.confirmPlatNotifyExt(params, r.txid);
                        // 轮询请求r.txid的交易状态
                        this.doPlatNotifyRefundRes(params, r.txid)
                        // 记录使用的utxo，后面不再使用，需要记录高度
                        var height = await Main.netMgr.getWWW().api_getHeight_nodes();
                        oldarr.map(old => old.height = height);
                        tools.OldUTXO.oldutxosPush(oldarr);

                        // 刷新payView的状态
                        Main.viewMgr.payView.doGetWalletLists(1);

                    } else {
                        // this.confirmPlatNotify(params)
                        // Main.showErrMsg("转换合约执行失败！");
                        Main.showErrMsg(("main_refund_doFail"))
                    }
                } else {
                    // Main.showErrMsg("发送转换请求失败！");
                    Main.showErrMsg(("main_refund_sendRequest_err"))
                }
            } else {
                // Main.showErrMsg("获取转换合约失败！");
                Main.showErrMsg(("main_refund_getScript_err"))
            }
        }
        private static async doPlatNotifyTransferRes(params, txid) {
            var r = await Main.netMgr.getWWW().api_getrawtransaction(txid)
            if (r) {
                console.log("[BlaCat]", '[main]', '[doPlatNotifyTransferRes]', 'txid: ' + txid + ", r => ", r)
                await Main.confirmPlatNotify(params)
                // 刷新payview交易状态
                Main.viewMgr.payView.doGetWalletLists()
            }
            else {
                setTimeout(() => {
                    this.doPlatNotifyTransferRes(params, txid)
                }, 10000);
            }
        }
        private static async doPlatNotifyRefundRes(params, txid) {
            var r = await Main.netMgr.getWWW().api_getrawtransaction(txid)
            if (r) {
                console.log("[BlaCat]", '[main]', '[doPlatNotifyRefundRes]', 'txid: ' + txid + ", r => ", r)
                await Main.confirmPlatNotify(params)
                // 刷新payview交易状态
                Main.viewMgr.payView.doGetWalletLists()
            }
            else {
                setTimeout(() => {
                    this.doPlatNotifyRefundRes(params, txid)
                }, 10000);
            }
        }
        // 确认回调
        private static async confirmPlatNotify(params) {
            var res = await ApiTool.walletNotify(params.txid);
            return res;
        }
        // 退款状态
        private static async confirmPlatNotifyExt(params, ext) {
            var res = await ApiTool.walletNotifyExt(params.txid, ext)
            return res;
        }
        
        // 切换网络
        static changeNetType(type: number) {
            Main.netMgr.changeNet(() => {
                // 切换回调
                Main.listenerCallback('changeNetTypeRes', type);
                // 替换底色
                Main.viewMgr.mainView.changNetType()
                // 刷新视图
                Main.viewMgr.update()
                // 重置
                Main.reset(1)
            }, type)
        }

        // 切换主链
        static changeChainType(type: number, callback = null) {
            Main.netMgr.changeChain((chain, net) => {
                // 切换回调
                Main.listenerCallback('changeChainTypeRes', {chain: chain, net: net});
                // 替换底色
                Main.viewMgr.mainView.changNetType()
                // 刷新视图
                Main.viewMgr.update()
                // 重置
                Main.reset(1)
                // 回调
                if (callback) {
                    try {
                        callback()
                    }
                    catch (e) {}
                }
            }, type)
        }

        // 从url地址获取参数
        static getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) {
                return unescape(r[2]);
            }
            return null; //返回参数值
        }

        // 验证登录信息
        static async validateLogin() {
            let login = tools.LoginInfo.getCurrentLogin()
            if (login) {
                Main.user.info.wallet = login.address
                Main.viewMgr.change("PayView");
            }
            else {
                Main.viewMgr.change("WalletView");
            }
        }

        // 通过错误码显示错误信息
        static async showErrCode(errCode: number, callback = null) {
            var msgId = "errCode_" + errCode.toString();

            var msg = Main.langMgr.get(msgId);
            if (msg == "") {
                // "未知错误！错误码："
                msgId = "errCode_default";
                msg = Main.langMgr.get("errCode_default") + errCode;
                this.showErrMsg(msgId, callback, { errCode: errCode })
                return
            }
            if (errCode == 100701) {
                // msg = "登录失效，请重新登录";
                this.showErrMsg(msgId, () => {
                    Main.viewMgr.removeAll();
                    Main.viewMgr.change("LoginView")
                })
                Main.user.logout()
                Main.logoutCallback()
                return
            }
            this.showErrMsg(msgId, callback)
        }
        // 显示错误信息
        static async showErrMsg(errMsgKey: string, callback = null, content_ext = null) {
            // alert(errMsg)
            ViewAlert.content = errMsgKey;
            ViewAlert.content_ext = content_ext;
            ViewAlert.callback = callback
            Main.viewMgr.change("ViewAlert")
        }
        // 显示toast信息
        static async showToast(msgKey: string, showTime: number = 1500) {
            // alert(msg)
            ViewToast.content = msgKey;
            ViewToast.showTime = showTime;
            Main.viewMgr.change("ViewToast")
        }
        // 显示信息
        static async showInfo(msgKey: string, callback = null, content_ext = null) {
            // alert(msg)
            ViewAlert.content = msgKey;
            ViewAlert.content_ext = content_ext;
            ViewAlert.callback = callback
            Main.viewMgr.change("ViewAlert")
        }
        // 显示确认
        static async showConFirm(msgKey: string) {
            // alert(errMsg)
            ViewConfirm.content = msgKey;
            Main.viewMgr.change("ViewConfirm")
        }
        // 显示Loading
        static async showLoading(msgKey: string) {
            // alert(errMsg)
            ViewLoading.content = msgKey;
            Main.viewMgr.change("ViewLoading")
        }

        // 判断钱包是否打开
        static isWalletOpen(): boolean {
            if (Main.wallet.isOpen() && Main.user.info.wallet == Main.wallet.wallet_addr) {
                return true;
            }
            return false;
        }
        // 判断是否在登录初始化中
        static isLoginInit(): boolean {
            if (Main.netMgr.getWWW().api_nodes) {
                return false
            }
            return true
        }

        // 验证数据格式，=== false表示失败；成功可能是true，也可能是其他（例如钱包地址）
        static async validateFormat(type: string, inputElement: HTMLInputElement | HTMLTextAreaElement) {
            var regex;
            switch (type) {
                case "user":
                    regex = /^[a-zA-Z0-9_]{4,16}$/
                    break;
                case "email":
                    regex = /^([0-9A-Za-z\-_\.]+)@([0-9A-Za-z]+\.[a-zA-Z]{2,3}(\.[a-zA-Z]{2})?)$/g;
                    break;
                case "phone":
                    regex = /^\d{4,}$/
                    break;
                case "vcode":
                    regex = /^\d{6}$/
                    break;
                case "ETHWallet":
                    if (inputElement.value.length == 42) {
                        return true
                    }
                    break;
                case "BTCWallet":
                    if (inputElement.value.length == 34) {
                        return true
                    }
                    break;
                case "NEOWallet":
                case "walletaddr":
                    let isAddress = tools.NNSTool.verifyAddr(inputElement.value);
                    if (isAddress) {
                        try {
                            if (tools.neotools.verifyPublicKey(inputElement.value)) {
                                return true;
                            }
                        }
                        catch (e) {

                        }
                    }
                    else {
                        let isDomain = tools.NNSTool.verifyDomain(inputElement.value);
                        if (isDomain) {
                            try {
                                inputElement.value = inputElement.value.toLowerCase();
                                let addr = await tools.NNSTool.resolveData(inputElement.value);
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
                inputElement.focus()
            })
            return false;
        }


        // 通过时间戳获取日期
        static getDate(timeString: string) {
            if (timeString != "0" && timeString != "") {
                var date = new Date(parseInt(timeString) * 1000);
                var fmt = "yyyy-MM-dd hh:mm:ss";
                var o = {
                    "M+": date.getMonth() + 1, //月份
                    "d+": date.getDate(), //日
                    "h+": date.getHours(), //小时
                    "m+": date.getMinutes(), //分
                    "s+": date.getSeconds(), //秒
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                    S: date.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(
                        RegExp.$1,
                        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
                    );
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(
                            RegExp.$1,
                            RegExp.$1.length == 1
                                ? o[k]
                                : ("00" + o[k]).substr(("" + o[k]).length)
                        );
                return fmt;
            }
            return "";
        }

        // 获取obj类名
        static getObjectClass(obj) {
            if (obj && obj.constructor && obj.constructor.toString()) {
                /*
                 * for browsers which have name property in the constructor
                 * of the object,such as chrome 
                 */
                if (obj.constructor.name) {
                    return obj.constructor.name;
                }
                var str = obj.constructor.toString();
                /*
                 * executed if the return of object.constructor.toString() is 
                 * "[object objectClass]"
                 */
                if (str.charAt(0) == '[') {
                    var arr = str.match(/\[\w+\s*(\w+)\]/);
                } else {
                    /*
                     * executed if the return of object.constructor.toString() is 
                     * "function objectClass () {}"
                     * for IE Firefox
                     */
                    var arr = str.match(/function\s*(\w+)/);
                }
                if (arr && arr.length == 2) {
                    return arr[1];
                }
            }
            return undefined;
        };

        // 获取未信任合约
        static getUnTrustNnc(params): Array<string> {
            var result = []
            if (params.hasOwnProperty('nnc')) {
                params = [params]
            }
            if (params instanceof Array) {
                for (let i = 0; i < params.length; i++) {
                    if (params[i].hasOwnProperty('nnc')) {
                        let nnc = params[i]['nnc']
                        if (Main.app_trust.length == 0) {
                            result.push(nnc)
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
                                result.push(nnc)
                            }
                        }
                    }
                }
            }
            return result;
        }


        // 设置存活时间
        static setLiveTime() {
            Main.liveTime = new Date().getTime()
            // console.log("[BlaCat]", '[main]', '[setLiveTime]', 'liveTime => ', Main.liveTime)
        }
        // 设置存活时间最大值
        static setLiveTimeMax(minutes: number) {
            Main.liveTimeMax = minutes * 60 * 1000;
            //console.log("[BlaCat]", '[main]', '[setLiveTime]', 'liveTimeMax => ', Main.liveTimeMax)
        }
        // 获取存活时间
        static getLiveTimeMax(): number {
            return Main.liveTimeMax;
        }
        // JS科学计数转换string
        static getStringNumber(num: number): string {
            let num_str = num.toString()
            if (num_str.indexOf('-') >= 0) {
                num_str = '0' + (num + 1).toString().substr(1)
            }
            return num_str;
        }
        // 获取客户端和服务端时间差
        private static setTsOffset(loginParam) {
            let curr_ts = Math.round((new Date()).getTime() / 1000);
            Main.tsOffset = (curr_ts - loginParam.time) * 1000
            console.log("[BlaCat]", '[Main]', '[setTsOffset]', 'tsOffset时间偏移(s) => ', Main.tsOffset/1000)
        }
        // 获取url主机头
        private static getUrlHead() {
            if (Main.urlHead === undefined) {
                if (window.location.protocol == "file:") {
                    Main.urlHead = "http:"
                }
                else {
                    Main.urlHead = ""
                }
            }
            return Main.urlHead
        }
        // 随机数组
        static randomSort(arr, newArr) {
            // 如果原数组arr的length值等于1时，原数组只有一个值，其键值为0
            // 同时将这个值push到新数组newArr中
            if (arr.length == 1) {
                newArr.push(arr[0]);
                return newArr; // 相当于递归退出
            }
            // 在原数组length基础上取出一个随机数
            var random = Math.ceil(Math.random() * arr.length) - 1;
            // 将原数组中的随机一个值push到新数组newArr中
            newArr.push(arr[random]);
            // 对应删除原数组arr的对应数组项
            arr.splice(random, 1);
            return Main.randomSort(arr, newArr);
        }

        static check(){
            //判断访问设备，方便后面针对不同设备调用代码  
            var dev = "";  
            if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {  
                //设备为移动端  
                dev = "mobile";  
            }  
            else {  
                //设备为pc  
                dev = "pc";  
            }  
            return dev;
        }

        static in_array(search:any, array: Array<any>)
        {
            for (let k=0; k<array.length; k++) {
                if (array[k] === search) {
                    return true
                }
            }
            return false
        }

        static getFeeConfig(chain: number): any {
            try {
                let service_charge = JSON.parse(Main.user.info.service_charge)
                if (service_charge.hasOwnProperty(chain)) {
                    if (chain == 1) {
                        if (service_charge[chain] instanceof Array) {
                            return service_charge[chain]
                        }
                    }
                    else {
                        return service_charge[chain]
                    }
                }
            }
            catch (e) {
                console.log("[BlaCat]", "[main]", "[getFee]", 'error => ', e)
            }
            return chain == 1 ? ["0", "0"] : "0"
        }

        static hasEnoughFee(params, net_fee: any, chain: number): boolean {
            switch (chain) {
                case 2: // neo
                    if (Number(net_fee) == 0 || Main.viewMgr.payView.gas > Number(net_fee)) {
                        return true
                    }
                    break
            }
            return false
        }
    }
}