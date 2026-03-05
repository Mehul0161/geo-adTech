// ========================================
// GeoAdTech — Auth Context
// ========================================
import { clearToken, fetchMe, loginUser, registerUser, setToken, updateProfileAPI } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface AuthUser {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    city?: string;
    role: 'citizen' | 'admin';
    sitesTracked: number;
    feedbackGiven: number;
    zonesEntered: number;
    createdAt: string;
}

interface AuthContextValue {
    user: AuthUser | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    register: (data: { name: string; email: string; password: string; phone?: string; city?: string }) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    updateUser: (data: { name: string; phone?: string; city?: string }) => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setTokenState] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // On app start, check if we have a stored token
    useEffect(() => {
        restoreSession();
    }, []);

    const restoreSession = async () => {
        // Safety timeout to ensure app doesn't hang forever
        const safetyTimeout = setTimeout(() => {
            if (loading) {
                console.warn('🕒 Auth session restoration took too long, forcing timeout');
                setLoading(false);
            }
        }, 10000);

        try {
            const stored = await AsyncStorage.getItem('geo_token');
            if (stored) {
                setTokenState(stored);
                // Use a short timeout for the initial session check
                const result = await fetchMe();
                if (result.success && result.user) {
                    setUser(result.user);
                } else {
                    await clearToken();
                    setTokenState(null);
                    setUser(null);
                }
            }
        } catch (err) {
            await clearToken();
        } finally {
            clearTimeout(safetyTimeout);
            setLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const result = await loginUser(email, password);
            if (result.success && result.token) {
                await setToken(result.token);
                await AsyncStorage.setItem('geo_user', JSON.stringify(result.user));
                setTokenState(result.token);
                setUser(result.user);
                return { success: true };
            }
            return { success: false, message: result.message || 'Login failed.' };
        } catch (err: any) {
            console.error('Login error:', err);
            return { success: false, message: 'Could not connect to server. Check your computer\'s IP (192.168.1.19) and verify both devices are on the same Wi-Fi.' };
        }
    };

    const register = async (data: { name: string; email: string; password: string; phone?: string; city?: string }): Promise<{ success: boolean; message?: string }> => {
        try {
            const result = await registerUser(data);
            if (result.success && result.token) {
                await setToken(result.token);
                await AsyncStorage.setItem('geo_user', JSON.stringify(result.user));
                setTokenState(result.token);
                setUser(result.user);
                return { success: true };
            }
            return { success: false, message: result.message || 'Registration failed.' };
        } catch (err: any) {
            console.error('Registration error:', err);
            return { success: false, message: 'Could not connect to server. Check your computer\'s IP (192.168.1.19) and verify both devices are on the same Wi-Fi.' };
        }
    };

    const logout = async () => {
        await clearToken();
        setUser(null);
        setTokenState(null);
    };

    const updateUser = async (data: { name: string; phone?: string; city?: string }) => {
        try {
            const result = await updateProfileAPI(data);
            if (result.success && result.user) {
                setUser(result.user);
                await AsyncStorage.setItem('geo_user', JSON.stringify(result.user));
            }
        } catch { }
    };

    const refreshUser = async () => {
        try {
            const result = await fetchMe();
            if (result.success && result.user) {
                setUser(result.user);
                await AsyncStorage.setItem('geo_user', JSON.stringify(result.user));
            }
        } catch { }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
