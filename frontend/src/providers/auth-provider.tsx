'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { usersApi } from '@/lib/api';
import { User as DbUser } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    dbUser: DbUser | null;
    session: Session | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [dbUser, setDbUser] = useState<DbUser | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            const { data: { session: initialSession } } = await supabase.auth.getSession();
            setSession(initialSession);
            setUser(initialSession?.user ?? null);

            if (initialSession?.user) {
                await fetchDbProfile();
            }

            setIsLoading(false);
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, currentSession) => {
                setSession(currentSession);
                setUser(currentSession?.user ?? null);

                if (currentSession?.user) {
                    await fetchDbProfile();
                } else {
                    setDbUser(null);
                }

                setIsLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchDbProfile = async () => {
        try {
            const { data } = await usersApi.getProfile();
            setDbUser(data);
        } catch (error) {
            console.error('Failed to fetch DB profile', error);
            // If DB user doesn't exist yet but has Supabase Auth user, 
            // the first API call to the backend usually auto-creates it.
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setDbUser(null);
        setSession(null);
        router.push('/');
        router.refresh();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                dbUser,
                session,
                isLoading,
                signOut,
                refreshProfile: fetchDbProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
