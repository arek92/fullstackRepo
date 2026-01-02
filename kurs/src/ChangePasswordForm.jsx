import React, { useState } from 'react';

function ChangePasswordForm({ onBackToLogin }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Nowe hasła nie pasują!');
      return;
    }
    // Tutaj dodaj logikę zmiany hasła, np. fetch do endpointu backendu
    console.log('Zmiana hasła:', { oldPassword, newPassword });
  };

  return (
    <div className='authPage'>
      <h2>Zmiana hasła</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Stare hasło:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nowe hasło:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Potwierdź hasło:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Zmień hasło</button>
      </form>
      <button onClick={onBackToLogin}>Wróć do logowania</button>
    </div>
  );
}

export default ChangePasswordForm;
