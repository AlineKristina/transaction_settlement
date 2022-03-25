import express from "express";
export const app = express();

app.listen(3002, () => {
    console.log("Listening on port 3002");
})