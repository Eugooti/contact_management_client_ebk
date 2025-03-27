import { createContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { ConfigProvider, Layout } from "antd";
import logo from "../assets/LOGO.svg";
import ProfileDropdown from "../Components/NavBar/index.jsx";

const NavBarContext = createContext(undefined);

const {  Content, Footer } = Layout;

export const NavBarProvider = () => {
    return (
        <NavBarContext.Provider value={null}>
            <ConfigProvider>
                <Layout>
                    <div
                        className="sticky px-8 top-0 z-50 bg-white/70 backdrop-blur-lg shadow-md flex items-center justify-between"
                    >
                        <div className="flex items-center">
                            <Link to="/" className="flex cursor-pointer items-center">
                                <img src={logo} alt="Company Logo" className="h-12 w-auto" />
                            </Link>
                        </div>
                        <ProfileDropdown />
                    </div>
                    <Content style={{ padding: "0 48px" }}>
                        <Outlet />
                    </Content>
                    <Footer style={{ textAlign: "center" }}>
                        Engineers Board of Kenya ©{new Date().getFullYear()} Created by PDTP
                    </Footer>
                </Layout>
            </ConfigProvider>
        </NavBarContext.Provider>
    );
};

export default NavBarProvider;