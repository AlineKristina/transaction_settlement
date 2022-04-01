import { DbConnection } from './src/database/DbConnection';
//import { SellerController } from './src/controller/SellerController';
import SellerRepository from './src/repository/SellerRepository';
import { SellerServices } from './src/service/SellerService';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import {swaggerJson} from './src/swagger/swagger';
import express from 'express';
import { config } from 'dotenv';
config();

const conn = () => {
    return new DbConnection().connection()
}
conn();

const _repository = new SellerRepository()
const _service = new SellerServices(_repository)

const serverConnection = express();

serverConnection.use(bodyParser.urlencoded({extended:true}))
serverConnection.use(express.json())
serverConnection.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson))

const PORT = process.env.PORT || 3000;

serverConnection.get("/v1/sellers/:id", async (req, res) => {
     await _service.getById(req, res);
})
    
serverConnection.post("/v1/sellers/", async (req, res) => {
    console.log(req.body)
   _service.createSeller(req, res);
})

serverConnection.get("/v1/sellers/", async (req, res) => {
    await _service.getPage(req, res);
})

serverConnection.patch("/v1/sellers/:id", async (req, res) => {
    await _service.updateSeller(req, res);
})

serverConnection.post("/v1/sellers/dummy-data", (req, res) => {
    _service.createDummyData(req, res);
    console.log(req.body)
})

serverConnection.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})