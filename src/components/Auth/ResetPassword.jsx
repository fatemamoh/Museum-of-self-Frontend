import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { resetPassword } from '../../services/authService';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setMessage('');
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await resetPassword(token, password);
            alert("Vault secured with new credentials!");
            navigate('/sign-in');
        } catch (err) {
            setMessage(err.err || "Token expired or invalid.");
        }
    };

    return (
        <main>
            <h1>Restore Access</h1>
            <p style={{ color: 'red' }}>{message}</p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="password">New Password:</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Min 8 characters, letters & numbers"
                    required
                />
                <button type="submit">Update Vault</button>
            </form>
        </main>
    );
};

export default ResetPassword;