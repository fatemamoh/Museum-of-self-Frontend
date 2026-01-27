import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as authService from '../../services/authService';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState({ text: '', type: '' });
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
        masterPin: ''
    });

    const handleChange = (e) => {
        setMessage({ text: '', type: '' });
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setMessage({ text: "Passwords do not match.", type: 'error' });
        }
        try {
            await authService.resetPassword(token, formData);
            setMessage({ text: "Vault secured! Redirecting to sign in...", type: 'success' });
            
            setTimeout(() => {
                navigate('/sign-in');
            }, 2000);
        } catch (err) {
            setMessage({ text: err.err || "Token expired or invalid.", type: 'error' });
        }
    };

    return (
        <main>
            <h1>Restore Access</h1>
            {message.text && (
                <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>
                    {message.text}
                </p>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="password">New Password:</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="masterPin">New MasterPIN:</label>
                    <input
                        id="masterPin"
                        type="password"
                        name="masterPin"
                        value={formData.masterPin}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Update Vault</button>
            </form>
        </main>
    );
};

export default ResetPassword;