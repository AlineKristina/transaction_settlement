import app from './server'
import { SellerController } from './src/controller/SellerController';
import { ISellerService } from './src/service/ISellerService';

class Route {

    private serverConnection = app;
    private _controller;

    constructor(sellerService : ISellerService){
       this._controller = new SellerController(sellerService);
    }
    
    getById() {
        this.serverConnection.get("/v1/sellers/:id", async (req, res) => {
            await this._controller.getById(req, res);
        })
    }

    createSeller() {
        this.serverConnection.post("/", async (req, res) => {
            await this._controller.createSeller(req, res);
        })
    }

    getByPage() {
        this.serverConnection.get("/", async (req, res) => {
            await this._controller.getPage(req, res);
        })
        
    }

    updateSeller() {
        this.serverConnection.patch("/", async (req, res) => {
            await this._controller.updateSeller(req, res);
        })
    }

    createDummySeller() {
        this.serverConnection.post("/v1/sellers/dummy-data", (req, res) => {
            this._controller.createDummyData(req, res);
        })
    }
}