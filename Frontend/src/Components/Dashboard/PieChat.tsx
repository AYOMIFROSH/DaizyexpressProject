import React from "react";
import { Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

type PieChatProps = {
  title: string;
};

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart: React.FC<PieChatProps> = ({ title }) => {
  // dummy data 
  const data = {
    labels: [],
    datasets: [
      {
        label: "Votes",
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "200px", margin: "auto" }}>
      <h2 className="text-center">{title}</h2>
      <Pie data={data} />
      <Link to="/jobs"><p className="text-center mt-3">view jobs</p></Link>
    </div>
  );
};

export default PieChart;
