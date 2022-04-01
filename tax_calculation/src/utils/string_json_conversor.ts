import { json } from "express";

export class ConversorJsonString{
    convertStringArray(jsonString : string){
        return jsonString.split(',').map((value) => {
            return value.split(':').map((value) => {
                if(value.endsWith("}")){
                    return value.substring(0, value.length-1).trim();
                }
                else if(value.startsWith('{')){
                    return value.substring(1).trim();
                }
                else {
                    return value;
                }
                //Retorno: [ [ 'seller_information', ' 1' ], [ 'amount ', '2000' ] ]
            })
        });
    }

    returnKeyFromArray(jsonArray : string[][], key : string){
        return jsonArray.find((value) => value[0] == key)![1]
    }
}