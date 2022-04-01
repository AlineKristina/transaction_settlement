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

    returnKeyFromArraySeller_Id(jsonArray : string[][]){
        for (let i = 0; i < jsonArray.length; i++){
            for (let j = 0; j < 2; j++){
                console.log(jsonArray[i][j]);
                if (jsonArray[i][j] == '"_id"'){
                    return jsonArray[i][j+1];
                }
            }
        }
    }

    returnKeyFromArrayAmount(jsonArray : string[][]){
        for (let i = 0; i < jsonArray.length; i++){
            for (let j = 0; j < 2; j++){
                console.log(jsonArray[i][j]);
                if (jsonArray[i][j] == '"amount"'){
                    return jsonArray[i][j+1];
                }
            }
        }
    }

    returnKeyFromArrayTaxValue(jsonArray : string[][]){
        for (let i = 0; i < jsonArray.length; i++){
            for (let j = 0; j < 2; j++){
                console.log(jsonArray[i][j]);
                if (jsonArray[i][j] == '"taxValue"'){
                    return jsonArray[i][j+1];
                }
            }
        }
    }

    returnKeyFromArraySettlementId(jsonArray : string[][]){
        for (let i = 0; i < jsonArray.length; i++){
            for (let j = 0; j < 2; j++){
                console.log(jsonArray[i][j]);
                if (jsonArray[i][j] == '"settlementId"'){
                    return jsonArray[i][j+1];
                }
            }
        }
    }

    returnKeyFromArraySettlementDate(jsonArray : string[][]){
        for (let i = 0; i < jsonArray.length; i++){
            for (let j = 0; j < 2; j++){
                console.log(jsonArray[i][j]);
                if (jsonArray[i][j] == '"settlementDate"'){
                    return jsonArray[i][j+1];
                }
            }
        }
    }
}