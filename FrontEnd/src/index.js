import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// src/index.js or src/App.js

// 1. Core PrimeReact CSS (Structural styles for components)
import "primereact/resources/primereact.min.css";

// 2. A PrimeReact Theme (Choose one, e.g., 'saga-blue' is a popular one)
import "primereact/resources/themes/saga-blue/theme.css";

// 3. PrimeIcons (Required for all 'pi pi-...' icons)
import "primeicons/primeicons.css";

// 4. PrimeFlex (Optional, but recommended for utility classes like w-full, p-3)
import "primeflex/primeflex.css";
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from 'primereact/button';



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //<React.StrictMode>
  <App />
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
