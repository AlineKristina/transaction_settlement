
import { SettlementRepository } from '../api/repository/repository';
import { EmitSettlement } from './settlement_file_request'; 
import { RabbitMQConnection } from './rabbit_connection';
import { ConversorJsonString } from '../utils/string_json_conversor';

export class TaxCalculationResponse {

    private _response = "tax_calculation_response";
    private _repository : SettlementRepository;
    private _emitter = new EmitSettlement().sendToQueue;
    private _connection = new RabbitMQConnection().createChannel();
    private _conversor = new ConversorJsonString();
    
    constructor(repository : SettlementRepository) {
        this._repository = repository;
    }

    consumeQueue(){
        this._connection.then((ch) => {
            ch.assertQueue(this._response);
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
                    const messageString = msg.content.toString();
                    const seller_id = Number.parseInt(this._conversor.returnKeyFromArray(this._conversor.convertStringArray(messageString), 'seller_id'));
                    const seller = await this._repository.getSellerInformation(seller_id);
                    const taxValue = Number.parseInt(this._conversor.returnKeyFromArray(this._conversor.convertStringArray(messageString), 'taxValue'));
                    let seller_settlement = await this._repository.getSellerSettlement(seller_id);
                    seller_settlement.taxValue = taxValue;
                    seller_settlement.bankAccount = seller.data.bankAccount;
                    seller_settlement.bankCode = seller.data.bankCode;
                    if(seller_id == id){
                        ch.ack(msg);
                        console.log(messageString);
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
