import { useContext } from 'react';
import { Routes, Route } from 'react-router';
import { UserContext } from './contexts/UserContext';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/Auth/SignUpForm';
import SignInForm from './components/Auth/SignInForm';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import LifePhaseForm from './components/LifePhase/LifePhaseForm';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import LifePhaseDetails from './pages/LifePhaseDetails';
import LifePhaseList from './pages/LifePhaseList';
import MemoryDetails from './pages/MemoryDetails'
const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar/>
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Landing />} />

        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/reset-password/:token' element={<ResetPassword/>}/>

        
        <Route path='/profile' element={user ? <Profile /> : <Landing />} />
        
        <Route path='/lifePhases' element={user ? <LifePhaseList /> : <Landing />} />
        <Route path='/lifePhases/new' element={user ? <LifePhaseForm /> : <Landing />} />
        <Route path='/lifePhases/:id' element={user ? <LifePhaseDetails /> : <Landing />} />
        
        <Route path="/memories/:id" element={<MemoryDetails />} />
        <Route path='*' element={<Landing />} />
      </Routes>
    </>
  );
};

export default App;
