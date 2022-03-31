import amqplib from 'amqplib';
import { SettlementRepository } from '../api/repository/repository';
import { EmitSettlement } from './settlement_file_request'; 

export class TaxCalculationResponse {

    private _url = process.env.URL || "amqp://admin:admin@localhost:15672//";
    private _response = process.env.RESPONSE || "tax_calculation_response";
    private _repository = new SettlementRepository();
    private _emitter = new EmitSettlement().sendToQueue;
    
    createChannel() {
        return amqplib.connect(this._url).then((conn) => {
            return conn.createChannel()
        })
    }

    consumeQueue(){
        this.createChannel().then((ch) => {
            ch.consume(this._response, (msg) => {
                console.log(msg);
                const message = JSON.stringify(msg?.content.toString());
                console.log(message);
                return message;
            })
        });
    }

   getTaxesById(id : Number){
        this.createChannel().then((ch) => {
            
            ch.consume(this._response, async (msg) => {
                console.log(msg);
                if(msg){
                    const message = JSON.parse(msg.content.toString());
                    const seller = await this._repository.getSellerInformation(message.seller_id);
                    let seller_settlement = await this._repository.getSellerSettlement(message.seller_id);
                    seller_settlement.taxValue = message.taxValue;
                    seller_settlement.bankAccount = seller.data.bankAccount;
                    seller_settlement.bankCode = seller.data.bankCode;
                    if(message.seller_id == id){
                        ch.ack(msg);
                        return message;
                    }
                    if(await this._repository.verifyRegisterTaxes()){
                        let settlementEmitter =   {settlementId : seller_settlement.settlementId,
                                                   settlementDate: Date.now()}
                        this._emitter(JSON.stringify(settlementEmitter));
                    };
                }
            })
        });
        return {taxValue:undefined};
    }
}
