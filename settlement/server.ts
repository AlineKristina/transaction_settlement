import { SettlementRepository } from './src/api/repository/repository'
import { TaxCalculationResponse } from "./src/events/tax_calculation_response";
import { ListeningSettlement } from "./src/events/settlement_file_response";
import { MongooseConnection } from './src/db/Connection';
import express from "express";

const _repository = new SettlementRepository();
const tax_response = new TaxCalculationResponse(_repository);
const settlement_response = new ListeningSettlement(_repository);
const app = express();
const connection = new MongooseConnection();

tax_response.consumeQueue();
settlement_response.listeningQueue();

app.post("/v1/transactions/dummy-data", async (req, res) => {
    await _repository.postDummyData(req, res);
});

app.post("/v1/settlements", async (req, res) => {
    await _repository.postSellerSettlement(req, res);
});

app.post("/v1/sellerSettlements", async (req, res) => {
    await _repository.postSellerSettlement(req, res);
})

app.get("/v1/settlements", async (req, res) => {
    await _repository.getSettlementResume(req, res);
})


app.listen(3002, () => {
    console.log("Listening on port 3002");
})