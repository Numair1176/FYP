// firebaseController.js
const { ref, get, push, remove, set } = require('firebase/database');
const database = require("../Config/firebase");

const fetchData = async (req, res) => {
  try {
    const userId = "aliusman62867@gmail_com";
    const dbRef = ref(database, userId);
    const snapshot = await get(dbRef);
    const data = snapshot.val();
    res.json(data);
  } catch (error) {
    res.status(500).send("Error fetching data: " + error.message);
  }
};

const fetchModels = async (req, res) => {
  try {
    const { userId } = req.params;
    const userRef = ref(database, userId);
    const snapshot = await get(userRef);
    const data = snapshot.val();

    if (!data) {
      res.status(404).send("No data found for this user.");
      return;
    }

    const models = Object.keys(data).map((model) => ({
      model,
      childName: data[model]["Child Name"],
    }));

    res.json(models);
  } catch (error) {
    res.status(500).send("Error fetching data: " + error.message);
  }
};

const fetchAppUsage = async (req, res) => {
  try {
    const { userId, model } = req.params;
    const userRef = ref(database, `${userId}/${model}/AppUsage`);
    const snapshot = await get(userRef);
    const data = snapshot.val();

    if (!data) {
      res.status(404).send("No AppUsage data found for this model.");
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).send("Error fetching AppUsage data: " + error.message);
  }
};

const fetchApps = async (req, res) => {
  try {
    const { userId, model } = req.params;
    const userRef = ref(database, `${userId}/${model}/Apps`);
    const snapshot = await get(userRef);

    const data = snapshot.val();

    if (!data) {
      res.status(404).send("No apps found for this model.");
      return;
    }

    const apps = [];
    for (const key in data) {
      const appString = data[key];
      const appInfo = parseAppString(appString);
      if (appInfo) {
        apps.push(appInfo);
      }
    }

    res.json(apps);
  } catch (error) {
    console.error("Error fetching apps:", error);
    res.status(500).send("Error fetching apps: " + error.message);
  }
};
const parseAppString = (appString) => {
  try {
    if (!appString) {
      console.error("App string is undefined or empty");
      return null;
    }

    const appNameRegex = /App Name: ([^\n]+)/;
    const packageNameRegex = /Package Name: ([^\n]+)/;
    const installTimeRegex = /Install Time: ([^\n]+)/;

    const appNameMatch = appString.match(appNameRegex);
    const packageNameMatch = appString.match(packageNameRegex);
    const installTimeMatch = appString.match(installTimeRegex);

    if (!appNameMatch || !packageNameMatch || !installTimeMatch) {
      console.error("App string does not match expected format:", appString);
      return null;
    }

    const appName = appNameMatch[1].trim();
    const packageName = packageNameMatch[1].trim();
    const installTime = installTimeMatch[1].trim();

    return {
      appName,
      packageName,
      installTime,
    };
  } catch (error) {
    console.error("Error parsing app string:", error);
    return null;
  }
};

const fetchCallLogs = async (req, res) => {
  try {
    const { userId, model } = req.params;
    const userRef = ref(database, `${userId}/${model}/CallLogs`);
    const snapshot = await get(userRef);
    const data = snapshot.val();

    if (!data) {
      res.status(404).send("No call logs found for this model.");
      return;
    }

    const callLogs = [];

    for (const key in data) {
      const callLogString = data[key];
      const callLogInfo = parseCallLogString(callLogString);
      if (callLogInfo) {
        callLogs.push(callLogInfo);
      }
    }

    res.json(callLogs);
  } catch (error) {
    console.error("Error fetching call logs:", error);
    res.status(500).send("Error fetching call logs: " + error.message);
  }
};

