import React from 'react';
import Navbar from '../Components/Navbar/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Components/Footer/Footer';

const RootLayout = () => {
    return (
        <div className=" min-h-screen flex flex-col">
            <Navbar></Navbar>
  <main className="flex-grow">
        <Outlet />
      </main>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;