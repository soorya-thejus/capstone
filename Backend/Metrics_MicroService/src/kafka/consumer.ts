// metricsMicroservice/kafka/consumer.ts
import { Kafka } from 'kafkajs';
import { updateMetricsFromDealEvent } from '../services/metricsService';
 
const kafka = new Kafka({
  clientId: 'metrics-service1',
  brokers: ['localhost:9093'] // Adjust with your Kafka broker address
});

const consumer = kafka.consumer({ groupId: 'metrics-group' });

export const runConsumer = async () => {
  await consumer.connect();
  console.log('Kafka Consumer connected');

  await consumer.subscribe({ topic: 'deal-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const dealData = JSON.parse(message.value!.toString());
      console.log('Received deal event:', dealData);
      await updateMetricsFromDealEvent(dealData);
    },
  });
};
