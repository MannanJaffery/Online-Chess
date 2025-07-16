import { useUser } from "./Usercontext"
import { Navigate, useNavigate } from "react-router-dom"

const ProtectedRoute = ({children}) => {

    const navigate = useNavigate();
    const {username} = useUser();
    if(!username){
        return navigate('/');
    }
    return children;
}

export default ProtectedRoute
