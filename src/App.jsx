import { useEffect, useRef, useState } from 'react'
//styles
import './App.css';
//components
import Navbar from './components/Navbar/Navbar'
import AppHead from './components/AppHead/AppHead'
import AppBody from './components/AppBody/AppBody';
//contexts
import { TransactionsContext, MoneyContext } from "./Contexts/AllContexts"
//variables
import { dummyData } from './dummyTransactions';

function App() {
  const [money, setMoney] = useState({
    balance: 5000, // Set initial balance to 5000 as per requirements
    expenses: 0    // Set initial expenses to 0
  })
  const [transactionData, setTransactionData] = useState([]);
  const initialRender = useRef(true);

  useEffect(() => {
    // Load data from localStorage on initial render
    onLoad();
    // Mark initial render as complete
    initialRender.current = false;
  }, [])

  useEffect(() => {
    // Save data to localStorage only after initial render
    if (!initialRender.current) {
      localStorage.setItem("expenses", JSON.stringify(transactionData));
      localStorage.setItem("walletBalance", JSON.stringify(money));
    }
  }, [money, transactionData])

  //functions
  const onLoad = () => {
    //load data from local storage if present
    const expensesData = localStorage.getItem("expenses");
    const walletData = localStorage.getItem("walletBalance");
    
    if (expensesData) {
      try {
        const parsedExpenses = JSON.parse(expensesData);
        setTransactionData(parsedExpenses);
      } catch (error) {
        console.error("Error parsing expenses data:", error);
      }
    }
    
    if (walletData) {
      try {
        const parsedWallet = JSON.parse(walletData);
        setMoney(parsedWallet);
      } catch (error) {
        console.error("Error parsing wallet data:", error);
      }
    }
  }

  return (
    <main className='App'>
      <MoneyContext.Provider value={[money, setMoney]}>
      <TransactionsContext.Provider value={[transactionData, setTransactionData]}>
        <Navbar />
        <AppHead balance={money.balance} expenses={money.expenses}/>
        <AppBody transactionData={transactionData}/>
      </TransactionsContext.Provider> 
      </MoneyContext.Provider>
    </main>
  )
}

export default App
