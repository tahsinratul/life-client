import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase.config";

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email,password) => {
        return createUserWithEmailAndPassword(auth, email,password);
    }
    const loginUser = (email,password) => {
        return signInWithEmailAndPassword(auth, email,password);
    }

    const loginUserWithGoogle = (provider) => {
        return signInWithPopup(auth,provider);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            setUser(currentUser);
          } else {
            setUser(null);
          }
          setLoading(false);
          console.log('user in the auth state change', currentUser)
        });
        return () => unsubscribe();
      }, []);
      

    const logOutUser = () => {
        return signOut(auth);
    }

    const userInfo = {
        user,
        setUser,
        createUser,
        loginUser,
        logOutUser,
        loading,
        loginUserWithGoogle
    }
    return (
        <AuthContext value={userInfo}>
            {children}
        </AuthContext>
    )
};

export default AuthProvider;