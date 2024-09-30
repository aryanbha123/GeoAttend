import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const baseurl = "https://geo-attend-backend.vercel.app";

    const checkAuth = async () => {
        try {
            const response = await axios.get(`https://geo-attend-backend.vercel.app/`,{ withCredentials: true });
            setUser(response.data.user);
        } catch (error) {
            console.error('User is not authenticated', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        checkAuth();
    }, []);

    const login = async ({username,password}) => {
        setLoading(true);

        const loginPromise = toast.promise(
            axios.post(`${baseurl}/login`, {username,password}, { withCredentials: true }),
            {
                loading: 'Logging in...',
                success: 'Logged in successfully!',
                error: 'Login failed! Please try again.',
            }
        );

        try {
            const response = await loginPromise;
            await checkAuth();
            // navigate(`${user.role}`)
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
            await axios.post(`${baseurl}/logout`);
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };



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