//import { Metrics } from '../models/Metrics';
import axios from 'axios';
/*
export const updateMetricsFromDealEvent = async (dealData: any): Promise<void> => {
  const { deal_value, forecast_value, stage, expected_close_date, org_id } = dealData;

  // Fetch current metrics for the specified org_id or initialize a new metrics object for the organization
  let metrics = await Metrics.findOne({ org_id });
  if (!metrics) {
    metrics = new Metrics({ org_id });
    metrics.total_deals = 1;
    metrics.new_deals = 0;
    metrics.discovery_deals = 0;
    metrics.proposal_deals = 0;
    metrics.nego_deals = 0;
    metrics.won_deals = 0;
    metrics.lost_deals = 0;
    metrics.actual_revenue = 0;
    metrics.average_won_deal_value = 0;
    metrics.active_deals_forecast_value = 0;
    metrics.actual_revenue_by_month = {};
    metrics.forecasted_revenue_by_month = {};
    metrics.deal_status_distribution = {};
    metrics.pipeline_conversion = {};
  }

  // Fetch previous deal stage (if the deal exists)
  let previousStage: string | undefined;
  if (dealData._id) {
    try {
      const response = await axios.get(`http://localhost:5002/api/deals/${dealData._id}`);
      previousStage = response.data.stage; // Get the previous stage of the deal
    } catch (error) {
      console.error('Error fetching existing deal from deals service:', error);
    }
  }

  // Increment total deals count only for new deals
  if (!previousStage) {
    metrics.total_deals = (metrics.total_deals || 0) + 1;
  }

  // Handle the active_deals_forecast_value adjustment based on the previous stage
  if (previousStage && ['new', 'discovery', 'proposal', 'negotiation'].includes(previousStage)) {
    // Subtract the forecast value if it was previously counted in active deals
    metrics.active_deals_forecast_value = Math.max(0, (metrics.active_deals_forecast_value || 0) - forecast_value);
  }

  // Adjust metrics for the previous stage
  if (previousStage && previousStage !== stage) {
    if (previousStage === 'new') metrics.new_deals = Math.max(0, metrics.new_deals - 1);
    if (previousStage === 'discovery') metrics.discovery_deals = Math.max(0, metrics.discovery_deals - 1);
    if (previousStage === 'proposal') metrics.proposal_deals = Math.max(0, metrics.proposal_deals - 1);
    if (previousStage === 'negotiation') metrics.nego_deals = Math.max(0, metrics.nego_deals - 1);
    if (previousStage === 'won') metrics.won_deals = Math.max(0, metrics.won_deals - 1);
    if (previousStage === 'lost') metrics.lost_deals = Math.max(0, metrics.lost_deals - 1);
  }

  // Reset all stages to 0 and set the count for the new stage
  metrics.new_deals = stage === 'new' ? 1 : 0;
  metrics.discovery_deals = stage === 'discovery' ? 1 : 0;
  metrics.proposal_deals = stage === 'proposal' ? 1 : 0;
  metrics.nego_deals = stage === 'negotiation' ? 1 : 0;
  metrics.won_deals = stage === 'won' ? 1 : 0;
  metrics.lost_deals = stage === 'lost' ? 1 : 0;

  // If the deal is in an active stage, add its forecast value to active_deals_forecast_value
  if (['new', 'discovery', 'proposal', 'negotiation'].includes(stage)) {
    metrics.active_deals_forecast_value = (metrics.active_deals_forecast_value || 0) + forecast_value;
  }

  // Handle revenue calculations if the deal is won
  if (stage === 'won') {
    metrics.actual_revenue = (metrics.actual_revenue || 0) + deal_value;
    metrics.average_won_deal_value = metrics.won_deals > 0 ? metrics.actual_revenue / metrics.won_deals : 0;

    const closeDate = new Date(expected_close_date);
    const month = closeDate.toLocaleString('default', { month: 'short', year: 'numeric' });
    metrics.actual_revenue_by_month[month] = (metrics.actual_revenue_by_month[month] || 0) + deal_value;
  } else if (stage !== 'lost') {
    // Forecast revenue calculations for active deals
    metrics.forecasted_revenue_by_stage[stage] = (metrics.forecasted_revenue_by_stage[stage] || 0) + forecast_value;

    const month = new Date(expected_close_date).toLocaleString('default', { month: 'short', year: 'numeric' });
    metrics.forecasted_revenue_by_month[month] = (metrics.forecasted_revenue_by_month[month] || 0) + forecast_value;
  }

  // Update pipeline conversion for each stage
  metrics.pipeline_conversion.new = metrics.new_deals;
  metrics.pipeline_conversion.won = metrics.won_deals;
  metrics.pipeline_conversion.lost = metrics.lost_deals;
  metrics.pipeline_conversion.discovery = metrics.discovery_deals;
  metrics.pipeline_conversion.proposal = metrics.proposal_deals;
  metrics.pipeline_conversion.negotiation = metrics.nego_deals;

  // Calculate total deals for distribution
  const totalDeals = (metrics.new_deals || 0) + (metrics.discovery_deals || 0) +
                     (metrics.proposal_deals || 0) + (metrics.nego_deals || 0) +
                     (metrics.won_deals || 0) + (metrics.lost_deals || 0);

  // Calculate deal status distribution percentage for each stage safely
  if (totalDeals > 0) {
    metrics.deal_status_distribution.new = ((metrics.new_deals || 0) / totalDeals) * 100;
    metrics.deal_status_distribution.discovery = ((metrics.discovery_deals || 0) / totalDeals) * 100;
    metrics.deal_status_distribution.proposal = ((metrics.proposal_deals || 0) / totalDeals) * 100;
    metrics.deal_status_distribution.negotiation = ((metrics.nego_deals || 0) / totalDeals) * 100;
    metrics.deal_status_distribution.won = ((metrics.won_deals || 0) / totalDeals) * 100;
    metrics.deal_status_distribution.lost = ((metrics.lost_deals || 0) / totalDeals) * 100;
  }

  // Save the updated metrics document
  await metrics.save();
};*/





