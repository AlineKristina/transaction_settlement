import amqplib from 'amqplib';

export class Publisher {

    private _url : string;

    constructor(url: string) {
        this._url = url;
    }

    createChannel() {
        return amqplib.connect(this._url).then((conn) => {
            return conn.createChannel();
        })
    }

    sendToQueue(queue : string, message : string) {
        this.createChannel().then((ch) => {
            ch.sendToQueue(queue, Buffer.from(message));
        });
    }

    createQueue(queueName : string){
        this.createChannel().then((ch) => {
            return ch.assertQueue(queueName);
        })
    }

}