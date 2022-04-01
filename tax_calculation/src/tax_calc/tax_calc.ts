import amqplib from 'amqplib';
import { ConversorJsonString } from '../utils/string_json_conversor';

export class Tax_Calc {

    private readonly _url : string; 
    private readonly _conversor = new ConversorJsonString();

    constructor(url: string) {
        this._url = url;
    }

    createChannel() {
        amqplib.connect(this._url).then((conn) => {
            conn.createConfirmChannel().then((ch) => {
                console.log('Connected to RabbitMQ.');

                ch.consume('tax_calculation_request', (msg) => {
                    console.log('aquiii')
                    let convertedMessage = msg!.content.toString();
                    const seller_id = this._conversor.returnKeyFromArray(this._conversor.convertStringArray(convertedMessage), 'seller_id');
                    const amount = this._conversor.returnKeyFromArray(this._conversor.convertStringArray(convertedMessage), 'amount');
                    const tax_value = ((Number.parseInt(amount)) * 6)/100;
                    const calculatedTax = {seller_id: seller_id,
                                           amount: amount,
                                           tax_value: tax_value};
                    ch.ack(msg!);
                    ch.sendToQueue('tax_calculation_response', Buffer.from(JSON.stringify(calculatedTax)));
                })
            })
            
        })

        
    }
}