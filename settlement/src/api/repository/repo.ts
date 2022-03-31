
import { TransactionModel } from '../../models/Transactions';
import { SettlementModel } from '../../models/Settlements';
import { SellerSettlementModel } from '../../models/SellerSettlements';
import { DummyTransactions } from '../dummy_transactions/generateDummyTransactions';
import { SettlementGenerator } from '../settlement_generator/settlement_generator';
import { QueueRequestConnection } from '../../events/tax_calculation_request';
import { QueueResponseConnection } from '../../events/tax_calculation_response';
import { EmitSettlement } from '../../events/settlement_file_request';
import { Request, Response } from 'express';
import { config } from 'dotenv';
import mongoose from 'mongoose'
import axios from 'axios';
config();

export class SettlementRepo {

    private sellerSettlementModel  : mongoose.Model<any>;
    private transactionModel : mongoose.Model<any>;
    private settlementModel : mongoose.Model<any>;
    private sendToQueue = new QueueRequestConnection().createChannel;
    private getFromQueue = new QueueResponseConnection().getTaxesById;
    private emitSettlement = new EmitSettlement().sendToQueue;
    private dummyTransaction : DummyTransactions;
    private settlementId : any;
    
    constructor(){
        this.sellerSettlementModel = new SellerSettlementModel().sellerSettlementModel();
        this.transactionModel = new TransactionModel().transactionModel();
        this.settlementModel = new SettlementModel().settlementModel();
        this.dummyTransaction = new DummyTransactions();
    }

    async postDummyData(req : Request, res : Response) {
        const tModel = this.transactionModel;
        
        const data = this.dummyTransaction.generateDummyTransaction();
        
        for(let i = 0; i < data.length; i++){
            let model = new tModel(data[i]);
            await model.save();
        }

        res.sendStatus(200);
    }

    async postSettlement(req : Request, res : Response){
        const settlement = new SettlementGenerator().generateSettlement();
        const settlementModel = this.settlementModel.create(settlement);
        this.settlementId = settlement.settlementId;
        res.sendStatus(200);
        return settlement;
    }


}