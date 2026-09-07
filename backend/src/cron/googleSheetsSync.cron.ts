import cron from 'node-cron';
import { syncLeadRemarks } from '../controllers/googleSheetsSync.controller';

const startGoogleSheetsSyncCron = () => {
  // Run every 1 hour at minute 0
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('[CRON] Starting hourly Google Sheets sync for Lead Remarks...');
      await syncLeadRemarks();
    } catch (err) {
      console.error('[CRON ERROR] Failed to run Google Sheets sync:', err);
    }
  });
  console.log('Google Sheets sync cron initialized (runs every hour).');
};

export default startGoogleSheetsSyncCron;
