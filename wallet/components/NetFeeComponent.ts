/// <reference path="../main.ts" />

namespace BlackCat {
    export class NetFeeComponent {

        private chain: number
        private netFeeComponet

        constructor(parentDiv, callback) {
            this.chain = Main.netMgr.getCurrChain()
            console.log("[BlaCat]", "[NetFeeComponent]", "[constructor]", 'chain => ', this.chain)
            switch (this.chain) {
                case 2: // neo
                    this.netFeeComponet = new NetFeeComponentNeo(parentDiv, callback)
                    break
            }
        }

        // setNetFees(net_fees: any) {
        //     this.netFeeComponet.setNetFees(net_fees)
        // }

        setFeeDefault(net_fee = Main.user.info.service_charge) {
            this.netFeeComponet.setFeeDefault(net_fee)
        }
        setNetFeeShowRate(rate: number = 1) {
            this.netFeeComponet.setNetFeeShowRate(rate)
        }

        setGasLimitMin(value: number) {

        }

        createDiv() {
            this.netFeeComponet.createDiv()
        }


        hidden() {
            this.netFeeComponet.hidden()
        }

        show() {
            this.netFeeComponet.show()
        }
    }
}