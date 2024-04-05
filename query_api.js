const fs = require('fs');
const https = require('https');

// Define the API endpoints
const endpoints = {
  stationInformation: 'https://gbfs.mex.lyftbikes.com/gbfs/en/station_information.json',
  stationStatus: 'https://gbfs.mex.lyftbikes.com/gbfs/en/station_status.json'
};

// Current timestamp for file naming
const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").substring(0,14);

// Function to query each endpoint and save the response
function queryAndSave(url, name) {
  https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      const filename = `${name}_${timestamp}.json`;
      fs.writeFile(filename, data, (err) => {
        if (err) throw err;
        console.log(`${filename} has been saved!`);
      });
    });

  }).on('error', (err) => {
    console.error('Error: ' + err.message);
  });
}

// Execute the function for both endpoints
queryAndSave(endpoints.stationInformation, 'station_information');
queryAndSave(endpoints.stationStatus, 'station_status');
