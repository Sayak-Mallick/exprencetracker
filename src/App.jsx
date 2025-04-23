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
    balance: 3800,
    expenses: 1200
  })
  const [transactionData, setTransactionData] = useState(dummyData);
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
      localStorage.setItem("allData", JSON.stringify({money, transactionData}));
    }
  }, [money, transactionData])

  //functions
  const onLoad = () => {
    //load data from local storage if present
    const localData = localStorage.getItem("allData");
    if (localData) {
      try {
        const parsedData = JSON.parse(localData);
        if (parsedData.money) setMoney(parsedData.money);
        if (parsedData.transactionData) setTransactionData(parsedData.transactionData);
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
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
