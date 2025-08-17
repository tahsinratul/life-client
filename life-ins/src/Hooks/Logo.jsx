import React from 'react';
import logo from '/logo.png'; 
import { NavLink } from 'react-router';

// logo fix

const Logo = () => {
  return (
    <NavLink to="/">
      <div className='flex   items-end'>
      <img src={logo} className='size-14' alt="Logo" />

    </div>
    </NavLink>
  );
};

export default Logo;
