import SellerRepository from "../repository/SellerRepository";
import {ISellerService} from "./ISellerService";
import {Request, Response} from 'express';

export class SellerServices implements ISellerService{

    private _repository;

    constructor(sellerRepository : SellerRepository) {
        this._repository = sellerRepository;
    }

    async getById(req : Request, res : Response) {
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

    async getPage(req : Request, res : Response) {
        try {
            return await this._repository.getById(req, res);
        }
        catch(err){
            console.log(err);
        }
    }

    async updateSeller(req : Request, res : Response) {
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

    async createSeller(req : Request, res : Response) {
        try {
            this._repository.createSeller(req, res);
        }
        catch(err) {
            console.log(err);
        }
    }

    async createDummyData(req : Request, res : Response) {
        try {
            this._repository.createDummyData(req, res);
        }
        catch(err){
            console.log(err);
        }
    }
}