import { useState } from "react";
import { forgotPassword } from "../../services/authService";

import React from 'react'

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message,setMessage] = useState('');


  return (
<main>
    <h1>Vault Recovery</h1>
    <p>{message}</p>
    <form onSubmit={}>
    <label htmlFor="email">Email Adress:</label>
    <input type="email" id="email" value={email} placeholder="Enter your registered email" 
    required onChange={}/>
    <button type="submit">Send Reset Link</button>

    </form>
</main>
)
};

export default ForgotPassword