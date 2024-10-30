// src/components/crm/Widget.tsx
import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import styles from '../../styles/crm/widget.module.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface WidgetProps {
  title: string;
  content?: string | JSX.Element; // Adjust to accept JSX
  chartData?: { labels: string[]; datasets: { data: number[]; label: string }[] };
  chartType?: 'bar' | 'pie';
}

const Widget: React.FC<WidgetProps> = ({ title, content, chartData, chartType }) => {
  return (
    <div className={styles.widget}>
      <h3>{title}</h3>
      {content && <div>{content}</div>}
      {chartData && chartType === 'bar' && (
        <Bar
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets.map(dataset => ({
              ...dataset,
              backgroundColor: dataset.label === 'New Deals' ? 'rgba(75, 192, 192, 0.6)' :
                              dataset.label === 'Won Deals' ? 'rgba(255, 206, 86, 0.6)' :
                              dataset.label === 'Working Deals' ? 'rgba(255, 99, 132, 0.6)' :
                              'rgba(153, 102, 255, 0.6)', // Default color
            })),
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Deals Progress by Month' },
            },
            scales: {
              y: {
                stacked: true, // Enable stacking
                min: 0, // Minimum value on Y-axis
                ticks: {
                  callback: (value) => {
                    // Check if value is a number before comparing
                    if (typeof value === 'number' && value >= 0) {
                      return value;
                    }
                    return null; // Return null for non-numeric values
                  },
                },
              },
              x: {
                stacked: true, // Enable stacking
              },
            },
          }}
          style={{ height: '300px' }} // Use CSS to control height
        />
      )}
      {chartData && chartType === 'pie' && (
        <Pie
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets.map((dataset) => ({
              ...dataset,
              backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 206, 86, 0.6)', 
                'rgba(255, 99, 132, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(54, 162, 235, 0.6)'], // Example colors
            })),
          }}
          options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
        />
      )}
    </div>
  );
};

export default Widget;
