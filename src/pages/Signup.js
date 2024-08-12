import React from 'react';
import Header from '../components/Header/index';
import'../App.css';
import SignupSigninComponent from '../components/SignupSignin';

function Signup() {
  return (
    <div>
            <Header/>
            <div className='wrapper'>
              <SignupSigninComponent/>
            </div>
            
    </div>
  )
}

export default Signup;
