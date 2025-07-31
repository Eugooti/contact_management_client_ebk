import {
    Avatar,
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    Form,
    Input,
    message,
    Row,
    Space,
    Tag,
    Typography
} from 'antd';
import {
    CalendarOutlined,
    CloseOutlined,
    CrownOutlined,
    EditOutlined,
    MailOutlined,
    PhoneOutlined,
    UserOutlined
} from '@ant-design/icons';
import {BriefcaseIcon} from "@heroicons/react/16/solid/index.js";
import {getFromSessionStorage} from "../../utils/SessionStorage/sessionStorage.js";
import {useState} from "react";
import {useForm} from "antd/es/form/Form.js";
import {useDispatch} from "react-redux";
import {updatePassword} from "../../Redux/Reducers/AuthSlice.js";

const { Title, Text } = Typography;

const UserProfile = () => {
    const user = getFromSessionStorage('user')
    const [changePassword, setChangePassword] = useState(false);
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const roleColors = {
        admin: 'bg-red-100 text-red-800 border-red-200',
        user: 'bg-blue-100 text-blue-800 border-blue-200',
        manager: 'bg-green-100 text-green-800 border-green-200'
    };

    const roleIcons = {
        admin: <CrownOutlined className="mr-1" />,
        user: <UserOutlined className="mr-1" />,
        manager: <BriefcaseIcon className="mr-1" />
    };

    const userData = {
        ...user.responseData
    }

    const [form] = useForm();

    const onFormFinish = (values) => {
        // todo handle form finish
        const data = {
            password:values.oldPassword,
            newPassword:values.newPassword,
        }
        dispatch(updatePassword({data,id:userData.id})).then((action) => {
            action.error?
                messageApi.error(action.payload.message):
                messageApi.success(action.payload.message).then(() => {
                    setChangePassword(false)
                })
        })
    };

    const rules = {
        password: [{required:true,message:"Required field"}],
        newPassword:[{required:true,message:"Required field"},{min:8,message: "Must contain at least 8 characters"}],
        confirmPassword:[{required:true,message:"Required field"},
            ({ getFieldValue }) => ({
                validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                },
            })
        ],
    };


    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            {contextHolder}
            <Card
                bordered={false}
                className="w-full shadow-md rounded-xl overflow-hidden border border-gray-100"
            >
                {/* Profile Header */}
                <Row gutter={[24, 16]} className="mb-6">
                    <Col xs={24} sm={8} md={6} className="flex justify-center">
                        <Avatar
                            size={120}
                            className="bg-blue-500 text-white text-4xl font-bold flex items-center justify-center shadow-sm"
                        >
                            <h1 className='text-5xl font-bold text-black'>
                                {userData?.initials}
                            </h1>
                        </Avatar>
                    </Col>

                    <Col xs={24} sm={16} md={18}>
                        <Space direction="vertical" className="w-full">
                            <div className="flex flex-wrap items-center gap-3">
                                <Title level={3} className="m-0">
                                    {userData?.name}
                                </Title>
                                <Tag
                                    icon={roleIcons[userData?.role.toLowerCase()] || <UserOutlined />}
                                    className={`${roleColors[userData?.role.toLowerCase()] || 'bg-gray-100 text-gray-800'} 
                    rounded-full px-4 py-1 border inline-flex items-center capitalize`}
                                >
                                    {userData?.role}
                                </Tag>
                            </div>

                            <Text type="secondary" className="text-lg">
                                {userData?.designation}
                            </Text>

                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={()=>setChangePassword(true)}
                                className="rounded-full w-fit mt-2"
                            >
                                Change Password
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Divider className="my-4" />

                {/* Main Content */}
                <Row gutter={[24, 16]}>
                    <Col xs={24} md={12}>
                        <Card
                            title="Contact Information"
                            bordered={false}
                            className="shadow-sm rounded-lg"
                        >
                            <Descriptions column={1} className="w-full">
                                <Descriptions.Item
                                    label={
                                        <span className="flex items-center text-gray-600">
                      <MailOutlined className="mr-2" /> Email
                    </span>
                                    }
                                >
                                    <Text className="text-gray-800">{userData?.email}</Text>
                                </Descriptions.Item>

                                <Descriptions.Item
                                    label={
                                        <span className="flex items-center text-gray-600">
                      <PhoneOutlined className="mr-2" /> Phone
                    </span>
                                    }
                                >
                                    <Text className="text-gray-800">
                                        {userData?.phoneNumber || 'Not provided'}
                                    </Text>
                                </Descriptions.Item>

                            </Descriptions>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card
                            title="Professional Details"
                            bordered={false}
                            className="shadow-sm rounded-lg"
                        >
                            <Descriptions column={1}>

                                <Descriptions.Item
                                    label={
                                        <span className="flex items-center text-gray-600">
                                            <UserOutlined className="mr-2" /> Position
                                        </span>
                                    }
                                >
                                    <Text className="text-gray-800">{userData?.designation}</Text>
                                </Descriptions.Item>

                                <Descriptions.Item
                                    label={
                                        <span className="flex items-center text-gray-600">
                                            <CalendarOutlined className="mr-2" /> Joined
                                        </span>
                                    }
                                >
                                    <Text className="text-gray-800">{userData?.joined}</Text>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                </Row>

                {/* Additional Info Section */}
                <Card
                    title="About"
                    bordered={false}
                    className="mt-6 shadow-sm rounded-lg"
                >
                    <Text className="text-gray-700">
                        I work Hard.
                    </Text>
                </Card>
                {changePassword&&
                    <div className='flex justify-center mt-6'>
                        <Card title="Change Passord" extra={<Button onClick={()=>setChangePassword(false)} type="dashed" shape="circle" icon={<CloseOutlined/>}/>} style={{ width: 500 }}>

                            <Form
                                form={form}
                                name="updatePassword"
                                layout="vertical"
                                initialValues={{remember: true}}
                                onFinish={onFormFinish}
                            >


                                <Form.Item label="Old Password" name="oldPassword" rules={rules.password}>
                                    <Input.Password size="large" />
                                </Form.Item>

                                <Form.Item label="New Password" name="newPassword" rules={rules.newPassword}>
                                    <Input.Password size="large" />
                                </Form.Item>

                                <Form.Item
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    rules={rules.confirmPassword}
                                >
                                    <Input.Password size="large" />
                                </Form.Item>


                                <Button size={"large"} htmlType={'submit'} type="primary" block>
                                    Update Password
                                </Button>

                            </Form>
                        </Card>
                    </div>

                }


            </Card>
        </div>
    );
};

export default UserProfile;