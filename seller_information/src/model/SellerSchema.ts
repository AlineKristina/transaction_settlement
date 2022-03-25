import mongoose from 'mongoose';

export class SellerSchema {
    createSchema() {
        return new mongoose.Schema({
            seller_id: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            cnpj: {
                type: Number,
                required: true
            },
            bankCode: {
                type: Number,
                required: true
            },
            bankAccount: {
                type: Number,
                required: true
            },
            notes: {
                type: String,
                required: false
            }
        });
    }

}