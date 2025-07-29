import React, { useContext, useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaCamera, FaClock } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/AuthProvider";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import UseUserRole from "../../../Hooks/UseUserRole";

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();

  const [editMode, setEditMode] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({ name: "", photo: "" });
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
 const { role, isRoleLoading } = UseUserRole();
  // Fetch user data from DB
  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/user/${user.email}`).then((res) => {
        setUserData(res.data);
        setUpdatedInfo({
          name: res.data.name || "",
          photo: res.data.photo || user?.photoURL || "",
        });
        setLoading(false);
      });
    }
  }, [user, axiosSecure]);

  const handleChange = (e) => {
    setUpdatedInfo({ ...updatedInfo, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosSecure.patch(`/users/${userData._id}`, {
        name: updatedInfo.name,
        photo: updatedInfo.photo,
      });

      if (res.data.modifiedCount > 0) {
        Swal.fire("Success", "Profile updated successfully!", "success");
        setUserData({ ...userData, ...updatedInfo }); // update local data
        setEditMode(false);
      } else {
        Swal.fire("Info", "No changes made.", "info");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update profile.", "error");
    }
  };

  const getBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-600";
      case "agent":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-green-100 text-green-600";
    }
  };

  if (loading) {
    return <p className="text-center py-20">Loading profile...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 bg-white shadow-md rounded-xl">
      <div className="flex flex-col items-center space-y-4">
        {/* Profile Photo */}
        <img
          src={updatedInfo.photo}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-[var(--color-primary)]"
        />
        {editMode && (
          <input
            type="text"
            name="photo"
            placeholder="Photo URL"
            value={updatedInfo.photo}
            onChange={handleChange}
            className="input input-bordered w-full text-center"
          />
        )}

        {/* Name */}
        <h2 className="text-2xl font-bold text-[var(--color-primary)] flex items-center gap-2">
          <FaUser />
          {editMode ? (
            <input
              type="text"
              name="name"
              value={updatedInfo.name}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          ) : (
            <span>{userData.name}</span>
          )}
        </h2>

        {/* Email */}
        <p className="text-gray-600 flex items-center gap-2">
          <FaEnvelope />
          {user?.email}
        </p>

        {/* Role Badge */}
        <span
          className={`text-sm px-3 py-1 rounded-full font-medium ${getBadgeColor(
            userData.role
          )}`}
        >
          {userData.role.toUpperCase()}
        </span>

        {/* Last Login */}
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <FaClock />
          Last Login:{" "}
          {user?.metadata?.lastSignInTime
            ? new Date(user.metadata.lastSignInTime).toLocaleString()
            : "Unknown"}
        </p>

        {/* Buttons */}
        {editMode ? (
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleUpdate}
              className="btn bg-[var(--color-primary)] text-white"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              // Reset with latest DB values when clicking Edit
              setUpdatedInfo({
                name: userData.name || "",
                photo: userData.photo || user?.photoURL || "",
              });
              setEditMode(true);
            }}
            className="btn btn-outline text-[var(--color-primary)] mt-4"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
