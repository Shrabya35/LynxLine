import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";

Chart.register(...registerables);

const LineGraph = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "New Users",
        data: [],
        borderColor: "#2669ff",
        borderWidth: 1,
        fill: false,
        tension: 0.1,
      },
    ],
  });
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/user/get-user-count-dated`
        );
        const userCounts = response.data;

        if (Array.isArray(userCounts) && userCounts.length > 0) {
          const labels = userCounts.map((data) => data.month);
          const newUsers = userCounts.map((data) => data.newUsers);
          setChartData({
            labels,
            datasets: [
              {
                label: "New Users",
                data: newUsers,
                borderColor: "#2669ff",
                borderWidth: 1,
                fill: false,
                tension: 0.2,
              },
            ],
          });
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [baseUrl]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                display: true,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
      />
    </div>
  );
};

export default LineGraph;
