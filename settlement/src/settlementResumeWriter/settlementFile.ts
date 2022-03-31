import fs from 'fs';

export class SettlementFile {

    async writeNewFile(data : string[], settlementDate : string){
        const fileName = settlementDate;
        data.map((seller) => {
            fs.appendFile(`../../../${fileName}`, this.dataFile(seller), (err) => {
                console.log(err);
            })
        })
    }

    dataFile(sellerInformation : any){
        return `${sellerInformation.seller_id}     ${sellerInformation.amount}     ${sellerInformation.taxValue}   ${sellerInformation.bankCode}   ${sellerInformation.bankAccount}
        `
    }
}
