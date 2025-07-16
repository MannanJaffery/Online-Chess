import { useState } from 'react'
import { createContext , useContext } from 'react';


const UserContext = createContext();
export const useUser= ()  => useContext(UserContext);

export const UserProvider = ({children}) => {
        const [username , setUsername] = useState('');

        return (

<UserContext.Provider value={{username , setUsername}}>
    {children}
</UserContext.Provider>

        );
}


