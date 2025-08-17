import axios from 'axios';
import React from 'react';
const AxiosInstant = axios.create({


    baseURL:`https://life-insurance-server-side.vercel.app/`

})

const UseAxios = () => {
    return AxiosInstant;
};

export default UseAxios;