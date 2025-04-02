import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated"); // Check if user is logged in, here you can use any state logic.

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;
