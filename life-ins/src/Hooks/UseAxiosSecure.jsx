import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router'; // Use react-router-dom for hooks
import { AuthContext } from '../Context/AuthProvider';

const UseAxiosSecure = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  // Create axios instance
  const axiosSecure = axios.create({
    baseURL: 'https://life-server-one.vercel.app/',
    withCredentials:true
  });

  // Add Authorization header to requests if user token exists
  axiosSecure.interceptors.request.use(
    (config) => {
      if (user?.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle response errors globally
  axiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;

      if (status === 403) {
        navigate('/forbidden');
      } else if (status === 401) {
        try {
          await logOut();
          navigate('/login');
        } catch (err) {
          console.error('Error during logout:', err);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default UseAxiosSecure;
