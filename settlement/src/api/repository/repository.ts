import { TransactionModel } from '../../models/Transactions';
import { SettlementModel } from '../../models/Settlements';
import { SellerSettlementModel } from '../../models/SellerSettlements';
import { DummyTransactions } from '../dummy_transactions/generateDummyTransactions';
import { SettlementGenerator } from '../settlement_generator/settlement_generator';
import { QueueRequestConnection } from '../../events/tax_calculation_request';
import { QueueResponseConnection } from '../../events/tax_calculation_response';
import { EmitSettlement } from '../../events/settlement_file_request';
import { Request, Response } from 'express';
import http from 'http';

import { config } from 'dotenv';
import mongoose from 'mongoose'
config();

export class SettlementRepository {

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

    async getTransactionBySettlementDate(req : Request, res : Response){
        const DATE = process.env.SETTLEMENT_DATE || "2022-03-01";
        const tModel = this.transactionModel;
        const transactions =  await tModel.aggregate([{$match: { settlementDate: "2022-03-01" }},{ $group: {_id: "$sellerId",  amount: {$sum: "$amount"}}}]);
        console.log(transactions);
        res.sendStatus(200);
        return transactions;
    }

    async findSettlementByDate(){
        return await new SettlementModel().settlementModel().find({"settlementDate":"2022-03-01"});
    }

        // NAO ESTÁ POSTANDO O SELLER_ID MAIS
    async postSellerSettlement(req : Request, res : Response) {
        let groupedTransactions = await this.getTransactionBySettlementDate(req, res);
        let sellerSettlementModel = this.sellerSettlementModel;
        groupedTransactions.forEach((grouped) => {
            sellerSettlementModel.create({
                seller_id : grouped._id,
                settlementId : this.settlementId,
                amount : grouped.amount,
                taxValue : 0,
                bankCode : null,
                bankAccount: null
            });

            this.sendToQueue(JSON.stringify(grouped));
            console.log(JSON.stringify(grouped));

        });
    }

    async getSellerInformation(id : Number){

        let data = ''

        await http.get(`http://localhost:3000/v1/sellers/${id}`, (res) => {

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log(JSON.parse(data))
            });

            return data;

        }).on('error', (err) => {
            console.log(err);
        });
        
        return JSON.parse(data);
    }

    async getSellerSettlement(id : Number){
        return await this.sellerSettlementModel.findOne({seller_id : id});
    }

    async updateSellerSettlement(id : Number){
        if (await this.verifyRegisterTaxes()){

            const sellerInformation = await this.getSellerInformation(id);
            const sellerSettlementInformation = await this.getSellerSettlement(id);
            const getTaxes = this.getFromQueue(id);
            const settlementInformation = await this.findSettlementById(sellerSettlementInformation.settlementId);
            sellerSettlementInformation.taxValue = getTaxes.taxValue;
            sellerSettlementInformation.bankAccount = sellerInformation.bankAccount;
            sellerSettlementInformation.bankCode = sellerInformation.bankCode;
            this.sellerSettlementModel.updateOne({seller_id:id}, sellerSettlementInformation);
            const settlementMessage = {
                settlementId : settlementInformation.settlementId,
                settlementDate : settlementInformation.settlementDate
            };
            this.emitSettlement(JSON.stringify(settlementMessage));
        }
    }

    async findSettlementById(id : Number){
        return await this.settlementModel.findOne({settlementId:id});
    }

    async verifyRegisterTaxes() {
        const sellerWithoutTax = this.sellerSettlementModel.find({taxValue : 0});
        if (sellerWithoutTax == null) {
            return true;
        }
        else {
            return false;
        }
    }

    async getSellersBySettlement(settlementId : string){
        return await this.sellerSettlementModel.find({settlementId : settlementId});
    }

    async registerSettlement(settlementId : Number, data : object){
        this.settlementModel.updateOne({settlementId : settlementId}, {});
    }
}