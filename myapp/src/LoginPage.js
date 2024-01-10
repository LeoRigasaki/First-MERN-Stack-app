import { useState } from 'react';
import { Alert, Button, Snackbar } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

const ErrorBanner = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useState(() => {
    const timeout = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', margin: '10px 0', borderRadius: '4px' }}>
      <p>{message}</p>
    </div>
  );
};
function LoginPage() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('signUp');
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userID, setUserID] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const changeView = (view) => {
    setCurrentView(view);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const validatePassword = (password) => {
    if (password.length <= 6) {
      setPasswordError('Password must be longer than 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };
  const handleLogin = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;
    if (!validatePassword(password)) {
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        // Login was successful
        const data = await response.json();
        const { userID } = data;
        console.log('Login successful');
        console.log('userID:', userID);
        setUserID(userID);
        localStorage.setItem('username', username);
        localStorage.setItem('userID', userID);
        setOpenSuccessAlert(true);
        navigate('/dashboard');
      } else {
        console.error('Login error:', response.status);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };
  const handleSignup = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    if (!validatePassword(password)) {
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.status === 201) {
        const data = await response.json();
        const { userID } = data;
        console.log('Signup successful');
        console.log('userID:', userID);
        setUserID(userID);
        localStorage.setItem('username', username);
        localStorage.setItem('userID', userID);
        setOpenSuccessAlert(true);
        navigate('/dashboard');
      } else {
        console.error('Signup error:', response.status);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };
  const handleCloseSuccessAlert = () => {
    setOpenSuccessAlert(false);
  };

  const currentViewComponent = () => {
    switch (currentView) {
      case 'signUp':
        return (
          
          <>{passwordError && <ErrorBanner message={passwordError} />}
          <form onSubmit={handleSignup}>
            <h2>Sign Up!</h2>
            <fieldset>
              <legend>Create Account</legend>
              <ul>
                <li>
                  <label htmlFor="username">Username:</label>
                  <input type="text" id="username" name="username" required />
                </li>
                <li>
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" name="email" required />
                </li>
                <li>
                  <label htmlFor="password">Password:</label>
                  <div style={{ display: 'flex' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </button>
                  </div>
                </li>
              </ul>
            </fieldset>
            <Button type="submit" variant="outlined">
              Submit
            </Button>
            <Button type="button" onClick={() => changeView('logIn')}>
              Have an Account?
            </Button>
          </form>
          </>
        );
      case 'logIn':
        return (
          <>{passwordError && <ErrorBanner message={passwordError} />}
          <form onSubmit={handleLogin}>
            <h2>Welcome Back!</h2>
            <fieldset>
              <legend>Log In</legend>
              <ul>
                <li>
                  <label htmlFor="username">Username:</label>
                  <input type="text" id="username" name="username" required />
                </li>
                <li>
                  <label htmlFor="password">Password:</label>
                  <input type="password" id="password" name="password" required />
                </li>
                <li>
                  <i />
                  <button
                    onClick={() => changeView('PWReset')}
                    href="#"
                  >
                    Forgot Password?
                  </button>
                </li>
              </ul>
            </fieldset>
            <Button type="submit" variant="outlined">
              Login
            </Button>
            <Button type="button" onClick={() => changeView('signUp')}>
              Create an Account
            </Button>
          </form>
          </>
        );
      case 'PWReset':
        return (
          <form>
            <h2>Reset Password</h2>
            <fieldset>
              <legend>Password Reset</legend>
              <ul>
                <li>
                  <em>A reset link will be sent to your inbox!</em>
                </li>
                <li>
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" name="email" required />
                </li>
              </ul>
            </fieldset>
            <Button variant="outlined">Send Reset Link</Button>
            <Button
              type="button"
              onClick={() => changeView('logIn')}
            >
              Go Back
            </Button>
          </form>
        );

      default:
        break;
    }
  };
  return (
    <section id="entry-page">
      {currentViewComponent()}
      <Snackbar
        open={openSuccessAlert}
        autoHideDuration={6000}
        onClose={handleCloseSuccessAlert}
      >
        <Alert
          onClose={handleCloseSuccessAlert}
          severity="success"
          sx={{ width: '100%' }}
        >
          {currentView === 'signUp' ? `Signup successful! Your userID is ${userID}` : `Login successful! Your userID is ${userID}`}
        </Alert>
      </Snackbar>
    </section>
  );
}

export default LoginPage;
