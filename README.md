# AI Email Assistant

**Nume:** Epure Radu Corneliu  
**Grupa:** 1146  
**Link aplicație:** https://ai-email-assistant-snowy.vercel.app  
**Link video:** (adaugi după ce încarci pe YouTube)

---

## 1. Introducere

AI Email Assistant este o aplicație web care permite utilizatorilor să genereze și să trimită emailuri profesionale folosind inteligența artificială. Utilizatorul descrie pe scurt ce vrea să comunice, iar aplicația generează automat un email complet și îl poate trimite direct destinatarului.

---

## 2. Descriere problemă

Redactarea emailurilor profesionale consumă timp și necesită abilități de comunicare scrisă. Această aplicație rezolvă problema prin automatizarea procesului de scriere a emailurilor folosind AI, permițând utilizatorilor să genereze emailuri de calitate în câteva secunde, în diferite tonuri (profesional, formal, prietenos, urgent).

---

## 3. Descriere API

### Serviciu 1 — Claude AI API (Anthropic)
- **Scop:** Generarea conținutului emailurilor folosind inteligența artificială
- **Endpoint:** `POST https://api.anthropic.com/v1/messages`
- **Autentificare:** API Key în header `x-api-key`
- **Model folosit:** `claude-haiku-4-5`

### Serviciu 2 — EmailJS
- **Scop:** Trimiterea emailurilor generate către destinatar
- **Endpoint:** `POST https://api.emailjs.com/api/v1.0/email/send`
- **Autentificare:** Public Key + Service ID + Template ID

### Serviciu 3 — Firebase (Google)
- **Scop:** Autentificarea utilizatorilor și stocarea istoricului emailurilor
- **Servicii folosite:** Firebase Authentication + Firestore Database
- **Autentificare:** Firebase API Key

---

## 4. Flux de date

### Exemplu request generare email (Claude AI):
```json
POST https://api.anthropic.com/v1/messages
Headers:
  x-api-key: sk-ant-...
  anthropic-version: 2023-06-01
Body:
{
  "model": "claude-haiku-4-5",
  "max_tokens": 1024,
  "messages": [{
    "role": "user",
    "content": "Scrie un email profesional în română despre: cer o zi liberă"
  }]
}
```

### Exemplu response:
```json
{
  "content": [{
    "type": "text",
    "text": "Subject: Cerere zi liberă\n\nStimată doamnă/domnule director..."
  }]
}
```

### Metode HTTP folosite:
- **POST** — generare email cu Claude AI
- **POST** — trimitere email prin EmailJS
- **POST** — înregistrare/autentificare utilizator (Firebase)
- **GET** — încărcare istoric emailuri (Firestore)

### Autentificare și autorizare:
- **Firebase Authentication** — gestionează sesiunile utilizatorilor cu persistență la refresh
- **Claude API** — autentificare prin API Key în header
- **EmailJS** — autentificare prin Public Key, Service ID și Template ID

---

## 5. Capturi ecran aplicație

(Adaugi screenshots după)

---

## 6. Referințe

- [Anthropic Claude API](https://docs.anthropic.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [EmailJS Documentation](https://www.emailjs.com/docs)
- [React Documentation](https://react.dev)
- [Vercel Deployment](https://vercel.com/docs)
