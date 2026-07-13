import "./App.css";
import HomePage from "./HomePage";
import EntryPage from "./components/EntryPage";
import RegistrationPage from "./components/RegistrationPage";
import Tracker from "./components/Tracker";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductAnalyticsPage from "./pages/ProductAnalyticsPage";
import UserAnalyticsPage from "./pages/UserAnalyticsPage";

import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import keycloak from "./components/keycloak"; // import your keycloak.js

function App() {
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);

  useEffect(() => {
    keycloak
      .init({ onLoad: "check-sso", pkceMethod: "S256" })
      .then((authenticated) => {
        if (authenticated) {
          console.log("token details:", keycloak.realmAccess.roles);
          localStorage.setItem("userId", keycloak.tokenParsed.sub);
          const userRoles = keycloak.realmAccess.roles;
          // 1. Check if the 'admin' role is present
          const isAdmin = userRoles.includes("admin");
          // 2. Store the boolean result in local storage
          if (isAdmin) {
            localStorage.setItem("userRole", "admin");
            console.log("Admin status stored in localStorage.");
          } else {
            // Optionally, store false or remove the item if not admin
            localStorage.setItem("userRole", "user");
            console.log("User is not an admin.");
          }
          if (keycloak.token) {
            localStorage.setItem("token", keycloak.token);
            localStorage.setItem("token", keycloak.token);
          } else {
            localStorage.setItem("token", keycloak.refreshToken);
          }

          console.log("✅ Logged in at app level. Token:", keycloak.token);
        }
        setKeycloakInitialized(true);
      })
      .catch((err) => {
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
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/product-analytics" element={<ProductAnalyticsPage />} />
        <Route path="/product-analytics" element={<ProductAnalyticsPage />} />

        <Route path="/user-analytics" element={<UserAnalyticsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
