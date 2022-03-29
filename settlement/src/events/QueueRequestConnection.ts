import amqplib from 'amqplib';

export class QueueRequestConnection {

    private _url = process.env.URL || "amqp://admin:admin@localhost:15672//";
    private _request = process.env.RESPONSE || "tax_calculation_request";
    
    createChannel() {
        return amqplib.connect(this._url).then((conn) => {
            return conn.createChannel();
        })
    }

    sendToQueue(message : string){
        this.createChannel().then((ch) => {
            ch.sendToQueue(this._request, Buffer.from(message));
        })
    }
}
