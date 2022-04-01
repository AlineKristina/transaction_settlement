import mongoose from 'mongoose';
import { IDbConnection } from './IDbConnection';

export class DbConnection implements IDbConnection {

    constructor(){
    }

    async connection() {
        //mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority
        //mongodb://YourUsername:YourPasswordHere@127.0.0.1:27017/your-database-name
        await mongoose.connect("mongodb://localhost:27017/sellers").then(() => console.log("Connected to MongoDB."))
        .catch( (err) => {
        console.log(err);
    })};

}