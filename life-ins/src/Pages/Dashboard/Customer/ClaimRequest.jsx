import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/AuthProvider";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { FaShieldAlt, FaFileInvoice } from "react-icons/fa";

const ClaimRequest = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();

  const [approvedApplications, setApprovedApplications] = useState([]);
  const [claims, setClaims] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchApprovedApplications = async () => {
      try {
        const res = await axiosSecure.get(
          `/my-approved-applications?email=${user?.email}`
        );
        setApprovedApplications(res.data);
      } catch (err) {
        console.error("Failed to fetch approved applications:", err);
      }
    };

    const fetchClaims = async () => {
      try {
        const res = await axiosSecure.get(`/claims?userEmail=${user?.email}`);
        setClaims(res.data);
      } catch (err) {
        console.error("Failed to fetch claims:", err);
      }
    };

    if (user?.email) {
      fetchApprovedApplications();
      fetchClaims();
    }
  }, [user?.email, axiosSecure]);

  const openClaimForm = (application) => {
    setSelectedApp(application);
    setShowForm(true);
  };

  const onClaimSubmitted = (newClaim) => {
    setClaims((prev) => [...prev, newClaim]);
    setShowForm(false);
    setSelectedApp(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow my-10">
      <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6 flex items-center gap-2">
        <FaShieldAlt className="text-[var(--color-primary)]" />
        Your Approved Policies & Claims
      </h2>

      {approvedApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow">
          <FaFileInvoice className="text-7xl text-gray-300 mb-4" />
          <p className="text-2xl font-semibold text-gray-600 mb-2">
            No Approved Policies Found
          </p>
          <p className="text-gray-400 text-center max-w-sm">
            You currently have no approved policies. Once a policy is approved,
            it will appear here for you to file claims.
          </p>
        </div>
      ) : (
        <table className="table w-full border rounded-lg">
          <thead>
            <tr className="bg-[var(--color-primary)] text-white">
              <th>Policy Name</th>
              <th>Claim Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {approvedApplications.map((app) => {
              const claim = claims.find((c) => c.policyId === app.policyId);
              const status = claim?.status || "No Claims";

              return (
                <tr key={app._id} className="hover">
                  <td>{app.policyTitle}</td>
                  <td>{status}</td>
                  <td>
                    {!claim ? (
                      <button
                        onClick={() => openClaimForm(app)}
                        className="btn btn-sm bg-[var(--color-primary)] text-white"
                      >
                        File Claim
                      </button>
                    ) : status === "Pending" ? (
                      <button
                        disabled
                        className="btn text-black btn-sm btn-disabled"
                      >
                        Pending Claim
                      </button>
                    ) : status === "Approved" ? (
                      <button
                        disabled
                        className="btn btn-sm bg-green-500 text-black"
                      >
                        Approved
                      </button>
                    ) : (
                      <button disabled className="btn btn-sm btn-disabled">
                        {status}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {showForm && selectedApp && (
        <ClaimForm
          application={selectedApp}
          userEmail={user.email}
          onClose={() => setShowForm(false)}
          onSuccess={onClaimSubmitted}
          axiosSecure={axiosSecure}
        />
      )}
    </div>
  );
};

const ClaimForm = ({
  application,
  userEmail,
  onClose,
  onSuccess,
  axiosSecure,
}) => {
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && ["image/jpeg", "image/png"].includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      Swal.fire("Invalid file", "Only JPG or PNG images are allowed.", "error");
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      Swal.fire("Error", "Please provide reason for claim.", "error");
      return;
    }
    if (!file) {
      Swal.fire("Error", "Please upload supporting document.", "error");
      return;
    }

    setSubmitting(true);

    try {
      // Upload to ImgBB
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Key}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error("Image upload failed");

      const claimData = {
        policyId: application.policyId,
        policyTitle: application.policyTitle,
        userEmail,
        reason,
        documentUrl: uploadData.data.url,
        status: "Pending",
        submittedAt: new Date(),
      };

      const res = await axiosSecure.post("/claims", claimData);

      if (res.data.insertedId) {
        Swal.fire("Success", "Claim submitted successfully.", "success");
        onSuccess({ ...claimData, _id: res.data.insertedId });
      } else {
        throw new Error("Failed to save claim");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Claim submission failed.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">
          File Claim for: {application.policyTitle}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Policy Name</label>
            <input
              type="text"
              value={application.policyTitle}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Reason for Claim</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="textarea textarea-bordered w-full"
              placeholder="Enter the reason for your claim"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Upload Supporting Document (Image Only)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-[var(--color-primary)] text-white"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Claim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimRequest;
