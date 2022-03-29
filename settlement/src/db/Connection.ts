import mongoose from "mongoose";

export class MongooseConnection {

    constructor() {
        this.connection();
    }

    async connection() {
        await mongoose.connect("mongodb://localhost:27017/settlement")
        .then(() => console.log("Connected to Monguinho."))
        .catch( (err) => {
        console.log(err);
    })};

}