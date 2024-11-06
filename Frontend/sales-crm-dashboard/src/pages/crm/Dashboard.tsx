import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/crm/DashboardLayout';
import Widget from '../../components/crm/Widget';
import styles from '../../styles/crm/dashboard.module.css';
import axios from 'axios';

interface DashboardData {
  activeDealsForecastValue: number;
  avgWonDealValue: number;
  actualRevenue: number;
  commission: number;
  leadConversion: number;
  dealConversion: number;
  actualRevenueByMonth: { labels: string[]; datasets: { data: number[]; label: string }[] };
  dealStatusDistribution: { labels: string[]; datasets: { data: number[]; label: string }[] };
  leadStatusDistribution: { labels: string[]; datasets: { data: number[]; label: string }[] }; // Added leadStatusDistribution
  pipelineConversion: { labels: string[]; datasets: { data: number[]; label: string }[] };
  forecastedRevenueByMonth: { labels: string[]; datasets: { data: number[]; label: string }[] };
  forecastedRevenueByStage: { labels: string[]; datasets: { data: number[]; label: string }[] };
}

const defaultDashboardData: DashboardData = {
  activeDealsForecastValue: 0,
  avgWonDealValue: 0,
  actualRevenue: 0,
  commission: 0,
  leadConversion: 0,
  dealConversion: 0,
  actualRevenueByMonth: { labels: [], datasets: [{ data: [], label: 'Actual Revenue by Month' }] },
  dealStatusDistribution: { labels: [], datasets: [{ data: [], label: 'Deal Status Distribution' }] },
  leadStatusDistribution: { labels: [], datasets: [{ data: [], label: 'Lead Status Distribution' }] }, // Added default data for leadStatusDistribution
  pipelineConversion: { labels: [], datasets: [{ data: [], label: 'Pipeline Conversion' }] },
  forecastedRevenueByMonth: { labels: [], datasets: [{ data: [], label: 'Forecasted Revenue by Month' }] },
  forecastedRevenueByStage: { labels: [], datasets: [{ data: [], label: 'Forecasted Revenue by Stage' }] },
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>(defaultDashboardData);

  const role = sessionStorage.getItem('role') || '';

  const transformData = (metrics: any): DashboardData => {
    return {
      activeDealsForecastValue: metrics.active_deals_forecast_value ?? 0,
      avgWonDealValue: metrics.average_won_deal_value ?? 0,
      actualRevenue: metrics.actual_revenue ?? 0,
      commission: metrics.commission ?? 0,
      leadConversion: metrics.lead_conversion_rate ?? 0,
      dealConversion: metrics.deal_conversion_rate ?? 0,
      actualRevenueByMonth: {
        labels: Object.keys(metrics.actual_revenue_by_month || {}),
        datasets: [{ data: Object.values(metrics.actual_revenue_by_month || {}), label: 'Actual Revenue by Month' }],
      },
      dealStatusDistribution: {
        labels: Object.keys(metrics.deal_status_distribution || {}),
        datasets: [{ data: Object.values(metrics.deal_status_distribution || {}), label: 'Deal Status Distribution' }],
      },
      leadStatusDistribution: { // Added transformation for leadStatusDistribution
        labels: Object.keys(metrics.lead_status_distribution || {}),
        datasets: [{ data: Object.values(metrics.lead_status_distribution || {}), label: 'Lead Status Distribution' }],
      },
      pipelineConversion: {
        labels: Object.keys(metrics.pipeline_conversion || {}),
        datasets: [{ data: Object.values(metrics.pipeline_conversion || {}), label: 'Pipeline Conversion' }],
      },
      forecastedRevenueByMonth: {
        labels: Object.keys(metrics.forecasted_revenue_by_month || {}),
        datasets: [{ data: Object.values(metrics.forecasted_revenue_by_month || {}), label: 'Forecasted Revenue by Month' }],
      },
      forecastedRevenueByStage: {
        labels: Object.keys(metrics.forecasted_revenue_by_stage || {}),
        datasets: [{ data: Object.values(metrics.forecasted_revenue_by_stage || {}), label: 'Forecasted Revenue by Stage' }],
      },
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const org_id = sessionStorage.getItem('orgId');
        const owner_id = sessionStorage.getItem('userId');

        if (!org_id) {
          console.error('Organization ID is not available in session');
          return;
        }

        let response;
        if (role === 'Admin') {
          response = await axios.get(`http://localhost:5008/api/metrics/orgs/${org_id}`);
        } else if (role === 'Sales Rep') {
          response = await axios.get(`http://localhost:5009/api/metrics/salesRep/${owner_id}`);
        }

        if (response && Array.isArray(response.data) && response.data.length > 0) {
          const rawMetrics = response.data[0];
          setData(transformData(rawMetrics));
        } else {
          setData(defaultDashboardData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [role]);

  return (
    <DashboardLayout>
      <div className={styles.dashboardWidgets}>
        <div className={styles.smallWidgets}>
          <Widget title="Active Deals Forecast Value" content={`$${data.activeDealsForecastValue.toLocaleString()}`} />
          <Widget title="Average Won Deal Value" content={`$${data.avgWonDealValue.toFixed(2)}`} />
          <Widget title="Actual Revenue" content={`$${data.actualRevenue.toFixed(2)}`} />
          {role === 'Sales Rep' && <Widget title="Commission" content={`$${data.commission.toFixed(2)}`} />}
        </div>

        <div className={styles.progressWidgets}>
          <Widget title="Lead Conversion Rate" progressValue={data.leadConversion} />
          <Widget title="Deal Conversion Rate" progressValue={data.dealConversion} />
        </div>

        {/* Chart Section with Lead Status Distribution and Revenue by Month */}
        <div className={styles.chartRow}>
          {data.leadStatusDistribution.labels.length > 0 && ( // Updated to use leadStatusDistribution
            <Widget title="Lead Status Distribution" chartData={data.leadStatusDistribution} chartType="pie" />
          )}
          <Widget 
            title="Revenue by Month" 
            chartData={data.actualRevenueByMonth} 
            chartType="bar" 
            className={styles.largeWidget} 
          />
          {data.dealStatusDistribution.labels.length > 0 && (
            <Widget title="Deal Status Distribution" chartData={data.dealStatusDistribution} chartType="pie" />
          )}
        </div>

        <div className={styles.forecastWidgets}>
          <Widget title="Pipeline Conversion" chartData={data.pipelineConversion} chartType="bar" />
          <Widget title="Forecasted Revenue by Month" chartData={data.forecastedRevenueByMonth} chartType="bar" />
          <Widget title="Forecasted Revenue by Stage" chartData={data.forecastedRevenueByStage} chartType="bar" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
