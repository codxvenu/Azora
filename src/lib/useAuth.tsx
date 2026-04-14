import React, { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Auth listener starting...');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email);
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Listen to profile changes
        const profileRef = doc(db, 'users', firebaseUser.uid);
        console.log('Listening to profile:', firebaseUser.uid);
        const unsubProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            console.log('Profile loaded:', docSnap.data());
            setProfile(docSnap.data() as UserProfile);
          } else {
            console.log('Profile not found, creating...');
            // Create profile if it doesn't exist
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'User',
              walletBalance: 0,
              role: firebaseUser.email === 'eafstriker@gmail.com' ? 'admin' : 'user',
              twoFactorEnabled: false,
              createdAt: new Date().toISOString()
            };
            setDoc(profileRef, newProfile).then(() => {
              console.log('Profile created successfully');
            }).catch(err => {
              console.error('Error creating profile:', err);
            });
            setProfile(newProfile);
          }
          setLoading(false);
        }, (err) => {
          console.error('Profile snapshot error:', err);
          setLoading(false);
        });
        return () => unsubProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
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
