import { Box, Button, Divider, Paper, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectUser, setOnlineUsers } from '../users/usersSlice.ts';
import Sidebar from '../sidebar/Sidebar.tsx';
import { OnlineUser } from '../../types';

interface Message {
  _id: string;
  user: {
    _id: string;
    username: string;
    displayName: string;
    role: string;
    avatar?: string;
  };
  text: string;
  datetime: string;
}

interface IncomingMessage {
  type: string;
  payload: Message[] | OnlineUser[];
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState<string>("");
  const ws = useRef<WebSocket | null>(null);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [retryCount, setRetryCount] = useState(0);

  const connectWebSocket = () => {
    const wsClient = new WebSocket("ws://localhost:8000/messages");

    wsClient.onopen = () => {
      console.log("WebSocket connected");
      if (user) {
        wsClient.send(JSON.stringify({
          type: 'LOGIN',
          payload: { token: user.token }
        }));
      }
    };

    wsClient.onmessage = (event) => {
      try {
        const decoded = JSON.parse(event.data) as IncomingMessage;
        if (decoded.type === 'ALL_MESSAGES') {
          setMessages(decoded.payload as Message[]);
        }
        else if (decoded.type === 'ONLINE_USERS') {
          dispatch(setOnlineUsers(decoded.payload as OnlineUser[]));
        }
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    };

    wsClient.onclose = () => {
      console.log('WebSocket disconnected, reconnecting...');
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, Math.min(1000 * 2 ** retryCount, 30000));
    };

    wsClient.onerror = (error) => {
      console.error('WebSocket error:', error);
      wsClient.close();
    };

    ws.current = wsClient;
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws.current?.readyState === 1) {
        ws.current.close();
      }
    };
  }, [retryCount]);

  const onSubmitToSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !ws.current || !text.trim()) return;

    ws.current.send(JSON.stringify({
      type: "ADD_NEW_MESSAGE",
      payload: { text }
    }));
    setText("");
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!user || !ws.current) return;

    ws.current.send(JSON.stringify({
      type: 'DELETE_MESSAGE',
      payload: { messageId }
    }));
  };
  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid>
        <Sidebar />
      </Grid>

      <Grid size={9} sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2, width: "70%"}}>
        <Grid size={12} sx={{mb :2}}>
          <Typography variant="h6" gutterBottom>
            Chat room
          </Typography>
          <Divider/>
        </Grid>

        <Grid size={12} sx={{maxHeight: "400px",
          overflowY: "auto",}}>
          {messages.length === 0 ? (<Typography variant="body2" color="textSecondary" sx={{mt: 2}}>
            No messages found
          </Typography>): user && (messages.map((message) => (
            <Paper
              key={message._id}
              sx={{
                p: 1.5,
                maxWidth: "30%",
                alignSelf: "flex-start",
                backgroundColor: "#BDBDBD",
                borderRadius: "15px 15px 15px 0px",
                mb: 1,
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <Typography sx={{ color: "#1b5e20", fontSize: "18px", fontWeight: "bold" }}>
                  {message.user.username}
                </Typography>
                {user?.role === 'admin' && (
                  <Button
                    sx={{
                      margin: 0,
                      padding: 0
                    }}
                    color="error"
                    onClick={() => handleDeleteMessage(message._id)}
                  >
                    Delete
                  </Button>
                )}
              </Box>
              <Typography sx={{ color: "#212121", fontSize: "18px" }}>
                {message.text}
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: "12px" }}>
                {dayjs(message.datetime).format("HH:mm DD.MM.YYYY")}
              </Typography>
            </Paper>
          )))
          }

        </Grid>

        {user && (
          <Box sx={{ width: "100%", mt: 2 }}>
            <form onSubmit={onSubmitToSend}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={9}>
                  <TextField
                    fullWidth
                    required
                    label="Message"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </Grid>
                <Grid size={3}>
                  <Button fullWidth variant="outlined" type="submit">
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        )}
      </Grid>
    </Grid>

  );
};

export default Messages;
