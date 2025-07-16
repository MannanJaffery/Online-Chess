import { useUser } from "./Usercontext"
import { useNavigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
  const { username, isUserLoaded } = useUser();
  const navigate = useNavigate();

  if (!isUserLoaded) return null; // or loading spinner

  if (!username) {
    navigate('/');
    return null;
  }

  return children;
}

  export default ProtectedRoute;