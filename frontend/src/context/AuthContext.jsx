import { createContext, useContext, useEffect, useState } from 'react';
import {
    getSessionUser,
    loginUser,
    logoutUser,
    updateSessionUser,
} from '../api/releaseDeskApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const loadSessionUser = async () => {
            try {
                const sessionUser = await getSessionUser();
                setUser(sessionUser);
                setAuthError(null);
            } catch {
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        };

        loadSessionUser();
    }, []);

    const login = async (credentials) => {
        const loggedInUser = await loginUser(credentials);
        setUser(loggedInUser);
        setAuthError(null);
        return loggedInUser;
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
        setAuthError(null);
    };

    const updateAccount = async (payload) => {
        const updatedUser = await updateSessionUser(payload);
        setUser(updatedUser);
        return updatedUser;
    };

    const hasRole = (roleName) => {
        if (!user) {
            return false;
        }

        return user.roles?.includes(roleName) || user.is_superuser;
    };

    const value = {
        user,
        setUser,
        authLoading,
        authError,
        setAuthError,
        isAuthenticated: Boolean(user),
        login,
        logout,
        updateAccount,
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }

    return context;
}