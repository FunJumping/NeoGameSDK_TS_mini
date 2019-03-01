namespace BlackCat {

    export class UserInfo {

        wallet: string = '';
        service_charge: string = "";
    }

    export class TransInfo {
        assetid: string = "";
        targetaddr: string = "";
        amount: string = "";
    }

    export class RawTransInfo {
        sbParamJson: any[];
        sbPushString: string;
        nnc: string;
    }

    export class RefundTransInfo {
        count: number;
    }

    export class MintTokenTransInfo {
        count: number;
        extString: string;
    }

    export class getMintTokenTransInfo {
        txid: string;
    }

    export class invokescriptInfo {
        sbParamJson: any[];
        sbPushString: string;
        nnc: string;
        extString: string;
    }

    export class walletLists {
        id: string = "";
        g_id: string = "";
        state_gameplay: string = "";
        state_gameplay_detail: string = "";
        vdata: string = "";
        nnc: string = "";
        icon: string = "";
        name: string = "";
        ext: string = "";

        ctm: string = "";
        type: string = "";
        type_detail: string = "";
        state: string = "";
        txid: string = "";
        wallet: string = "";
        cnts: string = "0";
        params: string = "";
        client_notify: string = "";
        net_fee: string = ""
        blockindex: string = ""
    }

    export class contact {
        id: string = "";
        ctm: string = "";
        uid: string = "";
        address_name: string = "";
        address_wallet: string = "";
        address_desc: string = "";
    }
}