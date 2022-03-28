import mongoose from "mongoose";

export class MongooseConnection {

    constructor() {
        this.connection();
    }

    async connection() {
        await mongoose.connect("mongodb://admin:pass@mongo:27017/")
        .catch( (err) => {
        console.log(err);
    })};

}