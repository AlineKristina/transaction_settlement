import amqplib from 'amqplib';

export class QueueResponseConnection {

    private _url = process.env.URL || "amqp://admin:admin@localhost:15672//";
    private _response = process.env.RESPONSE || "tax_calculation_response";
    
    createChannel() {
        return amqplib.connect(this._url).then((conn) => {
            return conn.createChannel()
        })
    }

    consumeQueue(){
        this.createChannel().then((ch) => {
            ch.consume(this._response, (msg) => {
                console.log(msg);
                const message = JSON.stringify(msg?.content.toString());
                console.log(message);
                return message;
            })
        });
    }

   getTaxesById(id : Number){
        this.createChannel().then((ch) => {
            
            ch.consume(this._response, (msg) => {
                console.log(msg);
                if(msg){
                    const message = JSON.parse(msg.content.toString());
                    console.log(message);
                    if(message.seller_id == id){
                        ch.ack(msg);
                        return message;
                    }
                }
            })
        });
        return {taxValue:undefined};
    }
}
