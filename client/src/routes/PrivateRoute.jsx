import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
export default function PrivateRoute({ children }) {
  const token = useSelector(s => s.auth.token);
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}