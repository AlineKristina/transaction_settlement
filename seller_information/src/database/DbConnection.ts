import mongoose from 'mongoose';
import { IDbConnection } from './IDbConnection';

export class DbConnection implements IDbConnection {

    constructor(){
        this.connection();
    }

    async connection() {
        
        await mongoose.connect("mongodb://admin:pass@mongo:27017/")
        .catch( (err) => {
        console.log(err);
    })};

}