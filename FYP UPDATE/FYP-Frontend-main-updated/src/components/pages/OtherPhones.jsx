import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Sidebar from '../../assets/Sidebar.jsx';
import Navbar from '../../assets/Navbar.jsx';
import "../../assets/Pages/style.css";
import user from "../pics/user.png";
import { Link } from 'react-router-dom'; // Import Link component
import { Spinner } from 'react-bootstrap'; // Import Spinner component
import "./slectchild.css";

function OtherPhones() {
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const parentId = localStorage.getItem('parentid');
        if (parentId) {
            
            fetch(`http://localhost:5500/fetch-models/${parentId}`)
                .then(response => response.json())
                .then(data => {
                    setChildren(data);
                    setLoading(false); // Set loading to false when data is fetched
                })
                .catch(error => {
                    console.error('Error fetching children data:', error);
                    setLoading(false); // Set loading to false in case of error
                });
        } else {
            console.error('Parent ID not found in local storage.');
            setLoading(false); // Set loading to false if parent ID is missing
        }
    }, []);

    const handleOpen = async (id,name) => {
        const existingChildId = localStorage.getItem('childid');
        const existingChildname = localStorage.getItem('childname');
        if (existingChildId && existingChildname) {
            localStorage.removeItem('childid');
            localStorage.removeItem('childname');
        }
        localStorage.setItem('childid', id);
        localStorage.setItem('childname', name);
        const parentid = localStorage.getItem("parentid");
        const childid = localStorage.getItem("childid");
        const createNotificationUrl = `http://localhost:5500/create-notification/${parentid}/${childid}`;
        await fetch(createNotificationUrl);
    };

    return (
        <>
            <Navbar />
            <Box height={40} />
            <Box sx={{ display: 'flex' }}>
                <Sidebar />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    {loading ? (
                        <div className="spinner-container">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <div className="container mt-5">
                            <div className="row mt-5">
                                {children.map((child, index) => (
                                    <div className="col-md-4" key={index}>
                                        <div className="our-team">
                                            <div className="picture">
                                                <img className="img-fluid" src={user} alt="user"/>
                                            </div>
                                            <div className="team-content px-5">
                                                <h3 className="name">{child.childName}</h3>
                                                <h4 className="title1 py-2">{child.model}</h4>
                                            </div>
                                            <ul className="social">
                                                <li><Link to="/Home" onClick={() => handleOpen(child.model,child.childName )}>Open</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Box>
            </Box>
        </>
    );
}

export default OtherPhones;
