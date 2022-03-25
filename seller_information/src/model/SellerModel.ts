import mongoose from 'mongoose'
import { SellerSchema } from './SellerSchema';

export class SellerModel {

    private schema;

    constructor(sellerSchema : SellerSchema) {
        this.schema = sellerSchema.createSchema();
    }

    sellerModel() {
        return mongoose.model("seller", this.schema, "seller");
    }
}