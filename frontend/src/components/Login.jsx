import { useEffect } from 'react';
import React, { useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Login = () => { 
  const { id } = useParams();
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState(''); // State to store user name
  const [userId, setUserId] = useState('');
  const [userType, setUserType] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async () => {
    console.log(`inside login: ${email} , ${password}`);
    if (!email || !password) {
      alert('Error', 'Email and Password are required');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8081/users/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userType', user.userType);
        localStorage.setItem('name', user.name);
        
        switch (user.userType) {
          case 'Customer':
            navigate('CustomerHomePage');
            break;
          case 'Admin':
            navigate('AdminHomePage');
            break;
          default:
            alert('Error', 'Invalid user type');
            break;
        }
      }
    } catch (error) {
      console.error(error);
      alert('Error', 'Invalid credentials');
    }
  };

  // useEffect(() => {
  //   // Fetching user profile
  //   const fetchUserProfile = async () => {
  //     try {
  //       const token = localStorage.getItem('token'); // Use localStorage for web

  //       if (token) {
  //          const id = token
  //         const response = await fetch(`http://localhost:8081/users/getUser/${id}`, {
  //           method: 'GET',
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });
  //         const data = await response.json();
  //         setUserName(data.userName); // Set the user's name
  //         setUserId(data._id);
  //         setUserType(data.userType);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user profile:', error);
  //     }
  //   };

  //   fetchUserProfile();
  // }, [id]);


  const handleRegisterRedirect = () => {
    navigate('/register'); // Navigate to the register page
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.heading}>Login</h2>
      <form>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={styles.input} 
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={styles.input} 
          />
        </div>
        <button type="submit" style={styles.button} onClick={handleLogin}>Login</button>

        <button type="register" style={styles.register} onClick={handleRegisterRedirect}>Don't have an account?</button>

      </form>
    </div>
  );
};

const styles = {
  formContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '300px',
    maxWidth: '100%',
    margin: 'auto',
    marginTop: '100px',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    color: '#333',
    marginBottom: '5px',
  },
  input: {
    width: '90%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '4px',
  },

  register:
  {
    width: '100%',
    padding: '10px',
    marginTop:20,
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};

export default Login;

