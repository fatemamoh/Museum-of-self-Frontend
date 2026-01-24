import { useContext } from 'react';
import { Routes, Route } from 'react-router';

import { UserContext } from './contexts/UserContext';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';
import LifePhaseDetails from './components/LifePhase/LifePhaseDetails';

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar/>
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Landing />} />

        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />

        <Route path='/profile' element={user ? <Profile /> : <Landing />} />
        <Route path='/lifePhases/:id' element={user ? <LifePhaseDetails /> : <Landing />} />
        
        <Route path='*' element={<Landing />} />
      </Routes>
    </>
  );
};

export default App;
