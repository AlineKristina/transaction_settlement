import { SettlementFile } from '../settlementResumeWriter/settlementFile';
import { SettlementRepository } from '../api/repository/repository';
import { RabbitMQConnection } from './rabbit_connection';
import { ConversorJsonString } from '../utils/string_json_conversor';

export class  ListeningSettlement{

    private _settlement = "settlement_file_request"
    private _settlementFile = new SettlementFile();
    private _repository : SettlementRepository;
    private _connection = new RabbitMQConnection().createChannel();
    private _conversor = new ConversorJsonString();

    constructor(repository : SettlementRepository) {
        this._repository = repository;
    }

    listeningQueue(){
        this._connection.then((ch) => {
            ch.consume(this._settlement, async (msg) => {
                if(msg){
                    const settlementInfoString = await msg.content.toString();
                    console.log(settlementInfoString);
                    const settlementInfo = await JSON.parse(settlementInfoString)
                    const settlementId = settlementInfo.settlementId;
                    const settlementDate = settlementInfo.settlementDate;
                    const sellers = await this._repository.getSellersBySettlement(settlementId);
                    const sellersCount = sellers.length;
                    console.log("chegou aqui?");
                    await this._settlementFile.writeNewFile(sellers, settlementDate);
                    await this._repository.postSettlementResume(settlementInfoString, sellersCount);
                    ch.ack(msg);
                }
            })
        })
    }
}