// metricsMicroservice/services/metricsService.ts
import { Metrics } from '../models/Metrics';

export const updateMetricsFromDealEvent = async (dealData: any): Promise<void> => {
  const { deal_value, forecast_value, stage, expected_close_date, org_id } = dealData;

  // Fetch current metrics for the specified org_id or initialize a new metrics object for the organization
  let metrics = await Metrics.findOne({ org_id });
  if (!metrics) {
    metrics = new Metrics({ org_id }); // Initialize with org_id if not found
  }

  // Update total deals count for the organization
  metrics.total_deals = (metrics.total_deals || 0) + 1;

  // Reset or update metrics based on the deal stage
  if (stage === 'won') {
    // Add deal value to actual revenue
    metrics.actual_revenue = (metrics.actual_revenue || 0) + deal_value;

    // Total won deals
    metrics.won_deals = (metrics.won_deals || 0) + 1;

    // Calculate average won deal value
    metrics.average_won_deal_value = metrics.won_deals > 0 ? metrics.actual_revenue / metrics.won_deals : 0;

    // Add to actual revenue by month
    const closeDate = new Date(expected_close_date);
    const month = closeDate.toLocaleString('default', { month: 'short', year: 'numeric' });
    metrics.actual_revenue_by_month[month] = 
      (metrics.actual_revenue_by_month[month] || 0) + deal_value;
  } 
  
  else if (stage !== 'lost') {
    // Track deal stage counts for active deals
    if(stage === 'new'){
      metrics.new_deals = (metrics.new_deals || 0) + 1;
    }
    else if(stage === 'discovery'){
      metrics.discovery_deals = (metrics.discovery_deals || 0) + 1;
    }
    else if(stage === 'proposal'){
      metrics.proposal_deals = (metrics.proposal_deals || 0) + 1;
    }
    else if(stage === 'negotiation'){
      metrics.nego_deals = (metrics.nego_deals || 0) + 1;
    }

    // For active deals (not won or lost), add to forecasted values
    metrics.active_deals_forecast_value = (metrics.active_deals_forecast_value || 0) + forecast_value;

    // Track forecasted revenue by stage
    metrics.forecasted_revenue_by_stage[stage] = 
    (metrics.forecasted_revenue_by_stage[stage] || 0) + forecast_value;

    // Forecasted revenue by month for active deals
    const month = new Date(expected_close_date).toLocaleString('default', { month: 'short', year: 'numeric' });
    metrics.forecasted_revenue_by_month[month] = 
      (metrics.forecasted_revenue_by_month[month] || 0) + forecast_value;
  }

  

  // Update pipeline conversion and deal status distribution for each stage
  metrics.pipeline_conversion[stage] = 
    (metrics.pipeline_conversion[stage] || 0) + 1;

  // Calculate deal status distribution percentage for each stage
    metrics.deal_status_distribution.new = ((metrics.new_deals||0) / metrics.total_deals) * 100;

    metrics.deal_status_distribution.discovery = ((metrics.discovery_deals||0 )/ metrics.total_deals) * 100;

    metrics.deal_status_distribution.proposal = ((metrics.proposal_deals||0) / metrics.total_deals) * 100;

    metrics.deal_status_distribution.negotiation = ((metrics.nego_deals||0 )/ metrics.total_deals) * 100;

    metrics.deal_status_distribution.won = ((metrics.won_deals||0) / metrics.total_deals) * 100;

    metrics.deal_status_distribution.lost = ((metrics.lost_deals||0) / metrics.total_deals) * 100;

    

  // Save the updated metrics document
  await metrics.save();
};





