import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'leads-service',
  brokers: ['localhost:9093'], // Adjust the Kafka broker address if needed
});

const producer = kafka.producer();

export const initializeProducer = async () => {
  await producer.connect();
  console.log('Kafka Producer connected');
};

export const sendLeadEvent = async (leadData: any) => {
  try {
    await producer.send({
      topic: 'lead-events', // The topic to which you're sending messages
      messages: [
        {
          value: JSON.stringify(leadData), // Convert the deal data to JSON
        },
      ],
    });
    console.log('Lead event sent:', leadData);
  } catch (error) {
    console.error('Error sending lead event:', error);
  }
};

// Call this function to disconnect the producer when your application stops
export const disconnectProducer = async () => {
  await producer.disconnect();
  console.log('Kafka Producer disconnected');
};
