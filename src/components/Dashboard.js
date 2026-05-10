import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import EmailGenerator from './EmailGenerator';

function Dashboard({ user }) {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>✉️ AI Email Assistant</h1>
        <div style={styles.userInfo}>
          <span>{user.email}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Deconectare</button>
        </div>
      </header>
      <EmailGenerator user={user} />
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', background:'#f0f2f5' },
  header: { background:'white', padding:'16px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' },
  title: { margin:0, color:'#4F46E5' },
  userInfo: { display:'flex', alignItems:'center', gap:'16px' },
  logoutBtn: { padding:'8px 16px', background:'#ef4444', color:'white', border:'none', borderRadius:'8px', cursor:'pointer' }
};

export default Dashboard;