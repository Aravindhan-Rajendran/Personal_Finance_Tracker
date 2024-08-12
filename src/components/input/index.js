import React from 'react';
import './style.css';

function Input({ label, state, setState, placeholder, type }) {
  return (
    <div className='input-wrapper'>
      <p className='label-input'>{label}</p>
      <input
        value={state}
        placeholder={placeholder}
        type={type}
        onChange={(e) => setState(e.target.value)} // Update state on change
        className='custom-input'
      />
    </div>
  );
}

export default Input;