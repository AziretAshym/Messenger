import { Button, Grid2 } from '@mui/material';
import {NavLink} from 'react-router-dom';
import {AccountCircle, Login} from '@mui/icons-material';

const AnonymousMenu = () => {
  return (
    <Grid2>
      <Button component={NavLink} to="/login" color="inherit">
        <Login/>
      </Button>
      <Button component={NavLink} to="/register" color="inherit">
        <AccountCircle/>
      </Button>
    </Grid2>
  );
};

export default AnonymousMenu;