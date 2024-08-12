import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Ensure you have chart.js installed and auto-imported

export default function Linechart({ data }) {
  console.log('Data received in Linechart:', data);

  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  const labels = Object.keys(data);
  const usageValues = Object.values(data);

  // Convert usage values to GB
  const usageDataInGB = usageValues.map(usage => {
    const gbMatch = usage.match(/(\d+) GB/);
    const mbMatch = usage.match(/(\d+) MB/);
    const gb = gbMatch ? parseFloat(gbMatch[1]) : 0; // Extract number before GB
    const mb = mbMatch ? parseFloat(mbMatch[1]) : 0; // Extract number before MB
    return gb + mb / 1024; // Convert MB to GB
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Data Usage (GB)',
        data: usageDataInGB,
        fill: false,
        borderColor: '#1976d2',
        backgroundColor: '#1976d2',
        tension: 0.1,
      },
    ],
  };

  // Customize options for the chart
  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Dates' // X-axis label
        }
      },
      y: {
        title: {
          display: true,
          text: 'Data in GB' // Y-axis label
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}
