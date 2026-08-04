// src/keycloak.js
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
   url: "https://keycloak-production-d32a.up.railway.app",
  realm: "Ecommerce-Users",
  clientId: "Ecommerce-react-app",
});
