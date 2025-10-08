import './App.css';
import HomePage from './HomePage';
import EntryPage from './components/EntryPage';
import RegistrationPage from './components/RegistrationPage';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import keycloak from './components/keycloak'; // import your keycloak.js

function App() {
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);

  useEffect(() => {
    keycloak
      .init({ onLoad: "check-sso", pkceMethod: "S256" })
      .then(authenticated => {
        if (authenticated) {
          localStorage.setItem("userId",keycloak.tokenParsed.sub)
          if(keycloak.token){
            localStorage.setItem("token", keycloak.token);
          }
          else{
          localStorage.setItem("token", keycloak.refreshToken);
          }

          console.log("✅ Logged in at app level. Token:", keycloak.token);
        }
        setKeycloakInitialized(true);
      })
      .catch(err => {
        console.error("Keycloak ini t failed:", err);
      });
  }, []);

  if (!keycloakInitialized) return <p>Loading Keycloak...</p>;

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<EntryPage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
