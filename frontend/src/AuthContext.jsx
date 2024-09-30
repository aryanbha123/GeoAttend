import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        const checkAuth = async () => {
            try {
                const response = await axios.get('/api/auth/check');
                setUser(response.data.user);
            } catch (error) {
                console.error('User is not authenticated', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/auth/login', credentials);
            setUser(response.data.user);
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await axios.post('/api/auth/logout');
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
            throw error; 
        } finally {
            setLoading(false);
        }
    };


    const baseurl = "https://geo-attend-backend.vercel.app/";

    const value = {
        user,
        baseurl,
        login,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {/* {loading ? <div style={{position:"fixed " , top:"0" ,left : "0" ,zIndex:"999"}}><Loader></Loader></div> : children} */}
            <>{children}</>
        </AuthContext.Provider>
    );
};