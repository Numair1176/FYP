import React, { useState, useEffect } from "react";
import Navbar from "../../assets/Navbar.jsx";
import "../../assets/Pages/style.css";
import Sidebar from "../../assets/Sidebar.jsx";
import avatar2 from "../../assets/extra/avatar2.jpeg";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const parentid = localStorage.getItem("parentid");
        const childid = localStorage.getItem("childid");
        const apiUrl = `http://localhost:5500/notifications/${parentid}/${childid}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Filter out duplicate notifications
        const uniqueNotifications = filterUniqueNotifications(data);

        // Filter notifications by today's date
        const today = new Date().toISOString().split('T')[0];
        const todayNotifications = uniqueNotifications.filter(notification => notification.Date === today);

        // Format the notifications
        const formattedNotifications = todayNotifications.map(notification => ({
          ...notification,
          Notification: formatNotification(notification.Notification)
        }));

        setNotifications(formattedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Function to filter unique notifications based on Date and Notification
  const filterUniqueNotifications = (data) => {
    const uniqueNotifications = [];
    const notificationMap = {};
    data.forEach((notification) => {
      const key = `${notification.Date}_${notification.Notification}`;
      if (!notificationMap[key]) {
        notificationMap[key] = true;
        uniqueNotifications.push(notification);
      }
    });
    return uniqueNotifications;
  };

  // Function to format the notification text
  const formatNotification = (notificationText) => {
    const appNameRegex = /^(.*?)Package Name/;
    const match = notificationText.match(appNameRegex);
    if (match) {
      return `${match[1].trim()} is ${notificationText.includes('uninstalled') ? 'uninstalled' : 'installed'}.`;
    }
    return notificationText;
  };

  // Function to format date from "YYYY-MM-DD" to "DD-MM-YYYY"
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  return (
    <>
      <Navbar />
      <div style={{ height: 40 }} />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flexGrow: 1, padding: 24 }}>
          <div className="container-fluid notification-con mt-4">
            {notifications.map((notification, index) => (
              <div className="row mt-2" key={index}>
                <div className="col-lg-12">
                  <div className="notification">
                    <div className="notify">
                      <img src={avatar2} alt="" />
                      <h5 className="px-4">{notification.Notification}</h5>
                    </div>
                    <div className="notitime">
                      <h6>{formatDate(notification.Date)}</h6>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
