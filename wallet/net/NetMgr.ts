namespace BlackCat {
    export class NetMgr {

        private default_chain: number   // 默认主链
        private default_net: number     // 默认网络

        private chains: any             // NetMgrXX实例

        private support_chains:Array<number>   // 支持的主链类型[1,2]

        private chain: number       // 当前主链
        private lock_chain: boolean // 锁定当前主链
        private net: number         // 当前网络
        private lock_net: boolean   // 锁定当前网络
        

        constructor() {

            this.support_chains = [2] // 2:neo

            this.default_chain = 2  // neo
            this.default_net = 1    // mainnet

            this.lock_chain = false
            this.lock_net = false

            this.chains = {}
        }

        // 设置默认网络
        setDefaultNet(net: number) {
            if (this.lock_net) {
                console.log("[BlaCat]", '[NetMgr]', '[setDefaultNet]', '网络锁定状态，当前默认net => ', this.default_net)
                return
            }
            console.log("[BlaCat]", '[NetMgr]', '[setDefaultNet]', '设置默认网络[1:mainnet,2:testnet], net => ', net)
            this.default_net = net;
        }
        // 设置默认主链
        setDefaultChain(chain: number) {
            if (this.lock_chain) {
                console.log("[BlaCat]", '[NetMgr]', '[setDefaultChain]', '主链锁定状态，当前默认chain => ', this.default_chain)
                return
            }
            console.log("[BlaCat]", '[NetMgr]', '[setDefaultChain]', '设置默认主链[2:NEO], chain => ', chain)
            this.default_chain = chain;
        }
        // 锁定当前主链
        lockChain(): void {
            this.lock_chain = true
        }
        lockNet(): void {
            this.lock_net = true
        }
        // 获取当前网络
        getCurrNet(): number {
            return this.net
        }
        // 获取当前主链
        getCurrChain(): number {
            return this.chain
        }

        // 设置默认主链实例
        private setChainInstance(chain): void {
            if (!this.chains.hasOwnProperty(chain)) {
                switch (chain) {
                    case 2:
                        this.chains[chain] = new NetMgrNeo()
                        break
                }
            }
        }


        // 选择/切换网络
        changeNet(callback, net: number = null) {            
            if (!net) {
                net = this.default_net
            }
            else {
                // 指定net类型了，需判断是否锁定
                if (this.lock_net) {
                    return
                }
            }
            let chain = this.getCurrChain()
            // this.setChainInstance(chain)

            this.chains[chain].changeNet(() => {
                this.chain = chain
                this.net = net
                callback()
            }, net)
        }

        changeChain(callback, chain: number = null) {
            if (chain && chain == this.chain) {
                return
            }
            if (!chain) {
                chain = this.default_chain
            }
            else {
                // 判断是否锁链了
                if (this.lock_chain) {
                    return
                }
            }
            this.setChainInstance(chain)

            this.chains[chain].changeChain((net) => {
                this.chain = chain
                this.net = net
                callback(chain, net)
            }, this.default_net)
        }

        getChainCoins(chain: number = null): Array<string> {
            if (!chain) {
                chain = this.default_chain
            }
            else {
                if (this.lock_chain) {
                    if (chain !== this.chain) {
                        return new Array()
                    }
                }
            }
            // this.setChainInstance(chain)

            return this.chains[chain].getChainCoins()
        }

        getChainCoinsOld(chain: number = null): Array<string> {
            if (!chain) {
                chain = this.default_chain
            }
            else {
                if (this.lock_chain) {
                    if (chain !== this.chain) {
                        return new Array()
                    }
                }
            }
            // this.setChainInstance(chain)

            return this.chains[chain].getChainCoinsOld()
        }

        // 获取支持的主链
        getSupportChains(): Array<number> {
            var res = [this.chain]

            if (!this.lock_chain) {
                // return this.support_chains
                for (let k = 0; k < this.support_chains.length; k++) {
                    if (this.support_chains[k] !== this.chain) {
                        res.push(this.support_chains[k])
                    }
                }
            }
            
            return res;
       }

        getOtherNets(): Array<number> {
            if (this.lock_net) {
                return new Array()
            }
            return this.chains[this.chain].getOtherNets()
        }


        // 获取当前节点信息，type: clis，nodes
        getCurrNodeInfo(type: string) {
            return this.chains[this.chain].getCurrNodeInfo(type)
        }

        getNodeLists(type: string) {
            return this.chains[this.chain].getNodeLists(type)
        }

        setNode(type, url) {
            this.chains[this.chain].setNode(type, url)
        }

        getWWW() {
            return this.chains[this.chain].getWWW()
        }

        getCoinTool() {
            return this.chains[this.chain].getCoinTool()
        }

        getNextBlockTs(last_ts: number) {
            return this.chains[this.chain].getNextBlockTs(last_ts)
        }
    }

}