import amqplib from 'amqplib';
import { SettlementRepository } from '../api/repository/repository';

export class  EmitSettlement{

    private _settlement = process.env.RESPONSE || "settlement_file_request";
    private _url = process.env.URL || "amqp://admin:admin@localhost:15672//";

    createChannel() {
        return amqplib.connect(this._url).then((conn) => {
            return conn.createChannel();
            });
    }

    createQueue(){
        this.createChannel().then((ch) => {
            ch.assertQueue(this._settlement);
        });
    };

    sendToQueue(message : string){
        this.createChannel().then((ch) => {
            ch.assertQueue(this._settlement)
            ch.sendToQueue(this._settlement, Buffer.from(message));
        })
    }
}