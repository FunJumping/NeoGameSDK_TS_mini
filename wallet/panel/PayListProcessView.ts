/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 正在交易视图
    export class PayListProcessView extends ViewBase {

        static lists;

        private listsDiv: HTMLElement

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_paylist")

            // header 
            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            // 返回按钮
            var returnA = this.objCreate("a")
            returnA.classList.add("iconfont", "icon-bc-fanhui")
            returnA.textContent = Main.langMgr.get("return")//"返回"
            returnA.onclick = () => {
                this.return()
            }
            this.ObjAppend(header, returnA)

            // h1标题
            var headerH1 = this.objCreate("h1")
            headerH1.textContent = Main.platName
            this.ObjAppend(header, headerH1)

            // 更多钱包记录
            var divListsMore = this.objCreate("div")
            divListsMore.classList.add("pc_paymore")
            divListsMore.textContent = Main.langMgr.get("pay_more") // "更多"
            divListsMore.onclick = () => {
                this.hidden()
                PayListMoreView.refer = "PayListProcessView"
                Main.viewMgr.change("PayListMoreView")
            }

            var iListsMore = this.objCreate("i")
            iListsMore.classList.add("iconfont", "icon-bc-sanjiaoxing")
            this.ObjAppend(divListsMore, iListsMore)

            this.ObjAppend(header, divListsMore)




            //钱包交易记录
            this.listsDiv = this.objCreate("ul")
            this.ObjAppend(this.div, this.listsDiv)

            this.updateLists()
        }

        toRefer() {
            if (PayListProcessView.refer) {
                Main.viewMgr.change(PayListProcessView.refer);
                PayListProcessView.refer = null;
            }
        }

        updateLists() {
            this.listsDiv.innerHTML = ""
            // 显示pending&优化刷新时间
            PayListProcessView.lists.forEach(
                list => {
                    // li
                    var listObj = this.objCreate("li")
                    listObj.onclick = () => {
                        this.hidden()
                        PayListDetailView.refer = "PayListProcessView"
                        PayListDetailView.list = list;
                        Main.viewMgr.change("PayListDetailView")
                    }

                    // img
                    var img_div = this.objCreate("div")
                    img_div.classList.add("pc_listimg")
                    var img = this.objCreate("img") as HTMLImageElement
                    img.src = Main.viewMgr.payView.getListImg(list)
                    this.ObjAppend(img_div, img)
                    this.ObjAppend(listObj, img_div)

                    // appname & date
                    var content_div = this.objCreate("div")
                    content_div.classList.add("pc_liftinfo")

                    var content_name_div = this.objCreate("div")
                    content_name_div.classList.add("pc_listname")
                    content_name_div.textContent = Main.viewMgr.payView.getListName(list)
                    this.ObjAppend(content_div, content_name_div)

                    //合约方法
                    var content_ctm_p = this.objCreate("p")
                    content_ctm_p.classList.add("pc_method")
                    content_ctm_p.textContent = Main.viewMgr.payView.getListParamMethods(list)
                    this.ObjAppend(content_div, content_ctm_p)

                    this.ObjAppend(listObj, content_div)

                    // cnts & state
                    var state_cnts_div = this.objCreate("div")
                    state_cnts_div.classList.add("pc_cnts")

                    // 时间
                    var content_ctm_span = this.objCreate("div")
                    content_ctm_span.classList.add("pc_listdate", "listCtm") // listCtm不要随便修改，后面刷新时间(flushListCtm)用到了这个class
                    content_ctm_span.textContent = Main.viewMgr.payView.getListCtmMsg(list)
                    content_ctm_span.setAttribute("ctm", list.ctm)
                    this.ObjAppend(state_cnts_div, content_ctm_span)

                    // 数量
                    var cnts = Main.viewMgr.payView.getListCnts(list)
                    if (cnts) {
                        this.ObjAppend(state_cnts_div, cnts);
                        var cnts_class = Main.viewMgr.payView.getListCntsClass(list);
                        if (cnts_class) state_cnts_div.classList.add(cnts_class)
                    }

                    // 状态
                    var state = Main.viewMgr.payView.getListState(list);
                    if (state) this.ObjAppend(state_cnts_div, state)
                    this.ObjAppend(listObj, state_cnts_div)

                    this.ObjAppend(this.listsDiv, listObj)
                }
            );
        }
    }
}