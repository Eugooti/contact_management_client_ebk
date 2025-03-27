import {Routes,Route} from 'react-router-dom'
import ContactManagement from "./ContactsManagement.jsx";
import Ministry from "./NewContact/ministry.jsx";
import NewPrivateOrganization from "./NewContact/NewPrivateOrganization.jsx";
import NewParastatal from "./NewContact/GVTParastatal.jsx";
import ContactsDetails from "./ContactDetails/ContactsDetails.jsx";
import Login from "./Auth/Login.jsx";
import {NavBarProvider} from "../context/NavBarContext.jsx";
import ProtectedRoutesContext from "../context/ProtectedRoutesContext.jsx";
import PublicOrganization from "./CreateOrganization/PublicOrganization/Index.jsx";
import PrivateOrganization from "./CreateOrganization/PrivateOrganization/index.jsx";

const Pages = () => {
  return (
      <>
          <Routes>
              <Route exact path='/login' element={<Login/>}/>

              <Route element={<ProtectedRoutesContext/>}>
                  <Route element={<NavBarProvider/>}>
                      <Route exact path="/" element={<ContactManagement/>}/>
                      {/*<Route exact path="/ministry" element={<Ministry/>}/>*/}
                      {/*<Route exact path="/private" element={<NewPrivateOrganization/>}/>*/}
                      {/*<Route exact path="/state-corporation" element={<NewParastatal/>}/>*/}
                      {/*<Route exact path="/details" element={<ContactsDetails/>}/>*/}
                      <Route exact path='/private' element={<PrivateOrganization/>}/>
                      <Route exact path='/public' element={<PublicOrganization/>}/>
                  </Route>
              </Route>


          </Routes>
      </>
  )
}

export default Pages