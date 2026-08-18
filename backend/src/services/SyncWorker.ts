import cron from 'node-cron';
import fetch from 'node-fetch';
import SyncQueue from '../models/SyncQueue';

const CLOUD_API_URL = process.env.CLOUD_API_URL || 'https://api.kyrozplus.com';
const IS_LOCAL_SERVER = process.env.IS_LOCAL_SERVER === 'true';

class SyncWorker {
  private isRunning = false;

  public start() {
    if (!IS_LOCAL_SERVER) {
      console.log('SyncWorker: Not running locally, skipping sync worker start.');
      return;
    }

    console.log('SyncWorker: Starting local sync worker (runs every minute).');
    
    // Run every minute
    cron.schedule('* * * * *', async () => {
      if (this.isRunning) return;
      this.isRunning = true;
      try {
        await this.processQueue();
      } catch (error) {
        console.error('SyncWorker Error:', error);
      } finally {
        this.isRunning = false;
      }
    });
  }

  private async processQueue() {
    const pendingTasks = await SyncQueue.find({ status: 'PENDING' }).sort({ createdAt: 1 }).limit(50);
    
    if (pendingTasks.length === 0) {
      return;
    }

    console.log(`SyncWorker: Processing ${pendingTasks.length} pending tasks...`);

    for (const task of pendingTasks) {
      try {
        const response = await fetch(`${CLOUD_API_URL}/api/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Ideally add an auth token here
          },
          body: JSON.stringify({
            operation_id: task.operation_id,
            entity_type: task.entity_type,
            entity_id: task.entity_id,
            operation: task.operation,
            payload: task.payload
          }),
        });

        if (response.ok) {
          task.status = 'COMPLETED';
          await task.save();
          console.log(`SyncWorker: Task ${task.operation_id} completed successfully.`);
        } else {
          task.attempts += 1;
          task.last_error = `HTTP Error: ${response.status}`;
          if (task.attempts >= 5) {
             task.status = 'FAILED';
          }
          await task.save();
          console.error(`SyncWorker: Task ${task.operation_id} failed with status ${response.status}`);
        }
      } catch (error: any) {
        task.attempts += 1;
        task.last_error = error.message || 'Unknown error';
        if (task.attempts >= 5) {
           task.status = 'FAILED';
        }
        await task.save();
        console.error(`SyncWorker: Task ${task.operation_id} threw an error:`, error);
      }
    }
  }
}

export default new SyncWorker();
