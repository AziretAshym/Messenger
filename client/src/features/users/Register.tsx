import React, {useState} from 'react';
import {RegisterMutation} from '../../types';
import {Avatar, Box, Button, Grid, TextField, Typography, Link, CircularProgress, Grid2} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectRegisterError, selectRegisterLoading} from './usersSlice';
import {register} from './usersThunks';
import FileInput from '../../UI/FileInput/FileInput';


const Register = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectRegisterError);
  const isLoading = useAppSelector(selectRegisterLoading);
  const navigate = useNavigate();


  const [state, setState] = useState<RegisterMutation>({
    username: '',
    password: '',
    displayName: '',
    avatar: null,
  });

  const getFieldError = (fieldName: string) => {
    return error?.errors[fieldName]?.message;
  }

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setState((prevState) => ({...prevState, [name]: value}));
  };

  const fileInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    const value = files && files[0] ? files[0] : null;
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await dispatch(register(state)).unwrap();
      navigate('/');
    } catch (error) {

    }
  };
  return (
    <Box sx={{
      mt: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
        <LockOutlinedIcon/>
      </Avatar>
      <Typography component="h1" variant="h5">Sign Up</Typography>
      <Box component="form" noValidate onSubmit={submitFormHandler} sx={{mt: 2}}>
        <Grid2 direction="column" container spacing={2}>
          <Grid2 size={12}>
            <TextField
              required
              label="Username"
              name="username"
              autoComplete="new-username"
              value={state.username}
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('username'))}
              helperText={getFieldError('username')}
            />
          </Grid2>
          <Grid item>
            <TextField
              required
              type="password"
              label="Password"
              name="password"
              autoComplete="new-password"
              value={state.password}
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('password'))}
              helperText={getFieldError('password')}
            />
          </Grid>
          <Grid item>
            <TextField
              required
              id="displayName"
              label="Display name"
              name="displayName"
              autoComplete="new-username"
              value={state.displayName}
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('displayName'))}
              helperText={getFieldError('displayName')}
             />
          </Grid>
          <Grid2 size={12}>
            <FileInput
              label="Avatar"
              name="avatar"
              onChange={fileInputChangeHandler}
            />
          </Grid2>
        </Grid2>
        <Button
          disabled={isLoading}
          type="submit"
          fullWidth
          variant="contained"
          sx={{mt: 3, mb: 2}}>
          {isLoading ? <CircularProgress color="secondary" /> : null}
          Sign Up</Button>
        <Link component={RouterLink} to="/login" variant="body2" >
          Already have an account? Sign in
        </Link>
      </Box>
    </Box>
  )
};

export default Register;