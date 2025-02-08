import express from 'express';
import cors from 'cors';
import expressWs from 'express-ws';
import config from "./config";
import * as mongoose from "mongoose";
import MongoDb from "./mongoDb";
import usersRouter from "./routers/users";
import {WebSocket} from 'ws';
import Message from './models/Message';

const app = express();
expressWs(app);

const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/users', usersRouter);

const router = express.Router();

const connectedClients: WebSocket[] = [];

router.ws('/messages', async (ws, _req) => {
  connectedClients.push(ws);

  try {
    const messages = await Message.find().sort({datetime: -1}).limit(30).populate("user", "username");
    ws.send(JSON.stringify(messages));
  } catch (e) {
    ws.send(JSON.stringify({error: "Not found messages"}));
  }

  ws.on('close', () => {
    const index = connectedClients.indexOf(ws);
    connectedClients.splice(index, 1);
  })
})

app.use(router);

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
