import { createContext, useContext, useState } from 'react';

/**
 * Create a Context to store login status (true/false) and login/logout methods
 */
const LoginStatusContext = createContext();

/**
 * Provider component that wraps part of the app to manage login state globally
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Components that will have access to the login context
 * @returns {JSX.Element}
 */
export const LoginStatusProvider = ({ children }) => {
    // State to track whether the user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Method to log in (sets isLoggedIn to true)
    const login = () => setIsLoggedIn(true);

    // Method to log out (sets isLoggedIn to false)
    const logout = () => setIsLoggedIn(false);

    return (
        <LoginStatusContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </LoginStatusContext.Provider>
    );
};

/**
 * Custom hook to access login status and actions (login, logout)
 *
 * @returns {{ isLoggedIn: boolean, login: Function, logout: Function }}
 */
export const useLoginStatus = () => useContext(LoginStatusContext);