const fs = require('fs');
const path = 'c:/Users/Ritik prajapati/Desktop/project/kyroz-plus/backend/src/controllers/whatsappWebhook.controller.ts';
let code = fs.readFileSync(path, 'utf8');

// Add imports
if (!code.includes('import WhatsappConversation')) {
  code = code.replace(
    'import OnboardingReminder from \'../models/OnboardingReminder\';',
    'import OnboardingReminder from \'../models/OnboardingReminder\';\nimport WhatsappConversation from \'../models/WhatsappConversation\';\nimport WhatsappMessage from \'../models/WhatsappMessage\';\nimport { getIo } from \'../socket\';\nimport mongoose from \'mongoose\';'
  );
}

// Modify sendWhatsAppMessage to log outbound
if (!code.includes('WhatsappConversation.findOneAndUpdate')) {
  code = code.replace('export const sendWhatsAppMessage = async (toPhone: string, text: string) => {', 'export const sendWhatsAppMessage = async (toPhone: string, text: string, isAdminManualReply = false) => {');

  const originalSendTry = `    await axios.post(
      \`https://graph.facebook.com/v17.0/\${phoneId}/messages\`,
      {
        messaging_product: 'whatsapp',
        to: toPhone,
        type: 'text',
        text: { body: text }
      },
      {
        headers: {
          'Authorization': \`Bearer \${token}\`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(\`Sent message to \${toPhone}\`);`;

  const newSendTry = `    const response = await axios.post(
      \`https://graph.facebook.com/v17.0/\${phoneId}/messages\`,
      {
        messaging_product: 'whatsapp',
        to: toPhone,
        type: 'text',
        text: { body: text }
      },
      {
        headers: {
          'Authorization': \`Bearer \${token}\`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(\`Sent message to \${toPhone}\`);
    
    // Log outbound message
    try {
      let conv = await WhatsappConversation.findOneAndUpdate(
        { phone: toPhone },
        { 
          $set: { 
            lastMessageAt: new Date(), 
            lastMessagePreview: text.substring(0, 50) + (text.length > 50 ? '...' : '') 
          },
          $setOnInsert: { name: 'Unknown User' }
        },
        { upsert: true, new: true }
      );
      
      const msg = await WhatsappMessage.create({
        conversationId: conv._id,
        messageId: response.data?.messages?.[0]?.id || 'outbound_' + Date.now(),
        sender: isAdminManualReply ? 'admin' : 'system',
        direction: 'outbound',
        type: 'text',
        text,
        status: 'sent',
        timestamp: new Date()
      });
      
      try {
        const io = getIo();
        io.emit('new_whatsapp_message', { conversation: conv, message: msg });
      } catch (e) {}
    } catch(dbErr) {
      console.error('Failed to log outbound message', dbErr);
    }`;
    
  code = code.replace(originalSendTry, newSendTry);
}

// Modify handleIncomingMessage to log inbound
if (!code.includes('await WhatsappConversation.findOneAndUpdate')) {
  const incomingStr = `            const from = messageObj.from; // sender phone number
            const msg_body = messageObj.text?.body; // text message content
            
            // Extract profile name if available
            let senderName = 'Unknown User';
            if (body.entry[0].changes[0].value.contacts && body.entry[0].changes[0].value.contacts[0]) {
              senderName = body.entry[0].changes[0].value.contacts[0].profile?.name || 'Unknown User';
            }
            console.log(\`[WHATSAPP MESSAGE] From: \${senderName} (\${from})\`);`;
            
  const newIncomingStr = incomingStr + `
            
            // Log inbound message
            if (msg_body) {
              try {
                let conv = await WhatsappConversation.findOneAndUpdate(
                  { phone: from },
                  { 
                    $set: { 
                      name: senderName,
                      lastMessageAt: new Date(),
                      lastMessagePreview: msg_body.substring(0, 50) + (msg_body.length > 50 ? '...' : '')
                    },
                    $inc: { unreadCount: 1 }
                  },
                  { upsert: true, new: true }
                );
                
                const msg = await WhatsappMessage.create({
                  conversationId: conv._id,
                  messageId: messageId,
                  sender: 'user',
                  direction: 'inbound',
                  type: 'text',
                  text: msg_body,
                  status: 'received',
                  timestamp: new Date(messageObj.timestamp * 1000)
                });
                
                try {
                  const io = getIo();
                  io.emit('new_whatsapp_message', { conversation: conv, message: msg });
                } catch (e) {}
              } catch (dbErr) {
                console.error('Failed to log inbound message', dbErr);
              }
            }`;
            
  code = code.replace(incomingStr, newIncomingStr);
}

fs.writeFileSync(path, code);
