import express from 'express';
import cors from 'cors';
import expressWs from 'express-ws';
import config from "./config";
import * as mongoose from "mongoose";
import MongoDb from "./mongoDb";

const app = express();
expressWs(app);

const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


const run = async () => {
    try {
        await mongoose.connect(config.db);
        app.listen(port, () => {
            console.log(`Server started on port http://localhost:${port}`);
        });
        process.on('exit', () => {
            MongoDb.disconnect();
        })
    } catch (e){
        console.error(e);
    }
};

run().catch((e) => console.error(e));
