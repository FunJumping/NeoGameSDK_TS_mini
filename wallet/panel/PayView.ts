/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 钱包视图
    export class PayView extends ViewBase {

        private chains: Array<number>

        // 钱包地址
        wallet_addr: string
        wallet_addr_other: any

        // 各种币
        // === neo
        gas: number;
        cgas: number;
        neo: number;
        cneo: number;


        // cli高度
        height_clis: number;
        private divHeight_clis: HTMLElement;
        height_nodes: number;
        private divHeight_nodes: HTMLElement;

        // 记录每页显示数量
        listPageNum: number;

        // 正在处理交易数
        private spanRecord: HTMLDivElement

        // 钱包记录
        private walletListsHash: string;


        private divLists: HTMLDivElement;
        private divNetSelect: HTMLElement;

        private WalletListsNeedConfirm: boolean;

        private s_doGetWalletLists: any;

        private wallet_btn: HTMLElement;
        private assets_btn: HTMLElement;

        private game_assets_element: HTMLElement // 游戏assets视图
        private game_assets: any    // 游戏assets信息
        private game_assets_ts: any // 游戏assets获取时间
        private game_assets_update: number  // game_assets缓存时间
        private allnep5_balance: any // 所有nep5资产余额

        private pendingListsElement: HTMLElement; // 正在处理的记录

        reset() {

            if (!this.chains) {
                this.chains = Main.netMgr.getSupportChains()
            }

            let chain = Main.netMgr.getCurrChain()

            // 数量归零
            Main.netMgr.getChainCoins(chain).forEach((coin) => {
                this[coin] = 0
            })

            // 旧合约数量归零
            let coin_old = Main.netMgr.getChainCoinsOld(chain)
            coin_old.forEach((coin) => {
                if (Main.netMgr.getCoinTool()["id_" + coin.toUpperCase() + "_OLD"].length > 0) {
                    Main.netMgr.getCoinTool()["id_" + coin.toUpperCase() + "_OLD"].forEach((old) => {
                        this[coin + "_old" + old] = 0
                        this["span" + coin.toUpperCase() + "_OLD" + old] = null
                    })
                }
            })

            // 高度归零
            this.height_clis = 0;
            this.height_nodes = 0;

            this.listPageNum = 10;
            this.walletListsHash = null

            this.WalletListsNeedConfirm = false;

            this.game_assets_update = 1000 * 5; // 5s缓存
            this.allnep5_balance = {}
            this.game_assets_ts = null

            this.clearTimeout()
        }

        start() {
            super.start()
            // 调用登录回调
            Main.loginCallback()

            // 登录完成后最小化
            // Main.viewMgr.mainView.hidden()
            // Main.viewMgr.change("IconView")
        }

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_pay")

            //钱包标题
            var headerTitle = this.objCreate("div")
            headerTitle.classList.add("pc_header")
            this.ObjAppend(this.div, headerTitle)

            // 我的信息
            var myinfo_a = this.objCreate("a")
            myinfo_a.classList.add("iconfont", "icon-bc-touxiang")
            myinfo_a.onclick = () => {
                this.hidden()
                PersonalCenterView.refer = "PayView"
                Main.viewMgr.change("PersonalCenterView")
            }
            this.ObjAppend(headerTitle, myinfo_a)

            // nodes高度
            this.divHeight_nodes = this.objCreate("div")
            this.divHeight_nodes.classList.add("pc_payheighet", "iconfont", "icon-bc-blalian", "network")
            this.divHeight_nodes.style.top = "5px";
            this.divHeight_nodes.textContent = "n/a"
            this.divHeight_nodes.onclick = () => {
                this.hidden()
                ModifyNetworkLineView.refer = "PayView"

                ModifyNetworkLineView.defaultType = "nodes"
                Main.viewMgr.change("ModifyNetworkLineView")
            }
            this.ObjAppend(headerTitle, this.divHeight_nodes)

            // clis高度
            this.divHeight_clis = this.objCreate("div")
            this.divHeight_clis.classList.add("pc_payheighet", "iconfont", "icon-bc-neolian", "network")
            this.divHeight_clis.textContent = "n/a"
            this.divHeight_clis.onclick = () => {
                if (Main.netMgr.getWWW().api_clis && Main.netMgr.getWWW().api_clis != "") {
                    this.hidden()
                    ModifyNetworkLineView.refer = "PayView"

                    ModifyNetworkLineView.defaultType = "clis"
                    Main.viewMgr.change("ModifyNetworkLineView")
                }
            }
            this.ObjAppend(headerTitle, this.divHeight_clis)



            // 钱包标题
            var headerh1 = this.objCreate("h1")
            headerh1.textContent = Main.platName;
            this.ObjAppend(headerTitle, headerh1)

            //切换网络
            var divNetType = this.objCreate("div")
            divNetType.classList.add("pc_net", "iconfont")
            divNetType.textContent = this.getNetTypeName() //Main.langMgr.get("nettype_" + Main.netMgr.type)
            divNetType.onclick = () => {
                this.showChangeNetType()
            }
            this.ObjAppend(headerTitle, divNetType)

            this.divNetSelect = this.objCreate("div")
            this.divNetSelect.classList.add("pc_netbox")
            this.ObjAppend(headerTitle, this.divNetSelect)

            //返回游戏
            var aReturnGame = this.objCreate("i")
            aReturnGame.classList.add("pc_returngame", "iconfont", "icon-bc-fanhui1")
            aReturnGame.onclick = () => {
                BlackCat.SDK.showIcon()
            }
            if (!window.hasOwnProperty("BC_androidSDK")) {
                this.ObjAppend(headerTitle, aReturnGame)
            }

            // 钱包、虚拟资产按钮
            var btnbox = this.objCreate("div")
            this.ObjAppend(this.div, btnbox)
            btnbox.classList.add("pc_btnbox")

            // 钱包卡片
            var paycard = this.objCreate("div")
            paycard.classList.add("pc_card")
            this.ObjAppend(this.div, paycard)

            // 详情
            var aWalletDetail = this.objCreate("a")
            aWalletDetail.classList.add("pc_mydetail", "iconfont", "icon-bc-xiangqing")
            aWalletDetail.onclick = () => {
                this.wallet_detail()
            }
            this.ObjAppend(paycard, aWalletDetail)

            // 我的(缩略)钱包地址
            var divWallet = this.objCreate("div")
            divWallet.classList.add("pc_cardcon")
            divWallet.textContent = Main.user.info.wallet.substr(0, 4) + "****" + Main.user.info.wallet.substr(Main.user.info.wallet.length - 4)
            this.ObjAppend(paycard, divWallet)


            // 刷新
            var payRefresh = this.objCreate("div")
            payRefresh.classList.add("pc_cardrefresh")
            payRefresh.textContent = Main.langMgr.get("pay_refresh") // "刷新"
            payRefresh.onclick = async () => {
                Main.viewMgr.change("ViewLoading")
                await this.doGetBalances()
                await this.doGetWalletLists(1)
                Main.viewMgr.viewLoading.remove()
            }
            this.ObjAppend(paycard, payRefresh)

            //刷新图标            
            var iRefresh = this.objCreate("i")
            iRefresh.classList.add("iconfont", "icon-bc-shuaxin")
            this.ObjAppend(payRefresh, iRefresh)


            //收款及转账
            var divWalletUser = this.objCreate("div")
            divWalletUser.classList.add("pc_cardtransaction")
            // divWalletUser.textContent = Main.user.info.name
            this.ObjAppend(paycard, divWalletUser)

            // 收款
            var butReceivables = this.objCreate("button")
            butReceivables.textContent = Main.langMgr.get("pay_received") //"收款"
            butReceivables.onclick = () => {
                this.doMakeReceivables()
            }
            this.ObjAppend(divWalletUser, butReceivables)

            // 提现
            var makeTransferObj = this.objCreate("button")
            makeTransferObj.textContent = Main.langMgr.get("pay_send") //"提现"
            makeTransferObj.onclick = () => {
                this.doMakeTransfer()
            }
            this.ObjAppend(divWalletUser, makeTransferObj)

            
            // 处理数量
            this.divLists = this.objCreate("div") as HTMLDivElement
            this.divLists.classList.add("pc_processing")
            this.ObjAppend(this.div, this.divLists)

            this.spanRecord = this.objCreate("div") as HTMLDivElement
            // this.spanRecord.innerText = Main.langMgr.get("pay_recentLists") //"交易中"
            this.ObjAppend(this.divLists, this.spanRecord)
            this.spanRecord.onclick = () => {
                this.hidden()
                PayListProcessView.refer = "PayView"
                Main.viewMgr.change("PayListProcessView")
            }

            // 更多钱包记录
            // this.divListsMore = this.objCreate("button")
            // this.divListsMore.classList.add("pc_paymore")
            // this.divListsMore.textContent = Main.langMgr.get("pay_more") // "更多"
            // this.divListsMore.onclick = () => {
            //     this.hidden()
            //     PayListMoreView.refer = "PayView"
            //     Main.viewMgr.change("PayListMoreView")
            // }
            // // this.divListsMore.style.display = "none"
            // this.ObjAppend(liRecord, this.divListsMore)

            // var iListsMore = this.objCreate("i")
            // iListsMore.classList.add("iconfont", "icon-bc-sanjiaoxing")
            // this.ObjAppend(this.divListsMore, iListsMore)

            // 正在处理的
            this.pendingListsElement = this.objCreate("div")
            this.ObjAppend(this.divLists, this.pendingListsElement)
            var iconfont = this.objCreate("i")
            iconfont.classList.add("iconfont","icon-bc-sanjiaoxing")
            this.ObjAppend(this.divLists,iconfont)



            // 代币
            var divCurrency = this.objCreate("div")
            divCurrency.classList.add("pc_currency")
            this.ObjAppend(this.div, divCurrency)

            // === 主链导航栏
            var divChainNav = this.objCreate("div")
            divChainNav.classList.add("pc_currencynumber")
            this.ObjAppend(divCurrency, divChainNav)

            // 当前主链
            let curr_chain_number = Main.netMgr.getCurrChain()
            let curr_chain = curr_chain_number.toString()
            // 当前网络
            let curr_net_number = Main.netMgr.getCurrNet()
            let curr_net = curr_net_number.toString()
            
            // 主链导航
            this.chains.forEach((chain_number) => {
            
                let chain = chain_number.toString()

                // 导航栏
                this["chain_" + chain] = this.objCreate("div")
                this["chain_" + chain].innerText = Main.langMgr.get("pay_chain_" + chain)
                this["chain_" + chain].onclick = () => {
                    // this.changeChain(chain);
                    Main.changeChainType(chain_number)
                }
                this.ObjAppend(divChainNav, this["chain_" + chain])
            })
            this["chain_" + curr_chain].classList.add('active')
            

            // 数字币种list，显示当前主链的
            this["coin_list_" + curr_chain] = this.objCreate("div")
            this["coin_list_" + curr_chain].classList.add("pc_currencylist")
            this["coin_list_" + curr_chain].classList.add("active")
            this.ObjAppend(divCurrency, this["coin_list_" + curr_chain])

            // 数字币种具体
            let chain_coins = Main.netMgr.getChainCoins(curr_chain_number)
            chain_coins.forEach((coin) => {
                let coinElement = this.objCreate("div")
                // 名称
                coinElement.innerHTML = Main.langMgr.get(coin)
                this.ObjAppend(this["coin_list_" + curr_chain], coinElement)
                // LOGO
                let logoElement = this.objCreate("img") as HTMLImageElement
                logoElement.src = Main.resHost + "res/img/" + coin + ".png"
                logoElement.classList.add("coinlogo")
                this.ObjAppend(coinElement, logoElement)
                // ?号
                let labelElement = this.objCreate("label")
                labelElement.classList.add("iconfont", "icon-bc-help")
                this.ObjAppend(coinElement, labelElement)
                let descText = ""
                if (Main.in_array(coin, ["gas", "neo"])) {
                    descText = Main.langMgr.get("pay_" + coin + "_desc" + "_" + curr_chain)
                }
                else {
                    descText = Main.langMgr.get("pay_" + coin + "_desc")
                }
                
                if (descText != "") {
                    // ?描述
                    let descElement = this.objCreate("div")
                    descElement.classList.add("pc_coincon")
                    descElement.textContent = descText
                    this.ObjAppend(labelElement, descElement)
                }
                else {
                    labelElement.style.display = "none"
                }
                // 字体图标">"
                let moreElement = this.objCreate("i")
                moreElement.classList.add("iconfont", "icon-bc-gengduo")
                this.ObjAppend(coinElement, moreElement)
                // 余额
                this["span" + coin.toUpperCase()] = this.objCreate("span")
                this["span" + coin.toUpperCase()].textContent = "0"
                this.ObjAppend(coinElement, this["span" + coin.toUpperCase()])
                // 点击事件
                coinElement.onclick = () => {
                    this["doExchange" + coin.toUpperCase()]()
                }
                
            })

            // old币种信息
            let coins_old = Main.netMgr.getChainCoinsOld(curr_chain_number)
            coins_old.forEach((coin) => {

                let coin_upcase = coin.toUpperCase() + "_OLD"
                if (Main.netMgr.getCoinTool()["id_" + coin_upcase].length > 0) {
                    Main.netMgr.getCoinTool()["id_" + coin_upcase].forEach((old) => {
                        let coinElement = this.objCreate("div")
                        // 名称
                        coinElement.innerHTML = Main.langMgr.get("pay_" + coin)
                        this.ObjAppend(this["coin_list_" + curr_chain], coinElement)
                        // LOGO
                        let logoElement = this.objCreate("img") as HTMLImageElement
                        logoElement.src = Main.resHost + "res/img/old" + coin + ".png"
                        logoElement.classList.add("coinlogo")
                        this.ObjAppend(coinElement, logoElement)
                        // ?号
                        let labelElement = this.objCreate("label")
                        labelElement.classList.add("iconfont", "icon-bc-help")
                        this.ObjAppend(coinElement, labelElement)
                        // ?描述
                        let descElement = this.objCreate("div")
                        descElement.classList.add("pc_coincon")
                        descElement.textContent = old
                        this.ObjAppend(labelElement, descElement)
                        // 字体图标">"
                        let moreElement = this.objCreate("i")
                        moreElement.classList.add("iconfont", "icon-bc-gengduo")
                        this.ObjAppend(coinElement, moreElement)
                        // 余额
                        this["span" + coin_upcase + old] = this.objCreate("span")
                        this["span" + coin_upcase + old].textContent = "0"
                        this.ObjAppend(coinElement, this["span" + coin_upcase + old])
                        // 点击事件
                        coinElement.onclick = () => {
                            this.doMakeRefundOld(old, coin_upcase)
                        }
                    })
                }
            })


            this.doGetBalances()
            this.doGetWalletLists(1)
            // 获取高度
            this.getHeight("nodes")
            this.getHeight("clis")
            
        }

        update() {
            var isHidden = this.isHidden();
            this.reset()
            super.update()
            if (isHidden) this.hidden()
        }

        key_esc() {

        }

        private clearTimeout() {
            if (this.s_doGetWalletLists) clearTimeout(this.s_doGetWalletLists)
        }

        async doGetBalances() {
            let chain = Main.netMgr.getCurrChain()
            switch (chain) {
                case 2: // neo
                    await this._doGetBalances_neo()
                    break
            }
        }


        async _doGetBalances_neo() {
            Main.netMgr.getCoinTool().initAllAsset();

            // 获得balance列表(gas)
            var balances = (await Main.netMgr.getWWW().api_getBalance(Main.user.info.wallet)) as tools.BalanceInfo[];
            if (balances) {
                //余额不唯空
                balances.map(item => (item.names = Main.netMgr.getCoinTool().assetID2name[item.asset])); //将列表的余额资产名称赋值
                await balances.forEach(
                    // 取GAS余额
                    balance => {
                        if (balance.asset == Main.netMgr.getCoinTool().id_GAS) {
                            this.gas = balance.balance;
                            // 判断一下有没有减号，不用科学计数法表示
                            this["spanGAS"].textContent = Main.getStringNumber(this.gas)
                        }
                        else if (balance.asset == Main.netMgr.getCoinTool().id_NEO) {
                            this.neo = balance.balance
                            this["spanNEO"].textContent = Main.getStringNumber(this.neo)
                        }
                    }
                );
            }
            else {
                this.gas = 0;
                this.neo = 0;
                this["spanGAS"].textContent = "0";
                this["spanNEO"].textContent = "0"
            }

            // 获取NEP5余额
            Main.netMgr.getChainCoins(Main.netMgr.getCurrChain()).forEach(coin => {
                if (coin != "gas" && coin != "neo") {
                    this.getNep5Balance(coin.toUpperCase())
                }
            })

            // 获取CGAS_OLD/CNEO_OLD余额
            Main.netMgr.getChainCoinsOld(Main.netMgr.getCurrChain()).forEach( coin => {
                this.getNep5BalanceOld(coin.toUpperCase() + "_OLD")
            })
        }

        private async getNep5BalanceOld(coin: string) {
            try {
                let coin_lowcase = coin.toLowerCase()
                await Main.netMgr.getCoinTool()["id_" + coin].forEach(async (old) => {
                    this[coin_lowcase + old] = await Main["get" + coin + "BalanceByAddress"](old, Main.user.info.wallet)
                    this["span" + coin + old].textContent = Main.getStringNumber(this[coin_lowcase + old])
                })
            }
            catch (e) { }
        }

        private async getNep5Balance(coin: string) {
            try {
                let coin_lowcase = coin.toLowerCase()
                this[coin_lowcase] = await Main["get" + coin + "BalanceByAddress"](Main.netMgr.getCoinTool()["id_" + coin], Main.user.info.wallet)
                this["span" + coin].textContent = Main.getStringNumber(this[coin_lowcase])

                // 通知其他界面更新余额
                Main.viewMgr.updateBalance()
            }
            catch (e) { }
        }

        private async doMakeRefundOld(id_old: string, type: string = "CGAS_OLD") {
            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 获取cgas合约地址
                // 暂时以第一个合约地址为准，后续如果多个，新开view显示
                let id_OLD = id_old

                // 获取cgas余额
                let balance = await Main["get" + type + "BalanceByAddress"](id_OLD, Main.user.info.wallet)
                let id_balance = balance.toString()

                // 打开输入数量
                ViewTransferCount.transType = "refund"
                ViewTransferCount.transNncOld = id_OLD

                if (type == "CGAS_OLD") {
                    ViewTransferCount.coinType = "CGAS"
                }
                else if (type == "CNEO_OLD") {
                    ViewTransferCount.coinType = "CNEO"
                }

                ViewTransferCount.refer = "PayView"
                ViewTransferCount.callback = () => {
                    this.makeRefundTransaction(id_old, type)
                }
                Main.viewMgr.change("ViewTransferCount")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.doMakeRefundOld(id_old, type)
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }

        }

        private async doExchangeGAS() {
            this.doExchangeToken("CGAS", "refund")
        }

        private async doExchangeCNEO() {
            this.doExchangeToken("CNEO", "mint")
        }

        

        private async doExchangeCGAS() {
            this.doExchangeToken("CGAS", "mint")
        }

        private async doExchangeToken(coinType: string = "CGAS", transType = "") {
            if (Main.isWalletOpen()) {
                // 打开钱包了
                // 打开输入数量
                ViewTransferCount.coinType = coinType
                ViewTransferCount.transType = transType
                ViewTransferCount.transNncOld = ""

                ViewTransferCount.refer = "PayView"
                ViewTransferCount.callback = () => {
                    switch (ViewTransferCount.transType) {
                        case "mint":
                            this.makeMintTokenTransaction(coinType)
                            break
                        case "refund":
                            this.makeRefundTransaction(Main.netMgr.getCoinTool()["id_" + coinType], coinType)
                            break;
                    }
                }
                Main.viewMgr.change("ViewTransferCount")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.doExchangeToken(coinType, transType)
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        private async doExchangeNEO() {

            this.doExchangeToken("CNEO", "refund")

        }



        private divLists_recreate() {
            this.pendingListsElement.innerHTML = "";
        }

        async doGetWalletLists(force = 0) {
            console.log("[BlaCat]", '[PayView]', '[doGetWalletLists]', '获取交易记录，force => ', force)
            if (!Main.user.info.wallet) {
                console.log("[BlaCat]", '[PayView]', '[doGetWalletLists]', '已退出登录，本次请求取消')
                return;
            }

            if (force == 0 && this.WalletListsNeedConfirm) {
                // 外部调用获取交易列表，当前又有待确认交易，取消本次查询，等待定时器自动刷新交易列表
                console.log("[BlaCat]", '[PayView]', '[doGetWalletLists]', '有定时刷新，本次请求取消')
                return;
            }

            if (this.s_doGetWalletLists) {
                clearTimeout(this.s_doGetWalletLists)
                this.s_doGetWalletLists = null
            }

            // 获取pending数据
            var res = ApiTool.getWalletListss(1, this.listPageNum, 1);

            if (res.r) {
                // 清理原始数据显示
                this.divLists_recreate()

                // 刷新icon
                Main.viewMgr.iconView.flushProcess(res.data.length)
                // 刷新PayView
                this.spanRecord.innerHTML = Main.langMgr.get('payview_process', { count: res.data.length})

                // 待确认交易信息复制
                PayListProcessView.lists = res.data
                // 通知数据更新
                if (Main.viewMgr.payListProcessView && !Main.viewMgr.payListProcessView.isHidden()) {
                    Main.viewMgr.payListProcessView.updateLists()
                }

                // 有待确认交易
                if (res.data && res.data.length > 0) {

                    // 刷新时间初始化
                    var next_timeout = 0; // 下次刷新间隔
                    var curr_ts = Math.round((new Date()).getTime() / 1000); // 当前时间戳

                    // 显示pending&优化刷新时间
                    await res.data.forEach(
                        list => {

                            // 优化间隔时间，此记录持续时间超过默认出块时间间隔，并且在3个出块时间内，使用最小刷新时间间隔
                            let last_ts = (curr_ts - list.ctm) * 1000 - Main.tsOffset

                            let next_timeout_tmp = Main.netMgr.getNextBlockTs(last_ts)
                            if (next_timeout === 0) {
                                next_timeout = next_timeout_tmp
                            }
                            else if (next_timeout > next_timeout_tmp) {
                                next_timeout = next_timeout_tmp
                            }
                        }
                    );

                    // 设置刷新任务
                    console.log("[BlaCat]", '[PayView]', '[doGetWalletLists]', next_timeout / 1000, "(s)后再次获取")
                    this.s_doGetWalletLists = setTimeout(() => { this.doGetWalletLists(1) }, next_timeout);
                    this.WalletListsNeedConfirm = true
                }

                // 获取余额判定
                let walletListsHash_tmp = JSON.stringify(res.data)
                if (this.walletListsHash != null && walletListsHash_tmp != this.walletListsHash) {
                    // 第一次，不需要获取余额
                    console.log("[BlaCat]", '[PayView]', '[doGetWalletLists]', '更新余额')
                    this.doGetBalances()
                }
                this.walletListsHash = walletListsHash_tmp
            }
            else {
                Main.showErrCode(res.errCode)
            }
        }

        /**
         * 获取币种图标
         * @param v 钱包交易记录list数据
         * @param type 币种，小写
         */
        private getCoinIcon(v, coin_type: string): string {
            try {
                var params = JSON.parse(v.params)
                if (params.hasOwnProperty("nnc")) {
                    params = [params]
                }
                if (params instanceof Array) {
                    for (let k in params) {
                        let this_nnc = null
                        if (params[k].hasOwnProperty('asset')) {
                            this_nnc = params[k]['asset']
                        }
                        else if (params[k].hasOwnProperty('nnc')) {
                            this_nnc = params[k]['nnc']
                        }
                        if (this_nnc) {
                            if (v.chain_type == "2") {
                                if (this_nnc == Main.netMgr.getCoinTool()["id_" + coin_type.toUpperCase()]) {
                                    return Main.resHost + "res/img/" + coin_type.toLowerCase() + ".png";
                                }
                            }
                            else {
                                if (this_nnc == Main.netMgr.getCoinTool()["id_" + coin_type.toUpperCase()]) {
                                    return Main.resHost + "res/img/" + coin_type.toLowerCase() + ".png";
                                }
                            }
                            
                        }
                    }
                }
            }
            catch (e) {
                console.log("[BlaCat]", '[PayView]', '[getCoinIcon]', 'v.type=' + v.type + ', error => ', e)
            }
            return Main.resHost + "res/img/old" + coin_type.toLowerCase() + ".png";
        }

        getListImg(v) {
            if (v.state == "0" && v.type == "5") {
                // 未确认，统一返回未确认图标
                return Main.resHost + "res/img/transconfirm.png";
            }

            switch (v.type) {
                case "1": // utxo->nep5(gas->cgas、neo->cneo)
                case "2": // nep5->utxo(cgas->gas、cneo->neo)
                case "3": // nep5(cgas、cneo）充值到游戏(nep5->game)
                case "4": // nep5(cgas、cneo）退款(game->nep5)
                    if (v.type_detail == "0") {
                        return this.getCoinIcon(v, 'cgas')
                    }
                    for (let k in PayTransferView.log_type_detail) {
                        if (PayTransferView.log_type_detail[k] == v.type_detail) {
                            return this.getCoinIcon(v, k)
                        }
                    }
                    break;
                case "5": // 游戏交易
                    // 判断params里面是否有cgas合约，有的话标记成cgas图标
                    var nep5Type = null
                    var coinTool = null
                    // neo
                    nep5Type = ['gas', 'cgas', 'neo', 'cneo']
                    coinTool = 'CoinTool'
                    
                    try {
                        var params = JSON.parse(v.params)
                        if (params.hasOwnProperty("nnc")) {
                            params = [params]
                        }
                        if (params instanceof Array) {
                            for (let k in params) {
                                if (params[k].hasOwnProperty('nnc')) {
                                    // CURR-NEP5
                                    for (let i = 0; i < nep5Type.length; i++) {
                                        if (params[k].nnc == tools[coinTool]["id_" + nep5Type[i].toUpperCase()]) {
                                            return Main.resHost + "res/img/" + nep5Type[i] + ".png"
                                        }
                                    }
                                    if (v.chain_type == "2") {
                                        // CGAS_OLD
                                        for (let m = 0; m < Main.netMgr.getCoinTool().id_CGAS_OLD.length; m++) {
                                            if (params[k].nnc == Main.netMgr.getCoinTool().id_CGAS_OLD[m]) {
                                                return Main.resHost + "res/img/oldcgas.png"
                                            }
                                        }
                                        // CNEO_OLD
                                        for (let m = 0; m < Main.netMgr.getCoinTool().id_CNEO_OLD.length; m++) {
                                            if (params[k].nnc == Main.netMgr.getCoinTool().id_CNEO_OLD[m]) {
                                                return Main.resHost + "res/img/oldcneo.png"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    catch (e) {
                        console.log("[BlaCat]", '[PayView]', '[getListImg]', 'v.type=5, error => ', e)
                    }
                    return this.getListGameIcon(v);
                case "6": // 转账
                    if (v.type_detail == "0") {
                        return Main.resHost + "res/img/gas.png"
                    }
                    for (let k in PayTransferView.log_type_detail) {
                        if (PayTransferView.log_type_detail[k] == v.type_detail) {
                            // return Main.resHost + "res/img/" + k + ".png"
                            return this.getCoinIcon(v, k)
                        }
                    }
                    break;

            }
            return Main.resHost + "res/img/game0.png";
        }

        getListGameIcon(v) {
            try {
                var iconObj = JSON.parse(v.icon)
                if (iconObj.hasOwnProperty(Main.langMgr.type) && iconObj[Main.langMgr.type] != "") {
                    return iconObj[Main.langMgr.type]
                }
                else if (iconObj.hasOwnProperty(Main.applang) && iconObj[Main.applang] != "") {
                    return iconObj[Main.applang];
                }
            }
            catch (e) {
                // return v.name;
                console.log("[BlaCat]", '[PayView]', '[getListGameIcon]', 'v => ', v, 'error => ', e.toString())
            }
            return v.icon
        }

        private getAppName(v) {
            var name = v.name;
            try {
                var nameObj = JSON.parse(name)
                if (nameObj.hasOwnProperty(Main.langMgr.type)) {
                    return nameObj[Main.langMgr.type]
                }
                else if (nameObj.hasOwnProperty(v.lang)) {
                    return nameObj[v.lang];
                }
            }
            catch (e) {
                // return v.name;
                console.log("[BlaCat]", '[PayView]', '[getAppName]', 'name =>', name, 'error => ', e.toString())
            }
            return name
        }

        getListName(v) {
            if (v.g_id == "0") {
                return Main.platName;
            }
            return this.getAppName(v);
        }

        getListCtm(v) {
            return Main.getDate(v.ctm)
        }

        getListCtmMsg(v) {
            var str = "";

            var timestamp = (new Date()).getTime();
            var ts = Math.round(timestamp / 1000);
            var last = ts - Number(v.ctm)

            var year = 60 * 60 * 24 * 365;
            var month = 60 * 60 * 24 * 30;
            var day = 60 * 60 * 24;
            var hour = 60 * 60;
            var minute = 60;

            if (last >= year) {
                var n = Math.floor(last / year);
                return Main.langMgr.get("paylist_ctm_year", { "year": n })
                // return n.toString() + "年前"
            }
            else if (last >= month) {
                var n = Math.floor(last / month);
                return Main.langMgr.get("paylist_ctm_month", { "month": n })
                // return n.toString() + "月前"
            }
            else if (last >= day) {
                var n = Math.floor(last / day);
                return Main.langMgr.get("paylist_ctm_day", { "day": n })
                // return n.toString() + "天前"
            }
            else if (last >= hour) {
                var n = Math.floor(last / hour);
                return Main.langMgr.get("paylist_ctm_hour", { "hour": n })
                // return n.toString() + "小时前"
            }
            else if (last >= minute) {
                var n = Math.floor(last / minute);
                return Main.langMgr.get("paylist_ctm_minute", { "minute": n })
                // return n.toString() + "分钟前"
            }
            else if (last >= 0) {
                return Main.langMgr.get("paylist_ctm_recent")
                // return "刚才"
            }
            else {
                // 负数？和服务器时间有差别，也返回刚才
                return Main.langMgr.get("paylist_ctm_recent")
                // return "刚才"
            }
        }

        getListParamMethods(v) {
            try {
                var params = JSON.parse(v.params)
                if (params.hasOwnProperty("sbPushString")) {
                    params = [params]
                }
                if (params instanceof Array) {
                    var method = new Array();
                    for (let k in params) {
                        if (params[k].hasOwnProperty("sbPushString")) {
                            method.push(params[k].sbPushString)
                        }
                    }
                    if (method.length > 1) {
                        return method[0] + ', ...';
                    }
                    else {
                        return method.toString()
                    }
                }
            }
            catch (e) {
                console.log("[BlaCat]", '[PayView]', '[getListParamMethods]', 'v => ', v, 'error => ', e.toString())
            }
            return Main.langMgr.get("paylist_sbPushString_none")
        }

        getListCnts(v) {
            if (v.cnts && Number(v.cnts) != 0) {
                var state_cnts_span = this.objCreate("span")
                state_cnts_span.textContent = v.cnts
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
                || v.type == "15"
            ) {
                return 'pc_income';
            }
            else if (Number(v.cnts) > 0) {
                return 'pc_expenditure';
            }
            return "";
        }

        getListState(v) {
            var state = v.state;
            var pct = "50%"; // 只有state=0才生效
            var i = 1; // 只有state=0生效，=1转圈；=2感叹号

            switch (v.type) {
                case "2":   // 平台退款
                    pct = "25%"
                    // 退款请求，特殊处理
                    if (v.state == "1") {
                        state = '0';
                        pct = '50%'

                        if (v.ext != "") {
                            state = '0';
                            pct = "75%"
                            if (v.client_notify == "1") {
                                state = '1';
                            }
                        }
                        else {
                            // 判断是否开启钱包，钱包未开启，需要感叹号表示
                            if (!Main.isWalletOpen()) {
                                i = 2;
                            }
                        }
                    }
                    break;
            }

            switch (state) {
                case '0':
                    var state_button0 = this.objCreate("div")
                    state_button0.classList.add("pc_verification")
                    if (i == 1) {
                        state_button0.classList.add("iconfont", "icon-bc-dengdai")
                        state_button0.innerHTML = "<label>" + pct + "</label>"
                    } else {
                        // 感叹号
                        var obja = this.objCreate("a")
                        obja.classList.add("iconfont", "icon-bc-jinhangzhong")
                        obja.innerHTML = '<label>' + pct + '</label>';
                        obja.onclick = () => {
                            Main.continueWithOpenWallet();
                            event.stopPropagation();
                        }
                        this.ObjAppend(state_button0, obja);
                    }

                    return state_button0;
                case '1':
                    var state_a1 = this.objCreate("a")
                    state_a1.classList.add("iconfont", "icon-bc-gou")
                    return state_a1;
                case '2':
                    var state_a2 = this.objCreate("a")
                    state_a2.classList.add("iconfont", "icon-bc-chacha")
                    return state_a2;
            }
        }

        getListBlockindex(v) {
            if (v.hasOwnProperty('blockindex')) {
                return v["blockindex"]
            }
            return 0
        }

        private wallet_detail() {
            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 打开详情页
                PayWalletDetailView.refer = "PayView"
                Main.viewMgr.change("PayWalletDetailView")
                this.hidden()

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.wallet_detail()
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        // gas -> cgas   neo -> cneo
        private async makeMintTokenTransaction(coinType: string = "CGAS") {
            Main.viewMgr.change("ViewLoading")

            var mintCount = Main.viewMgr.viewTransferCount.inputCount.value;
            var net_fee = Main.viewMgr.viewTransferCount.net_fee;// 手续费
            console.log("[BlaCat]", '[PayView]', '[makeMintTokenTransaction]', '充值' + coinType + '，数量 => ', mintCount, '手续费netfee =>', net_fee)


            var login = tools.LoginInfo.getCurrentLogin();

            try {
                var utxos_assets = await Main.netMgr.getCoinTool().getassets();
                console.log("[BlaCat]", '[PayView]', '[makeMintTokenTransaction]', 'utxos_assets => ', utxos_assets)

                if (coinType == "CGAS") {
                    var scriptaddress = Main.netMgr.getCoinTool().id_CGAS.hexToBytes().reverse();
                    var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                    var makeTranRes: Result = Main.netMgr.getCoinTool().makeTran(
                        utxos_assets,
                        nepAddress,
                        Main.netMgr.getCoinTool().id_GAS,
                        Neo.Fixed8.fromNumber(Number(mintCount)),
                        Neo.Fixed8.fromNumber(Number(net_fee)),
                        0,
                        true, // 拆分gas的utxo，以便后续手续费
                    );
                }
                else {
                    // CNEO
                    var scriptaddress = Main.netMgr.getCoinTool().id_CNEO.hexToBytes().reverse();
                    var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                    var makeTranRes: Result = Main.netMgr.getCoinTool().makeTran(
                        utxos_assets,
                        nepAddress,
                        Main.netMgr.getCoinTool().id_NEO,
                        Neo.Fixed8.fromNumber(Number(mintCount)),
                        //Neo.Fixed8.fromNumber(Number(net_fee)),
                        Neo.Fixed8.Zero,
                        0,
                        false, // 拆分gas的utxo，以便后续手续费
                    );

                    // 获取手续费
                    // 有网络手续费
                    if (Number(net_fee) > 0) {

                        // makeTranRes.info.tran.extdata.gas = Neo.Fixed8.fromNumber(Number(net_fee));
                        try {
                            // 获取用户utxo : utos_assets
                            var user_makeTranRes: Result = Main.netMgr.getCoinTool().makeTran(
                                utxos_assets,
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
                            console.log("[BlaCat]", '[PayView]', '[makeMintTokenTransaction]', 'user_makeTranRes => ', user_makeTranRes)
                        }
                        catch (e) {
                            Main.viewMgr.viewLoading.remove()
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
                Main.viewMgr.viewLoading.remove()
                let errmsg = Main.langMgr.get(e.message);
                if (errmsg) {
                    Main.showErrMsg((e.message)); // "GAS余额不足"
                }
                else {
                    if (coinType == "CGAS") {
                        Main.showErrMsg("pay_makeMintGasNotEnough")
                    }
                    else {
                        Main.showErrMsg("pay_makeMintNeoNotEnough")
                    }
                }

                return;
            }

            // gas转cgas，如果inputs+outputs的数量>=60，会超GAS,需要提示用户自己给自己转账后再操作
            var inputs_counts: number = makeTranRes.info.tran.hasOwnProperty("inputs") ? makeTranRes.info.tran.inputs.length : 0;
            var outputs_counts: number = makeTranRes.info.tran.hasOwnProperty("outputs") ? makeTranRes.info.tran.outputs.length : 0;
            var utxo_counts = inputs_counts + outputs_counts
            if (utxo_counts >= 50) {
                Main.viewMgr.viewLoading.remove()
                if (coinType == "CGAS") {
                    Main.showErrMsg("pay_makeMintGasUtxoCountsLimit", () => {
                        PayTransferView.transferType_default = "GAS"
                        PayTransferView.callback = null
                        PayTransferView.address = Main.user.info.wallet
                        Main.viewMgr.change("PayTransferView")
                        Main.viewMgr.payTransferView.inputTransferCount.value = mintCount
                    }, { gas: mintCount })
                }
                else {
                    // CNEO
                    Main.showErrMsg("pay_makeMintNeoUtxoCountsLimit", () => {
                        PayTransferView.transferType_default = "NEO"
                        PayTransferView.callback = null
                        PayTransferView.address = Main.user.info.wallet
                        Main.viewMgr.change("PayTransferView")
                        Main.viewMgr.payTransferView.inputTransferCount.value = mintCount
                    }, { neo: mintCount })
                }
                return
            }


            var sb = new ThinNeo.ScriptBuilder();
            //Parameter inversion
            sb.EmitParamJson([]); //Parameter list
            sb.EmitPushString("mintTokens"); //Method
            sb.EmitAppCall(scriptaddress); //Asset contract

            var tran: any = makeTranRes.info.tran;
            var oldarr = makeTranRes.info.oldarr;

            tran.type = ThinNeo.TransactionType.InvocationTransaction;
            tran.extdata = new ThinNeo.InvokeTransData();
            tran.extdata.script = sb.ToArray();
            tran.extdata.gas = Neo.Fixed8.fromNumber(Number(net_fee));
            // if (Number(extgas) > 0) {
            //     // 添加了手续费，version = 1
            //     tran.version = 1;
            // }

            var msg = tran.GetMessage();
            var signdata = ThinNeo.Helper.Sign(msg, login.prikey);
            tran.AddWitness(signdata, login.pubkey, login.address);

            var txid = "0x" + tran.GetHash().clone().reverse().toHexString();

            var data = tran.GetRawData();
            var r = await Main.netMgr.getWWW().api_postRawTransaction(data);
            if (r) {
                if (r["txid"] || r["sendrawtransactionresult"]) {
                    if (!r["txid"] || r["txid"] == "") {
                        r["txid"] = txid
                    }

                    var log_type = "1"
                    var log_nnc = Main.netMgr.getCoinTool()["id_" + coinType]
                    // 成功，上报
                    var logRes = await ApiTool.addUserWalletLogs(
                        r["txid"],
                        mintCount,
                        log_type,
                        '{"sbParamJson":"[]", "sbPushString": "mintTokens", "nnc": "' + log_nnc + '"}',
                        net_fee,
                        PayTransferView.log_type_detail[coinType.toLowerCase()]
                    );
                    // if (logRes.r)
                    // {
                    //     Main.platWalletLogId = parseInt(logRes.data);
                    // }

                    // 记录使用的utxo，后面不再使用，需要记录高度
                    var height = await Main.netMgr.getWWW().api_getHeight_nodes();
                    oldarr.map(old => old.height = height);
                    tools.OldUTXO.oldutxosPush(oldarr);

                    // 重新获取记录
                    Main.viewMgr.viewLoading.remove()
                    this.doGetWalletLists(1);

                    // TODO: 更新记录状态
                    //this.makeMintTokenTransaction_confirm(txid);
                } else {
                    // 失败
                    Main.viewMgr.viewLoading.remove()
                    Main.showErrMsg("pay_makeMintDoFail")
                }
            } else {
                // 失败
                Main.viewMgr.viewLoading.remove()
                Main.showErrMsg("pay_makeMintDoFail2")
            }
        }

        // cgas -> gas cneo -> neo
        private async makeRefundTransaction(id_ASSET: string = Main.netMgr.getCoinTool().id_CGAS, coinType: string = "CGAS") {
            Main.viewMgr.change("ViewLoading")

            var refundCount = Main.viewMgr.viewTransferCount.inputCount.value;
            var sendCount = Neo.Fixed8.fromNumber(Number(refundCount))

            var net_fee = Main.viewMgr.viewTransferCount.net_fee;// 手续费
            // var net_fee = "0.00000001"
            console.log("[BlaCat]", '[PayView]', '[makeRefundTransaction]', '退到gas/neo，数量 => ', refundCount, '手续费netfee =>', net_fee)

            // 查询余额
            var scriptaddress = id_ASSET.hexToBytes().reverse();

            var login = tools.LoginInfo.getCurrentLogin();

            //获取cgas/cneo合约地址的资产列表
            if (id_ASSET == '0x74f2dc36a68fdc4682034178eb2220729231db76') {
                // 注意，如果合约升级了，需要改动
                // 协调退款
                var utxos_assets = await Main.netMgr.getCoinTool().getCgasAssets(id_ASSET, Number(refundCount));
            }
            else {
                // cneo也可以用这个
                var utxos_assets = await Main.netMgr.getCoinTool().getNep5Assets(id_ASSET);
            }


            var log_type = "2"

            var coinType_asset = Main.netMgr.getCoinTool().id_GAS
            var not_enough_utxo_err = "pay_makeRefundCgasNotEnoughUtxo"
            var not_enough_err = "pay_makeRefundCgasNotEnough"
            if (coinType == "CNEO" || coinType == "CNEO_OLD") {
                coinType_asset = Main.netMgr.getCoinTool().id_NEO
                not_enough_utxo_err = "pay_makeRefundCneoNotEnoughUtxo"
                not_enough_err = "pay_makeRefundCneoNotEnough"
            }

            var us = utxos_assets[coinType_asset];
            if (us == undefined) {
                Main.viewMgr.viewLoading.remove()
                Main.showErrMsg(not_enough_utxo_err)
                return;
            }

            // 打乱us顺序，尽量避免一个块时间内，使用了重复的utxo，导致交易失败
            // 不能完全避免失败，但是可以提高并发成功率
            let us_random = []
            Main.randomSort(us, us_random)
            us = us_random

            console.log("[BlaCat]", '[payView]', '[makeRefundTransaction]', 'us.before => ', us);

            //检查cgas地址拥有的gas的utxo是否有被标记过
            var us_parse = [] // us处理后结果
            var count: Neo.Fixed8 = Neo.Fixed8.Zero;
            for (var i = us.length - 1; i >= 0; i--) {

                if (count.compareTo(sendCount) > 0) {
                    // 足够数量了，后面的直接剔除了
                    console.log("[BlaCat]", '[payView]', '[makeRefundTransaction]', 'enough us[' + i + '].delete => ', us[i]);
                    // delete us[i];
                    continue
                }

                if (us[i].n > 0) {
                    count = count.add(us[i].count)
                    us_parse.push(us[i])
                    continue;
                }

                var sb = new ThinNeo.ScriptBuilder();
                sb.EmitParamJson(["(hex256)" + us[i].txid.toString()]);
                sb.EmitPushString("getRefundTarget");
                sb.EmitAppCall(scriptaddress);

                var data = sb.ToArray();
                var r = await Main.netMgr.getWWW().api_getInvokescript(data);
                if (r) {
                    var stack = r["stack"];
                    var value = stack[0]["value"].toString();
                    if (value.length > 0) {
                        console.log("[BlaCat]", '[payView]', '[makeRefundTransaction]', 'us[' + i + '].delete => ', us[i]);
                        // delete us[i];
                    }
                    else {
                        count = count.add(us[i].count)
                        us_parse.push(us[i])
                    }
                }
            }
            us = us_parse

            console.log("[BlaCat]", '[payView]', '[makeRefundTransaction]', 'us.after => ', us);

            utxos_assets[coinType_asset] = us;

            console.log("[BlaCat]", '[payView]', '[makeRefundTransaction]', 'utxos_assets.after => ', utxos_assets);

            // 生成交易请求

            //cgas 自己给自己转账   用来生成一个utxo  合约会把这个utxo标记给发起的地址使用
            try {
                var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(scriptaddress);
                var makeTranRes: Result = Main.netMgr.getCoinTool().makeTran(
                    utxos_assets,
                    nepAddress,
                    coinType_asset,
                    Neo.Fixed8.fromNumber(Number(refundCount))
                );
                // 有网络手续费
                // ***************** CNEO退款暂时不支持支付GAS手续费 ****************************
                if (Number(net_fee) > 0) {

                    // makeTranRes.info.tran.extdata.gas = Neo.Fixed8.fromNumber(Number(net_fee));
                    try {
                        // 获取用户utxo
                        var user_utxos_assets = await Main.netMgr.getCoinTool().getassets();
                        console.log("[BlaCat]", '[PayView]', '[makeRefundTransaction]', 'user_utxos_assets => ', user_utxos_assets)

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
                        console.log("[BlaCat]", '[PayView]', '[makeRefundTransaction]', 'user_makeTranRes => ', user_makeTranRes)
                    }
                    catch (e) {
                        Main.viewMgr.viewLoading.remove()
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
            catch (e) {
                Main.viewMgr.viewLoading.remove()
                Main.showErrMsg(not_enough_err)
                return;
            }

            console.log(
                "[BlaCat]", "[payView]", "[makeRefundTransaction]", "makeTranRes => ",
                makeTranRes
            );

            var r = await Main.netMgr.getWWW().api_getcontractstate(id_ASSET);
            if (r && r["script"]) {
                var Script = r["script"].hexToBytes();

                var scriptHash = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(
                    login.address
                );

                var sb = new ThinNeo.ScriptBuilder();
                sb.EmitParamJson(["(bytes)" + scriptHash.toHexString()]);
                sb.EmitPushString("refund");
                sb.EmitAppCall(scriptaddress);

                var tran: any = makeTranRes.info.tran;
                var oldarr: Array<tools.OldUTXO> = makeTranRes.info.oldarr;

                tran.type = ThinNeo.TransactionType.InvocationTransaction;
                tran.extdata = new ThinNeo.InvokeTransData();
                tran.extdata.script = sb.ToArray();
                // 网络手续费
                if (Number(net_fee) > 0) tran.extdata.gas = Neo.Fixed8.fromNumber(Number(net_fee));

                //附加鉴证
                tran.attributes = new Array<ThinNeo.Attribute>(1);
                tran.attributes[0] = new ThinNeo.Attribute();
                tran.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
                tran.attributes[0].data = scriptHash;

                var wsb = new ThinNeo.ScriptBuilder();
                wsb.EmitPushString("whatever");
                wsb.EmitPushNumber(new Neo.BigInteger(250));
                tran.AddWitnessScript(Script, wsb.ToArray());

                //做提款人的签名
                var signdata = ThinNeo.Helper.Sign(tran.GetMessage(), login.prikey);
                tran.AddWitness(signdata, login.pubkey, login.address);

                var txid = "0x" + tran.GetHash().clone().reverse().toHexString();

                var trandata = tran.GetRawData();

                console.log("[BlaCat]", '[payView]', '[makeRefundTransaction]', 'tran => ', tran);

                // 发送交易请求

                r = await Main.netMgr.getWWW().api_postRawTransaction(trandata);

                if (r) {
                    if (r.txid || r['sendrawtransactionresult']) {
                        if (!r["txid"] || r["txid"] == "") {
                            r["txid"] = txid
                        }
                        var paramJson_tmp = "(bytes)" + scriptHash.toHexString();
                        // 上报钱包操作记录
                        var logRes = await ApiTool.addUserWalletLogs(
                            r.txid,
                            refundCount,
                            log_type,
                            // 塞入net_fee，以便退款第二步参考手续费
                            '{"sbParamJson":"' + paramJson_tmp + '", "sbPushString": "refund", "nnc": "' + id_ASSET + '", "net_fee": "' + net_fee + '"}',
                            "",
                            PayTransferView.log_type_detail[coinType.toLowerCase()]
                        );
                        
                        // 记录使用的utxo，后面不再使用，需要记录高度
                        var height = await Main.netMgr.getWWW().api_getHeight_nodes();
                        oldarr.map(old => old.height = height);
                        tools.OldUTXO.oldutxosPush(oldarr);

                        // 等待交易确认
                        // this.makeRefundTransaction_confirm(r["txid"], refundCount);

                        // 刷新钱包记录，显示当前交易信息
                        Main.viewMgr.viewLoading.remove()
                        this.doGetWalletLists(1)

                    } else {
                        Main.viewMgr.viewLoading.remove()
                        // Main.showErrMsg("提取合约执行失败！请等待上个提现或兑换交易完成再操作！");
                        Main.showErrMsg(("pay_makeRefundDoFail"))
                    }
                    console.log("[BlaCat]", '[payView]', '[makeRefundTransaction]', 'api_postRawTransaction结果 => ', r);

                }
                else {
                    Main.viewMgr.viewLoading.remove()
                    // Main.showErrMsg("发送提取交易失败！请检查网络，稍候重试！");
                    Main.showErrMsg("pay_makeRefundDoFail2")
                }
            }
            else {
                Main.viewMgr.viewLoading.remove()
                // Main.showErrMsg("获取提取合约失败！");
                Main.showErrMsg("pay_makeRefundGetScriptFail")
            }
        }

        //收款
        private async doMakeReceivables() {
            this.hidden()
            PayReceivablesView.refer = "PayView"
            Main.viewMgr.change("PayReceivablesView")
        }


        //转账
        private async doMakeTransfer() {
            if (Main.isWalletOpen()) {
                // 打开钱包了

                // 打开转账页
                PayTransferView.refer = "PayView"
                PayTransferView.callback = () => {
                    this.doGetWalletLists(1)
                }
                Main.viewMgr.change("PayTransferView")

            } else {
                // 未打开钱包
                ViewWalletOpen.refer = "PayView"
                ViewWalletOpen.callback = () => {
                    this.doMakeTransfer()
                }
                Main.viewMgr.change("ViewWalletOpen")
                // this.hidden()
            }
        }

        flushListCtm() {
            var ctms = document.getElementsByClassName("listCtm")
            if (ctms && ctms.length > 0) {
                for (let k = 0; k < ctms.length; k++) {
                    var list = {
                        ctm: ctms[k].getAttribute("ctm")
                    }
                    ctms[k].textContent = this.getListCtmMsg(list)
                }
            }
        }

        private getNetTypeName() {
            return Main.langMgr.get("pay_nettype_" + Main.netMgr.getCurrNet());
        }

        private showChangeNetType() {
            if (this.divNetSelect.innerHTML.length > 0) {
                this.divNetSelect.innerHTML = "";
            }
            else {
                var other = Main.netMgr.getOtherNets()
                for (let i = 0; i < other.length; i++) {
                    this.ObjAppend(this.divNetSelect, this.getDivNetSelectType(other[i]))
                }
            }
        }

        private getDivNetSelectType(type: number) {
            var divObj = this.objCreate("div")
            divObj.textContent = Main.langMgr.get("pay_nettype_" + type)
            divObj.onclick = () => {
                Main.changeNetType(type)
            }
            return divObj;
        }

        checkTransCount(count: string): boolean {
            var regex = /(?!^0*(\.0{1,2})?$)^\d{1,14}(\.\d{1,8})?$/
            if (!regex.test(count)) {
                return false
            }
            if (Number(count) <= 0) {
                return false
            }
            return true
        }

        async getHeight(type: string, chain: number = null) {
            let height = ""

            height = await Main.netMgr.getWWW()["api_getHeight_" + type]()
                    
            if (height) {
                this.updateHeight(type, height)
            }
        }
        updateHeight(type, height) {
            this["divHeight_" + type].textContent = height.toString()
            this["height_" + type] = height
        }

        parseTypeDetailType10(type_detail: string) {
            var res = { type: "0", type_src: "0" }
            var detail = parseInt(type_detail)
            res.type_src = Math.floor(detail / 1000).toString()
            res.type = (detail % 1000).toString()

            return res
        }

        
    }
}