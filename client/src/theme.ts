import {createTheme} from '@mui/material';

const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      }
    }
  },
  palette: {
    primary: {
      main: '#00e1ff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#80ffc0',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 700,
      letterSpacing: 0.5,
    }
  }
});

export default theme;