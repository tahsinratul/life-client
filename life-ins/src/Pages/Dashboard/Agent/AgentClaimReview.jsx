import React, { useEffect, useState, Fragment } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import { Dialog, Transition } from "@headlessui/react";
import { FaClock, FaInbox } from "react-icons/fa";

const AgentClaimReview = () => {
  const axiosSecure = UseAxiosSecure();
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await axiosSecure.get("/claims");
        const pendingClaims = res.data.filter(claim => claim.status === "Pending");
        setClaims(pendingClaims);
      } catch (err) {
        console.error("Error fetching claims:", err);
      }
    };
    fetchClaims();
  }, [axiosSecure]);

  const handleApprove = async (claimId) => {
    try {
      const res = await axiosSecure.patch(`/claims/status/${claimId}`, {
        status: "Approved"
      });
      if (res.data.modifiedCount > 0) {
        Swal.fire("Success", "Claim approved successfully!", "success");
        setClaims(prev => prev.filter(claim => claim._id !== claimId));
        setSelectedClaim(null);
      }
    } catch (error) {
      console.error("Approval failed", error);
      Swal.fire("Error", "Failed to approve claim", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6 flex items-center gap-2">
        <FaClock className="text-[var(--color-primary)]" />
        Pending Claim Requests
      </h2>

      {claims.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow">
          <FaInbox className="text-6xl text-gray-400 mb-4" />
          <p className="text-xl font-semibold text-gray-600">No pending claims found.</p>
          <p className="text-sm text-gray-400">All customer claims have been reviewed.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="table w-full">
            <thead>
              <tr className="bg-[var(--color-primary)] text-white">
                <th>Policy Name</th>
                <th>Reason</th>
                <th>User</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {claims.map(claim => (
                <tr key={claim._id}>
                  <td>{claim.policyTitle}</td>
                  <td>{claim.reason.slice(0, 30)}...</td>
                  <td>{claim.userEmail}</td>
                  <td>{new Date(claim.submittedAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => setSelectedClaim(claim)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Transition appear show={!!selectedClaim} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setSelectedClaim(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6">
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-xl font-bold text-[var(--color-primary)] mb-4">
                  Claim Details
                </Dialog.Title>

                {selectedClaim && (
                  <div className="space-y-3">
                    <p><strong>Policy Title:</strong> {selectedClaim.policyTitle}</p>
                    <p><strong>User Email:</strong> {selectedClaim.userEmail}</p>
                    <p><strong>Reason:</strong> {selectedClaim.reason}</p>
                    <p><strong>Status:</strong> {selectedClaim.status}</p>
                    <p><strong>Submitted:</strong> {new Date(selectedClaim.submittedAt).toLocaleString()}</p>
                    <p>
                      <strong>Document:</strong>{" "}
                      <a
                        href={selectedClaim.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View File
                      </a>
                    </p>
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-2">
                  <button className="btn btn-outline" onClick={() => setSelectedClaim(null)}>
                    Close
                  </button>
                  <button
                    className="btn bg-[var(--color-primary)] text-white"
                    onClick={() => handleApprove(selectedClaim._id)}
                  >
                    Approve
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AgentClaimReview;
