import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import jwtAPI from '../api/jwtAPI';

const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });

  const { email, password } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const res = await jwtAPI.post('/auth/login', {
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);

        setAuth(true);

        toast.success('Logged in successfully');
      }
    } catch (err) {
      console.error(err.message);
      toast.error(err.message);
      setAuth(false);
    }
  };

  return (
    <>
      <h1 className='text-center my -5'>Login</h1>
      <form onSubmit={onSubmitForm}>
        <input
          type='email'
          name='email'
          placeholder='email'
          className='form-control my-3'
          value={email}
          onChange={(e) => onChange(e)}
        />
        <input
          type='password'
          name='password'
          placeholder='password'
          className='form-control my-3'
          value={password}
          onChange={(e) => onChange(e)}
        />

        <div className='d-grid gap-2'>
          <button className='btn btn-success'>Submit</button>
        </div>
      </form>
      <Link to='/register'>Register</Link>
    </>
  );
};

export default Login;
