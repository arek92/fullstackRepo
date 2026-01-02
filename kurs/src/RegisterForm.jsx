import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [login, setLogin] = useState('');
  const [role, setRole] = useState('MEMBER'); 
  const [adres, setAdres] = useState('');
  const [telefon, setTelefon] = useState('');
  const [koordynator,setKoordynator] = useState('');
  const [dataUrodzenia, setDataUrodzenia] = useState('');
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
  e.preventDefault();

  const registerData = {
    email,
    password,
    firstName,
    lastName,
    login,
    role,
    adres,
    telefon,
    koordynator,
    dataUrodzenia
  };

  try {
    const response = await axios.post(
      "http://localhost:8099/api/auth/register",
      registerData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    alert(response.data);
    setFirstName('');
    setLastName('');
    setLogin('');
    setPassword('');
    setTelefon('');
    setRole('');
    setDataUrodzenia('');
    setKoordynator('');
    setAdres('');

     // backend zwraca String
  } catch (error) {
    const msg =
      error.response?.data?.message ??
      error.response?.data ??
      error.message ??
      "Błąd rejestracji";
    alert("Wystąpił błąd podczas rejestracji: " + msg);
  }
};

  

  return (
    <div className='authPage'>
      <h2>Rejestracja</h2>
      
      {/* Przeniesiony link powrotu - oszczędza miejsce na dole */}
      <p style={{ marginBottom: '20px', fontSize: '0.9rem' }}>
        Masz już konto? <span 
          onClick={() => navigate("/")} 
          style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Zaloguj się
        </span>
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
          <div>
            <label>Imię:</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={{ width: '100%' }} />
          </div>
          <div>
            <label>Nazwisko:</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={{ width: '100%' }} />
          </div>

        {/* E-mail na całą szerokość */}
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%' }} />
        </div>

        {/* Data Urodzenia na całą szerokość */}
        <div>
          <label>Data Urodzenia:</label>
          <input type="date" value={dataUrodzenia} onChange={(e) => setDataUrodzenia(e.target.value)} required style={{ width: '100%' }} />
        </div>

          <div style={{ flex: 2 }}>
            <label>Adres:</label>
            <input type="text" value={adres} onChange={(e)=> setAdres(e.target.value)} required style={{ width: '100%' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Telefon:</label>
            <input type="text" value={telefon} onChange={(e)=> setTelefon(e.target.value)} required style={{ width: '100%' }} />
          </div>
      
          <div style={{ flex: 1 }}>
            <label>Login:</label>
            <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} required style={{ width: '100%' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Hasło:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%' }} />
          </div>

          <div style={{ flex: 1 }}>
            <label>Rola:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '8px' }}>
              <option value="MEMBER">Członek</option>
              <option value="COORDINATOR">Koordynator</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Imie Koordynatora:</label>
            <select value={koordynator} onChange={(e) => setKoordynator(e.target.value)} style={{ width: '100%', padding: '8px' }}>
              <option value="">Wybierz...</option>
              <option value="Irek">Irek</option>
              <option value="Arek">Arek</option>
              <option value="Leszek">Leszek</option>
            </select>
          </div>
        

        <button type="submit" style={{ marginTop: '10px', padding: '10px', cursor: 'pointer' }}>
          Zarejestruj się
        </button>
      </form>
    </div>
  );
}


export default RegisterForm;
