import amqplib from 'amqplib';
import { SettlementFile } from '../settlementResumeWriter/settlementFile';
import { SettlementRepository } from '../api/repository/repository';

export class  ListeningSettlement{

    private _url = process.env.URL || "amqp://admin:admin@localhost:15672//";
    private _settlement = process.env.RESPONSE || "settlement_file_request";
    private _settlementFile = new SettlementFile();
    private _repository = new SettlementRepository();
    
    createChannel() {
        return amqplib.connect(this._url).then((conn) => {
            return conn.createChannel();
        });
    }

    listeningQueue(){
        this.createChannel().then((ch) => {
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