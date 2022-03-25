import 'dotenv/config'

export class DummyTransactions {

    private _dummy_transactions = process.env.DUMMY_TRANSACTIONS || 10;
    private _dummy_sellers = process.env.DUMMY_SELLERS || 10;
    private totalTransactions = Number(this._dummy_sellers) * Number(this._dummy_transactions);

    dummyTransaction = {
        "transactionId": "c1e42054-c08f-4cb0-b893-1ebfdbad5719",
        "timeStamp": "2022-03-01 08:00",
        "sellerId": 1,
        "settlementDate": "2022-03-01",
        "amount": 2000
    }
}