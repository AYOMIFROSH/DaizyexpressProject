import { useState, useEffect } from 'react';
import { useAuth } from '../Context/useContext';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

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
  };
  serviceDate: string;
  preferredTime?: string;
  paymentMethod: string[];
  termsAgreed: boolean;
  signature: string;
  date: string;
  totalPrice: number;
}

const usePaypalPayment = () => {
  const { token } = useAuth();
  const location = useLocation();

  const [paypalLoading, setPaypalLoading] = useState<boolean>(false);
  const [paypalPending, setPaypalPending] = useState<boolean>(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [paypalSuccess, setPaypalSuccess] = useState<boolean>(false);

  const Base_Url =
    window.location.hostname === "localhost"
      ? "http://localhost:3000" 
      : "https://daizyexserver.vercel.app"; 

  // This effect checks if the URL contains the "paymentSuccess" flag
  // which the backend appends after a successful payment capture.
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('paymentSuccess')) {
      setPaypalSuccess(true);
      setPaypalPending(false); // Payment has been completed.
    }
  }, [location.search]);

  /**
   * Creates a PayPal payment by calling the backend API.
   * Upon receiving the approval URL, it redirects the user to PayPal.
   */
  const createPaypalPayment = async (paymentDetails: PaymentDetails) => {
    setPaypalLoading(true);
    setPaypalError(null);
    setPaypalPending(true); // Payment process initiated.
    try {
      const response = await axios.post(
        `${Base_Url}/api/paypal/paypal-payment`,
        paymentDetails,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { url } = response.data;
      // Redirect to the PayPal approval URL provided by your backend.
      window.location.href = url;
    } catch (err: any) {
      setPaypalError(err.response?.data?.error || 'An error occurred');
      setPaypalPending(false); // Reset pending since an error occurred.
    } finally {
      setPaypalLoading(false);
    }
  };

  return { paypalLoading, paypalError, paypalPending, paypalSuccess, createPaypalPayment };
};

export default usePaypalPayment;
