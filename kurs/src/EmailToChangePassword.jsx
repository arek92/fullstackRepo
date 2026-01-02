import React, { useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";




function EmailToChangePassword(){


  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();


    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");


  try {
      await axios.post(
        "http://localhost:8099/api/password/reset-request",
        { email },
        { withCredentials: true }
      );

      // backend powinien zwracać 200 zawsze
      setStatus("Jeśli email istnieje, wysłaliśmy link do resetu hasła. Sprawdź pocztę.");
      // opcjonalnie: zapamiętaj email w UI
      localStorage.setItem("resetEmail", email);

      // opcjonalnie: po 1-2 sekundach wróć do logowania
    //   setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (err) {
      // nawet jak błąd, nie zdradzaj czy email istnieje
      console.log(err);
      setStatus("Jeśli email istnieje, wysłaliśmy link do resetu hasła. Sprawdź pocztę.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="authPage">
      <div className="authCard">
        <h2>Reset hasła</h2>

        <form onSubmit={handleSubmit}>
          <label>Podaj Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Wysyłanie..." : "Zresetuj hasło"}
          </button>
        </form>

        {status && <p>{status}</p>}
      </div>
    </div>
  );
}



export default EmailToChangePassword;