// metricsMicroservice/kafka/consumer.ts
import { Kafka } from 'kafkajs';
import { updateMetricsFromDealEvent } from '../services/metricsService';

const kafka = new Kafka({
  clientId: 'metrics-service',
  brokers: ['localhost:9092'] // Adjust with your Kafka broker address
});

const consumer = kafka.consumer({ groupId: 'metrics-group' });

export const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'deal-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const dealData = JSON.parse(message.value!.toString());
      await updateMetricsFromDealEvent(dealData);
    },
  });
};
