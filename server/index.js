const { google } = require('googleapis');
const fs = require('fs');

const sheets = google.sheets('v4');

async function getSheetData() {
  // Load your credentials
  const auth = new google.auth.GoogleAuth({
    keyFile: './certificate-generator-435410-2802c42872e3.json', // Path to your JSON key file
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  // Auth client
  const authClient = await auth.getClient();

  // The ID of the spreadsheet to retrieve data from
  const spreadsheetId = '1oeOXy0P3CutG_0OWSdWh8EkQfsavOVp240sMvZLOkIA';

  const response = await sheets.spreadsheets.values.get({
    auth: authClient,
    spreadsheetId: spreadsheetId,
    range: 'Sheet1!A1:D13', // Adjust range as needed
  });

  // Data from the Google Sheet
  const rows = response.data.values;
  if (rows.length) {
    console.log('Fetched data:', rows);
    return rows;
  } else {
    console.log('No data found.');
  }
}

getSheetData();
