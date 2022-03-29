import mongoose from 'mongoose';
import { MongooseConnection } from '../db/Connection';

export class TransactionModel {

    transactionSchema(){
        return new mongoose.Schema({
            transactionId: String,
            timeStamp: Date,
            sellerId: Number,
            settlementDate: String,
            amount: Number
        })
    }

    transactionModel() {
        return mongoose.model("transactions", this.transactionSchema(), "transactions");
    }
}