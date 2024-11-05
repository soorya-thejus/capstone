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
  chartData?: { labels: string[]; datasets: { data: number[]; label: string }[] };
  chartType?: 'bar' | 'pie';
  className?: string;
}

const Widget: React.FC<WidgetProps> = ({ title, content, chartData, chartType, className }) => {
  return (
    <div className={`${styles.widget} ${className}`}>
      <h3>{title}</h3>
      {content && <div>{content}</div>}
      {chartData && chartType === 'bar' && (
        <Bar
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets.map(dataset => ({
              ...dataset,
              backgroundColor: 'blue', // Default color
            })),
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: 'top' }, title: { display: true, text: title } },
            scales: { y: { stacked: true, min: 0 }, x: { stacked: true } },
          }}
          style={{ height: '300px' }} // Adjust height for bar charts
        />
      )}
      {chartData && chartType === 'pie' && (
        <Pie
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets.map(dataset => ({
              ...dataset,
              backgroundColor: [
                'lightgreen', 'red',
                'lightblue', 'yellow',
                'orange', 'pink',
              ],
            })),
          }}
          options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
          style={{ height: '300px' }} // Adjust height for pie chart
        />
      )}
    </div>
  );
};

export default Widget;
