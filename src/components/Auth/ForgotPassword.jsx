import { useState } from "react";
import { forgotPassword } from "../../services/authService";
import { Link } from "react-router";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setMessage('');
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventdefault();
        try {
            const responce = await forgotPassword(email);
            setMessage(responce.message);
        } catch (error) {
            setMessage(err.err || 'Error sending request');
        }
    }

    return (
        <main>
            <h1>Vault Recovery</h1>
            {message && <p>{message}</p>}
            {!message ? (
            <form onSubmit={ handleSubmit }>
                <label htmlFor="email">Email Adress:</label>
                <input type="email" id="email" value={email} placeholder="Enter your registered email"
                    required onChange={ handleChange } />
                <button type="submit">Send Reset Link</button>
            </form>
            ) : (
                <p>Please check your inbox for further instructions.</p>
            )}
                <Link to="/sign-in">Return to Entrance (Sign In)</Link>
        </main>
    )
};

export default ForgotPassword