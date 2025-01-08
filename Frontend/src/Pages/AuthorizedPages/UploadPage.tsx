import  { useState } from 'react';
import Sidebar from '../../Components/Sidebar';
import Top from '../../Components/Top';
import ServiceForm from '../../Components/DashboardUser/PaymentForm';
import BookingDetailsForm from '../../Components/DashboardUser/BookingDetailsForm';
import UploadForm from '../../Components/DashboardUser/UploadForm';

const UploadPage = () => {
  const [currentView, setCurrentView] = useState<'services' | 'booking' | 'upload'>('services');

  const handleProceedToBooking = () => {
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
        <div style={{ flex: 1, padding: '20px', marginTop: '5rem' }}>
          {currentView === 'services' && <ServiceForm onProceed={handleProceedToBooking} />}
          {currentView === 'booking' && (
            <BookingDetailsForm onBack={handleBackToServices} onProceed={handleProceedToUpload} />
          )}
          {currentView === 'upload' && <UploadForm  />}
        </div>
      </div>
    </>
  );
};

export default UploadPage;
