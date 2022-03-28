import mongoose from 'mongoose';
import { TransactionModel } from '../../models/Transactions';
import { SettlementModel } from '../../models/Settlements'
import { MongooseConnection } from '../../db/Connection';
import { DummyTransactions } from '../dummy_transactions/generateDummyTransactions';
import { SettlementGenerator } from '../settlement_generator/settlement_generator';
import {config} from 'dotenv';
config();

export class SettlementRepository {
    private _mongooseConnection : MongooseConnection
    private transactionModel : TransactionModel;
    private dummyTransaction : DummyTransactions;


    constructor(mongooseConnection : MongooseConnection){
        this._mongooseConnection = mongooseConnection;
        this.transactionModel = new TransactionModel(this._mongooseConnection);
        this.dummyTransaction = new DummyTransactions();
    }

    async postDummyData(req, res) {
        const tModel = this.transactionModel.transactionModel();
        
        const data = this.dummyTransaction.generateDummyTransaction();
        
        for(let i = 0; i < data.length; i++){
            let model = new tModel(data[i]);
            await model.save();
        }
    }

    async postSettlement(req, res){
        const data = new SettlementGenerator().generateSettlement();
        const sModel = new SettlementModel(this._mongooseConnection).settlementModel();
        const model = new sModel(data).save();
    }

    async getSettlementByDate(){
        const DATE = process.env.SETTLEMENT_DATE;
        const sModel = new SettlementModel(this._mongooseConnection).settlementModel();
        return sModel.find({$match: {"settlementDate": "2022-03-01"}, $group: {_id : "$seller_id", amount: {$sum: "$amount"}}});
    }
}