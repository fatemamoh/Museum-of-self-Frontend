import { useState } from "react";
import { forgotPassword } from "../../services/authService";

import React from 'react'

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message,setMessage] = useState('');
  return (
    <div>ForgotPassword</div>
  )
}

export default ForgotPassword