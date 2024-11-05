// metricsMicroservice/kafka/consumer.ts
import { Kafka } from 'kafkajs';
import { updateMetricsFromDealEvent, updateMetricsFromLeadEvent } from '../services/metricsService';
 
const kafka = new Kafka({
  clientId: 'metrics-service',
  brokers: ['localhost:9093'] // Adjust with your Kafka broker address
});

const consumer = kafka.consumer({ groupId: 'metrics-group' });

export const runConsumer = async () => {
  await consumer.connect();
  console.log('Kafka Consumer connected');

  await consumer.subscribe({ topic: 'deal-events', fromBeginning: true });
  await consumer.subscribe({ topic: 'lead-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const eventData = JSON.parse(message.value!.toString());
      console.log(`Received ${topic} event:`, eventData);

      if (topic === 'deal-events') {
        await updateMetricsFromDealEvent(eventData);
      } else if (topic === 'lead-events') {
        await updateMetricsFromLeadEvent(eventData); // Handle lead event
      }
    },
  });
};
