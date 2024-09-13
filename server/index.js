const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const archiver = require('archiver');
const { getSheetData } = require('./getSheetData');

const app = express();
const PORT = 3000;

app.use(express.json());

const upload = multer({ dest: 'uploads/' }); // Specify the upload folder

app.post('/upload-template', upload.single('template'), (req, res) => {
  // Store the uploaded file
  const filePath = path.join(__dirname, 'uploads', 'your-template-file.pdf');
  res.send({ message: 'Template uploaded successfully', filePath });
});

app.post('/generate-certificates', async (req, res) => {
  const { filePath } = req.body; // Assuming you have the file path from the upload

  // Ensure the certificates directory exists
  if (!fs.existsSync('certificates')) {
    fs.mkdirSync('certificates');
  }

  // Load the PDF template
  const templateBytes = fs.readFileSync(filePath);
  const pdfDocTemplate = await PDFDocument.load(templateBytes);
  // const pages = pdfDoc.getPages();
  // const firstPage = pages[0];

  // Fetch participants' data from Google Sheet
  const participants = await getSheetData();

  // Iterate over each participant and generate certificates
  for (const participant of participants) {

    if (!participant.name || !participant.email) {
      console.error('Invalid participant data:', participant);
      continue; // Skip this participant if data is invalid
    }

    const pdfDoc = await PDFDocument.load(templateBytes);
    const page = pdfDoc.getPage(0);

    // Insert participant data into the PDF
    page.drawText(participant.name, { x: 50, y: 700 }); // Adjust position as needed
    page.drawText(participant.email, { x: 50, y: 650 });

    // Save the certificate
    const pdfBytes = await pdfDoc.save();
    const outputFilePath = path.join(__dirname, 'certificates', `${participant.name}.pdf`);
    fs.writeFileSync(outputFilePath, pdfBytes);
  }

  res.send({ message: 'Certificates generated successfully' });
});


app.get('/download-certificates', (req, res) => {
  const output = fs.createWriteStream('certificates.zip');
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`${archive.pointer()} total bytes`);
    console.log('Archiver has been finalized and the output file descriptor has closed.');
  });

  archive.pipe(output);
  archive.directory('certificates/', false);
  archive.finalize();
  res.download('certificates.zip');
});


app.listen(PORT, () => console.log('Server running on port 3000'));
