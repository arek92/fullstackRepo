import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { me as meApi } from "./api/auth";

export default function ProtectedRoute({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        await meApi();
        if (alive) setAllowed(true);
      } catch {
        if (alive) setAllowed(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (allowed === null) return <div>Ładowanie...</div>;
  if (!allowed) return <Navigate to="/" replace />;
  return children;
}
