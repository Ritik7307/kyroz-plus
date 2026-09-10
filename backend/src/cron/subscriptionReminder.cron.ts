import cron from 'node-cron';
import User from '../models/User';
import { sendWhatsAppMessage } from '../controllers/whatsappWebhook.controller';

const startSubscriptionReminderCron = () => {
  // Run every day at 10:00 AM
  cron.schedule('0 10 * * *', async () => {
    try {
      console.log('[CRON] Checking for subscription reminders...');
      
      // Find users with a phone number and an expiry date
      const users = await User.find({
        phone: { $exists: true, $ne: '' },
        subscriptionExpiryDate: { $exists: true, $ne: null }
      });

      if (users.length === 0) {
        return;
      }

      // Normalize today's date to midnight for accurate day comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const user of users) {
        try {
          const expiryDate = new Date(user.subscriptionExpiryDate!);
          expiryDate.setHours(0, 0, 0, 0);

          // Calculate difference in days
          const diffTime = expiryDate.getTime() - today.getTime();
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

          let message = '';

          if (diffDays === 1) {
            // Expires Tomorrow
            message = `Dear ${user.shopName || 'Restaurant Owner'},\n\nJust a friendly reminder that your KYROZ+ subscription expires tomorrow. Please renew to avoid losing access to premium features like AI tools, costing, and master SOPs.\n\nThank you,\nThe KYROZ+ Team`;
          } else if (diffDays === 0) {
            // Expires Today
            message = `Dear ${user.shopName || 'Restaurant Owner'},\n\nYour KYROZ+ subscription expires today. Renew now to keep your restaurant operations running smoothly and retain access to all premium features!\n\nThank you,\nThe KYROZ+ Team`;
          } else if (diffDays === -1) {
            // Expired Yesterday
            message = `Dear ${user.shopName || 'Restaurant Owner'},\n\nYour KYROZ+ subscription expired yesterday and premium features have been locked. Please renew to regain full access and continue scaling your business!\n\nThank you,\nThe KYROZ+ Team`;
          }

          if (message) {
            await sendWhatsAppMessage(user.phone!, message);
            console.log(`[CRON] Sent subscription reminder (diff: ${diffDays} days) to ${user.phone}`);
          }
        } catch (sendErr) {
          console.error(`[CRON] Failed to send subscription reminder to ${user.phone}:`, sendErr);
        }
      }
    } catch (err) {
      console.error('[CRON] Error running subscription reminder cron:', err);
    }
  });
  console.log('Subscription Reminder Cron Job initialized.');
};

export default startSubscriptionReminderCron;
