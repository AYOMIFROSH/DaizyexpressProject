import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { motion } from 'framer-motion';
import Sidebar from '../../Components/Sidebar';
import Top from '../../Components/Top';
import ServiceForm from '../../Components/DashboardUser/PaymentForm';
import BookingDetailsForm from '../../Components/DashboardUser/BookingDetailsForm';
import UploadForm from '../../Components/DashboardUser/UploadForm';
import { useAuth } from '../../Context/useContext';
import io from 'socket.io-client'; 

const UploadPage = () => {
  const { token } = useAuth();
  const [currentView, setCurrentView] = useState<'services' | 'booking' | 'upload'>('services');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const API_BASE_URL =
    window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://daizyexserver.vercel.app';

  
  const WEB_SOCKET_OI_LIVE_URL = 'https://websocket-oideizy.onrender.com'

  // Socket connection setup
  useEffect(() => {
    fetchActivePayment();
    const socket = io(WEB_SOCKET_OI_LIVE_URL, { transports: ['websocket'] });
  
    socket.on('activePaymentsUpdated', (data) => {
      setCurrentView(data.activePlan ? 'upload' : 'services');
    });
  
    return () => {
      socket.disconnect();
    };
  }, []); // Removed dependency  

  const fetchActivePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/active-payments`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (response.ok) {
        const { activePlan } = await response.json();
        setCurrentView(activePlan ? 'upload' : 'services'); 
      } else {
        console.error('Failed to fetch payment data.');
        setCurrentView('services'); 
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setCurrentView('services'); 
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = async () => {
    await fetchActivePayment(); // Re-fetch payment data and navigate accordingly
  }

  const handleProceedToBooking = (service: string | null, addOns: string[], price: number) => {
    setSelectedService(service);
    setSelectedAddOns(addOns);
    setTotalPrice(price);
    setCurrentView('booking');
  };

  const handleBackToServices = () => {
    setCurrentView('services');
  };

  const handleProceedToUpload = () => {
    setCurrentView('upload');
  };

  return (
    <>
      <Top isAdmin={false} />
      <div className="flex">
        <Sidebar isAdmin={false} />
        <div style={{ flex: 1, position: 'relative', padding: '20px' }}>
          {loading && (
            <div className='loading-mechanism'>
              <Spin tip="Loading..." size="small" />
            </div>
          )}
          {!loading && (
            <motion.div
              key={currentView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentView === 'services' && (
                <ServiceForm
                  onProceed={(addOns, service, price) => handleProceedToBooking(service, addOns, price)}
                />
              )}
              {currentView === 'booking' && (
                <BookingDetailsForm
                  onBack={handleBackToServices}
                  onProceed={handleProceedToUpload}
                  selectedAddOns={selectedAddOns}
                  totalPrice={totalPrice}
                  selectedService={selectedService}
                />
              )}
              {currentView === 'upload' && <UploadForm onUploadComplete={handleUploadComplete} />}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadPage;