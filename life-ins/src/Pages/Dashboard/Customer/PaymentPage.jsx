import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import { useParams } from 'react-router';
import PaymentForm from './PaymentForm';

const PaymentPage = () => {
    const stripesPromise = loadStripe(import.meta.env.VITE_Payment_key)
    const {id} = useParams()
    console.log(id)
    return (
         <Elements stripe={stripesPromise} >

            <PaymentForm id={id}></PaymentForm>

        </Elements>
    );
};

export default PaymentPage;