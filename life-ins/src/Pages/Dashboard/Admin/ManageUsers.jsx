import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import { FaUserShield, FaUserTie, FaUser, FaTrashAlt } from "react-icons/fa";

const ManageUsers = () => {
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      return await axiosSecure.patch(`/user/${id}`, { role });
    },
    onSuccess: (_, variables) => {
      Swal.fire("Updated!", `User role changed to ${variables.role}`, "success");
      queryClient.invalidateQueries(["allUsers"]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to update role", "error");
    },
  });

  // Delete mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/users/${id}`);
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "User has been removed.", "success");
      queryClient.invalidateQueries(["allUsers"]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to delete user", "error");
    },
  });

  if (isLoading) return <div className="text-center p-6">Loading users...</div>;
  if (error) return <div className="text-center text-red-600">Failed to load users.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-[var(--color-primary)] flex items-center gap-2">
        <FaUserShield /> Manage Users
      </h2>

      <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Registered</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{user.name || "N/A"}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-blue-100 text-blue-800"
                          : user.role === "agent"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(user.created_at || user.registeredAt || "").toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    {user.role === "customer" && (
                      <button
                        onClick={() => updateRoleMutation.mutate({ id: user._id, role: "agent" })}
                        className="inline-flex items-center px-3 py-1 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600"
                      >
                        <FaUserTie className="mr-1" /> Make Agent
                      </button>
                    )}
                    {user.role === "agent" && (
                      <button
                        onClick={() => updateRoleMutation.mutate({ id: user._id, role: "customer" })}
                        className="inline-flex items-center px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded hover:bg-yellow-600"
                      >
                        <FaUser className="mr-1" /> Make Customer
                      </button>
                    )}
                    <button
                      onClick={() => deleteUserMutation.mutate(user._id)}
                      className="inline-flex items-center px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600"
                    >
                      <FaTrashAlt className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
