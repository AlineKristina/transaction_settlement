import { DummyData } from "../dummyData/createDummyData";
import { SellerModel } from "../model/SellerModel";
import { SellerSchema } from "../model/SellerSchema";
import { ISellerRepository } from "./ISellerRepository";
import { config } from 'dotenv';
import { Request, Response } from "express";
config();

export default class SellerRepository implements ISellerRepository{
    

    sellerSchema = new SellerSchema();
    sellerModel = new SellerModel(this.sellerSchema).sellerModel();

    constructor() {
    }

    async getById(req : Request, res : Response){
        return await this.sellerModel.find({seller_id: req.params.id});
    }

    async getAndPaginate(req : Request, res : Response) {
        const {page, pageSize, ...queryParameters} = req.query;
        let index = Number(pageSize) * (Number(page)-1);
        
        const result = await this.sellerModel.find(queryParameters).skip(index).limit(Number(pageSize));
        
        res.send(result)
    }

    async createSeller(req : Request, res : Response) {
        const newSeller = req.body;
        const seller = new this.sellerModel(req.body);
        await seller.save();
        res.sendStatus(201);
    }

    async updateSeller(req : Request, res : Response) {
        console.log(req.params.id)
        console.log(req.body)
        await this.sellerModel.updateOne({seller_id:req.params.id}, {$set: req.body});
        
    }

    async createDummyData(req : Request, res : Response) {
        const dummyData = new DummyData().generateDummySeller();
        dummyData.forEach(async (dummyData) => {
            let tempObj = new this.sellerModel(dummyData);
            await tempObj.save();
        })
    }
}