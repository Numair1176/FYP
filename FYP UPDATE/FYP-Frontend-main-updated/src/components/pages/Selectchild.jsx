import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import { Spinner } from 'react-bootstrap'; // Import Spinner component
import "./slectchild.css";
import user from "../pics/user.png";

function Selectchild() {
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch parent ID from local storage
        const parentId = localStorage.getItem('parentid');
        if (parentId) {
            // Fetch children data from the API using the parent ID
            fetch(`http://localhost:5500/fetch-models/${parentId}`)
                .then(response => response.json())
                .then(data => {
                    // Update the state with the fetched children data
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

    const handleOpen = (id,name) => {
        const existingChildId = localStorage.getItem('childid');
        const existingChildname = localStorage.getItem('childname');
        if (existingChildId && existingChildname) {
            localStorage.removeItem('childid');
            localStorage.removeItem('childname');
        }
        localStorage.setItem('childid', id);
        localStorage.setItem('childname', name);
    };

    return (
        <>
            <h3 className='mt-5 title heading text-center' style={{color:"#2977d1"}}>Select Child</h3>
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
                                        <h4 className="title1 py-2">Model: {child.model}</h4>
                                    </div>
                                    <ul className="social">
                                        {/* Use Link component to navigate */}
                                        <li><Link to="/Home" onClick={() => handleOpen(child.model,child.childName)}>Open</Link></li>
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default Selectchild;
