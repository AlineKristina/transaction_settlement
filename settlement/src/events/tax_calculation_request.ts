import amqplib from 'amqplib';

export class QueueRequestConnection {

    private _url = process.env.URL || "amqp://admin:admin@localhost:15672//";
    private _request = process.env.RESPONSE || "tax_calculation_request";
    
    createChannel(message : string){
        amqplib.connect(this._url).then((connection) => {
            connection.createChannel().then((channel) => {
                channel.sendToQueue(this._request, Buffer.from(message));
            })
        })
    }
}
