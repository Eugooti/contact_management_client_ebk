import {Navigate, Outlet, useLocation} from "react-router-dom";
import {getFromSessionStorage} from "../utils/SessionStorage/sessionStorage.js";

// eslint-disable-next-line react/prop-types
const ProtectedRoutesContext = ({allowedRoles =[]}) => {
  const user = getFromSessionStorage('user');
  const location = useLocation();

  const userRole = user?.responseData?.role;

  return (
      user?
          allowedRoles.includes(userRole)?
              <Outlet/>:
              <Navigate to={'/unauthorised'} state={{from:location}} replace={true}/>
          :
          <Navigate to={'/login'} state={{from:location}} replace={true} />
  )
}

export default ProtectedRoutesContext;