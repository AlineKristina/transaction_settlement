import "dotenv/config";
import { Tax_Calc } from "./src/tax_calc/tax_calc";
import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "amqp://admin:admin@localhost:15672//";
const request = process.env.REQUEST || "tax_calculation_request";
const response = process.env.RESPONSE || "tax_calculation_response";

const tax_calc = new Tax_Calc(URL);

//Creating a channel
tax_calc.createChannel();

tax_calc.createQueue(request);
tax_calc.createQueue(response);

/* Consuming the queue tax_calculation_request, converting and calculating using messageConverter
and sendind the JSON with the tax to the queue tax_calculation_response */
tax_calc.consumeQueue(request, response);

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})