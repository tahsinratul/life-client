import React, { use, useEffect } from "react";
import { Link, NavLink } from "react-router";
import Logo from "../assets/logo.png";
import { AuthContext } from "../Context/AuthContext";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import "./Navbar.css"

const Navbar = () => {
  const { user, logOutUser } = use(AuthContext);

  const notLoggedInLinks = (
    <>
      <li>
        <NavLink className="font-bold" to={"/"}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink className="font-bold"
          to={"/availabletrips"}
        >
          Available Trips
        </NavLink>
      </li>
    </>
  );

  const loggedInLinks = (
    <>
      <li>
        <NavLink className="font-bold" to={"/"}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink className="font-bold"
          to={"/availabletrips"}
        >
          Available Trips
        </NavLink>
      </li>
      <li>
        <NavLink className="font-bold" to={"/addtrips"}>
          Add Trips
        </NavLink>
      </li>
      <li>
        <NavLink className="font-bold" to={"/mytrips"}>
          My Trips
        </NavLink>
      </li>
      <li>
        <NavLink className="font-bold"
          to={"/mybookings"}
        >
          My Bookings
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="flex justify-center items-center font-display">
      <div className="mx-auto w-[90%] fixed top-5 z-50  flex justify-between rounded-2xl items-center text-base font-normal py-1 px-2 bg-white border-4 border-slate-900">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {user ? loggedInLinks : notLoggedInLinks}
            </ul>
          </div>
          <a href="/" className="flex items-center text-xl font-bold">
            <img src={Logo} className="w-12" alt="" />
            Tourista
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {user ? loggedInLinks : notLoggedInLinks}
          </ul>
        </div>
        <div className="navbar-end flex gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div
                data-tooltip-id="user"
                data-tooltip-content={user?.displayName}
                data-tooltip-place="top"
              >
                <img
                  src={user?.photoURL}
                  alt={user?.displayName}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                />
              </div>
              <Tooltip id="user" style={{ zIndex: "1000" }} />
              <button
                className="btn bg-slate-900 rounded-2xl text-white"
                onClick={logOutUser}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="btn bg-slate-900 rounded-2xl text-white">Login</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
