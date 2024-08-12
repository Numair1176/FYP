import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Sidebar from '../../assets/Sidebar.jsx';
import Navbar from '../../assets/Navbar.jsx';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Spinner from 'react-bootstrap/Spinner';
import "../../assets/Pages/style.css";
import "./style.css";

function Datausage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);

    useEffect(() => {
        const parentid = localStorage.getItem('parentid');
        const childid = localStorage.getItem('childid');
        const apiUrl = `http://localhost:5500/data-usage/${parentid}/${childid}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Modify data structure
                const formattedData = Object.entries(data[0]).map(([date, usage]) => ({
                    date: date.trim(), // Remove extra whitespace
                    usage: usage.replace('and', '').trim() // Remove 'and' and extra whitespace
                }));
                setData(formattedData.reverse()); // Reverse the data array
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
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
                    <h4 className='mt-2 title heading text-center text-primary'>Data Usage</h4>
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
                                        <th>Date</th>
                                        <th>Data Usage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((record, index) => (
                                        <tr key={index}>
                                            <td>{data.length - (indexOfFirstItem + index)}</td> {/* Displaying index in reverse order */}
                                            <td>{record.date}</td>
                                            <td>{record.usage}</td>
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

export default Datausage;
