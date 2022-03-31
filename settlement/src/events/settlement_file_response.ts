import { SettlementFile } from '../settlementResumeWriter/settlementFile';
import { SettlementRepository } from '../api/repository/repository';
import { RabbitMQConnection } from './rabbit_connection';

export class  ListeningSettlement{

    private _settlement = "settlement_file_response"
    private _settlementFile = new SettlementFile();
    private _repository : SettlementRepository;
    private _connection = new RabbitMQConnection().createChannel();

    constructor(repository : SettlementRepository) {
        this._repository = repository;
    }

    createQueue(){
        this._connection.then((ch) => {
            ch.assertQueue(this._settlement);
        });
    };

    listeningQueue(){
        this._connection.then((ch) => {
            ch.consume(this._settlement, async (msg) => {
                if(msg){
                    const settlementInfo = JSON.parse(msg.content.toString());
                    const sellers = await this._repository.getSellersBySettlement(settlementInfo.settlementId);
                    const sellersCount = sellers.length;
                    this._settlementFile.writeNewFile(sellers, settlementInfo.settlementDate);
                    this._repository.postSettlementResume(settlementInfo, sellersCount);
                }
                
            })
        })
    }
}