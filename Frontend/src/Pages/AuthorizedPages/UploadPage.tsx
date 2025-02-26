import { useState, useEffect } from "react";
import { Spin } from "antd";
import { motion } from "framer-motion";
import Sidebar from "../../Components/Sidebar";
import Top from "../../Components/Top";
import ServiceForm from "../../Components/DashboardUser/PaymentForm";
import BookingDetailsForm from "../../Components/DashboardUser/BookingDetailsForm";
import UploadForm from "../../Components/DashboardUser/UploadForm";
import { useAuth } from "../../Context/useContext";
import io from "socket.io-client";

const UploadPage = () => {
  const { token } = useAuth();
  const [currentView, setCurrentView] = useState<"services" | "booking" | "upload">("services");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://daizyexserver.vercel.app";

  const WEB_SOCKET_OI_LIVE_URL = "https://websocket-oideizy.onrender.com";
  const [paymentId, setPaymentId] = useState<string | null>(null);

  // When upload completes, check if there are any active (pending) payments.
  // If not, redirect immediately back to the services page.
  const handleUploadComplete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/payment/active-payments`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        // If a pending payment exists and payment details are returned, update state accordingly.
        if (data.hasPending && data.payment && data.payment.id) {
          setPaymentId(data.payment.id);
          setCurrentView("upload");
        } else {
          setCurrentView("services");
        }
      } else {
        console.error("Failed to fetch active payments:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching active payments:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    // On component mount, fetch pending payment details.
    handleUploadComplete();
    
    const socket = io(WEB_SOCKET_OI_LIVE_URL, { transports: ["websocket"] });
    socket.on("activePaymentsUpdated", (data: { hasPending: boolean }) => {
      // When no pending payments remain, redirect to services.
      if (!data.hasPending) {
        setCurrentView("services");
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [WEB_SOCKET_OI_LIVE_URL, token]);
  
  const handleProceedToBooking = (
    service: string | null,
    addOns: string[],
    price: number
  ) => {
    setSelectedService(service);
    setSelectedAddOns(addOns);
    setTotalPrice(price);
    setCurrentView("booking");
  };

  const handleBackToServices = () => {
    setCurrentView("services");
  };

  const handleProceedToUpload = (paymentId: string) => {
    setPaymentId(paymentId);
    setCurrentView("upload");
  };

  return (
    <>
      <Top isAdmin={false} />
      <div className="flex">
        <Sidebar isAdmin={false} />
        <div style={{ flex: 1, position: "relative", padding: "20px" }}>
          {loading && (
            <div className="loading-mechanism">
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
              {currentView === "services" && (
                <ServiceForm
                  onProceed={(addOns, service, price) =>
                    handleProceedToBooking(service, addOns, price)
                  }
                />
              )}
              {currentView === "booking" && (
                <BookingDetailsForm
                  onBack={handleBackToServices}
                  onProceed={handleProceedToUpload}
                  selectedAddOns={selectedAddOns}
                  totalPrice={totalPrice}
                  selectedService={selectedService}
                />
              )}
              {currentView === "upload" && (
                <UploadForm paymentId={paymentId} onUploadComplete={handleUploadComplete} />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadPage;
