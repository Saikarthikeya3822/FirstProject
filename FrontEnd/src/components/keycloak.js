// src/keycloak.js
import Keycloak from "keycloak-js";

// Create the Keycloak instance
const keycloak = new Keycloak({
  url: "http://localhost:8443",
  realm: "Ecommerce-Users",
  clientId: "Ecommerce-react-app",
});

// Export the instance
export default keycloak;
