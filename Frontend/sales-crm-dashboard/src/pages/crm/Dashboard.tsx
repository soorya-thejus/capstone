import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/crm/DashboardLayout';
import Widget from '../../components/crm/Widget';
import styles from '../../styles/crm/dashboard.module.css';

interface DashboardData {
  activeDeals: number;
  avgDealValue: number;
  actualRevenue: number;
  revenueByMonth: { labels: string[]; datasets: { data: number[]; label: string }[] };
  dealStatusDistribution: { labels: string[]; datasets: { data: number[]; label: string }[] };
  topDeals: string[];
  pipelineConversion: { labels: string[]; datasets: { data: number[]; label: string }[] };
  forecastedRevenueByMonth: { labels: string[]; datasets: { data: number[]; label: string }[] };
  forecastedRevenueByStage: { labels: string[]; datasets: { data: number[]; label: string }[] };
  dealsProgressByMonth: { labels: string[]; datasets: { data: number[]; label: string }[] };
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setData({
        activeDeals: 50000,
        avgDealValue: 7000,
        actualRevenue: 500000,
        revenueByMonth: { labels: ['Jan', 'Feb', 'Mar'], datasets: [{ data: [120000, 150000, 130000], label: 'Revenue' }] },
        dealStatusDistribution: { labels: ['Won', 'Working', 'Discovery', 'Proposal', 'New'], datasets: [{ data: [15, 20, 10, 5, 5], label: 'Status' }] },
        topDeals: ['Deal 1 - $20k', 'Deal 2 - $18k', 'Deal 3 - $15k'],
        pipelineConversion: { labels: ['New', 'Discovery', 'Proposal', 'Negotiation', 'Won'], datasets: [{ data: [30, 25, 20, 15, 10], label: 'Conversion' }] },
        forecastedRevenueByMonth: { labels: ['Apr', 'May', 'Jun'], datasets: [{ data: [140000, 160000, 170000], label: 'Forecasted Revenue' }] },
        forecastedRevenueByStage: { labels: ['Discovery', 'Proposal', 'Negotiation', 'Won'], datasets: [{ data: [25000, 50000, 100000, 125000], label: 'Forecasted Revenue by Stage' }] },
        dealsProgressByMonth: { 
          labels: ['Jan', 'Feb', 'Mar'], 
          datasets: [
            { data: [1, 0, 0], label: 'New Deals' },
            { data: [1, 1, 0], label: 'Won Deals' },
            { data: [0, 0, 1], label: 'Working Deals' }
          ]
        },
      });
    };

    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <DashboardLayout>
      <div className={styles.dashboardWidgets}>
        <Widget title="Active Deals" content={`$${data.activeDeals.toLocaleString()}`} />
        <Widget title="Average Value of Won Deals" content={`$${data.avgDealValue}`} />
        <Widget title="Actual Revenue" content={`$${data.actualRevenue}`} />
        <Widget title="Revenue by Month" chartData={data.revenueByMonth} chartType="bar" />
        <Widget title="Deal Status Distribution" chartData={data.dealStatusDistribution} chartType="pie" />
        <Widget title="Top Deals" content={<ul>{data.topDeals.map((deal, index) => <li key={index}>{deal}</li>)}</ul>} />
        <Widget title="Pipeline Conversion" chartData={data.pipelineConversion} chartType="bar" />
        <Widget title="Forecasted Revenue by Month" chartData={data.forecastedRevenueByMonth} chartType="bar" />
        <Widget title="Forecasted Revenue by Stage" chartData={data.forecastedRevenueByStage} chartType="bar" />
        <Widget title="Deals Progress by Month" chartData={data.dealsProgressByMonth} chartType="bar" />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
