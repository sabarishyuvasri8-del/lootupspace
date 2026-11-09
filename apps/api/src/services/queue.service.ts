export interface BackgroundJob {
  id: string;
  type: 'GENERATE_MONTHLY_INVOICES' | 'RETRY_FAILED_PAYMENTS' | 'RELEASE_EXPIRED_SLOTS' | 'RECOMPUTE_WAREHOUSE_STATS' | 'SEND_SCHEDULED_REMINDERS';
  payload?: any;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  scheduledAt: string;
}

export class QueueService {
  private static jobs: BackgroundJob[] = [];

  static scheduleJob(type: BackgroundJob['type'], payload?: any, delayMs: number = 0): BackgroundJob {
    const job: BackgroundJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      payload,
      status: 'PENDING',
      scheduledAt: new Date(Date.now() + delayMs).toISOString()
    };

    this.jobs.push(job);
    console.log(`⏱️ [QueueService] Job scheduled: ${job.type} (${job.id})`);

    // In local execution, run simulated job after timeout
    if (delayMs > 0) {
      setTimeout(() => this.processJob(job), delayMs);
    } else {
      setImmediate(() => this.processJob(job));
    }

    return job;
  }

  private static async processJob(job: BackgroundJob) {
    job.status = 'RUNNING';
    try {
      switch (job.type) {
        case 'GENERATE_MONTHLY_INVOICES':
          console.log('🔄 [QueueWorker] Generating monthly recurring storage invoices for active subscriptions...');
          break;
        case 'RETRY_FAILED_PAYMENTS':
          console.log('🔄 [QueueWorker] Retrying failed payments under 7-day grace period...');
          break;
        case 'RELEASE_EXPIRED_SLOTS':
          console.log('🔄 [QueueWorker] Releasing unconfirmed driver slots older than 30 minutes...');
          break;
        case 'RECOMPUTE_WAREHOUSE_STATS':
          console.log('🔄 [QueueWorker] Recomputing warehouse cubic feet utilization across hubs...');
          break;
        case 'SEND_SCHEDULED_REMINDERS':
          console.log('🔄 [QueueWorker] Sending pickup and delivery day-before reminders...');
          break;
      }
      job.status = 'COMPLETED';
    } catch (err) {
      console.error(`❌ [QueueWorker] Job ${job.id} failed:`, err);
      job.status = 'FAILED';
    }
  }

  static getActiveJobs(): BackgroundJob[] {
    return this.jobs;
  }
}

