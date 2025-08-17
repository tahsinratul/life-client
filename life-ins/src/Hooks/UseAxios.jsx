import axios from 'axios';
import React from 'react';
const AxiosInstant = axios.create({


    baseURL:`https://life-server-one.vercel.app`

})

const UseAxios = () => {
    return AxiosInstant;
};

export default UseAxios;