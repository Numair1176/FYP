import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Sidebar from "../../assets/Sidebar.jsx";
import Navbar from "../../assets/Navbar.jsx";
import "../../assets/Pages/style.css";
import Barchart from "../../assets/Charts/Barchart.jsx"; // Updated import to match component name
import Linechart from "../../assets/Charts/Linechart.jsx";

function parseScreenTime(screenTime) {
  const [hours, minutes, seconds] = screenTime.split(":").map(Number);
  return hours * 60 + minutes + seconds / 60;
}

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toFixed(0)}m`;
}

function formatAverageTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toFixed(0)}m/day`;
}

export default function Home() {
  const [userData, setUserData] = useState({
    labels: [],
    datasets: [
      {
        label: "Time-Used (min)",
        data: [],
        backgroundColor: "#80C4FF", // Light blue color
        borderColor: "#80C4FF",
        borderWidth: 1,
      },
    ],
  });

  const [totalScreenTime, setTotalScreenTime] = useState(0);
  const [mostUsedApp, setMostUsedApp] = useState({ name: "", time: "" });
  const [averageScreenTime, setAverageScreenTime] = useState(0);
  const [callsToday, setCallsToday] = useState(0);
  const [dataUsageToday, setDataUsageToday] = useState(0);
  const [dataUsage, setDataUsage] = useState({});

  useEffect(() => {
    const parentid = localStorage.getItem("parentid");
    const childid = localStorage.getItem("childid");
    const apiUrl = `http://localhost:5500/appusage/${parentid}/${childid}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Calculate total screen time
        const totalScreenTime = data.reduce(
          (acc, record) => acc + parseScreenTime(record.ScreenTime),
          0
        );

        // Calculate average screen time
        const numberOfDays = new Set(data.map((record) => record.date)).size; // Assuming 'date' is in the data
        const averageScreenTime = totalScreenTime / numberOfDays;

        // Find the most used app
        const mostUsedApp = data.reduce(
          (max, record) =>
            parseScreenTime(record.ScreenTime) > parseScreenTime(max.ScreenTime)
              ? record
              : max,
          data[0]
        );

        // Sort data by ScreenTime in descending order and take top 10
        const sortedData = data
          .sort(
            (a, b) =>
              parseScreenTime(b.ScreenTime) - parseScreenTime(a.ScreenTime)
          )
          .slice(0, 10);

        // Shuffle the top 10 data to mix their order
        const shuffledData = shuffleArray(sortedData);

        setUserData({
          labels: shuffledData.map((record) => record.appName),
          datasets: [
            {
              label: "Time-Used (min)",
              data: shuffledData.map((record) =>
                parseScreenTime(record.ScreenTime)
              ),
              backgroundColor: "#80C4FF", // Light blue color
              borderColor: "#80C4FF",
              borderWidth: 1,
            },
          ],
        });

        setTotalScreenTime(totalScreenTime);
        setMostUsedApp({
          name: mostUsedApp.appName,
          time: formatTime(parseScreenTime(mostUsedApp.ScreenTime)),
        });
        setAverageScreenTime(averageScreenTime);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const parentId = localStorage.getItem("parentid");
    const childId = localStorage.getItem("childid");
    const apiUrl = `http://localhost:5500/calllogs/${parentId}/${childId}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const today = new Date().toISOString().split("T")[0];
        const callsToday = data.filter((record) =>
          record.date.startsWith(today)
        ).length;
        setCallsToday(callsToday);
      })
      .catch((error) => console.error("Error fetching call logs:", error));
  }, []);

  useEffect(() => {
    const parentId = localStorage.getItem("parentid");
    const childId = localStorage.getItem("childid");
    const apiUrl = `http://localhost:5500/data-usage/${parentId}/${childId}`;
  
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data Usage API response:", data); // Log the data to see its structure
        if (Array.isArray(data) && data.length > 0) {
          const lastFiveRecords = data.slice(-5); // Get the last 5 records
          const usageData = lastFiveRecords[0]; // Assuming the first entry contains the usage data
          const today = new Date().toISOString().split("T")[0];
          const todayUsage = usageData[today];
  
          if (todayUsage) {
            setDataUsageToday(todayUsage);
          } else {
            setDataUsageToday("0 MB"); // No data usage found for today
          }
        } else {
          setDataUsageToday("0 MB"); // No data usage found
        }
      })
      .catch((error) => console.error("Error fetching data usage:", error));
  }, []);
  

  useEffect(() => {
    const parentId = localStorage.getItem("parentid");
    const childId = localStorage.getItem("childid");
    const apiUrl = `http://localhost:5500/data-usage/${parentId}/${childId}`;
  
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Data Usage API response:", data); // Log the data to see its structure
        
        if (Array.isArray(data) && data.length > 0) {
          const usageData = data[0]; // Extract the data from the array
          if (usageData && typeof usageData === 'object') {
            const dates = Object.keys(usageData).sort((a, b) => new Date(b) - new Date(a)); // Sort dates in descending order
            const lastFourDays = dates.slice(0, 5); // Get the last 4 days
            const lastFourData = lastFourDays.reduce((obj, date) => {
              obj[date] = usageData[date];
              return obj;
            }, {});
            setDataUsage(lastFourData);
          } else {
            console.error("Unexpected data format:", usageData);
            setDataUsage({}); // Set empty data if the format is unexpected
          }
        } else {
          console.error("No data found or data is not an array");
          setDataUsage({}); // Set empty data if no valid data found
        }
      } catch (error) {
        console.error("Error fetching data usage:", error);
      }
    };
  
    fetchData();
  }, []);
  
  
  

  return (
    <div>
      <Navbar />
      <Box height={40} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <div className="container-fluid chart-con mt-4">
            <div className="row mt-4">
              <div className="col-lg-3 col-sm-3">
                <div className="card mt-3 top-cards">
                  <div className="card-body">
                    <h5 style={{ color: "#1976d2" }}>
                      <b>Total Screen Time</b>
                    </h5>
                    <h5>
                      <b className="text-secondary">
                        {formatTime(totalScreenTime)}
                      </b>
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-3">
                <div className="card mt-3 top-cards">
                  <div className="card-body">
                    <h4 style={{ color: "#1976d2" }}>
                      <b>Most Used App</b>
                    </h4>
                    <h5>
                      <b className="text-secondary">
                        {mostUsedApp.name} ({mostUsedApp.time})
                      </b>
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-3">
                <div className="card mt-3 top-cards">
                  <div className="card-body">
                    <h4 style={{ color: "#1976d2" }}>
                      <b>Number of Calls</b>
                    </h4>
                    <h5>
                      <b className="text-secondary">{callsToday}</b>
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-3">
                <div className="card mt-3 top-cards">
                  <div className="card-body">
                    <h4 style={{ color: "#1976d2" }}>
                      <b>Data Usage</b>
                    </h4>
                    <h5>
                      <b className="text-secondary">{dataUsageToday}</b>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-sm-6 text-center ">
                <div className="card">
                  <div
                    className="card-header"
                    style={{ backgroundColor: "#1976d2", color: "white" }}
                  >
                    Screen Time
                  </div>
                  <div className="card-body">
                    <Barchart chartdata={userData} />
                  </div>
                </div>
              </div>
              <div className="col-sm-6 text-center">
                <div className="card">
                  <div
                    className="card-header"
                    style={{ backgroundColor: "#1976d2", color: "white" }}
                  >
                    Data Usage
                  </div>
                  <div className="card-body">
                    <Linechart data={dataUsage} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </div>
  );
}
