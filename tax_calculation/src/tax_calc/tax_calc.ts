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
                    const seller_id = this._conversor.returnKeyFromArraySeller_Id(this._conversor.convertStringArray(convertedMessage));
                    const amount = this._conversor.returnKeyFromArrayAmount(this._conversor.convertStringArray(convertedMessage));
                    console.log("seller: " + seller_id + " amount: " + amount);
                    //const tax_value = ((Number.parseInt(amount)) * 6)/100;
                    const calculatedTax = {seller_id: seller_id,
                                           amount: amount,
                                           tax_value: 0};
                    ch.ack(msg!);
                    ch.sendToQueue('tax_calculation_response', Buffer.from(JSON.stringify(calculatedTax)));
                })
            })
            
        })

        
    }
}