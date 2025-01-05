import { useState, useEffect } from "react";
import Card from "../../Components/DashboardAdmin/Card";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";
import { useAuth } from "../../Context/useContext";
import { Spin } from "antd";

const Analytic = () => {
  const { token } = useAuth();
  const [data, setData] = useState({
    totalProcessedDocuments: null,
    totalFileUploadCount: null,
    totalUsers: null,
  });
  const [loading, setLoading] = useState({
    documents: true,
    processedDocuments: true,
    users: true,
  });

  const Base_Url =
  window.location.hostname === "localhost"
    ? "http://localhost:3000" // Localhost
    : "https://daizyexserver.vercel.app"; // 
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${Base_Url}/api/admin/usage-metrics`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const result = await response.json();

        // Update data and loading state for each metric
        setData({
          totalProcessedDocuments: result.data.totalProcessedDocuments,
          totalFileUploadCount: result.data.totalFileUploadCount,
          totalUsers: result.data.totalUsers,
        });

        setLoading({
          documents: false,
          processedDocuments: false,
          users: false,
        });
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setLoading({
          documents: false,
          processedDocuments: false,
          users: false,
        });
      }
    };

    fetchData();
  }, [token]);

  return (
    <section className="mt-32 px-6">
      <div className="flex flex-col">
        <h1 className="font-bold text-3xl text-[#5A5C69]">Dashboard</h1>
        <div className="flex items-center gap-10 mt-10 max-sm:flex-col max-sm:items-start">
          <Card
            title="Total Documents"
            icon={<IoDocumentTextOutline />}
            number={
              loading.documents ? (
                <Spin size="small" />
              ) : (
                data.totalFileUploadCount
              )
            }
          />
          <Card
            title="Processed Documents"
            icon={<IoDocumentTextOutline />}
            number={
              loading.processedDocuments ? (
                <Spin size="small" />
              ) : (
                data.totalProcessedDocuments
              )
            }
          />
          <Card
            title="Total Users"
            icon={<FaUsers />}
            number={
              loading.users ? (
                <Spin size="small" />
              ) : (
                data.totalUsers
              )
            }
          />
        </div>
      </div>
    </section>
  );
};

export default Analytic;

