import { Navigate } from 'react-router-dom';
import { useCruntRoll } from '../contexts/CruntRollContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useCruntRoll();

  if (loading) return <div className="loading">Carregando...</div>;
  if (!isLoggedIn) return <Navigate to="/auth" replace />;
  return children;
};

export default ProtectedRoute;