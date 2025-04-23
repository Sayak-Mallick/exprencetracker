import React, { useEffect, useState, useContext } from 'react';
//styles
import "../TransactionsBody/TransactionsBody.css";
//hooks
import useChartData from '../customHooks/useChartData';
//library
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
//contexts
import { TransactionsContext } from '../../Contexts/AllContexts';

const TopExpenseBody = ({ transactionData: propTransactionData }) => {
    //contexts
    const [contextTransactionData] = useContext(TransactionsContext);
    // Use prop data if provided, otherwise use context data
    const transactionData = propTransactionData || contextTransactionData;
    
    //state
    const [chartData, setChartData] = useState([
        { name: 'Food', value: 0 },
        { name: 'Entertainment', value: 0 },
        { name: 'Travel', value: 0 },
    ]);
    
    useEffect(() => {
        calculateCategories();
    }, [transactionData]);
    
    //functions
    const calculateCategories = () => {
        let foodTotal = 0, entertainmentTotal = 0, travelTotal = 0;
        
        if (transactionData && transactionData.length) {
            transactionData.forEach(item => {
                if(item.category === "food"){
                    foodTotal += Number(item.price);
                }
                if(item.category === "entertainment"){
                    entertainmentTotal += Number(item.price);
                }
                if(item.category === "travel") {
                    travelTotal += Number(item.price);
                }
            });
        }
        
        setChartData([
            { name: 'Food', value: foodTotal },
            { name: 'Entertainment', value: entertainmentTotal },
            { name: 'Travel', value: travelTotal },
        ]);
    };
    
    const showSortedData = () => {
        return chartData.sort((a,b) => b.value - a.value);
    };
    
    return (
        <div className='TopExpensesBody' style={{height: "100px"}}>
            <ResponsiveContainer width="100%" height="100%" >
                <BarChart data={showSortedData()} layout="vertical" barSize={30}>
                    <XAxis type='number' hide/>
                    <YAxis type="category" width={120} dataKey="name"/>
                    <Bar dataKey="value" fill="#8784D2" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TopExpenseBody;
