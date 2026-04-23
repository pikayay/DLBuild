import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

// Create a Redis connection
// Replace with your actual Redis connection string in production
const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

// Define the queue
export const emailQueue = new Queue('email-queue', { connection });

// Define the worker
export const emailWorker = new Worker('email-queue', async (job: Job) => {
  console.log(`Processing job ${job.id} of type ${job.name}`);
  console.log('Job data:', job.data);
  
  // Here we will add the logic to query users with email_opt_in = true
  // and send them the weekly email.
  
  // Simulate sending email
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  console.log(`Successfully completed job ${job.id}`);
}, { connection });

emailWorker.on('completed', (job: Job) => {
  console.log(`Job ${job.id} has completed!`);
});

emailWorker.on('failed', (job: Job | undefined, err: Error) => {
  console.log(`Job ${job?.id} has failed with ${err.message}`);
});

// Function to schedule weekly emails
export async function scheduleWeeklyEmails() {
  await emailQueue.add('send-weekly-emails', {}, {
    repeat: {
      pattern: '0 0 * * 0', // Every Sunday at midnight
    }
  });
  console.log('Weekly emails scheduled.');
}
