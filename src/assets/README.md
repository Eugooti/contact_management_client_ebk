# User Manual Generation

This folder contains the user manual for the Contact Management System in multiple formats:

- `user_manual.md`: Markdown version of the user manual
- `user_manual.html`: HTML version of the user manual with styling
- `convert_to_pdf.js`: Script to convert the HTML to PDF

## Generating the PDF

There are multiple ways to generate the PDF version of the user manual:

### Method 1: Using Puppeteer (Recommended)

1. Ensure you have Node.js installed on your system
2. Install the puppeteer package:
   ```
   npm install puppeteer
   ```
3. Run the conversion script:
   ```
   node convert_to_pdf.js
   ```
4. The PDF will be generated as `user_manual.pdf` in this folder

### Method 2: Using wkhtmltopdf

1. Install wkhtmltopdf from [https://wkhtmltopdf.org/downloads.html](https://wkhtmltopdf.org/downloads.html)
2. Open the `convert_to_pdf.js` file
3. Comment out the puppeteer code (lines 12-63)
4. Uncomment the wkhtmltopdf code (lines 76-99)
5. Run the script:
   ```
   node convert_to_pdf.js
   ```

### Method 3: Manual Conversion

1. Open the `user_manual.html` file in a web browser (Chrome, Firefox, etc.)
2. Press Ctrl+P (or Cmd+P on Mac) to open the print dialog
3. Select "Save as PDF" as the destination/printer
4. Click "Save" and choose this folder as the location
5. Name the file "user_manual.pdf" and save it

## Updating the User Manual

If you need to update the user manual:

1. Edit the `user_manual.md` file with your changes
2. Update the `user_manual.html` file to reflect the same changes
3. Regenerate the PDF using one of the methods above

## Notes

- The HTML version includes styling to make the PDF look professional
- The PDF includes headers and footers with page numbers
- The manual is designed to be user-friendly for non-technical users