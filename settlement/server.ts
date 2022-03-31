import { SettlementRepository } from './src/api/repository/repository'
import { TaxCalculationResponse } from "./src/events/tax_calculation_response";
import { TaxCalculationRequest } from "./src/events/tax_calculation_request";
import { EmitSettlement } from "./src/events/settlement_file_request";
import { ListeningSettlement } from "./src/events/settlement_file_response";
import express from "express";

const data = new SettlementRepository();
const tax_response = new TaxCalculationResponse();
const tax_request = new TaxCalculationRequest();
const settlement_request = new EmitSettlement();
const settlement_response = new ListeningSettlement();
const app = express();

tax_response.consumeQueue();
settlement_response.listeningQueue();

app.post("/v1/transactions/dummy-data", async (req, res) => {
    await data.postDummyData(req, res);
});

app.post("/v1/settlements", async (req, res) => {
    await data.postSellerSettlement(req, res);
});

app.post("/v1/sellerSettlements", async (req, res) => {
    await data.postSellerSettlement(req, res);
})

app.get("/v1/settlements", async (req, res) => {
    await data.getSettlementResume();
})


app.listen(3002, () => {
    console.log("Listening on port 3002");
})