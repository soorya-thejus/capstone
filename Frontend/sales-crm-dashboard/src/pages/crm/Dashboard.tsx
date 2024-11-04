import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/crm/DashboardLayout';
import Widget from '../../components/crm/Widget';
import styles from '../../styles/crm/dashboard.module.css';
import axios from 'axios';

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

  const transformData = (metrics: any): DashboardData => {
    return {
      activeDeals: metrics.active_deals_forecast_value,
      avgDealValue: metrics.average_won_deal_value,
      actualRevenue: metrics.actual_revenue,
      revenueByMonth: {
        labels: Object.keys(metrics.actual_revenue_by_month),
        datasets: [{ data: Object.values(metrics.actual_revenue_by_month), label: 'Revenue by Month' }],
      },
      dealStatusDistribution: {
        labels: Object.keys(metrics.deal_status_distribution),
        datasets: [{ data: Object.values(metrics.deal_status_distribution), label: 'Status' }],
      },
      topDeals: ['Sample Deal 1', 'Sample Deal 2', 'Sample Deal 3'], // Placeholder for top deals
      pipelineConversion: {
        labels: Object.keys(metrics.pipeline_conversion),
        datasets: [{ data: Object.values(metrics.pipeline_conversion), label: 'Conversion' }],
      },
      forecastedRevenueByMonth: {
        labels: Object.keys(metrics.forecasted_revenue_by_month),
        datasets: [{ data: Object.values(metrics.forecasted_revenue_by_month), label: 'Forecasted Revenue' }],
      },
      forecastedRevenueByStage: {
        labels: Object.keys(metrics.forecasted_revenue_by_stage),
        datasets: [{ data: Object.values(metrics.forecasted_revenue_by_stage), label: 'Forecasted Revenue by Stage' }],
      },
      dealsProgressByMonth: {
        labels: Object.keys(metrics.actual_revenue_by_month),
        datasets: [
          { data: Object.values(metrics.actual_revenue_by_month), label: 'Won Deals' },
          // Add more progress data as needed
        ],
      },
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgId = sessionStorage.getItem('org_id'); 
        if (!orgId) {
          console.error('Organization ID is not available in session');
          return;
        }
  
        const response = await axios.get(`http://localhost:5008/api/metrics/orgs/${orgId}`);
        const rawMetrics = response.data; 
        const formattedData = transformData(rawMetrics);
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
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