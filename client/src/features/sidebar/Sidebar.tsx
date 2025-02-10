import { useAppSelector } from '../../app/hooks.ts';
import { selectOnlineUsers } from '../users/usersSlice.ts';
import { Avatar, Box, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { apiUrl } from '../../globalConstants.ts';
import './Sidebar.css'
const Sidebar = () => {
  const onlineUsers = useAppSelector(selectOnlineUsers);

  return (
    <Box sx={{ width: 300, p: 2, borderRight: '1px solid #ddd', height: '100vh' }}>
      <Typography variant="h6" gutterBottom>
        Online users ({onlineUsers.length})
      </Typography>
      <Divider />
      <List>
        {onlineUsers.map(user => (
          <ListItem key={user.userId}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box
                sx={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: 'green',
                  marginRight: 1.5,
                  flexShrink: 0,
                  animation: 'blink 1s infinite'
                }}
              />
              <ListItemAvatar>
                <Avatar
                  alt={user.displayName}
                  src={user.avatar?.startsWith('http') ? user.avatar : `${apiUrl}/${user.avatar}`}
                />
              </ListItemAvatar>
              <ListItemText
                primary={user.displayName}
              />
            </Box>
          </ListItem>
        ))}
        {onlineUsers.length === 0 && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            No users online
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default Sidebar;