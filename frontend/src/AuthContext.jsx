import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'
import toast from 'react-hot-toast'
import { Navigate, useNavigate } from 'react-router-dom';
const Loader = () => {
    return (
        <>
        </>
    )
}

const AuthContext = createContext();
export const useAuth = () => {
    return useContext(AuthContext);
}
export const AuthProvider = ({ children }) => {
    const BaseURL = "http://localhost:3000";
    // const BaseURL = "https://geo-attend-backend.vercel.app";
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const checkAuth = async () => {
        try {
            const response = await axios.get(`${BaseURL}`, { withCredentials: true });
            setUser(response.data.user);
            console.log(user);
            <Navigate to={`/${response.data.role}`} />
        } catch (error) {
            console.error('User is not authenticated', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        checkAuth();
    }, [BaseURL]);

    const login = async (username, password) => {
        setLoading(true);

        const loginPromise = toast.promise(
            axios.post(`${BaseURL}/login`, { username, password }, { withCredentials: true }),
            {
                loading: 'Logging in...',
                success: 'Logged in successfully!',
                error: 'Login failed! Please try again.',
            }
        );

        try {
            const response = await loginPromise;
            await checkAuth();
            navigate(`/${user.role}`)
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);

        const logoutPromise = toast.promise(
            axios.post(`${BaseURL}/logout`, {}, { withCredentials: true }),
            {
                loading: 'Logging out...',
                success: 'Logged out successfully!',
                error: 'Logout failed! Please try again.',
            }
        );

        try {
            await logoutPromise;
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        BaseURL,
        user,
        login,
        logout,
        loading,
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
