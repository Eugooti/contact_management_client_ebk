import React, { lazy, Suspense } from "react";
import {Routes,Route} from 'react-router-dom'

const ContactManagement = lazy(() => import("./ContactsManagement.jsx"));
const Login = lazy(() => import("./Auth/Login.jsx"));
const ProtectedRoutesContext = lazy(() => import("../context/ProtectedRoutesContext.jsx"));
const PublicOrganization = lazy(() => import("./CreateOrganization/PublicOrganization/Index.jsx"));
const PrivateOrganization = lazy(() => import("./CreateOrganization/PrivateOrganization/index.jsx"));
const CreateUser = lazy(() => import("./Users/CreateUser.jsx"));
const Unauthorized = lazy(() => import("./Auth/Unauthorized.jsx"));
import {NavBarProvider} from "../context/NavBarContext.jsx";
import {Button, Result} from "antd";


// Loading component
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
);

// Error boundary component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <>
                    <Result
                        status="500"
                        title="500"
                        subTitle="Sorry, something went wrong."
                        extra={<Button onClick={() => window.location.reload()} type="primary">Reload Page</Button>}
                    />
                </>
            );
        }

        return this.props.children;
    }
}

const Pages = () => {
  return (
      <>

          <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                      <Route exact path='/login' element={<Login/>}/>
                      <Route path="/unauthorised" element={ <Unauthorized/> } />

                      <Route element={<ProtectedRoutesContext allowedRoles={["ADMIN","USER"]}/>}>
                          <Route element={<NavBarProvider/>}>
                              <Route element={<ProtectedRoutesContext allowedRoles={["ADMIN","USER"]}/>}>
                                  <Route exact path="/" element={<ContactManagement/>}/>
                              </Route>
                              <Route element={<ProtectedRoutesContext allowedRoles={["ADMIN"]}/>}>
                                  <Route exact path='/private' element={<PrivateOrganization/>}/>
                                  <Route exact path='/public' element={<PublicOrganization/>}/>
                                  <Route exact path='/new_user' element={<CreateUser/>}/>
                              </Route>
                          </Route>
                      </Route>


                  </Routes>
              </Suspense>
          </ErrorBoundary>
      </>
  )
}

export default Pages