import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import UseUserRole from '../Hooks/UseUserRole';
import { Navigate, useLocation } from 'react-router';
import Loading from '../Components/Loading';

const AgentRoute = ({children}) => {
    const {user,loading} = useContext(AuthContext)
    const{role,isRoleLoading} = UseUserRole()
    const location = useLocation()

    if(loading || isRoleLoading){
        return <Loading></Loading>
    }
    if(!user || role !=='agent'){
        return <Navigate state={location.pathname} to={'/forbidden'}></Navigate>
    }
    
    
    
    
    return children
};

export default AgentRoute;