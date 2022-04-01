import { json } from "express";

export class messageConverter{
    private msg;
    private tax : number = 6;
    private seller_id : any;
    private amount : any;
    
    constructor(msg : any){
        this.msg = msg;
    }

    calculateTax() {
        return ((Number(this.msg.amount * 100)) * (600))/100;
    }

    returnMessageConverted(){
        return {
            "seller_id" : this.msg.seller_id,
            "amount" : this.msg.amount,
            "tax_value": this.calculateTax()
        };
    }
}