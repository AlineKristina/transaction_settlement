
import { SettlementRepository } from '../api/repository/repository';
import { RabbitMQConnection } from './rabbit_connection';
import { ConversorJsonString } from '../utils/string_json_conversor';

export class TaxCalculationResponse {

    private _response = "tax_calculation_response";
    private _repository : SettlementRepository;
    private _connection = new RabbitMQConnection().createChannel();
    private _conversor = new ConversorJsonString();
    
    constructor(repository : SettlementRepository) {
        this._repository = repository;
    }

   consumeQueue(){
        this._connection.then((ch) => {
            
            ch.consume(this._response, async (msg) => {
                let settlementId;
                if(msg){
                    const message = await msg;
                    const messageString = await msg.content.toString();
                    const messageJSON = await JSON.parse(messageString)
                    const sellerInformation = await (await this._repository.getSellerInformation(messageJSON.seller_id)).data;
                    let sellerSettlement = await this._repository.getSellerSettlement(messageJSON.seller_id);
                    settlementId = sellerSettlement.settlementId;
                    sellerSettlement.taxValue = messageJSON.taxValue;
                    sellerSettlement.bankAccount = sellerInformation.bankAccount;
                    sellerSettlement.bankCode = sellerInformation.bankCode;

                    await this._repository.postFinalizedSellerSettlement(messageJSON.seller_id, sellerSettlement);


                    if(await this._repository.verifyRegisterTaxes()){
                        const info = {
                            settlementId: settlementId,
                            settlementDate: Date.now()
                        }
                        ch.ack(msg);
                        ch.sendToQueue('settlement_file_request', Buffer.from(JSON.stringify(info)));
                    }
                }
            })
        });
    }
}
