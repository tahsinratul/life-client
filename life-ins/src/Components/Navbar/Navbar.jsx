import { Link, NavLink } from "react-router"; // ✅ fixed import
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import Swal from "sweetalert2";
import Logo from "../../Hooks/Logo";
import {
  FaBlog,
  FaFileAlt,
  FaHome,
  FaTachometerAlt,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import useUserRole from "../../hooks/useUserRole"; // ✅ role hook

const Navbar = () => {
  const { user, loading, LogOut } = useContext(AuthContext);
  const { role, roleLoading } = useUserRole(user?.email);

  const handleLogout = () => {
    LogOut()
      .then(() => {
        Swal.fire("Logged Out", "You have been successfully logged out.", "success");
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Error", error.message, "error");
      });
  };

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `font-semibold flex items-center gap-2 text-white ${
              isActive ? "underline underline-offset-4 decoration-white" : ""
            }`
          }
        >
          <FaHome /> Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/policies"
          className={({ isActive }) =>
            `font-semibold flex items-center gap-2 text-white ${
              isActive ? "underline underline-offset-4 decoration-white" : ""
            }`
          }
        >
          <FaFileAlt /> All Policies
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/blogs"
          className={({ isActive }) =>
            `font-semibold flex items-center gap-2 text-white ${
              isActive ? "underline underline-offset-4 decoration-white" : ""
            }`
          }
        >
          <FaBlog /> Blogs
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `font-semibold flex items-center gap-2 text-white ${
                isActive ? "underline underline-offset-4 decoration-white" : ""
              }`
            }
          >
            <FaTachometerAlt /> Dashboard
          </NavLink>
        </li>
      )}
      {role === "admin" && (
        <li>
          <NavLink
            to="/dashboard/manage-users"
            className={({ isActive }) =>
              `font-semibold flex items-center gap-2 text-white ${
                isActive ? "underline underline-offset-4 decoration-white" : ""
              }`
            }
          >
            <MdAdminPanelSettings /> Admin Panel
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="bg-slate-800 shadow-sm fixed top-0 z-50 w-full px-4 max-w-7xl">
      <div className="navbar mx-auto flex justify-between items-center py-2">
        {/* Left (Logo + Brand) */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-bold text-white">Life Care</span>
          </Link>
        </div>

        {/* Center Nav (Large Screen Only) */}
        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-4">{navLinks}</ul>
        </div>

        {/* Right (Login / Logout + Mobile Menu) */}
        <div className="flex items-center gap-2">
          {!loading &&
            (user ? (
              <button
                onClick={handleLogout}
                className="btn bg-white text-red-600 hover:bg-red-100 flex items-center gap-2"
              >
                <FaSignOutAlt /> Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className="btn bg-white text-slate-700 hover:bg-blue-100 flex items-center gap-2"
              >
                <FaSignInAlt /> Login
              </NavLink>
            ))}

          {/* Mobile Menu */}
          <div className="dropdown dropdown-end lg:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1000] p-2 shadow bg-slate-800 rounded-box w-60"
            >
              {navLinks}
              {!loading &&
                (user ? (
                  <li>
                    <button onClick={handleLogout} className="text-white flex items-center gap-2">
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                ) : (
                  <li>
                    <NavLink to="/login" className="text-white flex items-center gap-2">
                      <FaSignInAlt /> Login
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
