import React, { useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';
import {format} from 'date-fns';

import CurrencyInput from './CurrencyInput';

const API_KEY = "c91ae9589450809cebc7547c";
const CURRENCY_API = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

const CurrencyConverter = () => {

  const [amountOne, setAmountOne] = useState(1);
  const [amountTwo, setAmountTwo] = useState(1);
  const [currencyOne, setCurrencyOne] = useState("USD");
  const [currencyTwo, setCurrencyTwo] = useState("PKR");
  const[currencyRates, setCurrencyRates] = useState([]);

  useEffect(() => {
    axios.get(CURRENCY_API)
    .then((response) => {
      setCurrencyRates(response.data.conversion_rates)
    }).catch((error) => {
      console.log(error);
      setCurrencyRates(null);
    })
  }, []);

  const handleAmountOneChange = (amountOne) => {
    setAmountTwo(formatCurrency((amountOne * currencyRates[currencyTwo]) / currencyRates[currencyOne]));
    setAmountOne(amountOne);
  };

  useEffect(() => {
    if(!!currencyRates){
      handleAmountOneChange(1);
    }
  }, [currencyRates]);

  const formatCurrency = (number) => {
    return number.toFixed(2);
  };

  const handleAmountTwoChange = (amountTwo) => {
    setAmountOne(formatCurrency((amountTwo * currencyRates[currencyOne]) / currencyRates[currencyTwo]));
    setAmountTwo(amountTwo);
  };

  const handleCurrencyOneChange = (currencyOne) => {
    setAmountTwo(formatCurrency((amountOne * currencyRates[currencyTwo]) / currencyRates[currencyOne]));
    setCurrencyOne(currencyOne);
  };

  const handleCurrencyTwoChange = (currencyTwo) => {
    setAmountOne(formatCurrency((amountTwo * currencyRates[currencyOne]) / currencyRates[currencyTwo]));
    setCurrencyTwo(currencyTwo);
  };

  if(!currencyRates) return <p>Something went wrong!</p>;

  if(currencyRates.length === 0) return <p>Loading...!</p>

  return (
    <div className='main-div'>
      <h1>React Currency Converter</h1>
      <p className='currency-one-text'>1 {currencyOne} equals to</p>
      <p className='rate-text'> {formatCurrency(amountTwo / amountOne)} {currencyTwo}</p>
      <p className='date'>{format(new Date(), "dd/MM/yyyy h:mm")}</p>

      <CurrencyInput 
      amount={amountOne} 
      currency={currencyOne} 
      currencies={Object.keys(currencyRates)}
      onAmountChange={handleAmountOneChange}
      onCurrencyChange={handleCurrencyOneChange} />

      <CurrencyInput amount={amountTwo} 
      currency={currencyTwo} 
      currencies={Object.keys(currencyRates)}
      onAmountChange={handleAmountTwoChange}
      onCurrencyChange={handleCurrencyTwoChange} />
    </div>
  );
};

export default CurrencyConverter;