const parseCallLogString = (callLogString) => {
  try {
    if (!callLogString) {
      console.error("Call log string is undefined or empty");
      return null;
    }

    const dateRegex = /Date: (.*?)\n/;
    const nameRegex = /Name: (.*?)\n/;
    const numberRegex = /Number: (.*?)\n/;
    const durationRegex = /Duration: (.*?)\n/;
    const typeRegex = /Type: (.*?)\n/;

    const dateMatch = callLogString.match(dateRegex);
    const nameMatch = callLogString.match(nameRegex);
    const numberMatch = callLogString.match(numberRegex);
    const durationMatch = callLogString.match(durationRegex);
    const typeMatch = callLogString.match(typeRegex);

    if (
      !dateMatch ||
      !nameMatch ||
      !numberMatch ||
      !durationMatch ||
      !typeMatch
    ) {
      console.error(
        "Call log string does not match expected format:",
        callLogString
      );
      return null;
    }

    return {
      date: dateMatch[1].trim(),
      name: nameMatch[1].trim(),
      number: numberMatch[1].trim(),
      duration: durationMatch[1].trim(),
      type: typeMatch[1].trim(),
    };
  } catch (error) {
    console.error("Error parsing call log string:", error);
    return null;
  }
};

const fetchLocations = async (req, res) => {
  try {
    const { userId, model } = req.params;
    const userRef = ref(database, `${userId}/${model}/Locations`);
    const snapshot = await get(userRef);
    const data = snapshot.val();

    if (!data) {
      res.status(404).send("No locations found for this model.");
      return;
    }

    const locations = Object.values(data)
      .map((locationString) => {
        const locationInfo = parseLocationString(locationString);
        if (locationInfo) {
          return locationInfo;
        }
      })
      .filter((location) => location); // Filter out undefined values

    // Get the last record only
    const lastLocation = locations;
    // const lastLocation = locations[locations.length - 1];

    res.json([lastLocation]);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).send("Error fetching locations: " + error.message);
  }
};

const parseLocationString = (locationString) => {
  try {
    if (!locationString) {
      console.error("Location data is undefined or empty:", locationString);
      return null;
    }

    if (typeof locationString === "string") {
      // Parse the string if it's a string
      const parts = locationString.split("\n");
      const latitude = parts
        .find((part) => part.includes("latitude"))
        ?.split(":")[1]
        ?.trim();
      const longitude = parts
        .find((part) => part.includes("longitude"))
        ?.split(":")[1]
        ?.trim();
      const time = parts
        .find((part) => part.includes("time"))
        ?.split(":")[1]
        ?.trim();

      return {
        latitude: latitude ? latitude.toString() : null,
        longitude: longitude ? longitude.toString() : null,
        time: time ? time.toString() : null,
      };
    } else if (typeof locationString === "object") {
      // Return the object as it is if it's already an object
      const { latitude, longitude, time } = locationString;

      return {
        latitude: latitude ? latitude.toString() : null,
        longitude: longitude ? longitude.toString() : null,
        time: time ? time.toString() : null,
      };
    } else {
      console.error("Location data is not a string or object:", locationString);
      return null;
    }
  } catch (error) {
    console.error("Error parsing location data:", error);
    return null;
  }
};

const fetchDataUsage = async (req, res) => {
  try {
    const { userId, model } = req.params;
    const userRef = ref(database, `${userId}/${model}/DataUsage`);
    const snapshot = await get(userRef);
    const data = snapshot.val();

    if (!data) {
      res.status(404).send("No data usage found for this model.");
      return;
    }

    res.json([data]);
  } catch (error) {
    console.error("Error fetching data usage:", error);
    res.status(500).send("Error fetching data usage: " + error.message);
  }
};


