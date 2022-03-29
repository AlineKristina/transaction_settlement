import express from "express";
import { MongooseConnection } from './src/db/Connection'
import {SettlementRepository} from './src/api/repository/repository'
import { SettlementGenerator } from "./src/api/settlement_generator/settlement_generator";

const conn = new MongooseConnection();
const data = new SettlementRepository();
const app = express();

//Cria massa de dados
app.post("/v1/transactions/dummy-data", async (req, res) => {
    await data.postDummyData(req, res);
});

//Realiza a gravação dos settlements
app.post("/v1/settlements", async (req, res) => {
    await data.postSettlement(req, res);
});

//Obtém as transações filtrando por settlementDate
app.get("/v1/transactions", async (req, res) => {
    await data.getTransactionBySettlementDate(req, res);
});

//Grava o agregado obtido na rota anterior no banco sellerSettlements
app.post("/v1/sellerSettlements", async (req, res) => {
    await data.postSellerSettlement(req, res);
})

app.listen(3002, () => {
    console.log("Listening on port 3002");
})