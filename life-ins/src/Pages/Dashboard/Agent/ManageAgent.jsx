import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import { FaUserCheck, FaUserTimes, FaUserShield, FaArrowDown } from "react-icons/fa";

const ManageAgent = () => {
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("pending");

  // Fetch all agent applications
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["toBeAgents"],
    queryFn: async () => {
      const res = await axiosSecure.get("/to-be-agent"); 
      return res.data;
    },
  });

  // Update status (approve/reject)
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      return await axiosSecure.patch(`/to-be-agent/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["toBeAgents"]);
    },
  });

  // Promote user to agent role
  const promoteToAgent = useMutation({
    mutationFn: async ({ id }) => {
      await axiosSecure.patch(`/users/${id}`, { role: "agent" });
      await axiosSecure.patch(`/to-be-agent/${id}`, { status: "approved" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["toBeAgents"]);
      Swal.fire("Success", "User promoted to Agent", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to promote user", "error");
    },
  });

  const handleApprove = (app) => {
    promoteToAgent.mutate({ id: app.userId });
  };

  const handleReject = (id) => {
    Swal.fire({
      title: "Reject application?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus.mutate({ id, status: "rejected" });
        Swal.fire("Rejected", "Application has been rejected", "info");
      }
    });
  };

  const handleDemote = (userId) => {
    Swal.fire({
      title: "Demote this agent?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Demote",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/users/${userId}`, { role: "customer" }).then(() => {
          queryClient.invalidateQueries(["toBeAgents"]);
          Swal.fire("Demoted", "Agent demoted to Customer", "info");
        });
      }
    });
  };

  // Filter applications by tab
  const filtered = applications?.filter(
    (app) => app.status === (tab === "pending" ? "pending" : "approved")
  );

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] flex items-center gap-2 mb-6">
        <FaUserShield /> Manage Agents
      </h1>

      {/* Tabs */}
      <div className="tabs mb-6">
        <button
          className={`tab tab-bordered ${tab === "pending" ? "tab-active" : ""}`}
          onClick={() => setTab("pending")}
        >
          Pending Applications
        </button>
        <button
          className={`tab tab-bordered ${tab === "approved" ? "tab-active" : ""}`}
          onClick={() => setTab("approved")}
        >
          All Current Agents
        </button>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">No {tab} agents found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200 text-sm">
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Experience</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app._id}>
                  <td>{app.fullName}</td>
                  <td>{app.email}</td>
                  <td>{app.phone}</td>
                  <td>{app.experience} yrs</td>
                  <td>
                    <span
                      className={`badge ${
                        app.status === "pending"
                          ? "badge-warning"
                          : app.status === "approved"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="flex flex-wrap gap-2 justify-center">
                    {tab === "pending" ? (
                      <>
                        <button
                          className="btn btn-xs btn-success"
                          onClick={() => handleApprove(app)}
                        >
                          <FaUserCheck /> Approve
                        </button>
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => handleReject(app._id)}
                        >
                          <FaUserTimes /> Reject
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-xs btn-warning"
                        onClick={() => handleDemote(app.userId)}
                      >
                        <FaArrowDown className="mr-1" /> Demote
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageAgent;
