import React, { useEffect, useState, useContext } from 'react';
import { MyContext } from '../../Context';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Divider, Label } from '@mui/material';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Alert from '@mui/material/Alert';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
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


const Quote = () => {
    const {globalLoanData, setGlobalLoanData} = useContext(MyContext);
    console.log(globalLoanData)
    const navigate = useNavigate();
    const [errorData, setErrorData] = useState({});
    const defaultTheme = createTheme();
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [isEditingFinance, setIsEditingFinance] = useState(false);

    const HandleInputChange = (e) => {
        const { name, value } = e.target;
        setGlobalLoanData((prevData) => ({
            ...prevData,
            [name]: value
        }));
      
    };

    const handleEditInfo = (e) =>{
        setIsEditingInfo(true)  
    }

    const handleEditFinance = (e) =>{
        setIsEditingFinance(true)   
    }

    const handleSaveInfo = (e) =>{
        setIsEditingInfo(false)  

    }
    const handleSaveFinance = (e) =>{
        // Todo
        axios.post('http://localhost:8100/calculate-loan', ({
            ...globalLoanData,
            AmountRequired: parseFloat(globalLoanData.AmountRequired),
            Term: parseInt(globalLoanData.Term),
            RepaymentFrom: parseFloat(globalLoanData.RepaymentFrom),
            DateOfBirth: globalLoanData.DateOfBirth.format('YYYY-MM-DD')
        }))
        .then((data) => {
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
        
        })
        .catch((error) => {
        console.error(error);
        
        });
        setIsEditingFinance(false)   
    }

    const handleErrorData = (e) =>{
        setErrorData({isError: true, errorMessage: e})   
    }

    const handleDateChange = (date) => {
        setGlobalLoanData((prevData) => ({
            ...prevData,
            DateOfBirth: date
        }));
      };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        console.log("globalLoanData.Token :" , globalLoanData)
        axios.patch(`http://localhost:8100/loan/${globalLoanData.Token}`, 
        ({
            ...globalLoanData,
            AmountRequired: parseFloat(globalLoanData.AmountRequired),
            Term: parseInt(globalLoanData.Term),
            RepaymentFrom: parseFloat(globalLoanData.RepaymentFrom),
            DateOfBirth: globalLoanData.DateOfBirth.format('YYYY-MM-DD')
        })
        )
        .then((response) => {
            navigate('/success')
        })
        .catch((error) => {
            console.error(error.response.data);
            handleErrorData(error.response.data)

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
        
            <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                    <Typography component="h1" variant="h4" align="center" marginBottom={10}>
                        Your Quote
                    </Typography> 
                        <Grid>
                            <form onSubmit={handleSubmit}>
                                <Grid mb={2}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} align={"left"}>  
                                            <Typography variant='h5'>Your information</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6} align={"right"}>  
                                            {isEditingInfo ? 
                                                (
                                                    <>
                                                        <Button onClick={handleSaveInfo}>Save</Button>
                                                    </>
                                                ):(
                                                    <>
                                                        <Button onClick={handleEditInfo}>Edit</Button>
                                                    </>
                                                )
                                            } 
                                        </Grid>
                                    </Grid>
                                    <Grid>
                                            { isEditingInfo ? (
                                            <>
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
                                                </Grid>
                                            </>
                                            ):(
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={3} align={"left"}>  
                                                            <Typography variant='h7'>Name</Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={9} align={"right"}>  
                                                            <Typography>{globalLoanData.Title +' ' +globalLoanData.FirstName +' ' +globalLoanData.LastName}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={3} align={"left"}>  
                                                            <Typography variant='h7'>Mobile</Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={9} align={"right"}>  
                                                            <Typography>{globalLoanData.Mobile}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={3} align={"left"}>  
                                                            <Typography variant='h7'>Email</Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={9} align={"right"}>  
                                                            <Typography>{globalLoanData.Email}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={3} align={"left"}>  
                                                            <Typography variant='h7'>Date Of Birth</Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={9} align={"right"}>  
                                                            <Typography>{globalLoanData.DateOfBirth.format('YYYY-MM-DD')}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </>  
                                            )}
                                        
                                    </Grid>    
                                </Grid>
                                <Divider></Divider>
                                <Grid>  
                                    <Grid container spacing={2} >
                                        <Grid item xs={12} sm={6} align={"left"}>  
                                            <Typography variant='h5'>Finance details</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6} align={"right"}>  
                                            {isEditingFinance ? 
                                            (
                                                <>
                                                    <Button onClick={handleSaveFinance}>Save</Button>
                                                </>
                                            ):(
                                                <>
                                                    <Button onClick={handleEditFinance}>Edit</Button>
                                                </>
                                            )}    
                                        </Grid>
                                    </Grid>
                                    <Grid>                
                                        {isEditingFinance ? 
                                            (
                                                <>
                                                    <TextField
                                                        id="AmountRequired"
                                                        name="AmountRequired"
                                                        label="Finance Amount"
                                                        value={globalLoanData.AmountRequired}
                                                    
                                                        onChange={HandleInputChange}
                                                        // variant="standard"
                                                    />
                                                    <Grid container marginTop={5}>
                                                        <Slider
                                                        m
                                                        defaultValue={24}
                                                        valueLabelDisplay="on"
                                                        value={globalLoanData.Term}
                                                        name='Term'
                                                        onChange={HandleInputChange}
                                                        valueLabelFormat={valueMonthFormat}
                                                        marks
                                                        size='large'
                                                        min={1}
                                                        max={64}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} align={"center"} marginBottom={5}>  
                                                        <Typography>Terms of Payment</Typography>
                                                    </Grid>
                                                </> 
                                            )
                                        :   
                                        (
                                            <>
                                                <Grid  mt={.5}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={6} align={"left"}>  
                                                            <Typography variant='h7'>Finance amount</Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} align={"right"}>  
                                                            <Typography>{ valueLabelFormat(globalLoanData.AmountRequired)}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={6} align={"left"}>  
                                                            <Divider></Divider>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} align={"right"}>  
                                                            <Typography>over { valueMonthFormat(globalLoanData.Term)} </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid> 
                                                <Grid mt={1}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={6} align={"left"}>  
                                                            <Typography variant='h7'>Repayments from</Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} align={"right"}>  
                                                            <Typography>{ valueLabelFormat(globalLoanData.RepaymentFrom)}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={6} align={"left"}>  
                                                            <Divider></Divider>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} align={"right"}>  
                                                            <Typography>monthly</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid> 
                                            </>
                                        )}
                                    </Grid>
                                </Grid>    

                                <Grid container justifyContent="center" alignItems="center">
                                    <Button 
                                        size="large"
                                        type="submit" 
                                        variant="contained" 
                                        color="primary"
                                    >
                                        Apply now
                                    </Button>
                                </Grid>
                                <Grid container justifyContent="center" mt={5} alignItems="center">
                                    {errorData.isError ? 
                                        (<><Alert severity="error">{errorData.errorMessage}</Alert></>)
                                        :
                                        (<></>)
                                    }
                                </Grid>

                            </form>
                        </Grid>
                </Paper>
            <Copyright />
        </Container>
        </ThemeProvider>
    )
};

export default Quote;

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
  

