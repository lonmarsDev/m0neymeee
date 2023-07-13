import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Alert from '@mui/material/Alert';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';

function Copyright() {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="http://marlonpamisa.com">
          marlonpamisa.com
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}
const PageSuccess = () => {
    const defaultTheme = createTheme();
    return (
        <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <AppBar
            position="absolute"
            color="default"
            elevation={0}
            sx={{
            position: 'relative',
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
            }}
        >
            <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
                MoneyMe
            </Typography>
            </Toolbar>
        </AppBar>
        
            <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                   
                    <Alert severity="success" >Application Submitted Successfully...</Alert>
                </Paper>
            <Copyright />
        </Container>
        </ThemeProvider>
    )
};
export default PageSuccess;
