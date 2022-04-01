import amqplib from 'amqplib';

export class RabbitMQConnection {

    private _url = "amqp://localhost:5672//";

    createChannel() {
        return amqplib.connect(this._url).then((conn) => {
            console.log("Connected to RabbitMQ.");
            return conn.createChannel();
        });
    }
}