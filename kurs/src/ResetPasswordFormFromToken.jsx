import React, { useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPasswordForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("token") || "";
  }, [location.search]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setStatus("Brak tokena w linku. Otwórz link z emaila.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus("Hasła nie pasują.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      await axios.post(
        "http://localhost:8099/api/password/reset",
        { token, newPassword },
        { withCredentials: true }
      );

      setStatus("Hasło zmienione. Możesz się zalogować.");
      localStorage.removeItem("resetEmail");
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err) {
        console.log(err);
      setStatus("Nie udało się zmienić hasła (token może być nieprawidłowy lub wygasł).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <h2>Ustaw nowe hasło</h2>

        <form onSubmit={handleSubmit}>
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

          <button type="submit" disabled={loading}>
            {loading ? "Zapisywanie..." : "Zmień hasło"}
          </button>
        </form>

        {status && <p>{status}</p>}

        <button type="button" onClick={() => navigate("/login")}>
          Wróć do logowania
        </button>
      </div>
    </div>
  );
}

export default ResetPasswordForm;
