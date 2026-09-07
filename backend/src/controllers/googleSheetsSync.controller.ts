import { Request, Response } from 'express';
import { google } from 'googleapis';
import LeadRemark from '../models/LeadRemark';
import WhatsAppOptOut from '../models/WhatsAppOptOut';
import { sendWhatsAppMessage } from './whatsappWebhook.controller';

const getGoogleSheetsAuth = () => {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  // Replace actual literal \n strings with newline characters for private key
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error('Google Sheets credentials are not configured in .env');
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });
};

export const syncLeadRemarks = async (req?: Request, res?: Response) => {
  console.log('[SYNC] Starting Google Sheets Lead Remarks Sync...');
  
  try {
    const auth = getGoogleSheetsAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = process.env.GOOGLE_SHEET_RANGE || 'Sheet1!A1:Z1000'; // Adjust based on user's sheet name

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID is not configured in .env');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found in Google Sheet.');
      if (res) return res.status(200).json({ message: 'No data found' });
      return;
    }

    // Assuming the first row contains headers. We need to find 'WhatsApp Number' and 'Remark' columns.
    const headers = rows[0];
    
    // Convert to lower case for loose matching
    const headerLower = headers.map(h => String(h).toLowerCase());
    
    const phoneColIndex = headerLower.findIndex(h => h.includes('whatsapp') || h.includes('phone') || h.includes('number'));
    const remarkColIndex = headerLower.findIndex(h => h.includes('remark') || h.includes('status') || h.includes('lead'));

    if (phoneColIndex === -1 || remarkColIndex === -1) {
      const errorMsg = 'Could not find required columns (WhatsApp Number, Remark) in the sheet headers.';
      console.error(errorMsg);
      if (res) return res.status(400).json({ error: errorMsg, headers });
      return;
    }

    let processedCount = 0;
    let newMessagesSent = 0;

    // Start from row 1 to skip headers
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      let rawPhone = row[phoneColIndex];
      const rawRemark = row[remarkColIndex];

      if (!rawPhone || !rawRemark) continue; // Skip empty rows

      // Clean phone number
      rawPhone = String(rawPhone).replace(/\D/g, "");
      if (rawPhone.length === 10) rawPhone = "91" + rawPhone;

      const remark = String(rawRemark).trim();
      
      // Check if we already processed this EXACT remark for this user
      const existingRecord = await LeadRemark.findOne({ phone: rawPhone, remark });
      
      if (!existingRecord) {
        // Opt-out Check
        const optOutRecord = await WhatsAppOptOut.findOne({ phone: rawPhone });
        if (optOutRecord && optOutRecord.optedOut) {
           console.log(`[OPT-OUT] Skipping opted-out user ${rawPhone} during sync.`);
        } else {
           // Send custom message based on remark
           await sendCustomMessage(rawPhone, remark);
           newMessagesSent++;
        }

        // Save to DB so we don't process it again
        await LeadRemark.create({ phone: rawPhone, remark });
      }
      
      processedCount++;
    }

    console.log(`[SYNC] Finished. Processed ${processedCount} rows. Sent ${newMessagesSent} new messages.`);
    if (res) return res.status(200).json({ message: 'Sync complete', processedCount, newMessagesSent });

  } catch (error: any) {
    console.error('Error during Google Sheets sync:', error);
    if (res) {
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      }
    }
  }
};

const sendCustomMessage = async (phone: string, remark: string) => {
  const r = remark.toLowerCase();
  
  if (r.includes('interested')) {
    if (r.includes('not')) {
       // "Not Interested"
       await sendWhatsAppMessage(phone, "Hi,\n\nKYROZ+ ki team se baat karne ka shukriya. Agar future me aapko apne restaurant operations ya food cost improve karna ho, to humein yaad zaroor karein.\n\nHappy Business! 🚀");
    } else {
       // "Interested"
       await sendWhatsAppMessage(phone, "Hi,\n\nKYROZ+ me interest dikhane ke liye shukriya! 🚀\n\nAapka next step hai Demo Session attend karna. Humari expert team ne aapse connect kiya tha.\nAgar aapka koi aur sawaal hai, ya aap apna KYROZ+ account setup start karna chahte hain, to bas reply karein!");
    }
  } else if (r.includes('demo') || r.includes('book')) {
       await sendWhatsAppMessage(phone, "Hi! Aapka KYROZ+ Demo successfully note kar liya gaya hai. Hum jaldi hi detail bhejege.");
  } else if (r.includes('later') || r.includes('busy')) {
       await sendWhatsAppMessage(phone, "Hi, jab humne call kiya tha tab aap busy lag rahe the.\nJab bhi aap free hon, kripya bataein taaki hum demo schedule kar sakein.");
  } else {
    console.log(`Unrecognized remark '${remark}' for ${phone}. No message sent.`);
  }
};
