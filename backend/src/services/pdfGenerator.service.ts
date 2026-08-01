import puppeteer from 'puppeteer';
import path from 'path';

// Force Puppeteer to use the local cache directory where the build script installed Chrome
process.env.PUPPETEER_CACHE_DIR = path.join(process.cwd(), '.cache', 'puppeteer');

export const generatePdfFromHtml = async (htmlContent: string): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  
  // Set the HTML content
  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
  
  // Add some basic styling if not already present
  await page.addStyleTag({
    content: `
      body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        color: #333;
        line-height: 1.6;
        padding: 40px;
        max-width: 800px;
        margin: 0 auto;
      }
      h1, h2, h3 {
        color: #D4AF37; /* KYROZ Gold */
      }
      h1 { border-bottom: 2px solid #D4AF37; padding-bottom: 10px; }
      ul, ol { margin-left: 20px; }
      .header { text-align: center; margin-bottom: 40px; }
      .header img { max-width: 150px; }
      .footer { text-align: center; margin-top: 40px; font-size: 0.8em; color: #777; border-top: 1px solid #eee; padding-top: 20px;}
    `
  });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  });

  await browser.close();
  return Buffer.from(pdfBuffer);
};
