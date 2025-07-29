import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../Context/AuthProvider';
import UseAxiosSecure from './UseAxiosSecure';

const UseUserRole = () => {
  const { user, loading } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();

  const { data: role = 'customer', isLoading: isRoleLoading } = useQuery({
    enabled: !!user?.email && !loading,
    queryKey: ['userRole', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      console.log(res)
      return res.data.role;
    },
  });
   
  return { role, isRoleLoading };
};

export default UseUserRole;
