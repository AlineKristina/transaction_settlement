import { SettlementRepository } from './src/api/repository/repository'
import { TaxCalculationRequest } from './src/events/tax_calculation_request';
import { TaxCalculationResponse } from "./src/events/tax_calculation_response";
import { EmitSettlement } from './src/events/settlement_file_request';
import { ListeningSettlement } from "./src/events/settlement_file_response";
import express from "express";

const repository = new SettlementRepository();
const tax_request = new TaxCalculationRequest();
const tax_response = new TaxCalculationResponse(repository);
const settlement_request = new EmitSettlement();
const settlement_response = new ListeningSettlement(repository);
const app = express();

settlement_response.listeningQueue();

tax_request.createQueue();
tax_response.createQueue();
settlement_request.createQueue();
settlement_response.createQueue();

tax_response.consumeQueue();

app.post("/v1/transactions/dummy-data", async (req, res) => {
    await repository.postDummyData(req, res);
});

app.post("/v1/settlements", async (req, res) => {
    await repository.postSellerSettlement(req, res);
});

app.post("/v1/sellerSettlements", async (req, res) => {
    await repository.postSellerSettlement(req, res);
})

app.get("/v1/settlements", async (req, res) => {
    await repository.getSettlementResume();
})


app.listen(3002, () => {
    console.log("Listening on port 3002");
})