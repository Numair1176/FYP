import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Sidebar from '../../assets/Sidebar.jsx';
import Navbar from '../../assets/Navbar.jsx';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Spinner from 'react-bootstrap/Spinner';
import "../../assets/Pages/style.css";
import "./style.css";

const convertToAmPm = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(':');
    let suffix = 'AM';
    let hour = parseInt(hours, 10);
    if (hour >= 12) {
        suffix = 'PM';
        hour -= 12;
    }
    if (hour === 0) {
        hour = 12;
    }
    return `${hour}:${minutes}:${seconds} ${suffix}`;
};

function Apppage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);

    useEffect(() => {
        const parentid = localStorage.getItem('parentid');
        const childid = localStorage.getItem('childid');
        const apiUrl = `http://localhost:5500/apps/${parentid}/${childid}`;
        const fallbackApiUrl = `http://localhost:5500/static-apps/${parentid}/${childid}`;

        const fetchData = async () => {
            try {
                const response = await fetch(apiUrl);
                const result = await response.json();
                if (Array.isArray(result) && result.length > 0) {
                    setData(result);
                } else {
                    // Call fallback API if the first API returns empty
                    const fallbackResponse = await fetch(fallbackApiUrl);
                    const fallbackResult = await fallbackResponse.json();
                    setData(fallbackResult);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <Navbar />
            <Box height={40} />
            <Box sx={{ display: 'flex' }}>
                <Sidebar />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <h4 className='mt-2 title heading text-center text-primary'>Apps</h4>
                    {loading ? (
                        <div className="spinner-container">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <>
                            <Table className="table table-hover">
                                <thead className='table-light'>
                                    <tr>
                                        <th>#</th>
                                        <th>App Name</th>
                                        <th>Package Name</th>
                                        <th>Update Date</th>
                                        <th>Update Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((record, index) => (
                                        <tr key={index}>
                                            <td>{indexOfFirstItem + index + 1}</td>
                                            <td>{record.appName}</td>
                                            <td>{record.packageName}</td>
                                            <td>{record.installTime.split(' ')[0]}</td>
                                            <td>{convertToAmPm(record.installTime.split(' ')[1])}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <Pagination>
                                {[...Array(Math.ceil(data.length / itemsPerPage)).keys()].map(number => (
                                    <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                                        {number + 1}
                                    </Pagination.Item>
                                ))}
                            </Pagination>
                        </>
                    )}
                </Box>
            </Box>
        </>
    );
}

export default Apppage;
