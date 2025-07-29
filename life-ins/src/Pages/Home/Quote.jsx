import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  HiOutlineUser,
  HiOutlineClock,
  HiOutlineUserCircle,
  HiOutlineFire,
  HiOutlineClipboardCheck,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";
import { AuthContext } from "../../Context/AuthProvider";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";

const Quote = () => {
  const navigate = useNavigate();
  const { id: policyId } = useParams();
  const { user } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();

  const [quote, setQuote] = useState(null);
  const [quoteId, setQuoteId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const age = parseInt(form.age.value, 10);
    const gender = form.gender.value;
    const coverage = parseInt(form.coverage.value, 10);
    const duration = parseInt(form.duration.value, 10);
    const smoker = form.smoker.value === "yes";

    // Premium calculation
    const baseRate = 0.05;
    let annual = (coverage * baseRate) / duration;

    if (age < 25) annual *= 0.9;
    else if (age <= 35) annual *= 1;
    else if (age <= 50) annual *= 1.2;
    else annual *= 1.5;

    if (smoker) annual *= 1.3;

    const monthly = Math.round(annual / 12);
    annual = Math.round(annual);

    const quoteData = {
      userEmail: user?.email,
      userName: user?.displayName,
      policyId,
      age,
      gender,
      coverage,
      duration,
      smoker,
      monthlyPremium: monthly,
      annualPremium: annual,
      createdAt: new Date(),
    };

    try {
      const res = await axiosSecure.post("/quotes", quoteData);
      if (res.data.insertedId) {
        setQuoteId(res.data.insertedId);
        setQuote({ monthly, annual });
      }
    } catch (error) {
      console.error("Failed to save quote", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-center text-[var(--color-primary)] mb-10">
        Get Your Insurance Quote
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-[var(--color-primary)] p-6 rounded-xl shadow"
      >
        {/* Age */}
        <div>
          <label className="block font-medium mb-1 flex items-center gap-2 text-[var(--color-primary)]">
            <HiOutlineUser /> Age
          </label>
          <input type="number" name="age" required className="input input-bordered w-full" />
        </div>

        {/* Gender */}
        <div>
          <label className="block font-medium mb-1 flex items-center gap-2 text-[var(--color-primary)]">
            <HiOutlineUserCircle /> Gender
          </label>
          <select name="gender" required className="select select-bordered w-full">
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Coverage */}
        <div>
          <label className="block font-medium mb-1 flex items-center gap-2 text-[var(--color-primary)]">
            <HiOutlineCurrencyDollar /> Coverage Amount
          </label>
          <input
            type="number"
            name="coverage"
            placeholder="e.g. 2000000"
            required
            className="input input-bordered w-full"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block font-medium mb-1 flex items-center gap-2 text-[var(--color-primary)]">
            <HiOutlineClock /> Duration (years)
          </label>
          <input
            type="number"
            name="duration"
            placeholder="e.g. 20"
            required
            className="input input-bordered w-full"
          />
        </div>

        {/* Smoker */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1 flex items-center gap-2 text-[var(--color-primary)]">
            <HiOutlineFire /> Smoker Status
          </label>
          <select name="smoker" required className="select select-bordered w-full">
            <option value="">Are you a smoker?</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex justify-between items-center">
          <button type="submit" className="btn bg-[var(--color-primary)] text-white">
            <HiOutlineClipboardCheck /> Calculate Premium
          </button>

          {quote && quoteId && (
            <button
              type="button"
              onClick={() => navigate(`/apply/${policyId}`)}
              className="btn btn-outline text-[var(--color-primary)]"
            >
              Apply for Policy
            </button>
          )}
        </div>
      </form>

      {/* Premium Display */}
      {quote && (
        <div className="mt-8 border border-[var(--color-primary)] rounded-xl p-6 text-center shadow">
          <h3 className="text-2xl font-semibold text-[var(--color-primary)]">
            Your Estimated Premium
          </h3>
          <p className="text-lg">
            <strong>Monthly:</strong> ${quote.monthly}
          </p>
          <p className="text-lg">
            <strong>Annual:</strong> ${quote.annual}
          </p>
        </div>
      )}
    </div>
  );
};

export default Quote;
