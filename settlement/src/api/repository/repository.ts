import { TransactionModel } from '../../models/Transactions';
import { SettlementModel } from '../../models/Settlements';
import { SellerSettlementModel } from '../../models/SellerSettlements';
import { DummyTransactions } from '../dummy_transactions/generateDummyTransactions';
import { SettlementGenerator } from '../settlement_generator/settlement_generator';
import { QueueRequestConnection } from '../../events/tax_calculation_request';
import { QueueResponseConnection } from '../../events/tax_calculation_response';
import { EmitSettlement } from '../../events/settlement_file_request';
import { request, Request, Response } from 'express';

import { config } from 'dotenv';
import mongoose from 'mongoose'
import axios from 'axios';
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

    //DOIS METODOS UNIDOS 
    private async getTransactionBySettlementDate(req : Request, res : Response){
        const DATE = process.env.SETTLEMENT_DATE || "2022-03-01";
        const transactionModel = this.transactionModel;
        const transactions =  await transactionModel.aggregate([{$match: { settlementDate: "2022-03-01" }},{ $group: {_id: "$sellerId",  amount: {$sum: "$amount"}}}]);
        res.sendStatus(200);
        return transactions;
    }
    async postSellerSettlement(req : Request, res : Response) {
        let groupedTransactions = await this.getTransactionBySettlementDate(req, res);
        let settlementId = groupedTransactions[0].settlementId;
        let sellerSettlementModel = this.sellerSettlementModel;
        groupedTransactions.forEach(async (grouped) => {
            await sellerSettlementModel.create({
                seller_id : grouped._id,
                settlementId : this.settlementId,
                amount : grouped.amount,
                taxValue : 0,
                bankCode : null,
                bankAccount: null
            });
            await this.sendToQueue(JSON.stringify(grouped));
            console.log(JSON.stringify(grouped));
        });
        return settlementId;
    }
    // FIM DA UNIAO

    async getSellerInformation(id : Number){
        await axios.all([
            axios.get(`http://localhost:3000/v1/sellers/${id}`).then((res) => {
                let data = res.data;
            })
        ])
    }

    async getSellerSettlement(id : Number){
        return await this.sellerSettlementModel.findOne({seller_id : id});
    }

    async findSettlement(param : any){
        return await new SettlementModel().settlementModel().find({"settlementDate":"2022-03-01"});
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










    // Inicia com um post, que chama o método, P2: INICIA A LIQUIDAÇÃO
    async methodPart2(req : Request, res : Response){
        return await this.postSellerSettlement(req, res); // Agrupou e gravou no banco, ao fim de cada operação enviava um trigger pra queu
        //Retorna settlementId <3
    }

    //P3: RECEBE O IMPOSTO, inicia com o trigger na fila do tax_calculation, o app fica ouvindo
    //Tax_ calculator manda a msg pra queue, tax_calculator ouve, calcula o impost e devolve
    // Faz uma chamada em seller_information para obter o seller
    async methodPart3(req : Request, res : Response){
        const settlementId = this.methodPart2(req, res); //Do i need this?
        //Ouvindo aqui
        const seller_id = 0;
        const seller = this.getSellerInformation(seller_id); //Retorna o seller
        // Chamar sellerSettlement para atualizar o imposto e os dados bancários
        let sellerSetllement = this.getSellerSettlement(seller_id) //Retorna o sellerSettlement
        //Verifica o imposto
        if(await this.verifyRegisterTaxes()){
            sellerSetllement.taxValue = listener.taxValue;
            sellerSettlement['bankCode', 'bankAccount'] = seller['bankCode', 'bankAccount'];
            //trigga o evento no fim, avisando que o calculo de imposto foi finalizado
        };

        //Criar o objeto durante a gravação.

    }

    //P4: Montar arquivo de liquidação - Escuta settlement_file_request
    async methodPart4(){
        //Método ouve o evento informando que o calculo das taxes foi finalizado, então chama o método
        // de gravação em arquivo   
    }




}