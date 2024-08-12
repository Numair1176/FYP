import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJs } from 'chart.js/auto';

export default function Barchart({ chartdata }) {
  // Customize options for the chart
  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Apps' // X-axis label
        }
      },
      y: {
        title: {
          display: true,
          text: 'Minutes' // Y-axis label
        }
      }
    }
  };

  return <Bar data={chartdata} options={options} />;
}
