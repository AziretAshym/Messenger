import express from 'express';
import cors from 'cors';
import expressWs from 'express-ws';
import config from "./config";
import * as mongoose from "mongoose";
import MongoDb from "./mongoDb";
import usersRouter from "./routers/users";
import {WebSocket} from 'ws';
import Message from './models/Message';
import User from './models/User';

const app = express();
expressWs(app);

const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/users', usersRouter);

const router = express.Router();

interface OnlineUser {
  userId: string;
  ws: WebSocket;
  username: string;
  displayName: string;
  avatar?: string;
}

const onlineUsers: OnlineUser[] = [];

router.ws('/messages', async (ws, _req) => {
  let currentUser: OnlineUser | null = null;

  const sendErrorMessage = (message: string) => {
    if (ws.readyState === 1) {
      ws.send(JSON.stringify({ type: 'ERROR', payload: { message } }));
    }
  };

  const handleAuth = async (token: string) => {
    try {
      const user = await User.findOne({ token }).select('-password');
      if (!user) {
        sendErrorMessage('Invalid token');
        return ws.close();
      }

      currentUser = {
        userId: user._id.toString(),
        ws,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar
      };

      onlineUsers.push(currentUser);
      onlineUsersList();
      await sendMessages();
    } catch (e) {
      sendErrorMessage('Authentication failed');
      ws.close();
    }
  };

  const sendMessages = async () => {
    try {
      const messages = await Message.find()
        .sort({ datetime: -1 })
        .limit(30)
        .populate("user", "username displayName avatar");

      if (ws.readyState === 1) {
        ws.send(JSON.stringify({
          type: "ALL_MESSAGES",
          payload: messages
        }));
      }
    } catch (e) {
      sendErrorMessage('Failed to load messages');
    }
  };

  ws.on('message', async (message) => {
    try {
      const decoded = JSON.parse(message.toString());

      if (decoded.type === 'LOGIN' && decoded.payload?.token) {
        await handleAuth(decoded.payload.token);
      }
      else if (decoded.type === 'ADD_NEW_MESSAGE' && currentUser) {
        const newMessage = new Message({
          user: currentUser.userId,
          text: decoded.payload.text,
          datetime: new Date(),
        });

        await newMessage.save();
        const messages = await Message.find()
          .sort({ datetime: -1 })
          .limit(30)
          .populate("user", "username displayName avatar");

        allMessages(messages);
      }
      else if (decoded.type === 'DELETE_MESSAGE' && currentUser) {
        const user = await User.findById(currentUser.userId);
        if (user?.role !== 'admin') {
          sendErrorMessage('You cannot delete messages!');
          return;
        }

        await Message.deleteOne({ _id: decoded.payload.messageId });
        const messages = await Message.find()
          .sort({ datetime: -1 })
          .limit(30)
          .populate("user", "username displayName avatar");

        allMessages(messages);
      }
    } catch (e) {
      sendErrorMessage('Invalid message format');
    }

  });

  ws.on('close', () => {
    if (currentUser) {
      const index = onlineUsers.findIndex(u => u.userId === currentUser!.userId);
      if (index !== -1) {
        onlineUsers.splice(index, 1);
        onlineUsersList();
      }
    }
  });

  const allMessages = (messages: any[]) => {
    onlineUsers.forEach(user => {
      if (user.ws.readyState === 1) {
        user.ws.send(JSON.stringify({
          type: 'ALL_MESSAGES',
          payload: messages
        }));
      }
    });
  };

  const onlineUsersList = () => {
    const usersList = onlineUsers.map(user => ({
      userId: user.userId,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar
    }));

    onlineUsers.forEach(user => {
      if (user.ws.readyState === 1) {
        user.ws.send(JSON.stringify({
          type: 'ONLINE_USERS',
          payload: usersList
        }));
      }
    });
  };
});

app.use(router);

const run = async () => {
  try {
    await mongoose.connect(config.db);
    app.listen(port, () => {
      console.log(`Server started on port http://localhost:${port}`);
    });
    process.on('exit', () => {
      MongoDb.disconnect();
    });
  } catch (e) {
    console.error(e);
  }
};

run().catch((e) => console.error(e));