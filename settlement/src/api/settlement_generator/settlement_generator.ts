import { v4 as uuidv4 } from 'uuid';

export class SettlementGenerator {

    generateSettlement(){
        return {
            "settlementId": uuidv4(),
            "settlementDate": "2022-03-01",
            "startDate": Date.now(),
            "endDate": null
            }
    }

}