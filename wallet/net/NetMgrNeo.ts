namespace BlackCat {
    export class NetMgrNeo {

        // 网络类型配置
        private net_types = [1, 2] // 1-mainnet，2-testnet

        // nelnode节点配置
        private nodes =
            {
                // mainnet
                1: [
                    // 中国_NEL
                    ["CN", "https://api.nel.group/api/mainnet", "_NEL"],
                    // 香港
                    ["HK", "https://mainnet_node_hk_02.blacat.org/api/mainnet"],
                ],
                // testnet
                2: [
                    // 中国_NEL
                    ["CN", "https://api.nel.group/api/testnet", "_NEL"],
                    // 香港
                    ["HK", "https://testnet_node_hk_02.blacat.org/api/testnet"],
                ]
            }

        // NEO-CLI节点配置
        private clis = {
            // mainnet
            1: [
            ],
            // testnet
            2: [

            ]
        }

        // 链币种信息
        private chain_coins: Array<string>

        // 链币种（老合约）信息
        private chain_coins_old: Array<string>

        // 已经选择的nelnode节点
        private curr_nodes: any // {type: {}, type: {}}

        // 临时选择的nelnode节点
        private curr_nodes_tmp

        // 已经选择的neo-cli节点
        private curr_clis // {type: {}, type: {}}

        // 当前网络类型
        private curr_net

        // CoinTool
        private CoinTool
        // WWW
        private WWW

        // 出块等待时间，用于获取记录确认等待
        private blockTs: number
        // 在>1个块时间并且<3个出块时间内，最小时间
        private blockTsMin: number


        constructor() {
            this.curr_nodes = {}
            this.curr_clis = {}

            this.blockTs = 20000
            this.blockTsMin = 10000

            this.CoinTool = tools.CoinToolNeo
            this.WWW = tools.WWWNeo
        }

        getWWW() {
            return this.WWW
        }

        getCoinTool() {
            return this.CoinTool
        }

        getNextBlockTs(last_ts: number): number {
            // 1-3个块时间内
            if (last_ts >= this.blockTs && last_ts < this.blockTs * 3) {
                return this.blockTsMin
            }
            return this.blockTs
        }

        

        // 测试网其他信息配置
        private _init_test() {

            // cgas合约地址、cgas旧合约地址
            this.CoinTool.id_CGAS = "0x74f2dc36a68fdc4682034178eb2220729231db76";
            this.CoinTool.id_CGAS_OLD = []
            // cgas协调退款地址
            this.WWW.api_cgas = 'https://apiwallet.nel.group/api/testnet';

            // cneo合约地址、ceno旧合约地址
            this.CoinTool.id_CNEO = "0xc074a05e9dcf0141cbe6b4b3475dd67baf4dcb60"
            this.CoinTool.id_CNEO_OLD = []
            // cneo协调退款地址
            this.WWW.api_cneo = '';


            // 币种信息
            this.chain_coins = ["gas", "cgas", "neo", "cneo"]

            // 有老币种信息
            this.chain_coins_old = ["cgas", "cneo"]
        }

        // 主网其他信息配置
        private _init_main() {

            // cgas合约地址、cgas旧合约地址
            this.CoinTool.id_CGAS = "0x74f2dc36a68fdc4682034178eb2220729231db76";
            this.CoinTool.id_CGAS_OLD = []
            // cgas协调退款地址
            this.WWW.api_cgas = 'https://apiwallet.nel.group/api/mainnet';

            // cneo合约地址、ceno旧合约地址
            this.CoinTool.id_CNEO = "0xc074a05e9dcf0141cbe6b4b3475dd67baf4dcb60"
            this.CoinTool.id_CNEO_OLD = []
            // cneo协调退款地址
            this.WWW.api_cneo = '';


            // 币种信息
            this.chain_coins = ["gas", "cgas", "neo", "cneo"]

            // 有老币种信息
            this.chain_coins_old = ["cgas", "cneo"]
        }







        



        // 获取主机
        private getHosts(hosts) {
            var res = []
            hosts.forEach(
                host => {
                    res.push(host[1])
                }
            )
            return res;
        }


        // 选择nelnode节点，使用这个后，必须再使用selectCli
        private selectNode(callback, type, force = 0) {
            if (force == 0 && this.curr_nodes && this.curr_nodes.hasOwnProperty(type) && this.curr_nodes[type]) {
                // this.WWW.api = this.node_server[type];
                this.curr_nodes_tmp = this.curr_nodes[type]
                // callback()
                this.selectCli(callback, type, force)
                return
            }

            // 连接中...
            Main.viewMgr.change("ViewConnecting")
            ViewConnecting.callback_retry = () => {
                // 重试
                this._selectNode(callback, type, force)
            }
            this._selectNode(callback, type, force)
        }

        private _selectNode(callback, type, force) {
            
            console.log("[BlaCat]", '[NetMgrNeo]', '[_selectNode]', 'start ...')

            Main.viewMgr.viewConnecting.showConnecting()
            Main.viewMgr.iconView.showState()
            var conn = new Connector(this.getHosts(this.nodes[type]), "?jsonrpc=2.0&id=1&method=getblockcount&params=[]", 'node')
            conn.getOne((res, response) => {
                if (res === false) {
                    // 失败提示
                    ViewConnecting.content = "netmgr_select_node_slow"
                    // 重试（返回）按钮
                    var showReturn = !Main.isLoginInit()
                    Main.viewMgr.viewConnecting.showRetry(showReturn)
                    // 隐藏icon状态
                    Main.viewMgr.iconView.hiddenState()
                    // icon颜色（灰色）
                    if (Main.isLoginInit() === true) Main.viewMgr.iconView.showFail()
                    return
                }
                console.log("[BlaCat]", '[NetMgrNeo]', '[_selectNode]', 'nelnode => ', res)
                console.log("[BlaCat]", '[NetMgrNeo]', '[_selectNode]', 'nelnode response => ', response)


                // this.node_server[type] = res
                // this.WWW.api = this.node_server[type]
                // callback()
                // if (Main.viewMgr.viewConnecting.isCreated) Main.viewMgr.viewConnecting.remove()
                // // 隐藏状态
                // Main.viewMgr.iconView.hiddenState()
                // // 显示正常
                // Main.viewMgr.iconView.showSucc()

                // 因为还需要选择cli节点，这里暂存一下结果
                this.curr_nodes_tmp = res
                this.selectCli(callback, type, force)
            })
        }


        private selectCli(callback, type, force = 0) {

            if (!this.clis || !this.clis[type] || this.clis[type].length == 0) {
                // 没有NeoCli
                this.curr_nodes[type] = this.curr_nodes_tmp
                this.WWW.api_nodes = this.curr_nodes[type]

                this.curr_clis[type] = null
                this.WWW.api_clis = null
                callback()

                if (Main.viewMgr.viewConnecting.isCreated) Main.viewMgr.viewConnecting.remove()
                // 隐藏状态
                Main.viewMgr.iconView.hiddenState()
                // 显示正常
                Main.viewMgr.iconView.showSucc()

                return
            }

            if (force == 0 && this.curr_clis && this.curr_clis.hasOwnProperty(type) && this.curr_clis[type]) {
                // 有NeoCli已经被选择了
                this.curr_nodes[type] = this.curr_nodes_tmp
                this.WWW.api_nodes = this.curr_nodes[type]

                this.WWW.api_clis = this.curr_clis[type]

                callback()

                if (Main.viewMgr.viewConnecting.isCreated) Main.viewMgr.viewConnecting.remove()
                // 隐藏状态
                Main.viewMgr.iconView.hiddenState()
                // 显示正常
                Main.viewMgr.iconView.showSucc()

                return
            }

            // 连接中...
            Main.viewMgr.change("ViewConnecting")
            ViewConnecting.callback_retry = () => {
                // 重试
                this._selectCli(callback, type)
            }
            this._selectCli(callback, type)
        }

        private _selectCli(callback, type) {
            
            console.log("[BlaCat]", '[NetMgrNeo]', '[_selectCli]', 'start ...')

            Main.viewMgr.viewConnecting.showConnecting()
            Main.viewMgr.iconView.showState()
            var conn = new Connector(this.getHosts(this.clis[type]), "?jsonrpc=2.0&id=1&method=getblockcount&params=[]&uid=" + Main.randNumber, 'cli')
            conn.getOne((res, response) => {
                if (res === false) {
                    // 失败提示
                    ViewConnecting.content = "netmgr_select_cli_slow"
                    // 重试（返回）按钮
                    var showReturn = !Main.isLoginInit()
                    Main.viewMgr.viewConnecting.showRetry(showReturn)
                    // 隐藏icon状态
                    Main.viewMgr.iconView.hiddenState()
                    // icon颜色（灰色）
                    if (Main.isLoginInit() === true) Main.viewMgr.iconView.showFail()
                    return
                }
                console.log("[BlaCat]", '[NetMgrNeo]', '[_selectCli]', 'neo-cli => ', res)
                console.log("[BlaCat]", '[NetMgrNeo]', '[_selectCli]', 'neo-cli response => ', response)

                // cli也选择成功，可都修改参数了
                this.curr_nodes[type] = this.curr_nodes_tmp
                this.WWW.api_nodes = this.curr_nodes[type]

                this.curr_clis[type] = res
                this.WWW.api_clis = this.curr_clis[type]

                callback()
                if (Main.viewMgr.viewConnecting.isCreated) Main.viewMgr.viewConnecting.remove()
                // 隐藏状态
                Main.viewMgr.iconView.hiddenState()
                // 显示正常
                Main.viewMgr.iconView.showSucc()
            })
        }


        private async change2test(callback) {
            // 节点地址
            this.selectNode(() => {
                // 测试网
                this.curr_net = 2;
                this._init_test()
                // 回调
                callback(this.curr_net)
            }, 2)
        }

        private async change2Main(callback) {
            // 节点地址
            this.selectNode(() => {
                // 主网
                this.curr_net = 1;
                this._init_main()
                // 回调
                callback(this.curr_net)
            }, 1)
        }




        // 获取网络类型
        getOtherNets(): Array<number> {
            var res = new Array()
            for (let k = 0; k < this.net_types.length; k++) {
                if (this.net_types[k] !== this.curr_net) {
                    res.push(this.net_types[k])
                }
            }
            return res;
        }

        // 选择/切换网络
        changeNet(callback, net: number = null) {
            if (!net) {
                net = Main.netMgr.getCurrNet()
            }
            if (this.curr_net != net) {
                console.log("[BlaCat]", '[NetMgrNeo]', '[changeNet]', 'NEO切换网络，net => ', net)
                switch (net) {
                    case 1: // 主网
                        this.change2Main(callback)
                        break;
                    case 2: // 测试网
                        this.change2test(callback)
                        break;
                }
            }
        }

        changeChain(callback, net: number) {
            if (this.curr_net) {
                // 如果当前网络类型已经设置，以当前类型为准
                net = this.curr_net
            }
            else {
                if (!Main.in_array(net, this.net_types)) {
                    // 传入的net类型不支持，从支持的类别选第一个
                    net = this.net_types[0]
                }
            }

            console.log("[BlaCat]", '[NetMgrNeo]', '[changeChain]', '主链切换成NEO，net[1:mainnet,2:testnet] => ', net)

            switch (net) {
                case 1: // 主网
                    this.change2Main(callback)
                    break;
                case 2: // 测试网
                    this.change2test(callback)
                    break;
            }
        }

        getChainCoins() {
            return this.chain_coins
        }

        getChainCoinsOld() {
            return this.chain_coins_old
        }


        // 获取当前节点信息，type: clis，nodes
        getCurrNodeInfo(type: string) {
            var info = null
            if (this[type][this.curr_net].length > 0) {
                for (let i = 0; i < this[type][this.curr_net].length; i++) {
                    if (this[type][this.curr_net][i][1] == this["curr_" + type][this.curr_net]) {
                        return this[type][this.curr_net][i]
                    }
                }
            }
            return info
        }

        getNodeLists(type: string) {
            var lists = []
            if (this[type] && this[type][this.curr_net]) {
                return this[type][this.curr_net]
            }
            return lists
        }

        setNode(type, url) {
            this["curr_" + type][this.curr_net] = url
            this.WWW["api_" + type] = url
        }
    }
}