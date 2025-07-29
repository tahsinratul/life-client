import React, { useContext, useState, Fragment } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../../Context/AuthProvider";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import { Dialog, Transition } from "@headlessui/react";

const AssignedCustomers = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedApp, setSelectedApp] = useState(null);

  // Fetch assigned applications
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["assignedApplications", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/applications?assignedAgent=${user?.email}`);
      
      return res.data
    },
  });

  // Update application status (and paymentStatus if Approved)
  const updateStatus = useMutation({
    mutationFn: async ({ appId, newStatus, policyId }) => {
      // Step 1: Update status
      await axiosSecure.patch(`/applicationStatus/${appId}`, {
        status: newStatus,
      });

      // Step 2: If status is Approved
      if (newStatus === "Approved") {
        // Set paymentStatus to "due"
        await axiosSecure.patch(`/applicationPaymentStatus/${appId}`, {
          paymentStatus: "due",
        });

        // Step 3: Increase policy purchase count
        await axiosSecure.patch(`/policies/purchase/${policyId}`);
      }
    },
    onSuccess: () => {
      Swal.fire("Success", "Status updated successfully!", "success");
      queryClient.invalidateQueries(["assignedApplications"]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to update status", "error");
    },
  });

  const handleStatusChange = (appId, newStatus, policyId) => {
    updateStatus.mutate({ appId, newStatus, policyId });
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-[var(--color-primary)]">
        Assigned Customers
      </h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-500">No assigned customers yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full bg-white shadow rounded-xl">
            <thead>
              <tr className="bg-[var(--color-primary)] text-white text-left">
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Policy</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-t">
                  <td className="py-3 px-4">{app.ApplicantName}</td>
                  <td className="py-3 px-4">{app.userEmail}</td>
                  <td className="py-3 px-4">{app.policyTitle}</td>
                  <td className="py-3 px-4">
                    <select
                      className="select select-bordered w-full max-w-xs"
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(app._id, e.target.value, app.policyId)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="btn btn-outline btn-sm"
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

      {/* Applicant Detail Modal */}
      <Transition appear show={!!selectedApp} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setSelectedApp(null)}>
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
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold leading-6 text-[var(--color-primary)] mb-4"
                >
                  Applicant Details
                </Dialog.Title>

                {selectedApp && (
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {selectedApp.ApplicantName}</p>
                    <p><strong>Email:</strong> {selectedApp.userEmail}</p>
                    <p><strong>Policy:</strong> {selectedApp.policyTitle}</p>
                    <p><strong>Age:</strong> {selectedApp.quoteInfo?.age}</p>
                    <p><strong>Gender:</strong> {selectedApp.quoteInfo?.gender}</p>
                    <p><strong>Smoker:</strong> {selectedApp.quoteInfo?.smoker ? "Yes" : "No"}</p>
                    <p><strong>Coverage:</strong> ${selectedApp.quoteInfo?.coverage}</p>
                    <p><strong>Duration:</strong> {selectedApp.quoteInfo?.duration} years</p>
                    <p><strong>Annual Premium:</strong> ${selectedApp.quoteInfo?.annual}</p>
                    <p><strong>Monthly Premium:</strong> ${selectedApp.quoteInfo?.monthly}</p>
                  </div>
                )}

                <div className="mt-6 text-right">
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="btn btn-outline"
                  >
                    Close
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

export default AssignedCustomers;
