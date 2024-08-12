import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Sidebar from "../../assets/Sidebar.jsx";
import Navbar from "../../assets/Navbar.jsx";
import { Table, Spinner, Form, Button } from "react-bootstrap";
import styled from "styled-components";
import "../../assets/Pages/style.css";
import "./style.css";

const FilterContainer = styled.div`
  max-height: ${(props) => (props.show ? "430px" : "0")};
  overflow: hidden;
  background-color: #F4F4F4;
  transition: max-height 0.8s ease-in-out, padding 0.5s ease-in-out;
  margin-bottom: 1rem;
  padding: ${(props) => (props.show ? "1rem 0" : "0")};
`;

const ToggleButton = styled(Button)`
  background-color: #007bff;
  border-color: #007bff;
  color: white;
  margin-bottom: 10px;
  font-size: 0.875rem;
`;

const ApplyButton = styled(Button)`
  background-color: #007bff;
  border-color: #007bff;
  color: white;
  font-size: 10px;
  padding: 10px;
  width: 100%;
`;

const RemoveButton = styled(Button)`
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
  font-size: 10px;
  padding: 10px;
  width: 100%;
`;

const PaginationContainer = styled.ul`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  .page-item.active .page-link {
    background-color: #007bff;
    border-color: #007bff;
    color: white;
  }
`;

function Calllogs() {
  const [callLogs, setCallLogs] = useState([]);
  const [filteredCallLogs, setFilteredCallLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterByCurrentDate, setFilterByCurrentDate] = useState(false);
  const [filterByOutgoing, setFilterByOutgoing] = useState(false);
  const [filterByIncoming, setFilterByIncoming] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterByMostCalls, setFilterByMostCalls] = useState(false);
  const [filterByNumber, setFilterByNumber] = useState("");
  const recordsPerPage = 200;

  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        const parentId = localStorage.getItem("parentid");
        const childId = localStorage.getItem("childid");

        if (parentId && childId) {
          setLoading(true); // Set loading to true when data fetching starts
          const response = await fetch(`http://localhost:5500/calllogs/${parentId}/${childId}`);
          const data = await response.json();
          setCallLogs(data);
          setFilteredCallLogs(data);
        } else {
          console.error("Parent ID or Child ID not found in local storage.");
        }
      } catch (error) {
        console.error("Error fetching call logs data:", error);
      } finally {
        setLoading(false); // Set loading to false when data is fetched or in case of error
      }
    };

    fetchCallLogs();
  }, []);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCallLogs.slice(indexOfFirstRecord, indexOfLastRecord);

  const convertToAmPm = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(":");
    let suffix = "AM";
    let hour = parseInt(hours, 10);
    if (hour >= 12) {
      suffix = "PM";
      hour -= 12;
    }
    if (hour === 0) {
      hour = 12;
    }
    return `${hour}:${minutes}:${seconds} ${suffix}`;
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filterLogs = () => {
    let filteredLogs = callLogs;

    if (filterByCurrentDate) {
      const currentDate = new Date().toISOString().split("T")[0];
      filteredLogs = filteredLogs.filter((log) => log.date.split(" ")[0] === currentDate);
    }

    if (filterByOutgoing) {
      filteredLogs = filteredLogs.filter((log) => log.type === "Outgoing");
    }

    if (filterByIncoming) {
      filteredLogs = filteredLogs.filter((log) => log.type === "Incoming");
    }

    if (startDate && endDate) {
      filteredLogs = filteredLogs.filter((log) => {
        const logDate = log.date.split(" ")[0];
        return logDate >= startDate && logDate <= endDate;
      });
    }

    if (filterByMostCalls) {
      const callCount = callLogs.reduce((acc, log) => {
        acc[log.number] = (acc[log.number] || 0) + 1;
        return acc;
      }, {});

      const mostCalledNumber = Object.keys(callCount).reduce((a, b) =>
        callCount[a] > callCount[b] ? a : b
      );

      filteredLogs = filteredLogs.filter((log) => log.number === mostCalledNumber);
    }
    

    if (filterByNumber) {
      filteredLogs = filteredLogs.filter((log) => log.number.includes(filterByNumber));
    }

    setFilteredCallLogs(filteredLogs);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  const removeFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilterByCurrentDate(false);
    setFilterByOutgoing(false);
    setFilterByIncoming(false);
    setFilterByMostCalls(false);
    setFilterByNumber("");
    setFilteredCallLogs(callLogs);
    setCurrentPage(1); // Reset to the first page after removing filters
  };

  return (
    <>
      <Navbar />
      <Box height={40} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h3 className="mt-2 title heading text-center text-primary">Call Logs</h3>
          <ToggleButton onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </ToggleButton>
          <FilterContainer show={showFilters}>
            <Form className="mb-3">
              <div className="row">
                <Form.Group controlId="startDate" className="col-md-6">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="endDate" className="col-md-6                ">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="row mt-3">
                <div className="col-sm-6">
                  <Form.Group controlId="filterByCurrentDate" className="col-md-12">
                    <Form.Check
                      type="checkbox"
                      label="Current Date"
                      checked={filterByCurrentDate}
                      onChange={(e) => setFilterByCurrentDate(e.target.checked)}
                    />
                  </Form.Group>
                </div>
                <div className="col-sm-6">
                  <Form.Group controlId="filterByOutgoing" className="col-md-12">
                    <Form.Check
                      type="checkbox"
                      label="Outgoings"
                      checked={filterByOutgoing}
                      onChange={(e) => setFilterByOutgoing(e.target.checked)}
                    />
                  </Form.Group>
                </div>
                <div className="col-sm-6">
                  <Form.Group controlId="filterByIncoming" className="col-md-12">
                    <Form.Check
                      type="checkbox"
                      label="Incomings"
                      checked={filterByIncoming}
                      onChange={(e) => setFilterByIncoming(e.target.checked)}
                    />
                  </Form.Group>
                </div>
                 <div className="col-lg-4">
                  <Form.Group controlId="filterByMostCalls" className="col-md-12">
                    <Form.Check
                      type="checkbox"
                      label="Most Calls"
                      checked={filterByMostCalls}
                      onChange={(e) => setFilterByMostCalls(e.target.checked)}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row mt-3">
               
                <div className="col-sm-12">
                  <Form.Group controlId="filterByNumber" className="col-md-12">
                    <Form.Label>Filter by Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={filterByNumber}
                      onChange={(e) => setFilterByNumber(e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-6">
                  <ApplyButton onClick={filterLogs}>Apply Filters</ApplyButton>
                </div>
                <div className="col-md-6">
                  <RemoveButton onClick={removeFilters}>Remove Filters</RemoveButton>
                </div>
              </div>
            </Form>
          </FilterContainer>
          {loading ? (
            <div className="spinner-container">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <Table hover>
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Number</th>
                    <th>Duration</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((item, index) => (
                    <tr key={index}>
                      <td>{indexOfFirstRecord + index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.number}</td>
                      <td>{item.duration}</td>
                      <td>{item.type}</td>
                      <td>{item.date.split(" ")[0]}</td>
                      <td>{convertToAmPm(item.date.split(" ")[1])}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <PaginationContainer className="pagination">
                {Array.from(
                  { length: Math.ceil(filteredCallLogs.length / recordsPerPage) },
                  (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                    >
                      <button className="page-link" onClick={() => paginate(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  )
                )}
              </PaginationContainer>
            </>
          )}
        </Box>
      </Box>
    </>
  );
}

export default Calllogs;
