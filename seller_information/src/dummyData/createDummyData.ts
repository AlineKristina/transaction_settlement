import { config } from 'dotenv';
config();

export class DummyData{

    private DUMMY_SELLERS = Number(process.env.DUMMY_SELLERS) || 10;

    dummySeller = {
        "seller_id": 0,
        "name": "Dummy Seller",
        "cnpj": 1234567890,
        "bankCode": 13,
        "bankAccount": 131313,
        "notes": ""
    }

    generateDummySeller() {

        let tempSeller = [];

        do {
            this.dummySeller.seller_id++;
            tempSeller.push(this.dummySeller);
            
        } 
        while (this.dummySeller.seller_id < this.DUMMY_SELLERS);

        return tempSeller;
    }

    
}