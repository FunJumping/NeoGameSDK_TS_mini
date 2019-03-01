/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />

namespace BlackCat {
    // 个人中心
    export class PersonalCenterView extends ViewBase {


        private myNet_nodes: HTMLElement;
        private myNet_clis: HTMLElement

        private divHeight_nodes: HTMLElement
        private divHeight_clis: HTMLElement;

        create() {
            this.div = this.objCreate("div") as HTMLDivElement
            this.div.classList.add("pc_bj", "pc_myinfo")

            var header = this.objCreate("div")
            header.classList.add("pc_header")
            this.ObjAppend(this.div, header)

            var returnA = this.objCreate("a")
            returnA.classList.add("iconfont", "icon-bc-fanhui")
            returnA.textContent = Main.langMgr.get("return") // 返回
            returnA.onclick = () => {
                this.return()
            }
            this.ObjAppend(header, returnA)

            var headerH1 = this.objCreate("h1")
            headerH1.textContent = Main.langMgr.get("personalcenter") // "个人中心"
            this.ObjAppend(header, headerH1)

            var myinfo = this.objCreate("div")
            myinfo.classList.add("pc_myinfolist")

            var ulMyinfo = this.objCreate("ul")
            this.ObjAppend(myinfo, ulMyinfo)


            //网络线路
            var liMyinfoNet = this.objCreate("li")
            liMyinfoNet.textContent = Main.langMgr.get("modifyNet")
            liMyinfoNet.onclick = () => {
                this.hidden()
                ModifyNetworkLineView.refer = "PersonalCenterView"
                ModifyNetworkLineView.defaultType = "nodes"
                Main.viewMgr.change("ModifyNetworkLineView")
            }
            this.ObjAppend(ulMyinfo, liMyinfoNet)

            //网络线路标签
            var iMyinfoNet = this.objCreate("i")
            iMyinfoNet.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(liMyinfoNet, iMyinfoNet)

            // 网络线路内容
            var spanNet_nodes = this.objCreate("span")
            this.ObjAppend(liMyinfoNet, spanNet_nodes)
            spanNet_nodes.classList.add("pc_spannet")

            this.myNet_nodes = this.objCreate("div")
            this.myNet_nodes.textContent = "API" // "中国—上海" //this.getArea()
            this.ObjAppend(spanNet_nodes, this.myNet_nodes)

            //网络线路高度
            this.divHeight_nodes = this.objCreate("div")
            this.divHeight_nodes.classList.add("iconfont", "icon-bc-blalian")
            this.divHeight_nodes.textContent = "n/a"
            this.ObjAppend(spanNet_nodes, this.divHeight_nodes)


            var spanNet_clis = this.objCreate("span")
            this.ObjAppend(liMyinfoNet, spanNet_clis)
            spanNet_clis.classList.add("pc_spannet", "pc_spannet_clis")

            this.myNet_clis = this.objCreate("div")
            this.myNet_clis.textContent = "CLI" // "中国—上海" //this.getArea()
            this.ObjAppend(spanNet_clis, this.myNet_clis)

            this.divHeight_clis = this.objCreate("div")
            this.divHeight_clis.classList.add("iconfont", "icon-bc-neolian")
            this.divHeight_clis.textContent = "n/a"
            this.ObjAppend(spanNet_clis, this.divHeight_clis)


            // 安全中心
            var liMyinfoTrust = this.objCreate("li")
            liMyinfoTrust.textContent = Main.langMgr.get("myinfo_security")
            liMyinfoTrust.onclick = () => {
                this.hidden()
                SecurityCenterView.refer = "PersonalCenterView"
                Main.viewMgr.change("SecurityCenterView")
            }
            this.ObjAppend(ulMyinfo, liMyinfoTrust)

            // 安全中心图标
            var iMyinfoTrust = this.objCreate("i")
            iMyinfoTrust.classList.add("iconfont", "icon-bc-gengduo")
            this.ObjAppend(liMyinfoTrust, iMyinfoTrust)

            // 安全中心设置
            var spanMyinfoTrust = this.objCreate("span")
            spanMyinfoTrust.textContent = Main.langMgr.get("myinfo_set")
            this.ObjAppend(liMyinfoTrust, spanMyinfoTrust)

            //退出账号
            var logout = this.objCreate("button")
            logout.textContent = Main.langMgr.get("myinfo_logout") //"退出账号"
            logout.onclick = () => {
                this.doLogout()
            }
            this.ObjAppend(myinfo, logout)

            this.ObjAppend(this.div, myinfo)


            // this.getNodeName("nodes")
            this.getNodeHeight("nodes")

            // this.getNodeName("clis")
            this.getNodeHeight("clis")

        }

        toRefer() {
            if (PersonalCenterView.refer) {
                Main.viewMgr.change(PersonalCenterView.refer)
                PersonalCenterView.refer = null;
            }
        }


        private doLogout() {

            ViewConfirm.callback = () => {
                this.makeLogout()
            }
            Main.showConFirm("myinfo_logoutConfirm")
        }


        private async makeLogout() {
            Main.user.logout()
            Main.viewMgr.removeAll();
            Main.viewMgr.change("WalletView")
            Main.logoutCallback()
        }


        private async getNodeHeight(type: string) {
            let height = Main.viewMgr.payView["height_" + type].toString()
            if (height > 0) {
                this["divHeight_" + type].textContent = height == 0 ? "n/a" : height
            }
        }

        updateNodeInfo() {
            // this.getNodeName(type)
            this.getNodeHeight("nodes")
            if (Main.netMgr.getWWW().api_clis && Main.netMgr.getWWW().api_clis != "") {
                this.getNodeHeight("clis")
            }
        }

    }
}