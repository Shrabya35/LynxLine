import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const OrderStatusPie = () => {
  const data = {
    labels: ["In Progress", "Delivered", "Cancel"],
    datasets: [
      {
        label: "# of Votes",
        data: [4, 2, 1],
        backgroundColor: ["#ffc400", "#00d247", "#ff0000"],
        borderColor: ["#ffc400", "#00d247", "#ff0000"],
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
