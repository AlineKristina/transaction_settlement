import amqplib from 'amqplib';

export class Subscriber {
    private _url : string;
    
    constructor(url: string) {
        this._url = url;
    }

    createChannel() {
        return amqplib.connect(this._url).then((conn) => {
            console.log("Connected to RabbitMQ.")
            return conn.createChannel();
        })
    }

    consumeQueue(queue : string){
        this.createChannel().then(async (ch) => {
            await ch.consume(queue, (msg) => {
                if (msg){
                    console.log(msg.content.toString());
                    ch.ack(msg);
                }
            });
        })
    }
}