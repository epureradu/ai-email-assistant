import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Email sau parolă greșite.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Autentificare</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} type="password" placeholder="Parolă" value={password} onChange={e => setPassword(e.target.value)} />
        <button style={styles.button} onClick={handleLogin}>Intră în cont</button>
        <p>Nu ai cont? <Link to="/register">Înregistrează-te</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f0f2f5' },
  card: { background:'white', padding:'40px', borderRadius:'12px', boxShadow:'0 2px 20px rgba(0,0,0,0.1)', display:'flex', flexDirection:'column', gap:'16px', width:'320px' },
  input: { padding:'12px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'16px' },
  button: { padding:'12px', background:'#4F46E5', color:'white', border:'none', borderRadius:'8px', fontSize:'16px', cursor:'pointer' },
  error: { color:'red', fontSize:'14px' }
};

export default Login;