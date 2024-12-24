import Cards from "./Cards";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/useContext";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import axios from "axios";
import { Spin } from "antd";

const Analytic = () => {
  const { token } = useAuth();
  const [fileUploadCount, setFileUploadCount] = useState<number | null>(null); // Store the count here
  const [processedDocument, setProcessedDocument] = useState<number | null>(null); // Store the count here
  const [loadingFileUploadCount, setLoadingFileUploadCount] = useState<boolean>(true); // Loading state for file upload count
  const [loadingProcessedDocument, setLoadingProcessedDocument] = useState<boolean>(true); // Loading state for processed document
  const [error, setError] = useState<string | null>(null); // Store any error

  useEffect(() => {
    const fetchFileUploadCount = async () => {
      try {
        setLoadingFileUploadCount(true);
        setLoadingProcessedDocument(true);

        const response = await axios.get(
          "https://daizyexserver.vercel.app/api/files/user-files-count",
          {
            headers: { Authorization: `Bearer ${token || ""}` },
          }
        );

        if (response.data.status === "success") {
          setFileUploadCount(response.data.fileUploadCount || 0);
          setProcessedDocument(response.data.ProcessedDocument || 0);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error("Error fetching file upload count:", err);
        setError("Failed to fetch file upload count");
      } finally {
        setLoadingFileUploadCount(false);
        setLoadingProcessedDocument(false);
      }
    };

    fetchFileUploadCount();
  }, [token]);

  return (
    <section className="mt-32 px-6">
      <div className="flex flex-col">
        <h1 className="font-bold text-3xl text-[#5A5C69] max-md:text-2xl max-sm:text-[20px]">
          Dashboard
        </h1>
        <div className="flex items-center gap-5 mt-10 max-sm:flex-col max-sm:items-start">
          <Cards
            title="Total Document"
            icon={<IoDocumentTextOutline />}
            number={
              loadingFileUploadCount ? (
                <Spin size="small" />
              ) : (
                fileUploadCount || 0
              )
            }
          />
          <Cards
            title="Processed Document"
            icon={<IoDocumentTextOutline />}
            number={
              loadingProcessedDocument ? (
                <Spin size="small" />
              ) : (
                processedDocument || 0
              )
            }
          />
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <div className="flex items-center justify-center my-10">
          <Link
            to="/document"
            className="px-5 py-2.5 rounded-[5px] bg-yellow-300 text-white font-semibold"
          >
            View Documents
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Analytic;
