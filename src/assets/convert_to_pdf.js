/**
 * This script converts the HTML user manual to PDF
 * 
 * Requirements:
 * - Node.js installed
 * - puppeteer package installed (npm install puppeteer)
 * 
 * Usage:
 * - Run this script with Node.js: node convert_to_pdf.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    console.log('Starting PDF conversion...');
    
    // Get the absolute paths to the HTML and PDF files
    const htmlPath = path.resolve(__dirname, 'user_manual.html');
    const pdfPath = path.resolve(__dirname, 'user_manual.pdf');
    
    // Check if the HTML file exists
    if (!fs.existsSync(htmlPath)) {
      console.error(`Error: HTML file not found at ${htmlPath}`);
      process.exit(1);
    }
    
    // Launch a headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Load the HTML file
    console.log(`Loading HTML file from ${htmlPath}`);
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    console.log('Generating PDF...');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div style="font-size: 8px; width: 100%; text-align: center;">Contact Management System - User Manual</div>',
      footerTemplate: '<div style="font-size: 8px; width: 100%; text-align: center; margin: 0 auto;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
    });
    
    // Close the browser
    await browser.close();
    
    console.log(`PDF successfully created at ${pdfPath}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
})();

/**
 * Alternative method using wkhtmltopdf (if puppeteer doesn't work for you)
 * 
 * Requirements:
 * - wkhtmltopdf installed on your system (https://wkhtmltopdf.org/downloads.html)
 * - Node.js installed
 * - child_process module (built into Node.js)
 * 
 * Uncomment the code below and comment out the puppeteer code above to use wkhtmltopdf
 */

/*
const { exec } = require('child_process');
const path = require('path');

const htmlPath = path.resolve(__dirname, 'user_manual.html');
const pdfPath = path.resolve(__dirname, 'user_manual.pdf');

console.log('Starting PDF conversion using wkhtmltopdf...');

// Command to execute wkhtmltopdf
const command = `wkhtmltopdf --enable-local-file-access "${htmlPath}" "${pdfPath}"`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`PDF successfully created at ${pdfPath}`);
});
*/

/**
 * Manual conversion instructions:
 * 
 * If neither of the above methods work, you can manually convert the HTML to PDF:
 * 
 * 1. Open the user_manual.html file in a web browser (Chrome, Firefox, etc.)
 * 2. Press Ctrl+P (or Cmd+P on Mac) to open the print dialog
 * 3. Select "Save as PDF" as the destination/printer
 * 4. Click "Save" and choose the location to save the PDF
 * 5. Name the file "user_manual.pdf" and save it in the assets folder
 */