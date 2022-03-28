import {app} from "../../../server"
import {SettlementRepository} from '../repository/repository'
import {MongooseConnection} from '../../db/Connection';
import { SettlementGenerator } from "../settlement_generator/settlement_generator";

const conn = new MongooseConnection();
const data = new SettlementRepository(conn)

app.post("/v1/transactions/dummy-data", async (req, res) => {
    await data.postDummyData(req, res);
})

app.post("/v1/settlements", async (req, res) => {
    await data.postSettlement(req, res);
})

app.post("/v1/sellerSettlements", async (req, res) => {
    
})

app.get("/v1/settlements", async (req, res) => {

})