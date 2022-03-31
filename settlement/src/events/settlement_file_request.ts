import { RabbitMQConnection } from './rabbit_connection';

export class  EmitSettlement{

    private _settlement = "settlement_file_request";
    private _connection = new RabbitMQConnection().createChannel();

    createQueue(){
        this._connection.then((ch) => {
            ch.assertQueue(this._settlement);
        });
    };

    sendToQueue(message : string){
        this._connection.then((ch) => {
            ch.assertQueue(this._settlement)
            ch.sendToQueue(this._settlement, Buffer.from(message));
        })
    }
}