// salesRepmetricsMicroservice/kafka/consumer.ts

import { Kafka } from 'kafkajs';
import { updateSalesRepMetricsFromDealEvent, updateSalesRepMetricsFromLeadEvent } from '../services/metricsService';

const kafka = new Kafka({
  clientId: 'salesrep-metrics-service', // Unique clientId for salesRepmetricsMicroservice
  brokers: ['localhost:9093'] // Adjust with your Kafka broker address
});

const consumer = kafka.consumer({ groupId: 'salesrep-metrics-group' }); // Unique groupId for salesRepmetricsMicroservice

export const runConsumer = async () => {
  await consumer.connect();
  console.log('Kafka Consumer for Sales Rep Metrics connected');

  await consumer.subscribe({ topic: 'deal-events', fromBeginning: false });
  await consumer.subscribe({ topic: 'lead-events', fromBeginning: false });
  //console.log('Subscribed to topic: deal-events for Sales Rep Metrics');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const eventData = JSON.parse(message.value!.toString());
      console.log(`Received ${topic} event:`, eventData);

      if (topic === 'deal-events') {
        await updateSalesRepMetricsFromDealEvent(eventData);
      } else if (topic === 'lead-events') {
        await updateSalesRepMetricsFromLeadEvent(eventData); 
      }
    },
  });
};