const createNotification = async (req, res) => {
  try {
    const { userId, model } = req.params;

    const userNotificationsRef = ref(database, `${userId}/${model}/Notifications`);

    // Check if Notifications collection exists for the user and model
    const snapshotNotifications = await get(userNotificationsRef);
    if (!snapshotNotifications.exists()) {
      // Create Notifications collection if it doesn't exist
      await push(userNotificationsRef, { exists: true });
    }

    const userAppUsageRef = ref(database, `${userId}/${model}/AppUsage`);
    const snapshot = await get(userAppUsageRef);
    const appUsageData = snapshot.val();

    if (!appUsageData) {
      console.error("No AppUsage data found for this model.");
      return res.status(404).send("No AppUsage data found for this model.");
    }

    const notifications = [];

    // Get current date
    const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

    // Iterate through each app's screen time
    for (const key in appUsageData) {
      const screenTime = appUsageData[key].ScreenTime;

      if (convertScreenTimeToMinutes(screenTime) > 60) {
        const appName = appUsageData[key].appName;
        console.log(`${appName} has used more than one hour.`);

        // Add notification to the array
        notifications.push({
          Notification: `${appName} has used more than one hour.`,
          Date: currentDate
        });
      }
    }

    // Add notifications to the collection
    for (const notification of notifications) {
      push(userNotificationsRef, notification);
    }

    return res.status(200).send("Notifications checked successfully.");
  } catch (error) {
    console.error("Error creating notifications:", error);
    return res.status(500).send("Error creating notifications: " + error.message);
  }
};



const convertScreenTimeToMinutes = (screenTime) => {
  // Assuming screenTime format is "HH:MM:SS"
  const [hours, minutes, seconds] = screenTime.split(":").map(Number);
  return hours * 60 + minutes + seconds / 60;
};

const fetchNotifications = async (req, res) => {
  try {
    const { userId, model } = req.params;
    
    // Reference to Notifications collection for the specific user and model
    const notificationsRef = ref(database, `${userId}/${model}/Notifications`);

    // Get snapshot of Notifications collection
    const snapshot = await get(notificationsRef);

    if (!snapshot.exists()) {
      console.error("No notifications found.");
      return res.status(404).send("No notifications found.");
    }

    // Extract notifications data from snapshot
    const notifications = [];
    snapshot.forEach((childSnapshot) => {
      const notification = childSnapshot.val();
      notifications.push(notification);
    });

    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).send("Error fetching notifications: " + error.message);
  }
};

const fetchStaticData = async (req, res) => {
  try {
    const { userId, model } = req.params;
    const userRef = ref(database, `${userId}/${model}/Apps/Static`);
    const snapshot = await get(userRef);

    const data = snapshot.val();

    if (!data) {
      res.status(404).send("No static data found for this model.");
      return;
    }

    const staticData = [];
    for (const key in data) {
      const staticString = data[key];
      const staticInfo = parseStaticString(staticString);
      if (staticInfo) {
        staticData.push(staticInfo);
      }
    }

    res.json(staticData);
  } catch (error) {
    console.error("Error fetching static data:", error);
    res.status(500).send("Error fetching static data: " + error.message);
  }
};


const parseStaticString = (staticString) => {
  try {
    if (!staticString) {
      console.error("Static string is undefined or empty");
      return null;
    }

    // Define regex patterns to match the app details
    const appNameRegex = /App Name: ([^\n]+)/;
    const packageNameRegex = /Package Name: ([^\n]+)/;
    const installTimeRegex = /Install Time: ([^\n]+)/;

    // Match the regex patterns with the static string
    const appNameMatch = staticString.match(appNameRegex);
    const packageNameMatch = staticString.match(packageNameRegex);
    const installTimeMatch = staticString.match(installTimeRegex);

    // Check if all required fields are present in the string
    if (!appNameMatch || !packageNameMatch || !installTimeMatch) {
      console.error("Static string does not match expected format:", staticString);
      return null;
    }

    // Extract the matched values and trim any extraneous whitespace
    const appName = appNameMatch[1].trim();
    const packageName = packageNameMatch[1].trim();
    const installTime = installTimeMatch[1].trim();

    // Return the parsed object
    return {
      appName,
      packageName,
      installTime,
    };
  } catch (error) {
    console.error("Error parsing static string:", error);
    return null;
  }
};


