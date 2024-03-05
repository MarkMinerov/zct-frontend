import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ publicOnly = false, children, cookies }) => {
  const isAuthenticated = cookies.token && cookies.token !== "undefined";

  const rule = publicOnly ? !isAuthenticated : isAuthenticated;

  if (rule) {
    return children;
  } else {
    return <Navigate replace to="/" />
  }
}

export default ProtectedRoute;