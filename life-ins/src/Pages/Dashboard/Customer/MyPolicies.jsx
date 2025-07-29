import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { AuthContext } from "../../../Context/AuthProvider";
import { FaClipboardList } from "react-icons/fa";
import { jsPDF } from "jspdf";

const MyPolicies = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = useContext(AuthContext);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch applications for logged-in user
  const { data: applications = [], isLoading, refetch } = useQuery({
    queryKey: ["myPolicies", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/application?email=${user.email}`);
      return res.data;
    },
  });

  const openReviewModal = (app) => {
    setSelectedApplication(app);
    document.getElementById("review_modal").showModal();
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const form = e.target;
      const review = {
        rating: parseInt(form.rating.value),
        comment: form.comment.value,
        userEmail: user.email,
        userName: user?.displayName,
        photo: user?.photoURL,
        policyId: selectedApplication.policyId,
        policyTitle: selectedApplication.policyTitle,
        submittedAt: new Date(),
        status: "done", // add status here for backend validation
      };

      const res = await axiosSecure.post("/reviews", review);

      if (res.data.insertedId) {
        Swal.fire("Thank you!", "Review submitted successfully.", "success");
        form.reset();
        document.getElementById("review_modal").close();
        refetch();
      }
    } catch (error) {
      Swal.fire("Oops!", "Failed to submit review.", "error");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = (app) => {
    const doc = new jsPDF();
    const primaryColor = "#0284C7"; // Tailwind blue-600 or your primary color
    const lineHeight = 10;
    let y = 20;

    // ======= Header: Company Info =======
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor);
    doc.setFontSize(20);
    doc.text("Sure Life Insurance", 20, y);
    y += lineHeight;

    doc.setFontSize(11);
    doc.setTextColor(50);
    doc.setFont("helvetica", "normal");
    doc.text("Address: 123 Insurance Lane, Dhaka, Bangladesh", 20, y);
    y += 6;
    doc.text("Website: www.surelife.com   |   Contact: +880-1234-567890", 20, y);
    y += 10;

    // ======= Divider =======
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.7);
    doc.line(20, y, 190, y);
    y += 12;

    // ======= Section: Customer Info =======
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor);
    doc.text("Customer Information", 20, y);
    y += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Name: ${user?.displayName || "N/A"}`, 20, y);
    y += lineHeight;
    doc.text(`Email: ${app.userEmail}`, 20, y);
    y += lineHeight;

    // ======= Divider =======
    doc.setDrawColor(180);
    doc.line(20, y, 190, y);
    y += 12;

    // ======= Section: Policy Info =======
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor);
    doc.text("Policy Details", 20, y);
    y += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Policy Title: ${app.policyTitle}`, 20, y);
    y += lineHeight;
    doc.text(`Coverage: ${app.quoteInfo.coverage}`, 20, y);
    y += lineHeight;
    doc.text(`Duration: ${app.quoteInfo.duration} years`, 20, y);
    y += lineHeight;
    doc.text(`Monthly Premium: $${app.quoteInfo.monthly}`, 20, y);
    y += lineHeight;
    doc.text(`Status: ${app.status}`, 20, y);
    y += lineHeight;
    doc.text(`Issued On: ${new Date().toLocaleDateString()}`, 20, y);
    y += lineHeight;

    // ======= Divider =======
    y += 5;
    doc.setDrawColor(200);
    doc.line(20, y, 190, y);
    y += 15;

    // ======= Footer =======
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Sure Life Insurance — Helping You Secure Your Future", 20, 285);
    doc.text(
      "This is an auto-generated document. Please contact support for assistance.",
      20,
      290
    );

    // Save the file
    const fileName = `${app.policyTitle}_Policy_${app.userName || user?.displayName}.pdf`;
    doc.save(fileName);
  };

  if (isLoading) return <div className="text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)] flex items-center gap-2">
        <FaClipboardList className="text-[var(--color-primary)]" />
        My Policies
      </h2>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Policy</th>
              <th>Status</th>
              <th>Coverage</th>
              <th>Duration</th>
              <th>Premium</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.policyTitle}</td>
                <td>
                  <span
                    className={`badge ${
                      app.status === "Approved"
                        ? "badge-success"
                        : app.status === "Rejected"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {app.status}
                  </span>
                  {/* Show rejection feedback if exists */}
                  {app.status === "Rejected" && app.rejectionFeedback && (
                    <div className="text-xs mt-1 text-red-600">
                      Feedback: {app.rejectionFeedback}
                    </div>
                  )}
                </td>
                <td>{app.quoteInfo.coverage}</td>
                <td>{app.quoteInfo.duration} yrs</td>
                <td>${app.quoteInfo.monthly}</td>
                <td className="flex flex-col sm:flex-row gap-2">
                  {app.reviewSubmitted ? (
                    <button
                      className="btn btn-sm btn-success cursor-default"
                      disabled
                    >
                      Reviewed
                    </button>
                  ) : (
                    <button
                      onClick={() => openReviewModal(app)}
                      className="btn btn-sm btn-primary"
                    >
                      Give Review
                    </button>
                  )}

                  {app.status === "Approved" && (
                    <button
                      onClick={() => handleDownloadPDF(app)}
                      className="btn btn-sm btn-outline btn-secondary"
                    >
                      Download PDF
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      <dialog id="review_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Submit a Review</h3>
          <form onSubmit={handleReviewSubmit}>
            <label className="block mb-1 text-sm">Rating (1-5)</label>
            <select
              name="rating"
              className="select select-bordered w-full mb-3"
              required
            >
              <option value="">Choose rating</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>

            <label className="block mb-1 text-sm">Your Feedback</label>
            <textarea
              name="comment"
              className="textarea textarea-bordered w-full mb-3"
              placeholder="Write your experience..."
              required
            ></textarea>

            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
              <button
                type="button"
                onClick={() => document.getElementById("review_modal").close()}
                className="btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default MyPolicies;
