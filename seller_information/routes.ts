import { MongooseConnection } from '../settlement/src/db/Connection';
//import { SellerController } from './src/controller/SellerController';
import SellerRepository from './src/repository/SellerRepository';
import { SellerServices } from './src/service/SellerService';

const conn = () => {
    return new MongooseConnection().connection()
}
conn();
const _repository = new SellerRepository()
const _service = new SellerServices(_repository)
//const _controller = new SellerController(_connection)

import express from 'express';
import 'dotenv/config'

const serverConnection = express();
const PORT = process.env.PORT;

serverConnection.get("/v1/sellers/:id", async (req, res) => {
     await _service.getById(req, res);
})
    
serverConnection.post("/", async (req, res) => {
    await _service.createSeller(req, res);
})

serverConnection.get("/", async (req, res) => {
    await _service.getPage(req, res);
})

serverConnection.patch("/", async (req, res) => {
    await _service.updateSeller(req, res);
})

serverConnection.post("/v1/sellers/dummy-data", (req, res) => {
    _service.createDummyData(req, res);
})

serverConnection.listen(PORT, () => {
    console.log("Server connected");
})