// import axios from 'axios';
// import { Metrics } from '../models/Metrics';

// export async function fetchAllDeals() {
//   const response = await axios.get('http://localhost:5002/api/deals');
//   return response.data; // Assuming the API returns an array of deals
// }

// export const calculateMetricsFromDeal = async (dealData: any) => {
//   const { stage, deal_value = 0, forecast_value = 0, expected_close_date, org_id } = dealData;

//   // Fetch or initialize the metrics document for the organization
//   let metrics = await Metrics.findOne({ org_id });
//   if (!metrics) {
//     metrics = new Metrics({ org_id });
//   }

//   // Ensure numeric fields are initialized
//   metrics.total_deals = metrics.total_deals || 0; // Initialize if undefined
//   metrics.active_deals_forecast_value = metrics.active_deals_forecast_value || 0; // Initialize if undefined
//   metrics.won_deals = metrics.won_deals || 0;
//   metrics.lost_deals = metrics.lost_deals || 0;
//   metrics.new_deals = metrics.new_deals || 0;
//   metrics.discovery_deals = metrics.discovery_deals || 0;
//   metrics.proposal_deals = metrics.proposal_deals || 0;
//   metrics.nego_deals = metrics.nego_deals || 0;

//   // Increment total deals
//   metrics.total_deals++;

//   // Handle won deals
//   if (stage === 'won') {
//     metrics.won_deals++;
//     metrics.actual_revenue += deal_value;

//     const month = new Date(expected_close_date).toLocaleString('default', { month: 'short', year: 'numeric' });
//     metrics.actual_revenue_by_month[month] = (metrics.actual_revenue_by_month[month] || 0) + deal_value;
//   } else if (['new', 'discovery', 'proposal', 'negotiation'].includes(stage)) {
//     // Handle active deals
//     metrics.active_deals_forecast_value += forecast_value;
//     metrics.forecasted_revenue_by_stage[stage] = (metrics.forecasted_revenue_by_stage[stage] || 0) + forecast_value;

//     const month = new Date(expected_close_date).toLocaleString('default', { month: 'short', year: 'numeric' });
//     metrics.forecasted_revenue_by_month[month] = (metrics.forecasted_revenue_by_month[month] || 0) + forecast_value;
//   }

//   // Increment stage-specific counters
//   if (stage === 'new') metrics.new_deals = (metrics.new_deals || 0) + 1;
//   if (stage === 'discovery') metrics.discovery_deals = (metrics.discovery_deals || 0) + 1;
//   if (stage === 'proposal') metrics.proposal_deals = (metrics.proposal_deals || 0) + 1;
//   if (stage === 'negotiation') metrics.nego_deals = (metrics.nego_deals || 0) + 1;
//   if (stage === 'lost') metrics.lost_deals = (metrics.lost_deals || 0) + 1;

//   // Populate the pipeline conversion and deal status distribution fields
//   metrics.pipeline_conversion[stage] = (metrics.pipeline_conversion[stage] || 0) + 1;
//   metrics.deal_status_distribution[stage] = (metrics.deal_status_distribution[stage] || 0) + 1;

//   // Calculate the average won deal value
//   const totalWonDealValue = metrics.won_deals > 0 ? metrics.actual_revenue : 0;
//   metrics.average_won_deal_value = metrics.won_deals ? totalWonDealValue / metrics.won_deals : 0;

//   // Save the updated metrics document
//   await metrics.save();
// }
