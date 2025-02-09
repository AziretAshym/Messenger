import React, {useState} from 'react';
import {LoginMutation} from '../../types';
import {Alert, Avatar, Box, Button, Link, TextField, Typography} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectLoginError} from './usersSlice';
import {login} from './usersThunks';
import Grid from '@mui/material/Grid2';

const Login = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectLoginError);
  const navigate = useNavigate();
  const [state, setState] = useState<LoginMutation>({
    username: '',
    password: '',
  });

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setState((prevState) => ({...prevState, [name]: value}));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    await dispatch(login(state)).unwrap();
    navigate('/');
  };

  return (
    <Box sx={{
      mt: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
        <LockOpenIcon/>
      </Avatar>
      <Typography component="h1" variant="h5">Login</Typography>
      {error && (
        <Alert severity="error" sx={{mt: 3}}>
          {error.error}
        </Alert>
      )}
      <Box component="form" onSubmit={submitFormHandler} sx={{mt: 2}}>
        <Grid direction="column" container spacing={2}>
          <Grid size={12}>
            <TextField
              required
              label="Username"
              name="username"
              autoComplete="current-username"
              value={state.username}
              onChange={inputChangeHandler}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              required
              type="password"
              label="Password"
              name="password"
              autoComplete="new-password"
              value={state.password}
              onChange={inputChangeHandler}
            />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>Login</Button>
        <Link component={RouterLink} to="/register" variant="body2">
          Or Sign Up
        </Link>
      </Box>
    </Box>
  );
};

export default Login;