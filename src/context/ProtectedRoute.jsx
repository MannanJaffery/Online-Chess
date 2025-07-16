import { useUser } from "./Usercontext"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({children}) => {

 
    const {username} = useUser();
    if(!username){
        return <Navigate to = '/' />;
    }
    return children;
}

export default ProtectedRoute
