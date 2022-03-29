import { json } from "express";

export class messageConverter{
    private msg : Buffer;
    private tax : number = 6;
    private seller_id : any;
    private amount : any;
    
    constructor(msg : Buffer){
        this.msg = msg;
        this.convertMessage();
    }

    convertMessage (){
        const decodedJsonObject = JSON.parse(Buffer.from(this.msg.toString(), 'base64').toString('ascii')); 
        if(decodedJsonObject.seller_id && decodedJsonObject.amount){
            this.seller_id = decodedJsonObject.seller_id;
            this.amount = decodedJsonObject.amount;
        }
    }

    calculateTax() {
        if(this.amount){
            return (this.amount * this.tax)/100;
        }
    }

    returnMessageConverted(){
        return {
            "seller_id" : this.seller_id,
            "amount" : this.amount,
            "tax_value": this.calculateTax()
        };
    }
}