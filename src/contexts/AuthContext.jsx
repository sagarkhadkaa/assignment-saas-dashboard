import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password) {
    try {
      console.log('Attempting to create user with email:', email);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('User created successfully:', userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error('Error in signup function:', error.code, error.message);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      console.log('Attempting to log in user with email:', email);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('User logged in successfully:', userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error('Error in login function:', error.code, error.message);
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    console.log('Setting up auth state observer');
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.log(
          'Auth state changed:',
          user ? `User: ${user.uid}` : 'No user'
        );
        setCurrentUser(user);
        setLoading(false);
      },
      (error) => {
        console.error('Auth state observer error:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
