// src/components/SessionPopup.js
import React from "react";
import { useNavigate } from "react-router-dom";

const SessionPopup = ({ visible, onClose, title, message }) => {
    const navigate=useNavigate();
  if (!visible) return null;
  const handleOkClick = () => {
    onClose();          // close popup
    navigate("/"); // redirect to entry page
  };

  return (
    <div className="session-overlay">
      <div className="session-popup">
        <h3>{title}</h3>
        <p>{message}</p>
        <button onClick={handleOkClick}>OK</button>
      </div>
    </div>
  );
};

export default SessionPopup;
