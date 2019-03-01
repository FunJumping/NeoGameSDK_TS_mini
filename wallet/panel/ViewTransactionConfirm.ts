/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 交易确认视图
    export class ViewTransactionConfirm extends ViewBase {

        static list: walletLists;

        private divConfirmSelect: HTMLElement; // 确认/取消栏div

        private trust: string; // 是否信任，"1"表示信任

        private netFeeCom: NetFeeComponent; // 手续费组件

        private net_fee: string // 网络交易费

        constructor() {
            super()

            if (!ViewTransactionConfirm.list) {
                ViewTransactionConfirm.list = new walletLists();
            }

        }

        start() {
            if (this.isCreated) {
                // 每次清理上一次的，显示最新的
                this.remove()
            }
            super.start()

            if (this.div.clientHeight < 667) {
                this.divConfirmSelect.style.top = "auto"
                this.divConfirmSelect.style.bottom = "0"
            }

            this.trust = "0";

        }

        create() {

            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_listdetail", "pc_tradeconfirm", "pc_trust")

            if (ViewTransactionConfirm.list && ViewTransactionConfirm.list.hasOwnProperty("wallet")) {
                // header标签创建比较麻烦
                var headerTitle = this.objCreate("div")
                headerTitle.classList.add("pc_header")
                // 返回按钮
                var returnBtn = this.objCreate("a")
                returnBtn.classList.add("iconfont", "icon-bc-fanhui")
                returnBtn.textContent = Main.langMgr.get("return") // "返回"
                returnBtn.onclick = () => {
                    this.return()
                    if (ViewTransactionConfirm.callback_cancel) {
                        ViewTransactionConfirm.callback_cancel()
                        ViewTransactionConfirm.callback_cancel = null;
                    }

                    // 隐藏
                    Main.viewMgr.mainView.hidden()
                    Main.viewMgr.change("IconView")
                }
                this.ObjAppend(headerTitle, returnBtn)
                // h1标题
                var h1Obj = this.objCreate("h1")
                h1Obj.textContent = Main.platName
                this.ObjAppend(headerTitle, h1Obj)

                this.ObjAppend(this.div, headerTitle)

                var contentObj = this.objCreate("div")
                contentObj.classList.add("pc_detail")
                //contentObj.style.paddingBottom = "210px"
                
                contentObj.style.paddingBottom = "160px"
                
                contentObj.innerHTML
                    = '<ul>'
                    + '<li>'
                    + '<div class="pc_listimg">'
                    + '<img src="' + Main.viewMgr.payView.getListImg(ViewTransactionConfirm.list) + '">'
                    + '</div>'
                    + '<div class="pc_liftinfo">'
                    + '<div class="pc_listname">' + Main.viewMgr.payView.getListName(ViewTransactionConfirm.list) + '</div>'
                    + '<span class="pc_listdate">' + Main.viewMgr.payView.getListCtm(ViewTransactionConfirm.list) + '</span>'
                    + '</div>'
                    + '<div class="pc_cnts ' + Main.viewMgr.payView.getListCntsClass(ViewTransactionConfirm.list) + ' ">'
                    + this.getCnts()
                    // +          this.getStats()
                    + '</div>'
                    + '</li>'
                    // +      '<li><label>交易单号：</label><p>' + this.getTxid() + '</p></li>'
                    + '<li><label>' + Main.langMgr.get("paylist_wallet") + '</label><p>' + this.getWallet() + '</p></li>'
                    + this.getParams()
                    + '</ul>'
                this.ObjAppend(this.div, contentObj)

                // 确认/取消栏div 
                this.divConfirmSelect = this.objCreate("div")
                this.divConfirmSelect.classList.add("pc_tradeconfirmbut")
                this.ObjAppend(this.div, this.divConfirmSelect)

                // 手续费组件
                this.netFeeCom = new NetFeeComponent(this.divConfirmSelect, (net_fee) => {
                    // this.netFeeChange(net_fee)
                    this.net_fee = net_fee
                })
                if (ViewTransactionConfirm.callback_params.hasOwnProperty('minGasLimit')) {
                    this.netFeeCom.setGasLimitMin(ViewTransactionConfirm.callback_params.minGasLimit)
                }
                this.netFeeCom.setFeeDefault()
                this.netFeeCom.createDiv()

                

                var cancelObj = this.objCreate("button")
                cancelObj.classList.add("pc_cancel")
                cancelObj.textContent = Main.langMgr.get("cancel") // "取消"
                cancelObj.onclick = () => {
                    console.log("[BlaCat]", '[ViewTransactionConfirm]', '[onclick]', '交易取消..')
                    if (ViewTransactionConfirm.callback_cancel) {
                        ViewTransactionConfirm.callback_cancel(ViewTransactionConfirm.callback_params)
                        ViewTransactionConfirm.callback_cancel = null;
                    }
                    this.remove()

                    // 隐藏
                    Main.viewMgr.mainView.hidden()
                    Main.viewMgr.change("IconView")
                }
                this.ObjAppend(this.divConfirmSelect, cancelObj)

                var confirmObj = this.objCreate("button")
                if (ViewTransactionConfirm.list.type == "3") {
                    confirmObj.textContent = Main.langMgr.get("pay_makeRecharge") // "充值"
                }
                else {
                    confirmObj.textContent = Main.langMgr.get("ok") // "确认"
                }
                confirmObj.onclick = () => {

                    if (Number(this.net_fee) > Main.viewMgr.payView.gas) {
                        // 手续费不足
                        Main.showErrMsg('pay_makerawtrans_fee_less', null, {reason: ""})
                        return
                    }

                    console.log("[BlaCat]", '[ViewTransactionConfirm]', '[onclick]', '交易确认..')
                    ViewTransactionConfirm.callback(ViewTransactionConfirm.callback_params, this.trust, this.net_fee)
                    ViewTransactionConfirm.callback = null;
                    this.remove(300)

                    // 隐藏
                    Main.viewMgr.mainView.hidden()
                    Main.viewMgr.change("IconView")
                }
                this.ObjAppend(this.divConfirmSelect, confirmObj)

            }
        }

        toRefer() {
            if (ViewTransactionConfirm.refer) {
                Main.viewMgr.change(ViewTransactionConfirm.refer);
                ViewTransactionConfirm.refer = null;
            }
        }

        key_esc() {
            
        }

        private getCnts() {
            return ViewTransactionConfirm.list.cnts != '0' ? ViewTransactionConfirm.list.cnts : ""
        }

        private getWallet() {
            return ViewTransactionConfirm.list.wallet
        }

        private getParams() {
            var html = ""
            var params: any = ViewTransactionConfirm.list.params;
            console.log("[BlaCat]", '[ViewTransactionConfirm]', '[getParams]', 'params => ', params)
            if (params) {
                try {
                    params = JSON.parse(params)
                    if (params.hasOwnProperty("nnc")) {
                        params = [params]
                    }
                    if (params instanceof Array) {
                        for (let k in params) {
                            html += '<li class="pc_contractAddress">'
                                + '<div><label>' + Main.langMgr.get("paylist_nnc") + '</label><p>' + params[k].nnc + '</p></div>'
                                + '<div><label>' + Main.langMgr.get("paylist_sbParamJson") + '</label><p>' + params[k].sbParamJson + '</p></div>'
                                + '<div><label>' + Main.langMgr.get("paylist_sbPushString") + '</label><p>' + params[k].sbPushString + '</p></div>'
                                + '</li>';
                        }
                    }
                }
                catch (e) {
                    console.log("[BlaCat]", '[ViewTransactionConfirm]', '[getParams]', 'error => ', e.toString())
                }
            }

            return html;
        }
        
    }
}