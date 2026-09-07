import { Request, Response } from 'express';
import { sendWhatsAppMessage, uploadWhatsAppMedia, sendWhatsAppDocument } from './whatsappWebhook.controller';
import Groq from 'groq-sdk';
import { generatePdfFromHtml } from '../services/pdfGenerator.service';
import { marked } from 'marked';
import PurchaseReminder from '../models/PurchaseReminder';
import WhatsAppOptOut from '../models/WhatsAppOptOut';
import PendingReport from '../models/PendingReport';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// In-memory cache to prevent processing duplicate triggers from Google Apps Script
const processedPhonesCache = new Set<string>();

export const handleGoogleFormWebhook = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log("[GOOGLE FORM WEBHOOK HIT] Received Data:", JSON.stringify(data, null, 2));

    const phone = data.whatsappNumber;

    if (!phone) {
      console.error("No WhatsApp number provided in the form submission.");
      return res.status(400).json({ error: "Missing WhatsApp Number" });
    }

    // --- Prevent duplicate webhook triggers (e.g. Google Apps Script retries) ---
    // If the phone number was processed recently, ignore this trigger.
    if (processedPhonesCache.has(phone)) {
      console.log(`[DUPLICATE WEBHOOK] Ignoring duplicate trigger for phone: ${phone}`);
      return res.status(200).json({ success: true, message: "Already processing" });
    }

    // Add to cache and automatically remove after 1 hour (3600000 ms)
    processedPhonesCache.add(phone);
    setTimeout(() => {
      processedPhonesCache.delete(phone);
    }, 60 * 60 * 1000);

    // 1. Return 200 OK to the webhook immediately so Google Apps Script doesn't timeout
    res.status(200).json({ success: true, message: "Processing started" });

    // 1.0 Reset opt-out status if the user submits a new form
    try {
      await WhatsAppOptOut.findOneAndUpdate(
        { phone },
        { phone, optedOut: false, updatedAt: new Date() },
        { upsert: true }
      );
      console.log(`[OPT-IN] User ${phone} submitted form. Messaging resumed.`);
    } catch (optErr) {
      console.error("[OPT-IN ERROR] Failed to reset opt-out status:", optErr);
    }

    // 1.1 Send immediate acknowledgment message to the user
    try {
      await sendWhatsAppMessage(phone, "Aapka form successfully submit ho gaya hai! 🎉\n\nHmari team aur AI aapke restaurant ka data analyze kar rahi hai. Aapko lagbhag 4 ghante mein ek detailed Growth Assessment Report bhej di jayegi.\n\nThank you for choosing KYROZ+! 🚀");
      console.log(`[ACK MESSAGE SENT] Acknowledgment sent to ${phone}`);
    } catch (ackErr) {
      console.error("[ACK MESSAGE ERROR] Failed to send acknowledgment:", ackErr);
    }

    // 1.5 Setup a purchase reminder to fire in 24 hours if the user hasn't bought the software yet
    try {
      const reminderTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
      await PurchaseReminder.findOneAndUpdate(
        { phone },
        { phone, reminderTime, status: 'PENDING' },
        { upsert: true, new: true }
      );
      console.log(`[REMINDER SET] 24h purchase reminder set for ${phone}`);
    } catch (reminderErr) {
      console.error('[REMINDER ERROR] Failed to set purchase reminder:', reminderErr);
    }

    // 2. Schedule AI Report to process in the background after 4 hours
    try {
      const executeAt = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours from now
      await PendingReport.create({
        phone: phone,
        data: data,
        executeAt: executeAt,
        status: 'PENDING'
      });
      console.log(`[REPORT SCHEDULED] AI Report for ${phone} scheduled to run at ${executeAt}`);
    } catch (scheduleErr) {
      console.error("[REPORT SCHEDULE ERROR] Failed to schedule AI report:", scheduleErr);
    }

  } catch (error) {
    console.error('Error handling Google Form webhook:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
