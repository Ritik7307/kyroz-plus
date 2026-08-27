import { Request, Response } from 'express';
import { exec } from 'child_process';
import ptp from 'pdf-to-printer';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const getPrinters = async (req: Request, res: Response) => {
  try {
    // We use powershell to get installed printers on Windows
    exec('powershell "Get-Printer | Select-Object Name, PrinterStatus | ConvertTo-Json"', (error, stdout, stderr) => {
      if (error) {
        console.error('Error fetching printers:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch printers' });
      }
      try {
        const printers = JSON.parse(stdout);
        // Ensure it returns an array even if there is only 1 printer
        const printerArray = Array.isArray(printers) ? printers : [printers];
        res.json({ success: true, printers: printerArray });
      } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to parse printer data' });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching printers' });
  }
};

export const printJob = async (req: Request, res: Response) => {
  try {
    const { htmlContent, printerName, jobType } = req.body;

    if (!htmlContent || !printerName) {
      return res.status(400).json({ success: false, message: 'Missing htmlContent or printerName' });
    }

    console.log(`Received print job for ${jobType || 'Unknown'} targeting printer: ${printerName}`);

    // Create a temporary file path for the PDF
    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const pdfPath = path.join(tempDir, `print_${crypto.randomBytes(4).toString('hex')}.pdf`);

    // Use puppeteer to render the HTML into a PDF
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // We add some basic print CSS to ensure it looks like a receipt
    const wrappedHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            margin: 0; 
            padding: 10px; 
            font-family: monospace; 
            width: ${jobType === 'report' ? '100%' : '80mm'}; /* Handle wide reports vs thermal receipts */
            color: black;
            background: white;
          }
          /* Allow specific styles from the frontend to be applied */
          @media print {
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    await page.setContent(wrappedHtml, { waitUntil: 'networkidle0' });
    
    // Generate PDF formatted for a receipt or report
    const pdfOptions: any = {
      path: pdfPath,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    };

    if (jobType === 'report') {
      pdfOptions.format = 'A4';
    } else {
      pdfOptions.width = '80mm';
    }

    await page.pdf(pdfOptions);

    await browser.close();

    // Print the generated PDF to the specific printer
    await ptp.print(pdfPath, { printer: printerName });

    // Clean up temp file
    fs.unlinkSync(pdfPath);

    res.json({ success: true, message: `Successfully sent job to ${printerName}` });
  } catch (error: any) {
    console.error('Print job error:', error);
    res.status(500).json({ success: false, message: 'Failed to process print job', error: error.message });
  }
};
