import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useDashboardStore } from '../store/dashboardStore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            // Check for the "Logged In" hint to avoid 401 errors in console for guests
            const authHint = localStorage.getItem('mantessa_logged_in');

            if (!authHint) {
                setLoading(false);
                return;
            }

            try {
                const { data } = await axios.get('/api/auth/me');
                setUser(data);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('mantessa_logged_in');
                } else {
                    console.error('Initial auth check failed:', error);
                }
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('mantessa_logged_in', 'true');
        setUser(data);
        return data;
    };

    const register = async (username, email, password, socialLinks, avatar) => {
        const { data } = await axios.post('/api/auth/register', { username, email, password, socialLinks, avatar });
        localStorage.setItem('mantessa_logged_in', 'true');
        setUser(data);
        return data;
    };

    const logout = async () => {
        await axios.post('/api/auth/logout');
        localStorage.removeItem('mantessa_logged_in');
        useDashboardStore.getState().reset();
        setUser(null);
    };

    const updateProfile = async (profileData) => {
        const { data } = await axios.put('/api/auth/profile', profileData);
        setUser(data);
        return data;
    };

    const updateSocialLinks = async (socialLinks) => {
        const { data } = await axios.put('/api/auth/social-links', socialLinks);
        setUser(data);
        return data;
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, updateSocialLinks, updateProfile, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
