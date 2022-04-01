import { RabbitMQConnection } from './rabbit_connection';

export class TaxCalculationRequest {

    private _request = "tax_calculation_request";
    private _connection = new RabbitMQConnection().createChannel();

    createChannel(message : string) {
        this._connection.then((channel) => {
            channel.assertQueue(this._request);
            channel.sendToQueue(this._request, Buffer.from(message));
        })
    }
}
