import React from 'react';
//styles
import "../Modal/Modal.css"

const FormButtons = props => {
    //props
    const { text, toggleModal } = props;
    return (
        <div className='formButtons'>
            <button 
                type="submit"
                className="Button largeButton backgroundOrange"
            >
                {text}
            </button>
            <button 
                type="button"
                className="Button largeButton backgroundWhite"
                onClick={toggleModal}
            >
                Cancel
            </button>
        </div>
    );
};

export default FormButtons;