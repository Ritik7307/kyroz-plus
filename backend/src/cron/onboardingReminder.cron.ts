import cron from 'node-cron';
import OnboardingReminder from '../models/OnboardingReminder';
import { sendWhatsAppMessage, sendWhatsAppDocument } from '../controllers/whatsappWebhook.controller';

const startOnboardingReminderCron = () => {
  // Run every 5 minutes to check for pending reminders
  cron.schedule('*/5 * * * *', async () => {
    try {
      // console.log('[CRON] Checking for pending onboarding reminders...');
      const now = new Date();

      // Find all reminders that are PENDING and their reminderTime has passed
      const pendingReminders = await OnboardingReminder.find({
        status: 'PENDING',
        reminderTime: { $lte: now }
      });

      if (pendingReminders.length === 0) {
        return; // Nothing to do
      }

      console.log(`[CRON] Found ${pendingReminders.length} pending onboarding reminders to send.`);

      for (const reminder of pendingReminders) {
        try {
          await sendWhatsAppMessage(reminder.phone, reminder.messageText);
          
          // Send PDF Brochure if configured
          const brochureMediaId = process.env.WHATSAPP_BROCHURE_MEDIA_ID;
          if (brochureMediaId) {
            await sendWhatsAppDocument(reminder.phone, brochureMediaId, 'KYROZ+ Brochure', 'KYROZ_Brochure.pdf');
          }

          reminder.status = 'SENT';
          console.log(`[CRON] Onboarding Reminder sent to ${reminder.phone}. Marking as SENT.`);
          
          await reminder.save();
        } catch (sendErr) {
          console.error(`[CRON] Failed to send onboarding reminder to ${reminder.phone}:`, sendErr);
        }
      }
    } catch (err) {
      console.error('[CRON] Error checking onboarding reminders:', err);
    }
  });
  console.log('Onboarding Reminder Cron Job initialized.');
};

export default startOnboardingReminderCron;
