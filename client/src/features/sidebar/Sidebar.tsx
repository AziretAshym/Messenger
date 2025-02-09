import { useAppSelector } from '../../app/hooks.ts';
import { selectUser } from '../users/usersSlice.ts';
import { Avatar, Box, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { apiUrl } from '../../globalConstants.ts';

const Sidebar = () => {
  const user = useAppSelector(selectUser);
  console.log(user);

  return (
    <Box sx={{width: 300, p: 2, borderRight: '1px solid #ddd', height: '100vh'}}>
      <Typography variant="h6" gutterBottom>
        Online users
      </Typography>
      <Divider/>
      <List>
        {user ? (
          <ListItem>
            <ListItemAvatar>
              <ListItemAvatar>
                <Avatar alt={user?.displayName}
                        src={user?.avatar?.startsWith('http') ? user.avatar : `${apiUrl}/${user?.avatar}`}/>
              </ListItemAvatar>
            </ListItemAvatar>
            <ListItemText
              primary={user.displayName}
              secondary={user.role === 'admin' ? 'Administrator' : 'User'}
            />
          </ListItem>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{mt: 2}}>
            No users found.
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default Sidebar;
