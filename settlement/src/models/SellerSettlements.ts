import mongoose, { mongo } from "mongoose";
import { MongooseConnection } from "../db/Connection";

export class SellerSettlementModel {
    private readonly _conn : MongooseConnection;

    constructor(conn : MongooseConnection){
        this._conn = conn;
    }

    sellerSettlementSchema(){
        return new mongoose.Schema({
            sellerId: Number,
            settlementId: String,
            amount: Number,
            taxValue: Number,
            bankCode: Number,
            bankAccount: Number
        })
    }

    sellerSettlementModel() {
        return mongoose.model("sellerSettlements", this.sellerSettlementSchema(), "sellerSettlements");
    }
}