import amqplib from 'amqplib';

export class  EmitSettlement{

    private _url = process.env.URL || "amqp://admin:admin@localhost:15672//";
    private _settlement = process.env.RESPONSE || "settlement_file_request";
    
    createChannel() {
        return amqplib.connect(this._url).then((conn) => {
            return conn.createChannel();
        });
    }

    sendToQueue(message : string){
        this.createChannel().then((ch) => {
            ch.assertQueue(this._settlement)
            ch.sendToQueue(this._settlement, Buffer.from(message));
        })
    }
}