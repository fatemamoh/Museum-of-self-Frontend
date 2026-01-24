import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import * as authService from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignUpForm = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '', 
    password: '',
    passwordConf: '',
    masterPin: '', 
  });

  const { setUser } = useContext(UserContext);

  const { username, email, password, passwordConf, masterPin } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const user = await authService.signUp(formData);
      setUser(user);
      navigate('/');
    } catch (err) {
      setMessage(err.response.data.err);
    }
  };

  const isFormInvalid = () => {
    return !(
      username && 
      email && 
      password && 
      password === passwordConf && 
      masterPin
    );
  };

  return (
    <main>
      <h1>Sign Up</h1>
      <p style={{ color: 'red' }}>{message}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            id='username'
            value={username}
            name='username'
            placeholder="Choose a display name"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            id='email'
            value={email}
            name='email'
            placeholder="example@mail.com"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            value={password}
            name='password'
            placeholder="8+ characters, letter & number"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor='confirm'>Confirm Password:</label>
          <input
            type='password'
            id='confirm'
            value={passwordConf}
            name='passwordConf'
            placeholder="Re-enter password"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor='masterPin'>MasterPIN (4-6 digits):</label>
          <input
            type='password'
            id='masterPin'
            value={masterPin}
            name='masterPin'
            placeholder="Numbers only"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <button disabled={isFormInvalid()}>Sign Up</button>
          <button type="button" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </main>
  );
};

export default SignUpForm;