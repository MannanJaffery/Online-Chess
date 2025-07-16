import { useState , useEffect } from 'react'
import { createContext , useContext } from 'react';


const UserContext = createContext();
export const useUser= ()  => useContext(UserContext);

export const UserProvider = ({children}) => {
        const [username , setUsername] = useState('');


          useEffect(() => {
                const storedUsername = localStorage.getItem('username');
                if (storedUsername) {
                setUsername(storedUsername);
                }
                }, []);

          useEffect(() => {
                if (username) {
                localStorage.setItem('username', username);
                }
                }, [username]);

        return (

<UserContext.Provider value={{username , setUsername}}>
    {children}
</UserContext.Provider>

        );
}


