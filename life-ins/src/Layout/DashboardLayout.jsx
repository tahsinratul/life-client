import { Link, Outlet } from 'react-router'; 
import {
  FaHome,
  FaUser,
  FaPaperPlane,
  FaUserShield,
  FaFileContract,
  FaMoneyCheckAlt,
  FaUsersCog,
  FaBars,
} from 'react-icons/fa';

import UseUserRole from '../Hooks/UseUserRole';
import Logo from '../Hooks/Logo';

const DashboardLayout = () => {
  const { role, isRoleLoading } = UseUserRole();

  if (isRoleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open">
      {/* Toggle for small devices */}
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        {/* Top bar for small devices */}
        <div className="w-full flex justify-between items-center text-white p-4 bg-primary lg:hidden">
          <label htmlFor="dashboard-drawer" className="btn btn-ghost text-xl">
            <FaBars />
          </label>
          <h2 className="text-lg font-bold text-white">Dashboard</h2>
        </div>

        {/* Page content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-72 min-h-full bg-base-200 text-base-content space-y-2">
          <Logo />

          <li>
            <Link to="/dashboard">
              <FaUser className="text-primary" />My Profile
            </Link>
          </li>

          {/* Role-based Links */}
          {role === 'admin' && (
            <>
              <li>
                <Link to="/dashboard/manage-applications">
                  <FaFileContract className="mr-2" /> Manage Applications
                </Link>
              </li>
              <li>
                <Link to="/dashboard/manage-users">
                  <FaUsersCog className="mr-2" /> Manage Users
                </Link>
              </li>
              <li>
                <Link to="/dashboard/manage-policies">
                  <FaFileContract className="mr-2" /> Manage Policies
                </Link>
              </li>
              <li>
                <Link to="/dashboard/manage-transactions">
                  <FaMoneyCheckAlt className="mr-2" /> Manage Transactions
                </Link>
              </li>
              <li>
                <Link to="/dashboard/manage-blogs">
                  <FaUser className="mr-2" /> Manage Blogs
                </Link>
              </li>
            </>
          )}

          {/* You can add other roles like agent, customer with their own menus here */}
         {role === 'agent' && (
  <>
    

    <li>
      <Link to="/dashboard/assigned-customers" className="flex items-center gap-2">
        <FaUsersCog className="text-primary" />
        <span className="font-medium">Assigned Customers</span>
      </Link>
    </li>

    <li>
      <Link to="/dashboard/claim-review" className="flex items-center gap-2">
        <FaFileContract className="text-primary" />
        <span className="font-medium">Claim Review</span>
      </Link>
    </li>

    <li>
      <Link to="/dashboard/post-blog" className="flex items-center gap-2">
        <FaUser className="text-primary" />
        <span className="font-medium">Manage Blogs</span>
      </Link>
    </li>
  </>
)}


{/* Customers routes */}
         {role === 'customer' && (
  <>
    <li>
      <Link to="/dashboard/my-policies" className="flex items-center gap-2">
        <FaFileContract className="text-primary" />
        <span className="font-medium">My Policies</span>
      </Link>
    </li>

    {/* <li>
      <Link to="/dashboard/profile" className="flex items-center gap-2">
        <FaUser className="text-primary" />
        <span className="font-medium"> My Profile</span>
      </Link>
    </li> */}

    {/* <li>
      <Link to="/dashboard/my-reviews" className="flex items-center gap-2">
        <FaPaperPlane className="text-primary" />
        <span className="font-medium">Submit Reviews</span>
      </Link>
    </li> */}

    <li>
      <Link to="/dashboard/payment-status" className="flex items-center gap-2">
        <FaMoneyCheckAlt className="text-primary" />
        <span className="font-medium">Payment Status</span>
      </Link>
    </li>

    {/* <li>
      <Link to="/dashboard/payment" className="flex items-center gap-2">
        <FaFileContract className="text-primary" />
        <span className="font-medium">Payment Page</span>
      </Link>
    </li> */}

    <li>
      <Link to="/dashboard/claim-request" className="flex items-center gap-2">
        <FaUserShield className="text-secondary" />
        <span className="font-medium">Claim Request</span>
      </Link>
    </li>
  </>
)}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;