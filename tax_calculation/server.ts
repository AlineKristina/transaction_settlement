import "dotenv/config";
import { Tax_Calc } from "./src/tax_calc/tax_calc";
import express from 'express';
const app = express();
const PORT = process.env.PORT || 3001;
const URL = process.env.URL || "amqp://localhost:5672/#/";

const tax_calc = new Tax_Calc(URL);

tax_calc.createChannel();

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})