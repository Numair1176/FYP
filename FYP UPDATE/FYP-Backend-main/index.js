const express = require("express");
const cors = require("cors");
const { fetchData, fetchModels, fetchAppUsage, fetchApps, fetchCallLogs, fetchLocations, fetchDataUsage, createNotification,fetchNotifications, fetchStaticData, syncAppData } = require("./Controllers/DataController");

const app = express();
app.use(cors());
app.use(express.json());

// Define routes after initializing the app
app.get('/fetch-data', fetchData);
app.get('/fetch-models/:userId', fetchModels);
app.get('/appusage/:userId/:model', fetchAppUsage);
app.get('/apps/:userId/:model', fetchApps);
app.get('/static-apps/:userId/:model', fetchStaticData);
app.get('/calllogs/:userId/:model', fetchCallLogs);
app.get('/locations/:userId/:model', fetchLocations);
app.get('/data-usage/:userId/:model', fetchDataUsage);
app.get('/create-notification/:userId/:model', createNotification); 
app.get('/notifications/:userId/:model', fetchNotifications); 
app.get('/install-unistall/:userId/:model', syncAppData); 

app.listen(5500, () => {
  console.log('Server is running on port 5500');
});
