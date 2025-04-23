import React from 'react';
//styles
import "./AppBody.css";
import Transactions from '../Transactions/Transactions';
import TopExpenses from '../TopExpenses/TopExpenses';
//components

const AppBody = ({ transactionData }) => {
    return (
        <div className='AppBody'>
            <Transactions transactionData={transactionData} />
            <TopExpenses transactionData={transactionData} />
        </div>
    );
};

export default AppBody;