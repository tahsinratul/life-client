import React from 'react';
import logo from '/logo.png'; 
import { NavLink } from 'react-router';

const Logo = () => {
  return (
    <NavLink to="/">
      <div className='flex   items-end'>
      <img src={logo} className='h-12 w-20' alt="Logo" />

    </div>
    </NavLink>
  );
};

export default Logo;
