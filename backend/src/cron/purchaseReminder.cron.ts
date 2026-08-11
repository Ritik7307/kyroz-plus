import cron from 'node-cron';
import PurchaseReminder from '../models/PurchaseReminder';
import { sendWhatsAppMessage } from '../controllers/whatsappWebhook.controller';

const startPurchaseReminderCron = () => {
  // Run every 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    try {
      console.log('[CRON] Checking for pending purchase reminders...');
      const now = new Date();

      // Find all reminders that are PENDING and their reminderTime has passed
      const pendingReminders = await PurchaseReminder.find({
        status: 'PENDING',
        reminderTime: { $lte: now }
      });

      if (pendingReminders.length === 0) {
        return; // Nothing to do
      }

      console.log(`[CRON] Found ${pendingReminders.length} pending reminders to send.`);

      for (const reminder of pendingReminders) {
        try {
          // A polite, formal message
          const message = `Dear Restaurant Owner,\n\nWe hope this message finds you well. You recently received a comprehensive Business Growth Assessment Report from KYROZ+.\n\nOur system is specifically designed to help restaurant owners standardize their operations, eliminate daily wastage, and significantly increase profit margins.\n\nWe invite you to upgrade to KYROZ+ and take the next step toward scaling your business. Should you have any questions or require assistance, please feel free to reply to this message.\n\nWarm regards,\nThe KYROZ+ Team`;
          
          await sendWhatsAppMessage(reminder.phone, message);
          
          // Increment send count
          reminder.sendCount = (reminder.sendCount || 0) + 1;
          
          if (reminder.sendCount >= 3) {
            // Sent 3 times, we can stop reminding them
            reminder.status = 'SENT';
            console.log(`[CRON] Reminder maxed out (3 times) for ${reminder.phone}. Marking as SENT.`);
          } else {
            // Schedule the next reminder for 24 hours from now
            reminder.reminderTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
            console.log(`[CRON] Reminder sent (${reminder.sendCount}/3) to ${reminder.phone}. Next reminder in 24 hours.`);
          }
          
          await reminder.save();
        } catch (sendErr) {
          console.error(`[CRON] Failed to send reminder to ${reminder.phone}:`, sendErr);
        }
      }
    } catch (err) {
      console.error('[CRON] Error checking purchase reminders:', err);
    }
  });
  console.log('Purchase Reminder Cron Job initialized.');
};

export default startPurchaseReminderCron;
