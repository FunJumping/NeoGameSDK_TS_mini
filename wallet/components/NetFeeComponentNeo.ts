/// <reference path="../main.ts" />
/// <reference path="./ComponentBase.ts" />

namespace BlackCat {
    export class NetFeeComponentNeo extends ComponentBase {

        private parentDiv: HTMLElement // 父节点

        private mainDiv: HTMLElement   // 主div

        private inputcharge: HTMLInputElement // 收费
        private divSpeedtips: HTMLElement  //手续费提示
        private divSpeedLength: HTMLElement //手续费长度

        private net_fee: string; // 网络手续费
        private net_fees: Array<string>; // 网络手续费类型

        private net_fee_show_rate: number; // 手续费显示倍率，一般用在多步骤操作时，默认1

        private callback: Function; // 手续费变化回调

        constructor(parentDiv, callback) {
            console.log("[BlaCat]", "[NetFeeComponentNeo]", "[constructor]", 'start ...')
            super()
            this.parentDiv = parentDiv
            this.callback = callback

            this.net_fees = ["0","0.001", "0.002", "0.004", "0.006", "0.008", "0.01", "0.1", "1"]
            this.net_fee = "0"
            this.net_fee_show_rate = 1;
        }

        setFeeDefault() {
            let net_fee = Main.user.info.service_charge
            try {
                let service_charge = JSON.parse(net_fee)
                if (service_charge.hasOwnProperty("2")) {
                    net_fee = service_charge["2"].toString()
                }
            }
            catch (e) {
                // console.log("[BlaCat]", "[NetFeeComponentNeo]", "[setFeeDefault]", 'error => ', e)
                net_fee = null
            }

            if (net_fee == "0") {
                this.net_fee = "0"
            }
            else {
                this.net_fee = this.net_fees[0]

                if (net_fee) {
                    for (let i = 0; i < this.net_fees.length; i++) {
                        if (this.net_fees[i] == net_fee) {
                            this.net_fee = net_fee
                            break;
                        }
                    }
                }
            }
        }

        setNetFeeShowRate(rate: number = 1) {
            if (rate != this.net_fee_show_rate) {
                this.net_fee_show_rate = rate
                this.showNetFee()
            }
        }

        createDiv() {
            //交易速度
            this.mainDiv = this.objCreate("div") as HTMLElement;
            this.mainDiv.classList.add("pc_speed")
            this.ObjAppend(this.parentDiv, this.mainDiv)

            var divChargeLength = this.objCreate("div")
            divChargeLength.classList.add("pc_chargelength")
            divChargeLength.innerHTML = Main.langMgr.get("pay_exchange_refund_range_tips")
            this.ObjAppend(this.mainDiv, divChargeLength)

            // 交易长度
            this.divSpeedLength = this.objCreate("div")
            this.divSpeedLength.classList.add("pc_speedlength")
            this.ObjAppend(divChargeLength, this.divSpeedLength)

            // 收费选择
            this.inputcharge = this.objCreate("input") as HTMLInputElement
            this.inputcharge.type = "range"
            this.inputcharge.value = '0'
            this.inputcharge.max = (this.net_fees.length - 1).toString()
            this.inputcharge.oninput = () => {
                this.dospeed()
            }
            this.inputcharge.onclick = () => {
                this.dospeed()
            }
            this.ObjAppend(divChargeLength, this.inputcharge)
            
            //手续费提示
            this.divSpeedtips = this.objCreate("p")
            this.divSpeedtips.classList.add("pc_speedtips")  
            this.ObjAppend(this.mainDiv, this.divSpeedtips)

            if (this.net_fee == "0") {
                this.dofree()
            }
            else {
                this.dospeed(this.net_fee)
            }
        }

        hidden() {
            this.mainDiv.style.display = "none"
            this.callback(0)
        }

        show() {
            this.mainDiv.style.display = "block"
            this.callback(this.net_fee)
        }

        private getNetFeesIdx(net_fee) {
            let idx = undefined
            for (let i = 0; i < this.net_fees.length; i++) {
                if (this.net_fees[i] == net_fee) {
                    return i;
                }
            }
            return idx
        }

        private dofree() {

            this.net_fee = "0"
            this.inputcharge.classList.remove("pc_active")

            this.showNetFee()

            this.callback(this.net_fee)
        }
        private dospeed(net_fee = undefined) {

            if (net_fee != undefined) {
                let idx = this.getNetFeesIdx(net_fee)
                if (idx != undefined) {
                    this.inputcharge.value = idx
                }
            }
            else {
                var idx = parseInt(this.inputcharge.value);
                if (this.net_fees[idx]) {
                    this.net_fee = this.net_fees[idx]
                }
                else {
                    this.net_fee = this.net_fees[0]
                }
            }

            this.inputcharge.classList.add("pc_active")

            this.showNetFee()

            this.callback(this.net_fee)
        }

        private showNetFee() {
            let showNetFee = floatNum.times( Number(this.net_fee), this.net_fee_show_rate).toString()
            let chargelength = floatNum.times(floatNum.divide(this.mainDiv.clientWidth,this.net_fees.length-1),this.getNetFeesIdx(this.net_fee))
            this.divSpeedLength.style.width = chargelength+"px"
            this.divSpeedtips.innerHTML = Main.langMgr.get("pay_exchange_refund_fee_tips",{NetFee:showNetFee})
        }
    }
}