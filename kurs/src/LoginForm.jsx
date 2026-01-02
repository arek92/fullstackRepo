import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { removeWishById } from './api/auth';


function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [wishes, setWishes] = useState([]); 



  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const response = await axios.post('http://localhost:8099/login', {
        username: email,
        password: password
        
      }, {headers: { 'Content-Type': 'application/json' },
 withCredentials: true });

      // Jeśli sukces
      if (response.status === 200) {
         setIsLoggedIn(true);
        // setMessage('Witaj, dobrze że jesteś!');

        // WYWOŁANIE POBIERANIA ŻYCZEŃ
        const userWishes = await showMyWishes();
        
        if (userWishes.length > 0) {
            setMessage(`Witaj! Ktoś o Tobie pamiętał:"`);
        } else {
            setMessage('Witaj, dobrze że jesteś!');
        }
        
        console.log('Logowanie udane i sprawdzono życzenia');

      }
    } catch (error) {
      // Obsługa błędów
      if (error.response) {
        if (error.response.status === 401) {
          setMessage('Błąd logowania: Nieprawidłowy login/hasło lub konto nieaktywne.');
        } else {
          setMessage('Błąd serwera: ' + error.response.data.message);
        }
      } else {
        setMessage('Błąd połączenia: Upewnij się, że backend działa na localhost:8099.');
      }
      console.error('Błąd logowania:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Wyślij POST do /logout z withCredentials
      await axios.post('http://localhost:8099/logout', {}, { withCredentials: true });
      setIsLoggedIn(false);
      setMessage(''); // Wyczyść komunikat
      console.log('Wylogowano pomyślnie');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Błąd wylogowania:', error);
      setMessage('Błąd wylogowania: Spróbuj ponownie.');
    }
  };

  const handleDeleteWish = async (id) => {
    if (!window.confirm("Czy chcesz usunąć to życzenie?")) return;

    try {
        await removeWishById(id);
        
        // Najszybszy sposób na odświeżenie GUI bez przeładowania całej strony:
        // Filtrujemy obecną listę życzeń usuwając to o podanym ID
        setWishes(prevWishes => prevWishes.filter(wish => wish.id !== id));
        
        
        alert("Życzenie zostało usunięte.");

    } catch (error) {
        console.error("Błąd podczas usuwania:", error);
        alert("Nie udało się usunąć życzenia.");
    }
};




  const showMyWishes = async () => {
    try {
        // Pamiętaj o poprawnej ścieżce do endpointu
        const response = await axios.get('http://localhost:8099/api/myWishes', { withCredentials: true });
        
        if (response.data && response.data.length > 0) {
            setWishes(response.data);
            // Możesz też od razu ustawić wiadomość powitalną
            setMessage(`Masz nowe życzenia (${response.data.length})! Sprawdź pod kalendarzem.`);
            return response.data;
        }
    } catch (error) {
        console.error("Nie udało się pobrać życzeń:", error);
    }
    return [];
  };


 return (
    <div className="authPage">
      <h2>Chrystus Zmartwychwstał !!</h2>
      {isLoggedIn ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#28a745' }}>{message}</p>
          
          {/* Sekcja wyświetlająca życzenia, jeśli jakieś istnieją */}
          {wishes && wishes.length > 0 && (
            <div style={{ 
              backgroundColor: '#fff3cd', 
              border: '2px dashed #ffc107', 
              padding: '20px', 
              borderRadius: '15px', 
              margin: '20px 0',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>🎉 Masz życzenia urodzinowe!</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {wishes.map((wish) => (
                  <li key={wish.id} style={{ 
                    fontStyle: 'italic', 
                    fontSize: '1.1rem', 
                    marginBottom: '10px',
                    color: '#533f03',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}>
                    <span>
                      "{wish.content}"
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#856404', marginLeft: '5px' }}>
                        — od {wish.senderName}
                      </span>
                    </span>
                    <button 
                        onClick={() => handleDeleteWish(wish.id)}
                        className="delete-event-btn"
                        title="Usuń"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <button className="zaloguj" onClick={() => navigate("/member")}>
              Rozpocznij
            </button>
            <div style={{ marginTop: '15px' }}>
              <button 
                onClick={handleLogout} 
                style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Wyloguj
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Hasło:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className='zaloguj' type="submit">Zaloguj się</button>
          </form>
          {message && <p style={{ color: 'red' }}>{message}</p>}
          <p style={{ marginBottom: '20px', fontSize: '0.9rem' }}>
            Nie masz konta?  <span 
              onClick={() => navigate("/register")} 
              style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Zarejestruj się
            </span>
          </p>
          <p>
            <button className='hasloBrak' onClick={() => navigate("/forgot-password")}>
              Nie pamiętasz hasła?
            </button>
          </p>
        </>
      )}
    </div>
  );


}

export default LoginForm;
