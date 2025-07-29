import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/AuthProvider";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";

const ApplicationForm = () => {
  const { quoteId: policyId } = useParams();
  const axiosSecure = UseAxiosSecure();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch selected policy
  const { data: policy, isLoading: loadingPolicy, error: policyError } = useQuery({
    queryKey: ["selectedPolicy", policyId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/policies/${policyId}`);
      return res.data;
    },
  });

  // Fetch user's latest quote
  const {
    data: quote,
    error: quoteError,
    isLoading: loadingQuote,
  } = useQuery({
    queryKey: ["userQuote", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/quotes?email=${user.email}`);
      return res.data;
    },
  });

  // Submit application to `/applications` collection
  const { mutate, isLoading: submitting } = useMutation({
    mutationFn: async (formData) => {
      const application = {
        userEmail: user?.email,
        ApplicantName:user?.displayName,
        policyId: policy._id,
        policyTitle: policy.title,
        quoteInfo: {
          monthly: quote?.monthlyPremium,
          annual: quote?.annualPremium,
          duration: quote?.duration,
          coverage: quote?.coverage,
          smoker: quote?.smoker,
          age: quote?.age,
          gender: quote?.gender,
        },
        applicantInfo: {
          ...formData,
        },
        status: "Pending",
        submittedAt: new Date(),
      };

      const res = await axiosSecure.post("/applications", application);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
  title: "Application Submitted!",
  text: "Your insurance application was successfully submitted.",
  icon: "success",
  timer: 3000,
  showConfirmButton: false,
  timerProgressBar: true,
});
      reset();
      navigate("/dashboard");
    },
    onError: (error) => {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Failed to submit application",
        icon: "error",
      });
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  if (loadingPolicy || loadingQuote)
    return <div className="text-center py-10">Loading form...</div>;

  if (policyError || !policy)
    return <div className="text-center py-10 text-red-600">Policy not found.</div>;

  if (quoteError || !quote)
    return <div className="text-center py-10 text-red-600">Quote not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow my-10">
      <h2 className="text-3xl font-bold text-center text-[var(--color-primary)] mb-6">
        Insurance Application Form
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Policy Summary */}
        <div className="grid md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded border border-blue-200">
          <Input label="Selected Policy" value={policy.title} />
          <Input label="Coverage" value={quote.coverage} />
          <Input label="Duration" value={`${quote.duration} years`} />
          <Input label="Premium (Monthly)" value={`$${quote.monthlyPremium}`} />
          <Input label="Premium (Annual)" value={`$${quote.annualPremium}`} />
        </div>

        {/* Personal Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <FormInput
            name="fullName"
            placeholder="Full Name"
            defaultValue={user?.displayName}
            register={register}
            error={errors.fullName}
            rules={{ required: "Full Name is required" }}
          />
          <input
            readOnly
            defaultValue={user?.email}
            className="input input-bordered w-full bg-gray-100"
          />
          <FormInput
            name="address"
            placeholder="Address"
            register={register}
            error={errors.address}
            rules={{ required: "Address is required" }}
          />
          <FormInput
            name="nid"
            placeholder="NID / SSN"
            register={register}
            error={errors.nid}
            rules={{ required: "NID / SSN is required" }}
          />
        </div>

        {/* Nominee Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <FormInput
            name="nomineeName"
            placeholder="Nominee Name"
            register={register}
            error={errors.nomineeName}
            rules={{ required: "Nominee Name is required" }}
          />
          <FormInput
            name="nomineeRelation"
            placeholder="Relationship"
            register={register}
            error={errors.nomineeRelation}
            rules={{ required: "Relationship is required" }}
          />
        </div>

        {/* Health Conditions */}
        <div>
          <label className="block mb-2 font-medium text-sm">Health Conditions</label>
          <div className="grid md:grid-cols-2 gap-3">
            {["Diabetes", "Heart Disease", "Cancer", "None of the above"].map((condition) => (
              <label className="flex gap-2" key={condition}>
                <input type="checkbox" value={condition} {...register("healthConditions")} />
                {condition}
              </label>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary px-10" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Helper Components
const Input = ({ label, value }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input readOnly value={value} className="input input-bordered w-full bg-gray-100" />
  </div>
);

const FormInput = ({ name, placeholder, register, error, rules, defaultValue }) => (
  <div>
    <input
      {...register(name, rules)}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="input input-bordered w-full"
    />
    {error && <p className="text-red-600 text-sm mt-1">{error.message}</p>}
  </div>
);

export default ApplicationForm;