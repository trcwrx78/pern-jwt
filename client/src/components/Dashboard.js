import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import jwtAPI from '../api/jwtAPI';

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState('');

  const getName = async () => {
    try {
      const res = await jwtAPI.get('/dashboard', {
        headers: { token: localStorage.token },
      });

      setName(res.data.user_name);
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = (e) => {
    e.preventDefault();

    localStorage.removeItem('token');

    setAuth(false);

    toast.success('Logged out successfully');
  };

  useEffect(() => {
    getName();
  }, []);

  return (
    <>
      <h1>Dashboard {name}</h1>
      <button className='btn btn-primary' onClick={logout}>
        Logout
      </button>
    </>
  );
};

export default Dashboard;
