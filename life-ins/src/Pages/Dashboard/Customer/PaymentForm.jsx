import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Context/AuthProvider';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { id: appId } = useParams(); // application ID
  const { user } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const { isPending, data: appData = {} } = useQuery({
    queryKey: ['application', appId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/application/${appId}`);
      return res.data;
    },
    enabled: !!appId
  });

  if (isPending) return <p>Loading application info...</p>;

  // Safely destructure
  const policyTitle = appData?.policyTitle || "Unknown Policy";
  const monthlyPremium = appData?.quoteInfo?.monthly;

  if (!monthlyPremium) {
    return <p className="text-red-500">No premium data found for this policy.</p>;
  }

  const amount = monthlyPremium;
  const amountInCents = amount * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card
    });

    if (stripeError) return setError(stripeError.message);
    setError('');

    const res = await axiosSecure.post('/create-payment-intent', {
      amount: amountInCents
    });

    const clientSecret = res.data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: user.displayName,
          email: user.email
        },
      }
    });

    if (result.error) {
      setError(result.error.message);
    } else if (result.paymentIntent.status === 'succeeded') {
      const transactionId = result.paymentIntent.id;

      const paymentInfo = {
        appId,
        policyId: appData.policyId,
        policyTitle: appData.policyTitle, 
        email: user.email,
        transactionId,
        amount,
        PaymentStatus:'paid',
        paymentMethod: result.paymentIntent.payment_method_types,
        date: new Date(),
      };

      const dbRes = await axiosSecure.post("/payments", paymentInfo);
      if (dbRes.data.insertedId) {
        await axiosSecure.patch(`/applications/${appId}/markPaid`);

        Swal.fire({
          icon: 'success',
          title: 'Payment Successful!',
          html: `<strong>Transaction ID:</strong> <code>${transactionId}</code>`,
          confirmButtonText: 'Go to My Policies',
        }).then(() => {
          navigate('/dashboard/payment-status');
        });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Pay Premium</h2>
      <p><strong>Policy:</strong> {policyTitle}</p>
      <p><strong>Monthly Premium:</strong> ${monthlyPremium}</p>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <CardElement className="p-2 border rounded" />
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={!stripe}
        >
          Pay ${amount}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
