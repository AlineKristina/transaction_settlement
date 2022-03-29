import mongoose from 'mongoose';
import { MongooseConnection } from '../db/Connection';

export class SettlementModel {

    settlementSchema(){
        return new mongoose.Schema({
            settlementId: String,
            settlementDate: Date,
            startDate: Date,
            endDate: Date,
            sellersCount: Number,
            transactionCount: Number,
            elapsedMiliseconds: Number
        })
    }

    settlementModel() {
        return mongoose.model("settlements", this.settlementSchema(), "settlements");
    }
}