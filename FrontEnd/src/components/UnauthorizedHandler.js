// src/hooks/useUnauthorizedHandler.js
import { useState } from "react";

const useUnauthorizedHandler = () => {
  //const [showSessionExpiredPopup, setShowSessionExpiredPopup] = useState(false);
  const [showNoAccessPopup, setShowNoAccessPopup] = useState(false);

  const handleUnauthorized = (error) => {
    console.log("Inside No acess handle");

 // Check if the error is 403 (Forbidden)
        if (error?.response?.status === 403) {
            console.log("Inside No Access handle (403).");
            setShowNoAccessPopup(true);
        } else {
             // For all other errors that escape the interceptor, log them but don't show the WRONG popup.
             // If a 401 escapes, the user will be redirected to /Entry by the interceptor's final catch block.
             // You can add a generic error state here if needed.
             // The key is: DO NOT show 'No Access' unless it's truly a 403.
             console.log("Error status:", error?.response?.status, ". Letting the Interceptor handle 401.");
        }
  };

  const handleNoAccess = () => {
    setShowNoAccessPopup(true);
  };

  return {
    // showSessionExpiredPopup,
    // setShowSessionExpiredPopup,
    showNoAccessPopup,
    setShowNoAccessPopup,
    handleUnauthorized,
    handleNoAccess,
  };
};

export default useUnauthorizedHandler;
