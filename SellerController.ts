import {SellerServices} from "../service/SellerService";
import {ISellerService} from "../service/ISellerService";

export class SellerController {

    private _service;

    constructor(sellerService : ISellerService){
        this._service = sellerService;
    }

    getByID(req : Request, res : Response){
        return this._service.getById(req, res);
    }

    getPage(req : Request, res : Response){
        return this._service.getPage(req, res);
    }

    updateSeller(req : Request, res : Response){
        return this._service.updateSeller(req, res);
    }

    createSeller(req : Request, res : Response){
        return this._service.createSeller(req, res);
    }

    createDummyData(req : Request, res : Response){
        return this._service.createDummyData(req, res);
    }

}