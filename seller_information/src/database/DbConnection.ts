import mongoose from 'mongoose';
import { IDbConnection } from './IDbConnection';

export class DbConnection implements IDbConnection {

    constructor(){
        this.connection();
    }

    async connection() {
        //mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority
        //mongodb://YourUsername:YourPasswordHere@127.0.0.1:27017/your-database-name
        await mongoose.connect("mongodb://root:pass@localhost:27028/sellers").then(() => console.log("connected"))
        .catch( (err) => {
        console.log(err);
    })};

}