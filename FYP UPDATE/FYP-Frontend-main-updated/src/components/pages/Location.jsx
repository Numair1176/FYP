import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Map, Marker } from "pigeon-maps";
import { FaMapMarkerAlt } from "react-icons/fa"; // Import the map marker icon
import Navbar from "../../assets/Navbar.jsx";
import Sidebar from "../../assets/Sidebar.jsx";
import "../../assets/Pages/style.css";

import { Table, Spinner, Form, Button } from "react-bootstrap";

function Location() {
  const [locationData, setLocationData] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [locationDatafull, setLocationDatafull] = useState([]);
  const [detailedLocationName, setDetailedLocationName] = useState("");

  useEffect(() => {
    const parentid = localStorage.getItem("parentid");
    const childid = localStorage.getItem("childid");

    const apiUrl = `http://localhost:5500/locations/${parentid}/${childid}`;

    const fetchLocation = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setLocationDatafull(data[0]);
        setLocationData(data[0][data[0].length - 1]); // Assuming the API returns only one location object
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocation();
  }, []);

  const fetchLocationName = async () => {
    if (!locationData) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${locationData.latitude}&lon=${locationData.longitude}&format=json`
      );
      const data = await response.json();
      setLocationName(data.display_name);
      setDetailedLocationName(data.address);
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
  };

  useEffect(() => {
    fetchLocationName();
  }, [locationData]);

  const parseTimeAndDate = (dateTime) => {
    const dateObj = new Date(dateTime);
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    return { date, time };
  };

  const handleMapIconClick = (item) => {
    setLocationData(item);
  };

  return (
    <>
      <Navbar />
      <Box height={40} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <br />
          <div className="location-con">
            <h5 className="text-center location-head">Location</h5>
            {locationData && (
              <div className="map-con">
                <Map
                  className="location-map"
                  style={{ borderRadius: 20 }}
                  height={400}
                  defaultCenter={[
                    parseFloat(locationData.latitude),
                    parseFloat(locationData.longitude),
                  ]}
                  defaultZoom={16}
                  center={[
                    parseFloat(locationData.latitude),
                    parseFloat(locationData.longitude),
                  ]}
                >
                  <Marker
                    anchor={[
                      parseFloat(locationData.latitude),
                      parseFloat(locationData.longitude),
                    ]}
                    payload={1}
                  />
                </Map>
              </div>
            )}
          </div>

          {locationData && (
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <div className="loc-time-con">
                <b style={{color:"#1976d2"}}>Time:</b> {parseTimeAndDate(locationData.time).time}
              </div>
              <div>
                <b style={{color:"#1976d2"}}>Date:</b> {parseTimeAndDate(locationData.time).date}
              </div>
              <div>
                <b style={{color:"#1976d2"}}>Latitude:</b> {locationData.latitude}
              </div>
              <div>
                <b style={{color:"#1976d2"}}>Longitude:</b> {locationData.longitude}
              </div>
              {locationName && (
                <div>
                  <b style={{color:"#1976d2"}}>Location Name:</b> {locationName}
                </div>
              )}
            </div>
          )}
          <div className="loction-data mt-5">
          <h4 className="mt-2 title heading text-center text-primary">
           Previous Locations
          </h4>
            <Table hover>
              <thead className="table-light">
                <tr>
                  <th>Longitude</th>
                  <th>Latitude</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Map</th>
                </tr>
              </thead>
              <tbody>
                {locationDatafull.map((item, index) => (
                  <tr key={index}>
                    <td>{item.longitude}</td>
                    <td>{item.latitude}</td>
                    <td>{parseTimeAndDate(item.time).date}</td>
                    <td>{parseTimeAndDate(item.time).time}</td>
                    <td>
                      <FaMapMarkerAlt
                        style={{ cursor: "pointer", color:"#1976d2" }}
                        onClick={() => handleMapIconClick(item)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Box>
      </Box>
    </>
  );
}

export default Location;
