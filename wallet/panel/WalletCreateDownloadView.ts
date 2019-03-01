/// <reference path="../main.ts" />
/// <reference path="./ViewBase.ts" />
/// <reference path="../tools/neo-ts.d.ts"/>

namespace BlackCat {
    // 创建钱包视图
    export class WalletCreateDownloadView extends ViewBase {

        static filestr: string
        static filepass: string
        static addr: string

        private walletExport: HTMLElement;

        create() {

            this.div = this.objCreate('div') as HTMLDivElement
            this.div.classList.add("pc_popup")
            //弹窗的框
            var popupbox = this.objCreate('div')
            popupbox.classList.add("pc_popupbox")
            this.ObjAppend(this.div, popupbox)

            // 弹窗的标题
            var popupTitle = this.objCreate('div')
            popupTitle.classList.add("pc_popup_title")
            popupTitle.innerText = Main.langMgr.get("walletCreate_download") // "创建钱包"
            this.ObjAppend(popupbox, popupTitle)

            var walletExportDiv = this.objCreate("div")
            walletExportDiv.classList.add("pc_walletdownload")
            this.ObjAppend(popupbox, walletExportDiv)
            this.walletExport = this.objCreate("a")
            this.walletExport.textContent = Main.langMgr.get("walletCreate_doDownload") //"导出钱包"
            this.walletExport.setAttribute("download", WalletCreateDownloadView.addr + ".json")
            this.ObjAppend(walletExportDiv, this.walletExport)
            this.exportWallet();

            var iWalletExport = this.objCreate("i")
            iWalletExport.classList.add("iconfont", "icon-bc-daochuqianbao")
            this.ObjAppend(this.walletExport, iWalletExport)


        }

        key_esc() {
            
        }

        private async exportWallet() {
            if (WalletCreateDownloadView.filestr) {
                var blob = new Blob([ThinNeo.Helper.String2Bytes(WalletCreateDownloadView.filepass)]);
                var url = URL.createObjectURL(blob);
                this.walletExport.setAttribute('href', url)
                this.walletExport.onclick = () => {
                    this.doDownload()
                }
            }
        }

        private async doDownload() {
            
            Main.viewMgr.change("ViewLoading")
            
            // 打开钱包
            await Main.wallet.setWalletStr(WalletCreateDownloadView.filestr)
            await Main.wallet.open(WalletCreateDownloadView.filepass)

            WalletCreateDownloadView.filestr = null
            WalletCreateDownloadView.filepass = null
            WalletCreateDownloadView.addr = null

            Main.viewMgr.viewLoading.remove()

            Main.validateLogin();
            this.remove();
            Main.viewMgr.walletView.remove();
        }

    }
}