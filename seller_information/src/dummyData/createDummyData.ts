export class DummyData{

    dummySeller = {
        "seller_id": 0,
        "name": "Dummy Seller",
        "cnpj": "1234567890",
        "bankCode": 13,
        "bankAccount": 131313,
        "notes": ""
    }

    generateDummySeller(quantity) {

        let tempSeller = [];

        do {
            this.dummySeller.seller_id++;
            tempSeller.push(this.dummySeller);
            
        } 
        while (this.dummySeller.seller_id < quantity);

        return tempSeller;
    }

    
}