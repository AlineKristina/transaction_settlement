import {IDbConnection} from "../database/IDbConnection";
import { DummyData } from "../dummyData/createDummyData";
import {SellerModel} from "../model/SellerModel";
import { SellerSchema } from "../model/SellerSchema";
import { ISellerRepository } from "./ISellerRepository";
import 'dotenv/config'

export default class SellerRepository implements ISellerRepository{
    
    private _dbConnection;
    sellerSchema = new SellerSchema();
    sellerModel = new SellerModel(this.sellerSchema).sellerModel();


    constructor(dbConn : IDbConnection) {
        this._dbConnection = dbConn;
        dbConn.connection();
    }

    async getById(req, res){
        return await this.sellerModel.findOne({seller_id: req.params.id});
    }

    async getAndPaginate(req, res) {
        const {page, pageSize, ...queryParameters} = req.query;
        let index = pageSize * (page-1);
        
        const result = await this.sellerModel.find(queryParameters).skip(index).limit(pageSize);

        let qty = result.length;
         
        res.send(result)
    }

    async createSeller(req, res) {
        const newSeller = req.body;
        console.log(newSeller)
        const seller = new this.sellerModel(req.body);
        await seller.save();
        res.sendStatus(201);
    }

    async updateSeller(req, res) {
        //await this.model.sellerModel.findByIdAndUpdate(id, { $set: reqBody }, { new: true });
        await this.sellerModel.updateOne({seller_id:req.params.id}, { $set: req.body });
        await this.sellerModel.findOne()
    }

    async createDummyData(req, res) {
        const QUANTITY = process.env.DUMMY_SELLERS || 10;
        const dummyData = new DummyData().generateDummySeller(QUANTITY);
        dummyData.forEach(async (dummyData) => {
            let tempObj = new this.sellerModel(dummyData);
            await tempObj.save();
        })
    }
}