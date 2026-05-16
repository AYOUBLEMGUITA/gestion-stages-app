import { Navigate } from "react-router-dom";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default ProtectedRoute;
