import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const OrderStatusPie = () => {
  const [pending, setpending] = useState("");
  const [processing, setProcessing] = useState("");
  const [delivered, setDelivered] = useState("");
  const [cancelled, setCancelled] = useState("");
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const countOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}/order/count-orders`);
        const {
          pendingOrders,
          processingOrders,
          deliveredOrders,
          cancelledOrders,
        } = response.data;
        setpending(pendingOrders);
        setProcessing(processingOrders);
        setDelivered(deliveredOrders);
        setCancelled(cancelledOrders);
      } catch (error) {
        console.error("Error Counting orders:", error);
      }
    };

    countOrders();
  }, [baseUrl]);

  const data = {
    labels: ["Pending", "Processing", "Delivered", "Cancelled"],
    datasets: [
      {
        label: "# of Votes",
        data: [pending, processing, delivered, cancelled],
        backgroundColor: ["#ffc107", "#2669ff", "#28a745", "#ff0000"],
        borderColor: ["#ffc107", "#2669ff", "#28a745", "#ff0000"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "rectRounded",
          padding: 20,
          font: {
            size: 14,
          },
        },
        onHover: (event, legendItem) => {
          event.native.target.style.cursor = "pointer";
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataset =
              tooltipItem.chart.data.datasets[tooltipItem.datasetIndex];
            const total = dataset.data.reduce(
              (previousValue, currentValue) => previousValue + currentValue
            );
            const currentValue = dataset.data[tooltipItem.dataIndex];
            const percentage = Math.round((currentValue / total) * 100);
            return `${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <div className="graph-container">
      <Pie data={data} options={options} />
    </div>
  );
};

export default OrderStatusPie;
