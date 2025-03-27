import {Navigate, Outlet, useLocation} from "react-router-dom";
import {getFromSessionStorage} from "../utils/SessionStorage/sessionStorage.js";

const ProtectedRoutesContext = () => {
  const user = getFromSessionStorage('user');
  const location = useLocation();

  return (
      user?<Outlet/>:
          <Navigate to={'/login'} state={{from:location}} replace={true} />
  )
}

export default ProtectedRoutesContext;