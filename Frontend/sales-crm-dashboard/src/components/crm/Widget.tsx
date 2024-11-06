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
  chartType?: 'bar' | 'pie' | 'progress';
  progressValue?: number; // New prop for progress value
  className?: string;
}

const Widget: React.FC<WidgetProps> = ({ title, content, chartData, chartType, progressValue, className }) => {
  return (
    <div className={`${styles.widget} ${className}`}>
      <h3>{title}</h3>
      
      {chartType === 'progress' && typeof progressValue === 'number' && (
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${progressValue.toFixed(2)}%`, backgroundColor: '#FF7100' }}
          >
            <span className={styles.progressText}>{progressValue.toFixed(2)}%</span>
          </div>
        </div>
      )}
      
      {content && chartType !== 'progress' && <div>{content}</div>}
      
      {chartData && chartType === 'bar' && (
        <Bar
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets.map(dataset => ({
              ...dataset,
              backgroundColor: 'blue',
            })),
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: 'top' }, title: { display: true, text: title } },
            scales: { y: { stacked: true, min: 0 }, x: { stacked: true } },
          }}
          style={{ height: '300px' }}
        />
      )}
      
      {chartData && chartType === 'pie' && (
        <Pie
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets.map(dataset => ({
              ...dataset,
              backgroundColor: ['lightgreen', 'red', 'lightblue', 'yellow', 'orange', 'pink'],
            })),
          }}
          options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
          style={{ height: '300px' }}
        />
      )}
    </div>
  );
};

export default Widget;
