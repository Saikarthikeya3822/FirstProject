// App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login'; // Import Login component
import HomePage from './HomePage'; 
import ProtectedRoute from './components/ProtectedRoute'; // Import HomePage component

import './App.css';
import '../src/styles/LoginPage.css';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Define routes for Login and HomePage */}
          <Route path="/login" element={<Login />} />
          <Route path="/homepage" element={<ProtectedRoute element={<HomePage />} />} />
          <Route path="/" element={<Login />} />  {/* Default route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
