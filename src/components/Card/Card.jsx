import React, { useState } from 'react';
//styles
import "./Card.css"
//components
import Button from '../Button/Button';
import Modal from '../Modal/Modal';

const Card = props => {
    //props
    const { text, value} = props;
    //states
    const [modalOn, setModalOn] = useState(false);
    //functions
    const toggleModal = () => setModalOn(!modalOn);

    return (
        <div className='card'>
            <span className='cardText'>
                <span>{text}: </span> 
                <span className={text === "Expenses" ? "cardTextRed" : "cardTextGreen"}>
                    ₹{value}
                </span>
            </span>
            <button 
                type="button"
                className={`Button largeButton ${text === "Expenses" ? "gradientRed" : "gradientGreen"}`}
                onClick={toggleModal}
            >
                {text === "Expenses" ? "+ Add Expense" : "+ Add Income"}
            </button>
            {modalOn ? 
                <Modal 
                toggleModal={toggleModal} 
                text={text === "Expenses" ? "Add Expense" : "Add Balance"}/> 
            :null
            }
        </div>
    );
};

export default Card;