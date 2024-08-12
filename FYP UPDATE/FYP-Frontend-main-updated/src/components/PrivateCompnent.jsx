import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateCompnent() {
    const parentid = localStorage.getItem("parentid");
    const childid = localStorage.getItem("childid");
    return (parentid && childid) ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateCompnent;
