
import { SettlementRepository } from '../api/repository/repository';
import { EmitSettlement } from './settlement_file_request'; 
import { RabbitMQConnection } from './rabbit_connection';

export class TaxCalculationResponse {

    private _response = "tax_calculation_response";
    private _repository : SettlementRepository;
    private _emitter = new EmitSettlement().sendToQueue;
    private _connection = new RabbitMQConnection().createChannel();
    
    constructor(repository : SettlementRepository) {
        this._repository = repository;
    }

    createQueue(){
        this._connection.then((ch) => {
            ch.assertQueue(this._response);
        });
    }

    consumeQueue(){
        this._connection.then((ch) => {
            ch.consume(this._response, (msg) => {
                console.log(msg);
                const message = JSON.stringify(msg?.content.toString());
                console.log(message);
                return message;
            })
        });
    }

   getTaxesById(id : Number){
        this._connection.then((ch) => {
            
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
