import React, { useEffect, useState, useContext } from 'react';
import { MyContext } from '../../Context';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Slider, { SliderThumb, SliderValueLabelProps } from '@mui/material/Slider';
import Grid from '@mui/material/Grid';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers';

import axios from 'axios';
import dayjs from 'dayjs';


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

function valueLabelFormat(value) {
    value.toLocaleString('en-US')
    return `$${value.toLocaleString('en-US')}`;
}

function valueMonthFormat(value) {
    value.toLocaleString('en-US')
    if (value === 1){
    return `${value.toLocaleString('en-US')} month`;
    }
    return `${value.toLocaleString('en-US')} months`;

}


const PaymentForm = () => {
    const {globalLoanData, setGlobalLoanData} = useContext(MyContext);
    const navigate = useNavigate();

    const handleValueChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const [selectedValue, setSelectedValue] = useState('');
 

    const defaultTheme = createTheme();

    const HandleInputChange = (e) => {
        const { name, value } = e.target;
        // setLoanData(...loanData, [name]:value)
        setGlobalLoanData((prevData) => ({
            ...prevData,
            [name]: value
        }));
      
    };

    const handleDateChange = (date) => {
        setGlobalLoanData((prevData) => ({
            ...prevData,
            DateOfBirth: date
        }));
      };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('token');
                console.log(token);
                
                const response = await axios.get(`http://localhost:8100/loan/${token}`);
                const data = response.data;
                setGlobalLoanData(
                {
                    AmountRequired: data.AmountRequired,
                    FirstName: data.FirstName, 
                    LastName: data.LastName, 
                    Mobile: data.Mobile, 
                    RepaymentFrom: data.RepaymentFrom, 
                    Term: data.Term, 
                    Title: data.Title, 
                    Token: data.Token,
                    Email: data.Email,
                    DateOfBirth: dayjs(data.DateOfBirth)
                }
                );
                
            
            } catch (error) { 
                console.log(error); 
            }

        }; 
    fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8100/calculate-loan', ({
            ...globalLoanData,
            DateOfBirth: globalLoanData.DateOfBirth.format('YYYY-MM-DD')
        }))
        .then((data) => {
        console.log('api data',data)
        setGlobalLoanData(
            {
                AmountRequired: data.data.AmountRequired,
                FirstName: data.data.FirstName, 
                LastName: data.data.LastName, 
                Mobile: data.data.Mobile, 
                RepaymentFrom: data.data.RepaymentFrom, 
                Term: data.data.Term, 
                Title: data.data.Title, 
                Token: globalLoanData.Token,
                Email: data.data.Email,
                DateOfBirth: dayjs(data.data.DateOfBirth)
            }
        )    
        navigate(`/quote?token=${globalLoanData.Token}`);
        
        })
        .catch((error) => {
        console.error(error);
        
        });
    };

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
        
            <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                    <Typography component="h1" variant="h4" align="center" marginBottom={10}>
                        Quote calculator
                    </Typography>           
                        <Grid   >
                            <form onSubmit={handleSubmit}>
                                
                                <PrettoSlider
                                    name='AmountRequired'
                                    onChange={HandleInputChange}
                                    valueLabelDisplay="on"
                                    value={globalLoanData.AmountRequired}
                                    valueLabelFormat={valueLabelFormat}
                                    min={2100}
                                    max={15000}
                                />
                                <Grid container  marginBottom={5} marginTop={0} paddingTop={0}>
                                    <Grid item xs={12} sm={4} alignItems={"left"}>  
                                        <Typography>$2,100</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4} align={"center"}>  
                                        <Typography>How much do you need?</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4} align={"right"}>  
                                        <Typography>$15,000</Typography>
                                    </Grid>
                                </Grid>
                                <Grid marginTop={10} marginBottom={8}>
                                    <Slider
                                    defaultValue={24}
                                    valueLabelDisplay="on"
                                    value={globalLoanData.Term}
                                    name='Term'
                                    onChange={HandleInputChange}
                                    valueLabelFormat={valueMonthFormat}
                                    marks
                                    min={1}
                                    max={64}
                                    />
                                    <Grid item xs={12} sm={4} align={"center"}>  
                                        <Typography>Terms of Payment</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                    
                                    <Grid item xs={12} sm={3}>
                                        <FormControl fullWidth>
                                            <InputLabel id="select-label">Title</InputLabel>
                                            <Select
                                                labelId="select-label"
                                                value={globalLoanData.Title}
                                                name='Title'
                                                onChange={HandleInputChange}
                                                fullWidth
                                
                                                variant="standard"
                                            >
                                            <MenuItem value="Mr.">Mr</MenuItem>
                                            <MenuItem value="Mrs.">Mrs</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={4.5}>
                                    <TextField
                                        id="FirstName"
                                        name="FirstName"
                                        label="First name"
                                        value={globalLoanData.FirstName}
                                        fullWidth  
                                        onChange={HandleInputChange}
                                        variant="standard"
                                    />
                                    </Grid>
                                    <Grid item xs={12} sm={4.5}>
                                    <TextField
                                        id="LastName"
                                        name="LastName"
                                        label="Last name"
                                        value={globalLoanData.LastName}
                                        fullWidth
                                        onChange={HandleInputChange}
                                        variant="standard"
                                    />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="Email"
                                        name="Email"
                                        value={globalLoanData.Email}
                                        onChange={HandleInputChange}
                                        label="Your email"
                                        fullWidth
                                        variant="standard"
                                    />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="Mobile"
                                        name="Mobile"
                                        label="Your Mobile Number"
                                        value={globalLoanData.Mobile}
                                        onChange={HandleInputChange}
                                        fullWidth
                                        variant="standard"
                                    />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Date Of Birth"
                                                value ={ globalLoanData.DateOfBirth}
                                                name = 'DateOfBirth'
                                                onChange={handleDateChange}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12}></Grid>
                                
                                </Grid>

                                
                                <Grid  container  justifyContent="center" alignItems="center">
                                    <Button 
                                        size="large"
                                        type="submit" 
                                        variant="contained" 
                                        color="primary"
                                    >
                                        Calculate quote
                                    </Button>
                                </Grid>
                            </form>
                        </Grid>
                </Paper>
            <Copyright />
        </Container>
        </ThemeProvider>
    )
};

export default PaymentForm;

const PrettoSlider = styled(Slider)({
    // color: '#52af77',
    height: 8,
    '& .MuiSlider-track': {
      border: 'none',
    },
    '& .MuiSlider-thumb': {
      height: 24,
      width: 24,
      // backgroundColor: '#fff',
      border: '2px solid currentColor',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
      '&:before': {
        display: 'none',
      },
    },
    '& .MuiSlider-valueLabel': {
      lineHeight: 1.2,
      fontSize: 12,
      background: 'unset',
      padding: 0,
      width: 47,
      height: 47,
      borderRadius: '50% 50% 50% 0',
      backgroundColor: '#52af77',
      transformOrigin: 'bottom left',
      transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
      '&:before': { display: 'none' },
      '&.MuiSlider-valueLabelOpen': {
        transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
      },
      '& > *': {
        transform: 'rotate(45deg)',
      },
    },
  });
  
