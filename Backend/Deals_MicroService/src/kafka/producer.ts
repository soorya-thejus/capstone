// dealsMicroservice/kafka/producer.ts
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'deals-service',
  brokers: ['localhost:9093'], // Adjust the Kafka broker address if needed
});

const producer = kafka.producer();

export const initializeProducer = async () => {
  await producer.connect();
  console.log('Kafka Producer connected');
};

export const sendDealEvent = async (dealData: any) => {
  try {
    await producer.send({
      topic: 'deal-events', // The topic to which you're sending messages
      messages: [
        {
          value: JSON.stringify(dealData), // Convert the deal data to JSON
        },
      ],
    });
    console.log('Deal event sent:', dealData);
  } catch (error) {
    console.error('Error sending deal event:', error);
  }
};

// Call this function to disconnect the producer when your application stops
export const disconnectProducer = async () => {
  await producer.disconnect();
  console.log('Kafka Producer disconnected');
};
