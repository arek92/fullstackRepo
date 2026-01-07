import React, { useEffect, useState } from "react";
import axios from "axios";
import '../Styles/MojeDane.css';
import { useNavigate } from "react-router-dom";


const EditableField = ({ label, value, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const API_URL = import.meta.env.VITE_API_URL;

  // aktualizacja gdy user się zmieni
  useEffect(() => {
    setVal(value);
  }, [value]);

  const handleBlur = () => {
    setEditing(false);
    if (val !== value) onSave(val);
  };

  const save = () => {
    setEditing(false);
    if (val !== value) onSave(val);
  };

  const cancel = () => {
    setVal(value);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    }
    if (e.key === "Escape") {
      cancel();
    }
  };

  return (
    <div className="field">
      <span className="label">{label}</span>
      {editing ? (
        <input
          value={val || ""}
          onChange={e => setVal(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <span className="value" onDoubleClick={() => setEditing(true)}>
          {value || "—"}
        </span>
      )}
    </div>
  );
};

export default function MojeDane() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // pobranie danych użytkownika
  useEffect(() => {
    axios.get("${API_URL}/api/me", { withCredentials: true })
      .then(res => setUser(res.data));
  }, []);

  // zapis pojedynczego pola
  const saveField = (field, value) => {
    const updated = { ...user, [field]: value };
    setUser(updated);

    axios.put("${API_URL}/api/meInfo", updated, {
      withCredentials: true
    });
  };

  // upload zdjęcia + odświeżenie usera
  const uploadPhoto = (file) => {
    const form = new FormData();
    form.append("file", file);
    form.append("category", "avatar");

    axios.post("${API_URL}/api/gallery/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true
    })
      .then(() => axios.get("${API_URL}/api/me", { withCredentials: true }))
      .then(res => setUser(res.data));
  };

  if (!user) return <div>Ładowanie...</div>;

  return (
    <div className="moje-dane">
      {/* LEWA STRONA
      <div className="left">
        <img
          src={`http://localhost:8099${user.avatarUrl}`}
          className="avatar"
          alt="avatar"
        />

        <input
          type="file"
          className="hidden-file-input"
          onChange={e => uploadPhoto(e.target.files[0])}
        />
      </div> */}

      {/* LEWA STRONA */}
<div className="left avatar-wrapper">
  <img
    src={`${API_URL}${user.avatarUrl}`}
    className="avatar"
    alt="avatar"
  />

  {/* Ikona pojawiająca się przy hoverze */}
  <div
    className="avatar-edit-icon"
    onClick={() => document.getElementById("avatarInput").click()}
  >
    🔄
  </div>

  {/* Ukryty input */}
  <input
    id="avatarInput"
    type="file"
    className="hidden-file-input"
    onChange={e => uploadPhoto(e.target.files[0])}
  />
</div>


      {/* PRAWA STRONA */}
      <div className="right">
        <EditableField label="Imię" value={user.firstName}
          onSave={v => saveField("firstName", v)} />

        <EditableField label="Nazwisko" value={user.lastName}
          onSave={v => saveField("lastName", v)} />

        <EditableField label="Email" value={user.email}
          onSave={v => saveField("email", v)} />

        <EditableField label="Telefon" value={user.telefon}
          onSave={v => saveField("telefon", v)} />

        <EditableField label="Adres" value={user.adres}
          onSave={v => saveField("adres", v)} />

        <EditableField label="Koordynator" value={user.koordynator}
          onSave={v => saveField("koordynator", v)} />
        <button className="widokMemberaPowrotUrodziny" onClick={()=> navigate("/member")}>Menu Glowne</button>
      </div>
    </div>
  );
}




