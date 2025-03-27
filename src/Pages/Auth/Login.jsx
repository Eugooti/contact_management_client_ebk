import  { useState } from "react";
import { useForm } from "antd/es/form/Form.js";
import AuthImage from '../../assets/LOGO.svg';
import { Button, Checkbox, Form, Input, message, Spin } from "antd";
import KeyIcon from '@mui/icons-material/Key';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../Redux/Reducers/AuthSlice.js";
import { useNavigate } from "react-router-dom";
import {setSessionStorage} from "../../utils/SessionStorage/sessionStorage.js";

const Login = () => {
    const [form] = useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading: reduxLoading } = useSelector((state) => state.auth); // Renamed to avoid conflict
    const [localLoading, setLocalLoading] = useState(false); // Local loading state

    const onFormFinish = async (values) => {
        setLocalLoading(true); // Start local loading

        try {
            // Simulate a 2-second delay
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const action = await dispatch(login(values));
            if (action.error) {
                messageApi.error(action.payload.message);
            } else {
                messageApi.success(action.payload.message);
                setSessionStorage('user', action.payload);
                setSessionStorage('authToken',action.payload.authorization.authToken)
                setSessionStorage('refreshToken',action.payload.authorization.refreshToken)
                navigate('/');
            }
        } catch (error) {
            messageApi.error('An error occurred during login.');
        } finally {
            setLocalLoading(false); // Stop local loading
        }
    };

    const rules = {
        username: [
            { required: true, message: 'Required field' },
            { pattern: /^[a-zA-Z0-9._%+-]+@ebk\.go\.ke$/, message: 'Invalid username.' }
        ],
        password: [{ required: true, message: 'Required field' }]
    };

    return (
        <div className="grid md:grid-cols-2 sm:grid-cols-1 w-full h-screen transition-colors duration-300">
            {contextHolder}
            {/* Auth Image Section */}
            <div className="hidden flex-col md:flex items-center justify-center themeBg">
                <img
                    src={AuthImage}
                    alt="Login illustration"
                    className="max-w-md"
                />
                <div>
                    <label className='text-2xl font-bold font-sans'>Smart Contact Managemet Service</label>
                </div>
            </div>

            {/* Login Form Section */}
            <div className="flex items-center justify-center">
                <Spin spinning={localLoading || reduxLoading} style={{color:'#5A862E'}} tip="Signing in..." size="large">
                    <div className="p-8 rounded-lg shadow-md w-96">
                        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back!</h2>
                        <p className="text-center mb-6">Sign In</p>
                        <Form
                            form={form}
                            name="login"
                            layout="vertical"
                            initialValues={{ remember: true }}
                            onFinish={onFormFinish}
                        >
                            <Form.Item rules={rules.username} label="Username" name="username">
                                <Input prefix={<PersonOutlineIcon className="site-form-item-icon" />} size="large" />
                            </Form.Item>
                            <Form.Item rules={rules.password} label="Password" name="password">
                                <Input.Password prefix={<KeyIcon className="site-form-item-icon" />} size="large" />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Keep me logged in</Checkbox>
                                </Form.Item>
                                <a className="login-form-forgot float-right" href="">
                                    Forgot password?
                                </a>
                            </Form.Item>
                            <div>
                                <Button
                                    type="primary"
                                    style={{ background: "#5A862E" }}
                                    loading={localLoading || reduxLoading}
                                    htmlType="submit"
                                    className="h-10 w-full rounded-lg text-white text-lg hover:hoverBg"
                                >
                                    {localLoading || reduxLoading ? "Signing in...." : "Sign in"}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Spin>
            </div>
        </div>
    );
};

export default Login;