import { useForm } from "antd/es/form/Form.js";
import { Form, Input, message, Select, Button, Card, Divider } from "antd";
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Work as WorkIcon,
    Phone as PhoneIcon,
    Badge as BadgeIcon,
} from '@mui/icons-material';
import { useDispatch } from "react-redux";
import { createUser } from "../../Redux/Reducers/usersSlice.js";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../../Components/Headings/SectionHeading.jsx";
import { motion } from "framer-motion";

const CreateUser = () => {
    const [form] = useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onFormFinish = async (values) => {
        setIsSubmitting(true);
        try {
            const action = await dispatch(createUser(values));
            if (action.error) {
                messageApi.error(action.payload.message);
            } else {
                messageApi.success(action.payload.message);
                setTimeout(() => navigate('/'), 1500); // Delay for user to see success message
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const rules = {
        email: [
            { required: true, message: 'Email is required' },
            {
                pattern: /^[a-zA-Z0-9._%+-]+@ebk\.go\.ke$/,
                message: 'Please use your official EBK email (@ebk.go.ke)'
            }
        ],
        phoneNumber: [
            { required: true, message: 'Phone number is required' },
            {
                pattern: /^[0-9]{10}$/,
                message: 'Please enter a valid 10-digit phone number'
            }
        ],
        required: [{ required: true, message: 'This field is required' }]
    };

    const roles = [
        { label: "Administrator", value: 'ADMIN' },
        { label: "Standard User", value: 'USER' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {contextHolder}
            <div className="p-4 md:p-6 lg:p-8">
                <SectionHeader
                    title="Create New User"
                    description="Add a new system user with appropriate permissions"
                />

                <Card className="shadow-md rounded-lg">
                    <Form
                        form={form}
                        name="new-user"
                        layout="vertical"
                        onFinish={onFormFinish}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                                    <PersonIcon className="text-blue-500" />
                                    Personal Information
                                </h3>

                                <Form.Item
                                    label="First Name"
                                    name="firstName"
                                    rules={rules.required}
                                >
                                    <Input
                                        prefix={<PersonIcon className="text-gray-400" />}
                                        size="large"
                                        placeholder="Enter first name"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Last Name"
                                    name="lastName"
                                    rules={rules.required}
                                >
                                    <Input
                                        prefix={<PersonIcon className="text-gray-400" />}
                                        size="large"
                                        placeholder="Enter last name"
                                    />
                                </Form.Item>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                                    <BadgeIcon className="text-blue-500" />
                                    Contact Information
                                </h3>

                                <Form.Item
                                    label="Email Address"
                                    name="email"
                                    rules={rules.email}
                                    help="Must be an @ebk.go.ke email"
                                >
                                    <Input
                                        prefix={<EmailIcon className="text-gray-400" />}
                                        size="large"
                                        placeholder="username@ebk.go.ke"
                                        type="email"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Phone Number"
                                    name="phoneNumber"
                                    rules={rules.phoneNumber}
                                    help="10 digits without spaces or special characters"
                                >
                                    <Input
                                        prefix={<PhoneIcon className="text-gray-400" />}
                                        size="large"
                                        placeholder="07XXXXXXXX"
                                        maxLength={10}
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <Divider className="my-6" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Professional Information */}
                            <Form.Item
                                label="Designation"
                                name="designation"
                                rules={rules.required}
                            >
                                <Input
                                    prefix={<WorkIcon className="text-gray-400" />}
                                    size="large"
                                    placeholder="Enter job title"
                                />
                            </Form.Item>

                            <Form.Item
                                label="User Role"
                                name="role"
                                rules={rules.required}
                            >
                                <Select
                                    placeholder="Select user role"
                                    size="large"
                                    options={roles}
                                    optionFilterProp="label"
                                    showSearch
                                />
                            </Form.Item>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <Button
                                htmlType="submit"
                                size="large"
                                type="primary"
                                loading={isSubmitting}
                                className="min-w-[180px] h-12 font-medium"
                            >
                                {isSubmitting ? 'Creating User...' : 'Create User'}
                            </Button>
                        </div>
                    </Form>
                </Card>
            </div>
        </motion.div>
    );
};

export default CreateUser;