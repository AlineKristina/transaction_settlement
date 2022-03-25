import amqplib from 'amqplib';
import { messageConverter } from '../model/messageConverter';

export class Tax_Calc {

    private readonly _url : string; 

    constructor(url: string) {
        this._url = url;
    }

    createChannel() {
        return amqplib.connect(this._url).then((conn) => {
            return conn.createChannel();
        })
    }

    createQueue(queueName : string){
        this.createChannel().then(async (ch) => {
            await ch.assertQueue(queueName);
        })
    }

    sendToQueue(queue : string, message : string) {
        this.createChannel().then((ch) => {
            ch.sendToQueue(queue, Buffer.from(message));
        });
    }

    consumeQueue(receivingFrom : string, sendingTo : string){
        this.createChannel().then(async (ch) => {
            await ch.consume(receivingFrom, (msg) => {
                if(msg) {
                    // Message received and calculating the tax, the result is the message that will
                    // be send to the response queue
                    let msgConverted = new messageConverter(msg.content).returnMessageConverted();
                    ch.ack(msg);
                    console.log(`Message received ${msg.content}`);
                    this.sendToQueue(sendingTo, JSON.stringify(msgConverted));
                }
                else {
                    return null;
                }
            });
        })
    }
}