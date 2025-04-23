import React from 'react';
//styles
import "../Transactions/Transactions.css";
import TopExpenseBody from '../TopExpenseBody/TopExpenseBody';

const TopExpenses = ({ transactionData }) => {
    return (
        <div className='Transactions'>
            <h2>Top Expenses</h2>
            <TopExpenseBody transactionData={transactionData} />
        </div>
    );
};

export default TopExpenses;