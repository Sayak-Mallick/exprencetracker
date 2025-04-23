import React from 'react';
//styles
import "./Transactions.css";
//components
import TransactionsBody from '../TransactionsBody/TransactionsBody';

const Transactions = ({ transactionData }) => {
    return (
        <div className='Transactions'>
            <h2>Recent Transactions</h2>
            <TransactionsBody transactionData={transactionData} />
        </div>
    );
};

export default Transactions;