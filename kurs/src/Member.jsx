import React, { useState, useEffect, useCallback } from 'react';
import { logout as logoutApi, me as meApi } from "./api/auth";
import { useNavigate } from "react-router-dom";

export default function WidokMembera() {
  const [message, setMessage] = useState("Ładowanie...");
  const [timeLeft, setTimeLeft] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const loadMe = useCallback(async () => {
    try {
      const data = await meApi();
      setMessage(`Witaj, ${data.login}!`);

      if (data.expiresAt) {
        const now = Date.now();
        const diffInSeconds = Math.floor((data.expiresAt - now) / 1000);
        if (diffInSeconds > 0) {
          setTimeLeft(diffInSeconds);
        }
      }
    } catch (error) {
      console.error("Błąd pobierania danych:", error);
      setMessage("Nie znaleziono użytkownika.");
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  // Główny licznik: aktualizuje zegar i czas sesji co sekundę
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Aktualizacja aktualnej godziny
      setCurrentTime(new Date());

      // 2. Aktualizacja czasu sesji
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleLogout]);

  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Formatowanie daty do wyświetlenia
  const formattedDateTime = currentTime.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div>
      <div className="toolbar">
        <div className="toolbarLeft">
          <span>Światło rozjaśni Twoje ciemności, noc ustępuje dniowi a Moja Chwała rozbłyska</span>
        </div>

        <div className="toolbarRight" style={{ display: 'flex', alignItems: 'center' }}>
          {/* Wyświetlanie aktualnej daty i godziny */}
          <span style={{ 
            marginRight: '20px', 
            fontSize: '14px', 
            color: '#4b5563', 
            fontFamily: 'monospace',
            fontWeight: '500'
          }}>
            {formattedDateTime}
          </span>

          {/* Wyświetlanie czasu do wylogowania (tylko ostatnia minuta) */}
          {timeLeft !== null && timeLeft <= 60 && (
            <span style={{ 
              marginRight: '15px', 
              color: '#ff4d4d',
              fontWeight: 'bold',
              fontSize: '14px',
              backgroundColor: 'rgba(0,0,0,0.1)',
              padding: '2px 8px',
              borderRadius: '4px',
              animation: 'blink 1s infinite'
            }}>
              Wylogowanie za: {formatTime(timeLeft)}
            </span>
          )}

          <span className="userBadge" style={{ marginRight: '10px' }}>{message}</span>
          <button onClick={handleLogout} className="toolbarBtn">Wyloguj</button>
        </div>
      </div>

      <div className="pageContent">
        <div className="gridItem" 
        onClick={() => navigate("/information")}>Moje Dane
        </div>
       <div 
          className="gridItem" 
          onClick={() => navigate("/birthday", { state: { date: currentTime.toISOString() } })}
        >
          Kto ma Urodziny
        </div>
        <div className="gridItem">Śpiewnik</div>
        <div className="gridItem"
            onClick={() => navigate("/calendar")}
        >Kalendarz

        </div>
        <div className="gridItem">Wspólnoty</div>
        <div className="gridItem" onClick={()=> navigate('/photos')}
        >Galeria</div>
        <div className="gridItem">Co mówi Pan</div>
        <div className="gridItem">Kontakt</div>
        <div className="gridItem">Pomoc</div>
      </div>
    </div>
  );
}
