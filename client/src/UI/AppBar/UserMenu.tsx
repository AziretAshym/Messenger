import React, { useState } from 'react';
import {Avatar, Button, Menu, MenuItem} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/users/usersThunks';
import { useNavigate } from 'react-router-dom';
import { selectUser, unsetUser } from '../../features/users/usersSlice';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { apiUrl } from '../../globalConstants.ts';


const UserMenu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const user = useAppSelector(selectUser);
  const isOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(unsetUser());
    navigate('/');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        {user && (
          <Typography component="h1" variant="h5">
            {user.displayName}
          </Typography>
        )}
        <Button onClick={handleClick} color="inherit">
          {user && user.googleID ?
            <Avatar alt={user.displayName} src={user.avatar}/> :
            <Avatar alt={user?.displayName} src={apiUrl + '/' + user?.avatar} />
          }
        </Button>
      </Box>
      <Menu open={isOpen} anchorEl={anchorEl} onClose={handleClose} keepMounted>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default UserMenu;
