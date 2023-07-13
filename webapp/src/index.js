import React, { useState }  from 'react';
import { MyContext } from './Context';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import Calculate from './Components/Calculate';
import PageSuccess from './Components/SuccessPage';
import Quote from './Components/Quote';
import theme from './theme';
import dayjs from 'dayjs';

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
// import Checkout from './Components/Checkout';

// Creating a context

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
 
const App=()=>{
  
  const [globalLoanData, setGlobalLoanData] = useState({
    AmountRequired: 2100,
    FirstName: "", 
    LastName: "", 
    Mobile: "", 
    RepaymentFrom: 0, 
    Term: 1, 
    Title: "Mr", 
    Token: "",
    Email: "",
    DateOfBirth: dayjs("1990-01-01")
});

  return (
    <MyContext.Provider value={{globalLoanData,setGlobalLoanData}}>
      <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/calculate" element={<Calculate />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/success" element={<PageSuccess />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </MyContext.Provider>
  )
}

root.render(
  <App />
);