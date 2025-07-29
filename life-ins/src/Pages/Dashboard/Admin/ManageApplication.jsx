import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaEye,
  FaUserTie,
} from "react-icons/fa";

const ManageApplication = () => {
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  // State to handle modals and feedback
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false); // Step 1: Show/hide rejection modal
  const [rejectionFeedback, setRejectionFeedback] = useState(""); // Step 2: Store feedback input

  // Step 3: Fetch all applications
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["allApplications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/applicationsAdmin");
      return res.data;
    },
  });

  // Step 4: Fetch all agents
  const { data: agents = [] } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data.filter((user) => user.role === "agent");
    },
  });

  // Step 5: Mutation to update approval status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      axiosSecure.patch(`/applications/${id}/status`, { status }),
    onSuccess: (_, variables) => {
      Swal.fire("Success", `Status updated to ${variables.status}`, "success");
      queryClient.invalidateQueries(["allApplications"]);
    },
  });

  // Step 6: Mutation to assign agent
  const assignAgentMutation = useMutation({
    mutationFn: ({ applicationId, agentEmail }) =>
      axiosSecure.patch(`/applications/${applicationId}`, {
        assignedAgent: agentEmail,
      }),
    onSuccess: () => {
      Swal.fire("Assigned", "Agent successfully assigned", "success");
      queryClient.invalidateQueries(["allApplications"]);
    },
  });

  // Step 7: Mutation to reject with feedback
  const rejectApplicationMutation = useMutation({
    mutationFn: ({ id, feedback }) =>
      axiosSecure.patch(`/applications/${id}/reject`, { feedback }),
    onSuccess: () => {
      Swal.fire("Rejected", "Application has been rejected with feedback.", "success");
      queryClient.invalidateQueries(["allApplications"]);
      setRejectionFeedback("");
      setShowRejectModal(false);
    },
  });

  if (isLoading) return <p className="text-center py-10">Loading applications...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-[var(--color-primary)] flex items-center gap-2">
        <FaUserTie className="text-4xl" /> Manage Insurance Applications
      </h2>

      {/* Application Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="table w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
            <tr>
              <th>Applicant</th>
              <th>Email</th>
              <th>Policy</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Assign Agent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No applications found.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app._id} className="border-t hover:bg-gray-50">
                  <td>{app.ApplicantName || "N/A"}</td>
                  <td>{app.userEmail}</td>
                  <td>{app.policyTitle}</td>
                  <td>{new Date(app.submittedAt || app.createdAt || "").toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : app.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {app.status || "Pending"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline btn-primary"
                      onClick={() => {
                        setSelectedApplication(app);
                        document.getElementById("agent_assign_modal").showModal();
                      }}
                    >
                      {app.assignedAgent ? "Change Agent" : "Assign Agent"}
                    </button>
                  </td>
                  <td className="flex flex-wrap gap-2 mt-2">
                    <button
                      className="btn btn-xs bg-green-600 text-white"
                      onClick={() =>
                        updateStatusMutation.mutate({ id: app._id, status: "Approved" })
                      }
                      disabled={app.status === "Approved"}
                    >
                      <FaCheckCircle /> Approve
                    </button>

                    {/* Step 8: Trigger Rejection Modal */}
                    <button
                      className="btn btn-xs bg-red-600 text-white"
                      onClick={() => {
                        setSelectedApplication(app);
                        setShowRejectModal(true);
                      }}
                      disabled={app.status === "Rejected"}
                    >
                      <FaTimesCircle /> Reject
                    </button>

                    <button
                      className="btn btn-xs bg-blue-500 text-white"
                      onClick={() => {
                        setSelectedApplication(app);
                        document.getElementById("application_modal").showModal();
                      }}
                    >
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      <dialog id="application_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-xl mb-4 flex text-[var(--color-primary)] items-center gap-2">
            <FaInfoCircle /> Application Details
          </h3>
          {selectedApplication && (
            <div className="space-y-2 text-sm">
              <p><strong>Applicant Name:</strong> {selectedApplication.ApplicantName}</p>
              <p><strong>Email:</strong> {selectedApplication.userEmail}</p>
              <p><strong>Policy:</strong> {selectedApplication.policyTitle}</p>
              <p><strong>Coverage:</strong> {selectedApplication.quoteInfo?.coverage}</p>
              <p><strong>Duration:</strong> {selectedApplication.quoteInfo?.duration} years</p>
              <p><strong>Premium:</strong> ${selectedApplication.quoteInfo?.annual}</p>
              <p><strong>Status:</strong> {selectedApplication.status}</p>
              <p><strong>Assigned Agent:</strong> {selectedApplication.assignedAgent || "Not Assigned"}</p>
              {selectedApplication.status === "Rejected" && selectedApplication.rejectionFeedback && (
                <p className="text-red-500"><strong>Rejection Feedback:</strong> {selectedApplication.rejectionFeedback}</p>
              )}
            </div>
          )}
          <div className="modal-action mt-4">
            <form method="dialog">
              <button className="btn btn-neutral">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Assign Agent Modal */}
      <dialog id="agent_assign_modal" className="modal">
        <div className="modal-box max-w-xl">
          <h3 className="font-bold text-lg mb-4 text-[var(--color-primary)]">Assign Agent</h3>
          {selectedApplication && (
            <div>
              <p className="mb-2 text-sm text-gray-700">
                Assigning for: <strong>{selectedApplication.ApplicantName}</strong> ({selectedApplication.userEmail})
              </p>
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                {agents.length === 0 ? (
                  <p>No agents available.</p>
                ) : (
                  agents.map((agent) => (
                    <div
                      key={agent._id}
                      className="flex justify-between items-center border rounded-lg p-3 hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-semibold">{agent.name || "Unnamed Agent"}</p>
                        <p className="text-xs text-gray-500">{agent.email}</p>
                      </div>
                      <button
                        className="btn btn-xs btn-success"
                        onClick={() => {
                          assignAgentMutation.mutate({
                            applicationId: selectedApplication._id,
                            agentEmail: agent.email,
                          });
                          document.getElementById("agent_assign_modal").close();
                        }}
                      >
                        Assign
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          <div className="modal-action mt-4">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Step 9: Rejection Modal with Feedback */}
      {showRejectModal && (
        <dialog open className="modal" id="reject_modal">
          <div className="modal-box max-w-lg">
            <h3 className="font-bold text-lg text-red-600 mb-3 flex items-center gap-2">
              <FaTimesCircle /> Reject Application
            </h3>
            <p className="mb-2 text-sm text-gray-600">
              Provide a reason for rejecting{" "}
              <strong>{selectedApplication?.ApplicantName}</strong>'s application.
            </p>
            <textarea
              className="textarea textarea-bordered w-full h-28 mb-4"
              placeholder="Write feedback or reason here..."
              value={rejectionFeedback}
              onChange={(e) => setRejectionFeedback(e.target.value)}
            />
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={() => {
                  if (!rejectionFeedback.trim()) {
                    Swal.fire("Error", "Feedback is required", "error");
                    return;
                  }
                  rejectApplicationMutation.mutate({
                    id: selectedApplication._id,
                    feedback: rejectionFeedback,
                  });
                }}
              >
                Submit Rejection
              </button>
              <button
                className="btn"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionFeedback("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ManageApplication;
