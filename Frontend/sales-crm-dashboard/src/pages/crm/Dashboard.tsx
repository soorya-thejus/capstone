import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/crm/DashboardLayout';
import Widget from '../../components/crm/Widget';
import styles from '../../styles/crm/dashboard.module.css';
import axios from 'axios';

interface DashboardData {
  activeDealsForecastValue: number;
  avgWonDealValue: number;
  actualRevenue: number;
  actualRevenueByMonth: { labels: string[]; datasets: { data: number[]; label: string }[] };
  dealStatusDistribution: { labels: string[]; datasets: { data: number[]; label: string }[] };
  pipelineConversion: { labels: string[]; datasets: { data: number[]; label: string }[] };
  forecastedRevenueByMonth: { labels: string[]; datasets: { data: number[]; label: string }[] };
  forecastedRevenueByStage: { labels: string[]; datasets: { data: number[]; label: string }[] };
}

const defaultDashboardData: DashboardData = {
  activeDealsForecastValue: 0,
  avgWonDealValue: 0,
  actualRevenue: 0,
  actualRevenueByMonth: { labels: [], datasets: [{ data: [], label: 'Actual Revenue by Month' }] },
  dealStatusDistribution: { labels: [], datasets: [{ data: [], label: 'Deal Status Distribution' }] },
  pipelineConversion: { labels: [], datasets: [{ data: [], label: 'Pipeline Conversion' }] },
  forecastedRevenueByMonth: { labels: [], datasets: [{ data: [], label: 'Forecasted Revenue by Month' }] },
  forecastedRevenueByStage: { labels: [], datasets: [{ data: [], label: 'Forecasted Revenue by Stage' }] },
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>(defaultDashboardData);

  const transformData = (metrics: any): DashboardData => {
    return {
      activeDealsForecastValue: metrics.active_deals_forecast_value ?? 0,
      avgWonDealValue: metrics.average_won_deal_value ?? 0,
      actualRevenue: metrics.actual_revenue ?? 0,
      actualRevenueByMonth: {
        labels: metrics.actual_revenue_by_month ? Object.keys(metrics.actual_revenue_by_month) : [],
        datasets: [{
          data: metrics.actual_revenue_by_month ? Object.values(metrics.actual_revenue_by_month) : [],
          label: 'Actual Revenue by Month',
        }],
      },
      dealStatusDistribution: {
        labels: metrics.deal_status_distribution ? Object.keys(metrics.deal_status_distribution) : [],
        datasets: [{
          data: metrics.deal_status_distribution ? Object.values(metrics.deal_status_distribution) : [],
          label: 'Deal Status Distribution',
        }],
      },
      pipelineConversion: {
        labels: metrics.pipeline_conversion ? Object.keys(metrics.pipeline_conversion) : [],
        datasets: [{
          data: metrics.pipeline_conversion ? Object.values(metrics.pipeline_conversion) : [],
          label: 'Pipeline Conversion',
        }],
      },
      forecastedRevenueByMonth: {
        labels: metrics.forecasted_revenue_by_month ? Object.keys(metrics.forecasted_revenue_by_month) : [],
        datasets: [{
          data: metrics.forecasted_revenue_by_month ? Object.values(metrics.forecasted_revenue_by_month) : [],
          label: 'Forecasted Revenue by Month',
        }],
      },
      forecastedRevenueByStage: {
        labels: metrics.forecasted_revenue_by_stage ? Object.keys(metrics.forecasted_revenue_by_stage) : [],
        datasets: [{
          data: metrics.forecasted_revenue_by_stage ? Object.values(metrics.forecasted_revenue_by_stage) : [],
          label: 'Forecasted Revenue by Stage',
        }],
      },
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const org_id = sessionStorage.getItem('orgId');
        const owner_id = sessionStorage.getItem('userId');
        const role = sessionStorage.getItem('role');

        console.log('Fetched session data:', { org_id, owner_id, role });

        if (!org_id) {
          console.error('Organization ID is not available in session');
          return;
        }

        let response;
        if (role === "Admin") {
          response = await axios.get(`http://localhost:5008/api/metrics/orgs/${org_id}`);
        } else if (role === "Sales Rep") {
          response = await axios.get(`http://localhost:5009/api/metrics/salesRep/${owner_id}`);
        }

        if (response && Array.isArray(response.data) && response.data.length > 0) {
          console.log('API Response:', response.data); // Check the response data structure
          const rawMetrics = response.data[0]; // Assuming response.data is an array
          const formattedData = transformData(rawMetrics);
          console.log('Formatted Data:', formattedData); // Verify formatted data
          setData(formattedData);
        } else {
          console.error('No valid data received: Role may not match expected values or response is empty');
          setData(defaultDashboardData); // Reset to default values if no valid data received
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className={styles.dashboardWidgets}>
        <Widget title="Active Deals Forecast Value" content={`$${data.activeDealsForecastValue.toLocaleString()}`} />
        <Widget title="Average Value of Won Deals" content={`$${data.avgWonDealValue}`} />
        <Widget title="Actual Revenue" content={`$${data.actualRevenue}`} />
        <Widget title="Revenue by Month" chartData={data.actualRevenueByMonth} chartType="bar" />
        <Widget title="Deal Status Distribution" chartData={data.dealStatusDistribution} chartType="pie" />
        <Widget title="Pipeline Conversion" chartData={data.pipelineConversion} chartType="bar" />
        <Widget title="Forecasted Revenue by Month" chartData={data.forecastedRevenueByMonth} chartType="bar" />
        <Widget title="Forecasted Revenue by Stage" chartData={data.forecastedRevenueByStage} chartType="bar" />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
