import React from "react";
import { Table, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

interface DataType {
  key: string;
  name: string;
  date: string;
  status: string;
  fileUrl?: string;
}

const App: React.FC = () => {
  const data: DataType[] = [
    {
      key: "1",
      name: "Legal 1",
      date: "30-11-2024 10:00am",
      status: "Processed",
      fileUrl: "https://example.com/document1.pdf",
    },
    {
      key: "2",
      name: "Legal 2",
      date: "29-11-2024 9:20pm",
      status: "Not Processed",
    },
  ];

  const columns = [
    {
      title: "File Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span className="text-gray-800 font-medium text-[18px] mb-10">{name}</span>
      ),
    },
    {
      title: "Date and Time",
      dataIndex: "date",
      key: "date",
      render: (date: string) => (
        <span className="text-gray-600 text-sm">{date}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          className={`px-3 py-1 rounded-full font-semibold text-sm ${
            status === "Processed"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: DataType) => (
        <Button
          type="link"
          icon={<DownloadOutlined />}
          disabled={!record.fileUrl}
          className="text-blue-500"
          onClick={() => {
            if (record.fileUrl) {
              window.open(record.fileUrl, "_blank");
            }
          }}
        >
          Download
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 mt-10 min-w-[1000px] max-sm:min-w-[150px]">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Document Table</h2>
      <Table
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 5 }}
        className="rounded-lg shadow overflow-hidden bg-white w-full"
      />
    </div>
    
  );
};

export default App;
