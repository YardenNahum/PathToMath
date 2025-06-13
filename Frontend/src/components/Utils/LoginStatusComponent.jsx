import { createContext, useContext, useState } from 'react';

// Create the LoginContext
const LoginStatusContext = createContext();

// Create the LoginProvider component
export const LoginStatusProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = () => setIsLoggedIn(true);
    const logout = () => setIsLoggedIn(false);

    return (
        <LoginStatusContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </LoginStatusContext.Provider>
    );
};

export const useLoginStatus = () => useContext(LoginStatusContext);