import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,

  onAuthStateChanged,
  getAuth,
  updateProfile,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

import app from "../Firebase/firebase.init";
import axios from "axios";

export const AuthContext = createContext();

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create user with email/password
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };



  const SignIn = (email,password)=>{
  setLoading(true)
  return  signInWithEmailAndPassword(auth,email,password)

  }




    const provider = new GoogleAuthProvider();
  const GoogleSignIn = () =>{
   return  signInWithPopup(auth,provider)
  }

  const LogOut = ()=>{
    setLoading(true)
    return signOut(auth)
  }



  const UpdatedInfo = (profileInfo) =>{
  return updateProfile(auth.currentUser,profileInfo)
}
  // Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if(currentUser?.email){
        const userData = {email:currentUser?.email}
      axios.post('https://life-insurance-server-side.vercel.app/jwt',userData,{
        withCredentials:true,
      })
      .then(res=>{
        console.log(res.data)
      })
      .catch(error=> console.log(error))
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authData = {
    user,
    loading,
    createUser,
    updateProfile,
    SignIn,
    GoogleSignIn,
    LogOut,
    UpdatedInfo
   
  };

  return (
    <AuthContext value={authData}>
      {children}
    </AuthContext>
  );
};

export default AuthProvider;
