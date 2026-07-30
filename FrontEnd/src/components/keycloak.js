// src/keycloak.js
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
   url: "http://auth.ecommerce.local:9090",
  realm: "Ecommerce-Users",
  clientId: "Ecommerce-react-app",
});

export default keycloak;