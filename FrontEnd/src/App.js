import './App.css';
import HomePage from './HomePage';
import EntryPage from './components/EntryPage';
import Login from './components/Login';
import RegistrationPage from './components/RegistrationPage';
//import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<EntryPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
