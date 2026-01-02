import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ResetPasswordFormFromToken from "./ResetPasswordFormFromToken";
import WidokMembera from "./Member";
import EmailToChangePassword from "./EmailToChangePassword";
import ProtectedRoute from "./ProtectedRoute";
import WhoHasBirthdayComponent from "./WhoHasBirthdayComponent";
import CalendarEvents from "./Components/CalendarEvents";
import PhotosComponent from "./Components/PhotosComponent";
import MojeDane from "./Components/MojeDane";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/birthday" element={<WhoHasBirthdayComponent />} />
          <Route path="/calendar" element={<CalendarEvents />} />
          <Route path="/photos" element={<PhotosComponent/>} />
          <Route path="/information" element={<MojeDane/> } />

          <Route path="/forgot-password" element={<EmailToChangePassword />} />

          {/* ekran ustawienia nowego hasła z linku w mailu: /reset-hasla?token=... */}
          <Route path="/reset-hasla" element={<ResetPasswordFormFromToken />} />

          <Route path="/member" 
          element={<ProtectedRoute><WidokMembera /></ProtectedRoute>} 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
