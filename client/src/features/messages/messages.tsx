import { Box, Button, Grid, Paper, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import dayjs from "dayjs";
import { useAppSelector } from '../../app/hooks.ts';
import { selectUser } from '../users/usersSlice.ts';
import Sidebar from '../sidebar/Sidebar.tsx';

interface Message {
  _id: string;
  user: { _id: string, username: string };
  text: string;
  datetime: string;
}

interface IncomingMessage {
  type: string;
  payload: Message[];
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState<string>("");
  const ws = useRef<WebSocket | null>(null);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/messages");

    ws.current.onmessage = event => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;
      if (decodedMessage.type === "ALL_MESSAGES") {
        setMessages(decodedMessage.payload);
      }
    };
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const onSubmitToSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !ws.current || !text.trim()) return;

    ws.current.send(JSON.stringify({
      type: "ADD_NEW_MESSAGE",
      payload: {
        user: user._id,
        text
      }
    }));
    setText("");
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid>
        <Sidebar />
      </Grid>

      <Grid item xs={9} sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "60%",
            maxHeight: "500px",
            overflowY: "auto",
            border: "1px solid #BDBDBD",
            borderRadius: 4,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
            p: 2,
            mt: 4
          }}
        >
          {messages.map((message) => (
            <Paper
              key={message._id}
              sx={{
                p: 1.5,
                maxWidth: "75%",
                alignSelf: "flex-start",
                backgroundColor: "#BDBDBD",
                borderRadius: "15px 15px 15px 0px",
                mb: 1
              }}
            >
              <Typography sx={{ color: "#1b5e20", fontSize: "18px", fontWeight: "bold" }}>
                {message.user.username}
              </Typography>
              <Typography sx={{ color: "#212121", fontSize: "18px" }}>
                {message.text}
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: "12px" }}>
                {dayjs(message.datetime).format("HH:mm DD.MM.YYYY")}
              </Typography>
            </Paper>
          ))}
        </Box>

        {user && (
          <Box sx={{ width: "60%", mt: 2 }}>
            <form onSubmit={onSubmitToSend}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    required
                    label="Message"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
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
