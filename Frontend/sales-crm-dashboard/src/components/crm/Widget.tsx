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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface WidgetProps {
  title: string;
  content?: string | JSX.Element;
  chartData?: { 
    labels: string[]; 
    datasets: { 
      data: number[]; 
      label: string; 
      backgroundColor?: string[]; 
      borderColor?: string[]; 
      hoverBackgroundColor?: string[]; 
      hoverBorderColor?: string[]; 
    }[]; 
  };
  chartType?: 'bar' | 'pie';
  progressValue?: number;
  className?: string;
}

const Widget: React.FC<WidgetProps> = ({ 
  title, 
  content, 
  chartData, 
  chartType, 
  progressValue, 
  className 
}) => {

  const defaultBarChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,  // Ensures the type is correct
      },
    },
    scales: {
      x: { 
        beginAtZero: true 
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `${value.toLocaleString()}`, // Format y-axis labels as currency
        }
      }
    },
    hover: {
      mode: 'nearest',
    },
  };

  const defaultPieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,  // Ensures the type is correct
      },
    },
  };

  // Define a set of unique and distinguishable colors for the pie chart
  const pieChartColors = [
    '#33FF57', // green
    '#FF5733', // red
    
    '#3357FF', // blue
    '#FF33A1', // pink
    '#33FFFC', // cyan
    '#FF8C00', // orange
    '#8A2BE2', // blue-violet
    '#FFD700', // gold
    '#00FA9A', // medium spring green
    '#FF1493', // deep pink
  ];

  return (
    <div className={`${styles.widget} ${className || ''}`}>
      <h3>{title}</h3>
      {content && <div>{content}</div>}
      {progressValue !== undefined && (
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${progressValue}%` }}>{progressValue.toFixed(2)}%</div>
        </div>
      )}
      {chartData && chartType === 'bar' && (
        <Bar 
          data={{ 
            labels: chartData.labels, 
            datasets: chartData.datasets.map(dataset => ({
              ...dataset,
              backgroundColor: dataset.backgroundColor || ['#76c7c0'],  // Default color for bars
              borderColor: dataset.borderColor || ['#388e3c'],  // Border color
              hoverBackgroundColor: dataset.hoverBackgroundColor || ['#63b2aa'],  // Hover color
              hoverBorderColor: dataset.hoverBorderColor || ['#1e6721'],  // Hover border color
            })),
          }} 
          options={defaultBarChartOptions as any} // `as any` to handle any Chart.js type conflict
        />
      )}
      {chartData && chartType === 'pie' && (
        <Pie 
          data={{ 
            labels: chartData.labels, 
            datasets: chartData.datasets.map((dataset, index) => ({
              ...dataset,
              backgroundColor: dataset.backgroundColor || pieChartColors.slice(0, dataset.data.length), // Assign distinct colors from the defined palette
              borderColor: dataset.borderColor || ['#ffffff'],
              hoverBackgroundColor: dataset.hoverBackgroundColor || pieChartColors.slice(0, dataset.data.length),
            })),
          }} 
          options={defaultPieChartOptions as any} // `as any` to handle any Chart.js type conflict
        />
      )}
    </div>
  );
};

export default Widget;