const parseAppStringsync = (appString) => {
  try {
    if (!appString) {
      console.error("App string is undefined or empty");
      return null;
    }

    const appNameRegex = /App Name: ([^\n]+)/;
    const packageNameRegex = /Package Name: ([^\n]+)/;
    const installTimeRegex = /Install Time: ([^\n]+)/;

    const appNameMatch = appString.match(appNameRegex);
    const packageNameMatch = appString.match(packageNameRegex);
    const installTimeMatch = appString.match(installTimeRegex);

    if (!appNameMatch || !packageNameMatch || !installTimeMatch) {
      console.error("App string does not match expected format:", appString);
      return null;
    }

    const appName = appNameMatch[1].trim();
    const packageName = packageNameMatch[1].trim();
    const installTime = installTimeMatch[1].trim();

    return {
      appName,
      packageName,
      installTime,
    };
  } catch (error) {
    console.error("Error parsing app string:", error);
    return null;
  }
};

const syncAppData = async (req, res) => {
  try {
    const { userId, model } = req.params;
    const staticRef = ref(database, `${userId}/${model}/Apps/Static`);
    const dynamicRef = ref(database, `${userId}/${model}/Apps/Dynamic`);
    const notificationsRef = ref(database, `${userId}/${model}/Notifications`);

    // Fetch Static and Dynamic data
    const [staticSnapshot, dynamicSnapshot] = await Promise.all([
      get(staticRef),
      get(dynamicRef)
    ]);

    const staticData = staticSnapshot.val() || {};
    const dynamicData = dynamicSnapshot.val() || {};

    // Convert staticData and dynamicData to arrays
    const staticApps = Object.values(staticData);
    const dynamicApps = Object.values(dynamicData);

    // Parse static and dynamic apps
    const parsedStaticApps = staticApps.map(parseAppStringsync).filter(Boolean);
    const parsedDynamicApps = dynamicApps.map(parseAppStringsync).filter(Boolean);

    // Find newly installed apps (in dynamic but not in static)
    const newApps = parsedDynamicApps.filter(
      dynamicApp => !parsedStaticApps.some(
        staticApp => staticApp.packageName === dynamicApp.packageName
      )
    );

    // Find uninstalled apps (in static but not in dynamic)
    const uninstalledApps = parsedStaticApps.filter(
      staticApp => !parsedDynamicApps.some(
        dynamicApp => dynamicApp.packageName === staticApp.packageName
      )
    );

    // Generate notifications for new installs
    for (const app of newApps) {
      await push(notificationsRef, {
        Notification: `${app.appName} is installed.`,
        Date: new Date().toISOString().slice(0, 10)
      });
      // Add new app to Static collection
      await push(staticRef, `App Name: ${app.appName} Package Name: ${app.packageName} Install Time: ${app.installTime} -------------------------`);
    }

    // Generate notifications for uninstalls
    for (const app of uninstalledApps) {
      await push(notificationsRef, {
        Notification: `${app.appName} is uninstalled.`,
        Date: new Date().toISOString().slice(0, 10)
      });
      // Remove uninstalled app from Static collection
      const appKey = Object.keys(staticData).find(
        key => staticData[key].includes(app.packageName)
      );
      if (appKey) {
        await remove(ref(database, `${userId}/${model}/Apps/Static/${appKey}`));
      }
    }

    res.status(200).send("App data synced and notifications generated.");
  } catch (error) {
    console.error("Error syncing app data:", error);
    res.status(500).send("Error syncing app data: " + error.message);
  }
};

module.exports = {
  fetchData,
  fetchModels,
  fetchAppUsage,
  fetchApps,
  fetchCallLogs,
  fetchLocations,
  fetchDataUsage,
  createNotification,
  fetchNotifications,
  fetchStaticData,
  syncAppData
};
