import AppToolBar from './UI/AppBar/AppToolBar.tsx';
import { Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Register from './features/users/Register.tsx';
import Typography from '@mui/material/Typography';
import Login from './features/users/Login.tsx';
import Messages from './features/messages/messages.tsx';

const App = () => {
  return (
    <>
      <header>
        <AppToolBar/>
      </header>
      <Container maxWidth="xl" component="main">
        <Routes>
          <Route path="/" element={<Messages/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="*" element={<Typography variant="h1">Page Doesn't Exist</Typography>}/>
        </Routes>
      </Container>
    </>
  );
};

export default App;