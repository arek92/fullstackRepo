import React, { useState, useEffect, useCallback,Navigate } from 'react';
import { useLocation } from 'react-router-dom';
import './Styles/CalendarCard.css';
import { usersBorn as bornusers, me as loggedUser} from "./api/auth";
import axios from 'axios';
import { useNavigate } from "react-router-dom";





const WhoHasBirthdayComponent = () => {

    const location = useLocation();

    const passedDate = location.state?.date ? new Date(location.state.date) : new Date();

    const day = passedDate.getDate();
    const month = passedDate.toLocaleString('pl-PL', { month: 'long' });
    const year = passedDate.getFullYear();
    

    const [birthdayUsers, setBirthdayUsers] = useState([]);
    const [loading, setLoading] = useState(true);


    const [wishTexts, setWishTexts] = useState({});
    const handleWishChange = (email, text) => {
        setWishTexts(prev => ({ ...prev, [email]: text }));
    };

    const navigate = useNavigate();

     const [currentUser, setCurrentUser] = useState(null);




    const sendWish = async (recipientEmail) => {
        const text = wishTexts[recipientEmail];
        if (!text || !text.trim()) return;

        try {
            await axios.post('http://localhost:8099/api/sendWishes', {
                recipientEmail: recipientEmail,
                content: text
            }, { withCredentials: true });
            
            alert(`Wysłano życzenia do ${recipientEmail}!`);
            handleWishChange(recipientEmail, ''); // Czyścimy pole po wysłaniu
        } catch (error) {
            console.error("Błąd wysyłania:", error);
        }
    };

    // jednoczesnie pobieramy 2 dane 
     const loadData = useCallback(async () => {
        try {
            setLoading(true);
          const [usersBorn,me] = await Promise.all([bornusers(), loggedUser()]);

          setBirthdayUsers(usersBorn);
          setCurrentUser(me);
          
        } catch (error) {
          console.error("Błąd pobierania danych:", error);
        } finally {
            setLoading(false);
        }
      }, []);

       useEffect(() => {
        loadData();
    }, [loadData]);


   return (
        <div className="birthday-container">
            <div className="calendar-card">
                <div className="calendar-header">{month}</div>
                <div className="calendar-body">
                    <span className="calendar-day">{day}</span>
                    <span className="calendar-year">{year}</span>
                </div>
            </div>

            <div className="birthday-list">
                {loading ? (
                    <p>Sprawdzanie...</p>
                ) : birthdayUsers && birthdayUsers.length > 0 ? (
                    <>
                        <h3 style={{ color: '#e63946', marginTop: '20px' }}>
                            Dzisiaj urodziny obchodzą:
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {birthdayUsers.map((user, index) => {
                                // Tutaj definiujemy zmienną sprawdzającą czy to ja
                                const isMe = currentUser && user.email === currentUser.email;

                                return (
                                    <li key={index} style={{ marginBottom: '25px', textAlign: 'left' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                            🎉 {user.firstname} {user.lastname} {isMe && <span style={{fontSize: '0.85rem', color: '#888'}}> (To Ty! Wszystkiego najlepszego !!🎂)</span>}
                                        </div>
                                        
                                        <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                                            <input 
                                                type="text"
                                                disabled={isMe}
                                                placeholder={isMe ? "Nie możesz wysłać życzeń samemu sobie 😉" : `Napisz życzenia dla ${user.firstname}...`}
                                                value={wishTexts[user.email] || ''}
                                                onChange={(e) => handleWishChange(user.email, e.target.value)}
                                                style={{ 
                                                    flex: 1, 
                                                    padding: '8px', 
                                                    borderRadius: '20px', 
                                                    border: '1px solid #ddd',
                                                    fontSize: '0.9rem',
                                                    backgroundColor: isMe ? '#f5f5f5' : 'white'
                                                }}
                                            />
                                            <button 
                                                disabled={isMe}
                                                onClick={() => sendWish(user.email, user.firstname)}
                                                style={{ 
                                                    backgroundColor: isMe ? '#ccc' : '#e63946', 
                                                    color: 'white', 
                                                    border: 'none', 
                                                    padding: '8px 15px', 
                                                    borderRadius: '20px', 
                                                    cursor: isMe ? 'not-allowed' : 'pointer',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Wyślij ✉️
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                ) : (
                    <p style={{ marginTop: '20px', color: '#666' }}>
                        Dzisiaj nikt nie obchodzi urodzin.
                    </p>
                )}
            </div>
            <div className='wishesLogout'>
                <button 
                onClick={() => navigate('/')} 
                style={{color: '#941616ff', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                Wyloguj
              </button>
            </div>
            <div className='widokMemberaPowrotUrodziny'>
               <button onClick={() => navigate('/member')}>Menu Glowne</button>
            </div>
        </div>
    );



}  

export default WhoHasBirthdayComponent;


