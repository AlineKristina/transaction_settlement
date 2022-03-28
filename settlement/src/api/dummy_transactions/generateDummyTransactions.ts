import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

config();

export class DummyTransactions {

    private _dummy_transactions = process.env.DUMMY_TRANSACTIONS || 10;
    private _dummy_sellers = process.env.DUMMY_SELLERS || 10;
    private totalTransactions = Number(this._dummy_sellers) * Number(this._dummy_transactions);

    private dummyTransaction(init : number) {
        return {
        "transactionId": uuidv4(),
        "timeStamp": Date.now(),
        "sellerId": init,
        "settlementDate": "2022-03-01",
        "amount": 2000}
    }

    generateDummyTransaction() {
        const dummyArr = [];
        for (let i = 1; i <= this._dummy_sellers; i++){
            for (let j = 0; j < this._dummy_transactions;  j++){
                dummyArr.push(this.dummyTransaction(i));
            }
        }
        return dummyArr;
    }
    
}