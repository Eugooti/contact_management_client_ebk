import { createContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { ConfigProvider, Layout, Divider, Row, Col } from "antd";
import logo from "../assets/LOGO.svg";
import ProfileDropdown from "../Components/NavBar/index.jsx";

const NavBarContext = createContext(undefined);

const { Content, Footer } = Layout;

export const NavBarProvider = () => {
    return (
        <NavBarContext.Provider value={null}>
            <ConfigProvider>
                <Layout>
                    <div className="sticky px-8 top-0 z-50 bg-white/70 backdrop-blur-lg shadow-md flex items-center justify-between">
                        <div className="flex items-center">
                            <Link to="/" className="flex cursor-pointer items-center">
                                <img src={logo} alt="Company Logo" className="h-12 w-auto" />
                            </Link>
                        </div>
                        <ProfileDropdown />
                    </div>
                    <Content style={{ padding: "0 48px", minHeight: '75vh' }}>
                        <Outlet />
                    </Content>
                    <Footer style={{
                        background: '#f0f2f5',
                        padding: '24px 48px',
                        borderTop: '1px solid #e8e8e8'
                    }}>
                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={24} md={8}>
                                <div style={{ textAlign: 'left' }}>
                                    <img src={logo} alt="Company Logo" style={{ height: '40px', marginBottom: '16px' }} />
                                    <p style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
                                        Engineers Board of Kenya - Regulating the engineering profession for excellence and integrity.
                                    </p>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <div style={{ textAlign: 'left' }}>
                                    <h3 style={{ color: 'rgba(0, 0, 0, 0.85)', marginBottom: '16px' }}>Quick Links</h3>
                                    <p><Link to="/" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>Home</Link></p>
                                    <p><Link to="/new_user" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>New User</Link></p>
                                    <p><Link to="/public" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>New Public Contact</Link></p>
                                    <p><Link to="/private" style={{ color: 'rgba(0, 0, 0, 0.65)' }}>New Private Contact</Link></p>
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <div style={{ textAlign: 'left' }}>
                                    <h3 style={{ color: 'rgba(0, 0, 0, 0.85)', marginBottom: '16px' }}>Contact Info</h3>
                                    <p style={{ color: 'rgba(0, 0, 0, 0.65)' }}>Email: info@ebk.or.ke</p>
                                    <p style={{ color: 'rgba(0, 0, 0, 0.65)' }}>Phone: +254 700 000000</p>
                                    <p style={{ color: 'rgba(0, 0, 0, 0.65)' }}>Nairobi, Kenya</p>
                                </div>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '16px 0' }} />
                        <div style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.45)' }}>
                            Engineers Board of Kenya ©{new Date().getFullYear()} - Created by PDTP
                        </div>
                    </Footer>
                </Layout>
            </ConfigProvider>
        </NavBarContext.Provider>
    );
};

export default NavBarProvider;