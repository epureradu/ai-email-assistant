import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import axios from 'axios';
import emailjs from '@emailjs/browser';

function EmailGenerator({ user }) {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('profesional');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const q = query(
          collection(db, 'emails'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error('Eroare la încărcarea istoricului:', err);
      }
    };
    loadHistory();
  }, [user.uid]);

  const generateEmail = async () => {
    if (!topic) { setStatus('Te rog introdu un subiect!'); return; }
    setLoading(true);
    setStatus('');
    setGeneratedEmail('');

    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-haiku-4-5',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content: `Scrie un email ${tone} în română despre: "${topic}". Include subiect (Subject:) și corpul emailului. Fii concis și profesionist.`
          }]
        },
        {
          headers: {
            'x-api-key': process.env.REACT_APP_ANTHROPIC_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
            'Content-Type': 'application/json'
          }
        }
      );

      const emailText = response.data.content[0].text;
      setGeneratedEmail(emailText);

      await addDoc(collection(db, 'emails'), {
        userId: user.uid,
        topic,
        tone,
        content: emailText,
        createdAt: new Date()
      });

      const q = query(collection(db, 'emails'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      setStatus('✅ Email generat cu succes!');
    } catch (err) {
      setStatus('❌ Eroare la generare: ' + err.message);
    }
    setLoading(false);
  };

  const sendEmail = async () => {
    if (!recipientEmail) { setStatus('Introdu adresa destinatarului!'); return; }
    if (!generatedEmail) { setStatus('Generează mai întâi un email!'); return; }
    setSending(true);
    setStatus('');

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          to_email: recipientEmail,
          message: generatedEmail,
          subject: 'Email generat cu AI',
          name: user.email
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
      setStatus('✅ Email trimis cu succes!');
    } catch (err) {
      setStatus('❌ Eroare la trimitere: ' + JSON.stringify(err));
    }
    setSending(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainPanel}>
        <h2>Generează un email cu AI</h2>

        <div style={styles.formGroup}>
          <label>Subiectul emailului:</label>
          <textarea
            style={styles.textarea}
            placeholder="Ex: Cer o zi liberă pentru vineri din motive personale"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            rows={3}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Tonul emailului:</label>
          <select style={styles.select} value={tone} onChange={e => setTone(e.target.value)}>
            <option value="profesional">Profesional</option>
            <option value="formal">Formal</option>
            <option value="prietenos">Prietenos</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <button style={styles.button} onClick={generateEmail} disabled={loading}>
          {loading ? '⏳ Se generează...' : '🤖 Generează cu AI'}
        </button>

        {generatedEmail && (
          <div style={styles.result}>
            <h3>Email generat:</h3>
            <pre style={styles.emailText}>{generatedEmail}</pre>

            <div style={styles.formGroup}>
              <label>Trimite la adresa:</label>
              <input
                style={styles.input}
                type="email"
                placeholder="destinatar@email.com"
                value={recipientEmail}
                onChange={e => setRecipientEmail(e.target.value)}
              />
            </div>

            <button style={{...styles.button, background:'#10b981'}} onClick={sendEmail} disabled={sending}>
              {sending ? '⏳ Se trimite...' : '📨 Trimite Email'}
            </button>
          </div>
        )}

        {status && <p style={styles.status}>{status}</p>}
      </div>

      <div style={styles.historyPanel}>
        <h3>Istoricul tău ({history.length} emailuri)</h3>
        {history.length === 0 && <p style={{color:'#888'}}>Nu ai generat niciun email încă.</p>}
        {history.map(item => (
          <div key={item.id} style={styles.historyItem} onClick={() => setGeneratedEmail(item.content)}>
            <p style={styles.historyTopic}>{item.topic}</p>
            <span style={styles.historyTone}>{item.tone}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', gap:'24px', padding:'24px', maxWidth:'1200px', margin:'0 auto' },
  mainPanel: { flex:2, background:'white', padding:'24px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' },
  historyPanel: { flex:1, background:'white', padding:'24px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', maxHeight:'80vh', overflowY:'auto' },
  formGroup: { marginBottom:'16px', display:'flex', flexDirection:'column', gap:'8px' },
  textarea: { padding:'12px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'15px', resize:'vertical' },
  select: { padding:'10px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'15px' },
  input: { padding:'10px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'15px' },
  button: { padding:'12px 24px', background:'#4F46E5', color:'white', border:'none', borderRadius:'8px', fontSize:'16px', cursor:'pointer', marginBottom:'16px' },
  result: { marginTop:'20px', padding:'16px', background:'#f8fafc', borderRadius:'8px' },
  emailText: { whiteSpace:'pre-wrap', fontFamily:'inherit', background:'white', padding:'16px', borderRadius:'8px', border:'1px solid #e2e8f0' },
  status: { marginTop:'12px', padding:'12px', background:'#f0fdf4', borderRadius:'8px', fontWeight:'500' },
  historyItem: { padding:'12px', marginBottom:'8px', border:'1px solid #e2e8f0', borderRadius:'8px', cursor:'pointer' },
  historyTopic: { margin:'0 0 4px 0', fontWeight:'500', fontSize:'14px' },
  historyTone: { fontSize:'12px', background:'#e0e7ff', color:'#4F46E5', padding:'2px 8px', borderRadius:'12px' }
};

export default EmailGenerator;