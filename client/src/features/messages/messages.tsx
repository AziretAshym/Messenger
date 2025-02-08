import { Box, Button, Grid2, Paper, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import dayjs from "dayjs";
import { useAppSelector } from '../../app/hooks.ts';
import { selectUser } from '../users/usersSlice.ts';

interface Message {
  _id: string;
  user: {_id: string, username: string};
  text: string;
  datetime: string;
}

interface IncomingMessage {
  type: string;
  payload: Message[];
}

const Messages = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState<string>();
  const ws = useRef<WebSocket | null>(null)
  const user  = useAppSelector(selectUser);


  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/messages");

    ws.current.onmessage = event => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;
      if (decodedMessage.type === "ALL_MESSAGES") {
        setMessages(decodedMessage.payload);
      }

    }
    return () => {
      if (ws.current) ws.current.close();
    }
  }, []);

  const onSubmitToSend = (e:React.ChangeEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(!user)return;

    if(!ws.current) return;
    ws.current.send(JSON.stringify({
      type:"ADD_NEW_MESSAGE",
      payload:{
        user:user._id,
        text
      }
    }));
  }




  return (
    <Grid2>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignSelf: "flex-end",
          gap: 1,
          p: 2,
          maxWidth: "60%",
          margin: "auto",
          borderRadius: 4,
          border: "1px solid #BDBDBD",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
          maxHeight: "500px",
          overflowY: "auto",
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
            }}
          >
            <Typography
              sx={{color: "#1b5e20", fontSize: "18px", fontWeight: "bold"}}
            >{message.user.username}
            </Typography>
            <Typography
              sx={{color: "#212121", fontSize: "18px"}}
            >{message.text}
            </Typography>
            <Typography
              sx={{color: "text.secondary", fontSize: "12px"}}
            >{dayjs(message.datetime).format("HH:mm DD.MM.YYYY")}
            </Typography>
          </Paper>
        ))}
      </Box>
      {user && <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignSelf: "flex-end",
        gap: 1,
        p: 2,
        maxWidth: "60%",
        margin: "auto",
        borderRadius: 4,
        border: "1px solid #BDBDBD",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
        maxHeight: "500px",
        overflowY: "auto",
        mt: 4
      }}>
        <Grid2
          gap={2}
          onSubmit={onSubmitToSend}
          container
          alignItems="center"
          component={'form'}>
          <Grid2 width="50%">
            <TextField
              fullWidth
              required
              id="message"
              name="message"
              label="message"
              onChange={(e) => setText(e.target.value)} />
          </Grid2>
          <Grid2 sx={{
            marginLeft:"auto",
          }}>
            <Button sx={{
              height:"55px"}} variant="outlined" type="submit">
              Send Message
            </Button>
          </Grid2>
        </Grid2>
      </Box>}
    </Grid2>
  );
};

export default Messages;