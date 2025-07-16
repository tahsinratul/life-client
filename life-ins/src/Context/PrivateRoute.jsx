import React, { use } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = use(AuthContext);
    const location = useLocation();

    if (loading) {
        return <span className="loading loading-spinner loading-xl mx-auto flex justify-center"></span>;
    }

    if (user) {
        return children;
    }

    return (<>
    <Navigate to="/login" state={{ from: location }} replace />
    </>);
};

export default PrivateRoute;
