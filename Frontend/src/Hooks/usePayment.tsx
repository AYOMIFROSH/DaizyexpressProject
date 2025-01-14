import { useState } from 'react';
import { useAuth } from "../Context/useContext";
import axios from 'axios';

interface PaymentDetails {
  selectedService: string | null;
  selectedAddOns: string[];
  recipientName: string;
  serviceAddress: string;
  city: string;
  state: string;
  zipCode: string;
  additionalAddresses?: {
    recipientName: string;
    serviceAddress: string;
    city: string;
    state: string;
    zipCode: string;
  }[];
  serviceDate: string;
  preferredTime?: string;
  paymentMethod: string[];
  termsAgreed: boolean;
  signature: string;
  date: string;
  totalPrice: number;
}

const usePayment = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);  
  const [success, setSuccess] = useState<boolean>(false); 

  const Base_Url =
  window.location.hostname === "localhost"
    ? "http://localhost:3000" 
    : "https://daizyexserver.vercel.app"; 
    

  const sendPaymentDetails = async (paymentDetails: PaymentDetails) => {
    setLoading(true);
    setError(null);
    setPending(true);  

    try {
      if (!token) {
        throw new Error('Authentication token is missing. Please log in.');
      }

      const response = await axios.post(
        `${Base_Url}/api/payment/card-payment`,
        paymentDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;  
      } else {
        throw new Error('Failed to process the payment details. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPending(false);  
    setSuccess(true);  
  };

  return { sendPaymentDetails, loading, error, success, pending, handlePaymentSuccess };
};

export default usePayment;
