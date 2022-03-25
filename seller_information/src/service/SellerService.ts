import SellerRepository from "../repository/SellerRepository";
import {ISellerService} from "./ISellerService";

export class SellerServices implements ISellerService{

    private _repository;

    constructor(sellerRepository : SellerRepository) {
        this._repository = sellerRepository;
    }

    async getById(req, res) {
        const seller = await this._repository.getById(req, res)
        if(!req.params.id){
            res.sendStatus(400);
        }
        else if(seller != null){
            return seller;
        }
        else {
            res.sendStatus(404);
        }
    }

    async getPage(req, res) {
        try {
            return await this._repository.getById(req, res);
        }
        catch(err){
            console.log(err);
        }
    }

    async updateSeller(req, res) {
        try {
            if(this._repository.getById(req, res) != null){
                return await this._repository.updateSeller(req, res);
            }
            else {
                res.sendStatus(400);
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    async createSeller(req, res) {
        try {
            this._repository.createSeller(req, res);
        }
        catch(err) {
            console.log(err);
        }
    }

    async createDummyData(req, res) {
        try {
            this._repository.createDummyData(req, res);
        }
        catch(err){
            console.log(err);
        }
    }
}