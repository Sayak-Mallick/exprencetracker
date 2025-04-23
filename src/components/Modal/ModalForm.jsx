import React, { useContext, useEffect, useState } from 'react';
//components
import FormButtons from '../FormButtons/FormButtons';
//contexts
import { MoneyContext, TransactionsContext } from '../../Contexts/AllContexts';
//style


const ModalForm = props => {
    //props
    const { toggleModal, formType, existingData } = props;
    //contexts
    const [money, setMoney] = useContext(MoneyContext);
    const [transactionData, setTransactionData] = useContext(TransactionsContext);
    //check for existing data to update transaction
    useEffect(()=> {
        if(existingData) updateFormDataWithExistingData();
    }, [])
    //states
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        date: new Date().toISOString().split("T")[0], //gives date in yyyy-mm-dd format
        category: "",
    })
    const [balanceFormData, setBalanceFormData] = useState({income: ""});
    //functions
    const updateFormDataWithExistingData = () => {
        const {name, date, amount, category} = existingData;
        setFormData({
            title: name,
            price: amount,
            date: date,
            category: category
        })
    }
    const handleChange = evt => {
        const key = evt.target.name, value = evt.target.value;
        setFormData({...formData, [key]: value });
    }
    const handleSubmit = evt => {
        evt.preventDefault();
        
        if(formType === "Add Balance"){
            if (!balanceFormData.income) {
                alert("Please enter an income amount");
                return;
            }
            
            setMoney({
                ...money,
                balance: money.balance + Number(balanceFormData.income)
            });
            
            // Clear form after submission
            setBalanceFormData({income: ""});
        }
        
        if(formType === "Add Expense"){
            // Validate all fields are filled
            if (!formData.title || !formData.price || !formData.category || !formData.date) {
                alert("Please fill in all fields");
                return;
            }
            
            let newExpense = money.expenses + Number(formData.price);
            let newBalance = money.balance - Number(formData.price);

            if(newBalance < 0){
                alert("Out of balance");
                return;
            } else {
                let newId = new Date().getTime();
                let newTransaction = {
                    name: formData.title,
                    price: Number(formData.price),
                    date: formData.date,
                    category: formData.category,
                    id: newId
                };
                
                setMoney({balance: newBalance, expenses: newExpense});
                setTransactionData([...transactionData, newTransaction]);
                
                // Clear form after submission
                setFormData({
                    title: "",
                    price: "",
                    date: new Date().toISOString().split("T")[0],
                    category: "",
                });
            }
        }
        
        if(formType === "Edit Expense"){
            // Validate all fields are filled
            if (!formData.title || !formData.price || !formData.category || !formData.date) {
                alert("Please fill in all fields");
                return;
            }
            
            let newExpense = money.expenses + Number(formData.price) - Number(existingData.amount);
            let newBalance = money.balance - Number(formData.price) + Number(existingData.amount);

            if(newBalance < 0) {
                alert("Out of balance");
                return;
            }
            
            //get index of transaction
            const indexOfTransaction = transactionData.findIndex(transaction => existingData.id === transaction.id);
            //store transaction data in new variable
            const updatedTransaction = {
                name: formData.title,
                price: Number(formData.price),
                date: formData.date,
                category: formData.category,
                id: existingData.id
            };
            //add that new tranaction at that index with same id
            const updatedTransactions = [...transactionData];
            updatedTransactions[indexOfTransaction] = updatedTransaction;

            setMoney({balance: newBalance, expenses: newExpense});
            setTransactionData(updatedTransactions);
        }

        toggleModal();
    }

    const expenseAndEditInput = () => {
        return (
            <div className='formInputsDiv'>
                <input 
                required
                value={formData.title}
                className="formInput" 
                onChange={handleChange} 
                placeholder='Title' 
                type='text' 
                name='title'
                autoFocus
                />
                <input 
                required
                value={formData.price}
                className="formInput" 
                onChange={handleChange} 
                placeholder='Price' 
                type='number' 
                name='price'
                />
                <select
                required
                value={formData.category} 
                className="formInput" 
                onChange={handleChange} 
                placeholder='Select Category' 
                name='category'>
                    <option value="">Select Category</option>
                    <option value="food">Food</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="travel">Travel</option>
                </select>
                <input 
                required
                value={formData.date}
                className="formInput" 
                onChange={handleChange} 
                placeholder='dd/mm/yyyy' 
                type='date' 
                name='date'
                />
            </div>
        )
    } 
    
    const incomeInputs = () => {
        return (
            <div className='balanceFormInputDiv'>
                <input 
                className="formInput" 
                onChange={e=> setBalanceFormData({income: +e.target.value})} 
                placeholder='Income Amount' 
                type='number' 
                name='income' 
                value={balanceFormData.income}
                autoFocus
                required
                />
            </div>
        )
    }
    
    return (
        <form className='modalForm expensesForm' onSubmit={handleSubmit}>
            {formType === "Add Balance" ? incomeInputs() : expenseAndEditInput()}
            <div className="formButtonsContainer">
                <button type="button" onClick={toggleModal} className="cancelButton">Cancel</button>
                <button type="submit" className="submitButton">
                    {formType}
                </button>
            </div>
        </form>
    )
}

export default ModalForm;