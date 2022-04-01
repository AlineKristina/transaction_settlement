import { SettlementFile } from '../settlementResumeWriter/settlementFile';
import { SettlementRepository } from '../api/repository/repository';
import { RabbitMQConnection } from './rabbit_connection';
import { ConversorJsonString } from '../utils/string_json_conversor';

export class  ListeningSettlement{

    private _settlement = "settlement_file_response"
    private _settlementFile = new SettlementFile();
    private _repository : SettlementRepository;
    private _connection = new RabbitMQConnection().createChannel();
    private _conversor = new ConversorJsonString();

    constructor(repository : SettlementRepository) {
        this._repository = repository;
    }

    listeningQueue(){
        this._connection.then((ch) => {
            ch.assertQueue(this._settlement);
            ch.consume(this._settlement, async (msg) => {
                if(msg){
                    const settlementInfoString = msg.content.toString();
                    ch.ack(msg);
                    const settlementId = this._conversor.returnKeyFromArray(this._conversor.convertStringArray(settlementInfoString), 'settlementId');
                    const settlementDate = this._conversor.returnKeyFromArray(this._conversor.convertStringArray(settlementInfoString), 'settlementDate');
                    const sellers = await this._repository.getSellersBySettlement(settlementId);
                    const sellersCount = sellers.length;
                    this._settlementFile.writeNewFile(sellers, settlementDate);
                    this._repository.postSettlementResume(settlementInfoString, sellersCount);
                }
            })
        })
    }
}