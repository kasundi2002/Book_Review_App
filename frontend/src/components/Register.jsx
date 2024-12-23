import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); 

const handleRegistration = async (e) => {
  console.log(`Inside register`)
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Passwords don't match!");
    return;
  }

  try {
    // API call to register the user
    const response = await fetch('http://localhost:8081/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Registration failed: ${errorData.message || 'Unknown error'}`);
      return;
    }

    const data = await response.json();
    console.log(data);
    alert('Registration successful! Please login.');

    // Redirect to login page after successful registration
    navigate('/login');
  } catch (error) {
    console.error('Error during registration:', error.message);
    alert('Registration failed. Please try again.');
  }
};


  const handleLoginRedirect = () => {
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.heading}>Register</h2>
      <form>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={styles.input} 
          />
        </div>
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
        <div style={styles.formGroup}>
          <label style={styles.label}>Confirm Password</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            style={styles.input} 
          />
        </div>
        <button type="button" style={styles.button} onClick={handleRegistration}>Register</button>

        <button type="submit" style={styles.login} onClick={handleLoginRedirect}>Already have an account?</button>
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
  login:   {
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

export default Registration;
