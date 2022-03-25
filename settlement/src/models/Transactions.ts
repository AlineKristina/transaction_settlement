import mongoose from 'mongoose';
import { MongooseConnection } from '../db/Connection';

export class TransactionModel {
    private readonly _conn : MongooseConnection;

    constructor(conn : MongooseConnection){
        this._conn = conn;
    }

    transactionSchema(){
        return new mongoose.Schema({
            transactionId: String,
            timeStamp: Date,
            sellerId: Number,
            settlementDate: Date,
            amount: Number
        })
    }

    transactionModel() {
        return mongoose.model("transactions", this.transactionSchema(), "transactions");
    }
}