import mongoose from 'mongoose';
import { MongooseConnection } from '../db/Connection';

export class SettlementModel {

    private readonly _conn : MongooseConnection;

    constructor(conn : MongooseConnection){
        this._conn = conn;
    }

    settlementSchema(){
        return new mongoose.Schema({
            settlementId: Number,
            settlementDate: Date,
            startDate: Date,
            endDate: Date,
            sellersCount: Number,
            transactionCount: Number,
            elapsedMiliseconds: Number
        })
    }

    settlementModel() {
        return mongoose.model("settlement", this.settlementSchema(), "s=ettlement");
    }
}