import React from 'react';

import { auth } from '../../service/Firebase';
import firebase from 'firebase/app';

export interface AuthController {
    signup: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
    login: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
    logout: () => Promise<void>;
    isLogging: () => boolean;
    currentUser: firebase.User | null;
}

export const AuthContext = React.createContext<AuthController>({
    signup: () => Promise.reject(),
    login: () => Promise.reject(),
    logout: () => Promise.reject(),
    isLogging: () => false,
    currentUser: null,
});

export const AuthProvider: React.FC = ({ children }) => {
    const [currentUser, setCurrentUser] = React.useState<firebase.User | null>(null);

    const signup = (email: string, password: string) => {
        return auth.createUserWithEmailAndPassword(email, password);
    };

    const login = (email: string, password: string) => {
        return auth.signInWithEmailAndPassword(email, password);
    };

    const logout = () => {
        return auth.signOut();
    };

    React.useEffect(() => {
        const unsabscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });

        return unsabscribe;
    }, []);

    return (
        <AuthContext.Provider
            value={{
                signup,
                login,
                logout,
                isLogging: () => false,
                currentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return React.useContext(AuthContext);
};
