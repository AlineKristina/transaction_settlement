import mongoose, { mongo } from "mongoose";
import { MongooseConnection } from "../db/Connection";

export class SellerSettlementModel {

    sellerSettlementSchema(){
        return new mongoose.Schema({
            sellerId: Number,
            settlementId: String,
            amount: Number,
            taxValue: Number,
            bankCode: Number,
            bankAccount: Number || null
        })
    }

    sellerSettlementModel() {
        return mongoose.model("sellerSettlements", this.sellerSettlementSchema(), "sellerSettlements");
    }
}