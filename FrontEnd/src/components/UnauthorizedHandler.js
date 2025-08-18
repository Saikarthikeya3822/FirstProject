// src/hooks/useUnauthorizedHandler.js
import { useState } from "react";

const useUnauthorizedHandler = () => {
  const [showSessionExpiredPopup, setShowSessionExpiredPopup] = useState(false);
  const [showNoAccessPopup, setShowNoAccessPopup] = useState(false);

  const handleUnauthorized = () => {
    console.log("Inside handleUnauthorized");

    // Clear session
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));

    // Show session expired popup
    setShowSessionExpiredPopup(true);
  };

  const handleNoAccess = () => {
    setShowNoAccessPopup(true);
  };

  return {
    showSessionExpiredPopup,
    setShowSessionExpiredPopup,
    showNoAccessPopup,
    setShowNoAccessPopup,
    handleUnauthorized,
    handleNoAccess,
  };
};

export default useUnauthorizedHandler;
