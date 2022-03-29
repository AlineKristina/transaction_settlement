import { TransactionModel } from '../../models/Transactions';
import { SettlementModel } from '../../models/Settlements';
import { SellerSettlementModel } from '../../models/SellerSettlements';
import { DummyTransactions } from '../dummy_transactions/generateDummyTransactions';
import { SettlementGenerator } from '../settlement_generator/settlement_generator';
import {Request, Response} from 'express';
import {config} from 'dotenv';
import mongoose from 'mongoose';
config();

export class SettlementRepository {

    private transactionModel : TransactionModel;
    private dummyTransaction : DummyTransactions;
    private settlementId : any;

    constructor(){
        this.transactionModel = new TransactionModel();
        this.dummyTransaction = new DummyTransactions();
    }

    async postDummyData(req : Request, res : Response) {
        const tModel = this.transactionModel.transactionModel();
        
        const data = this.dummyTransaction.generateDummyTransaction();
        
        for(let i = 0; i < data.length; i++){
            let model = new tModel(data[i]);
            await model.save();
        }

        res.sendStatus(200);
    }

    async postSettlement(req : Request, res : Response){
        const settlement = new SettlementGenerator().generateSettlement();
        this.settlementId = settlement.settlementId;
        const sModel = new SettlementModel().settlementModel();
        const model = new sModel(settlement).save();
        res.sendStatus(200);
        return settlement;
    }

    async getTransactionBySettlementDate(req : Request, res : Response){
        const DATE = process.env.SETTLEMENT_DATE || "2022-03-01";
        const tModel = this.transactionModel.transactionModel();
        const transactions =  await tModel.aggregate([ {$match: { settlementDate: "2022-03-01" }},{ $group: { _id: "$sellerId", amount: {$sum: "$amount"}}}]);
        console.log(transactions);
        return transactions;
    }

    async findSettlement(){
        return await new SettlementModel().settlementModel().find({"settlementDate":"2022-03-01"});
    }

    async postSellerSettlement(req : Request, res : Response) {
        let transaction = await this.getTransactionBySettlementDate(req, res);
        const ssModel = new SellerSettlementModel().sellerSettlementModel();
        const socorro = 
        //Isso deve ficar bem demorado...
        transaction.forEach((transact) => {
            transact.settlementId = this.settlementId;
            transact.seller_id = transact._id
            transact._id = new mongoose.Types.ObjectId().toHexString();
            transact.taxValue = 0;
            transact.bankAccount = null;
            console.log(transact);
            new ssModel(transact).save();
        })       
        
        res.sendStatus(200);
    }
}