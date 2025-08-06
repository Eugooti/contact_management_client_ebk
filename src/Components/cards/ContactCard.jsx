import { Avatar, Button, Collapse, Form, Input, message, Popover, Tag, Tooltip } from "antd";
import {
    CaretRightOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {Home, LocationOn, Mail, Phone, Send, Work} from "@mui/icons-material";
import { useForm } from "antd/es/form/Form.js";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { sendContact } from "../../Redux/Reducers/sendContactSlice.js";
import { getFromSessionStorage } from "../../utils/SessionStorage/sessionStorage.js";
import AddPersonContactModal from "../Modals/AddPersonContactModal.jsx";
import { deleteContact } from "../../Redux/Reducers/contactPersonSlice.js";
import JobsModel from "../Modals/JobsModel.jsx";

const ContactCard = ({ data, onFabToggle, isFabActive }) => {
    const [form] = useForm();
    const [isHovered, setIsHovered] = useState(false);
    const fabRef = useRef(null);
    const [openIndex, setOpenIndex] = useState(null);
    const [sendingIndex, setSendingIndex] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [jobModalVisible, setJobModalVisible] = useState(false);
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const [contacts, setContacts] = useState(data.contacts);
    const [jobs, setJobs] = useState(data.jobs);
    const user = data.person;
    const salutation = data?.salutations;
    const organization = data.organization;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (fabRef.current && !fabRef.current.contains(event.target)) {
                onFabToggle(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onFabToggle]);

    const sharingUser = getFromSessionStorage('user');

    const handleFormFinish = async (values, contact, index) => {
        setSendingIndex(index);
        const userId = sharingUser?.responseData?.id;
        const contactId = data.organization.contact_id;

        try {
            const contactData = {
                name: `${salutation.join(', ')} ${user.full_name}`,
                office: contact.office,
                organization: jobs[0]?.workPlace || "Not specified",
                postalCode: organization.postalCode,
                country: organization.country,
                city: organization.city,
                phoneNumber: contact.phone_number,
                email: contact.email,
            };

            const action = await dispatch(sendContact({
                to: values.email,
                contact: contactData,
                shareDetails: {
                    userId,
                    contactId,
                }
            }));

            if (action.error) {
                messageApi.error(action.payload.message);
            } else {
                messageApi.success(action.payload.message).then(() => {
                    setOpenIndex(null);
                    form.resetFields();
                });
            }
        } finally {
            setSendingIndex(null);
        }
    };

    const handleDeleteItem = (contactItem) => {
        dispatch(deleteContact(contactItem.id)).then((action) => {
            action.error ?
                messageApi.error(action.payload?.message || "Failed to delete contact") :
                messageApi.success(action.payload?.message || "Contact deleted successfully").then(() => {
                    setContacts((prevContacts) => prevContacts.filter(contact => contact.id !== contactItem.id));
                });
        });
    };

    const handlePopoverToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        console.log("Edit contact:", data);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        console.log("Delete contact:", data);
    };

    const toggleFab = (e) => {
        e.stopPropagation();
        onFabToggle(!isFabActive);
    };

    const userRole = getFromSessionStorage('user')?.responseData;

    // Animation variants
    const fabVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <motion.div
            className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            whileHover={{ y: -5 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            layout
        >
            {contextHolder}

            {/* Contact Header */}
            <div className="flex items-start gap-4 mb-6">
                <motion.div
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Avatar
                        size={72}
                        className="border-2 border-blue-500 shadow-md"
                        style={{
                            backgroundColor: '#3b82f6',
                            backgroundImage: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                        }}
                        icon={<UserOutlined className="text-white text-xl" />}
                    />
                </motion.div>

                <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {salutation.join(', ')} {user?.full_name}
                        </h1>
                        <Tag
                            color="geekblue"
                            className="rounded-full px-3 py-1 font-medium"
                            style={{ background: '#e0e7ff', color: '#4f46e5' }}
                        >
                            {user?.profession}
                        </Tag>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                        {data?.Office}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <Tag icon={<LocationOn />} color="blue" className="flex items-center">
                            {organization.city}, {organization.country}
                        </Tag>
                    </div>
                </div>
            </div>

            {/* Contact Details Collapse */}
            <Collapse
                bordered={false}
                ghost
                expandIcon={({ isActive }) => (
                    <CaretRightOutlined className="text-blue-500" rotate={isActive ? 90 : 0} />
                )}
                className="custom-collapse"
                items={[
                    {
                        key: 'contacts',
                        label: <span className="font-semibold text-gray-700 text-base">Contact Information</span>,
                        children: (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {userRole?.role === "ADMIN" && (
                                    <div className='mb-4 flex justify-end'>
                                        <Button
                                            onClick={() => setModalVisible(true)}
                                            type="primary"
                                            ghost
                                            className="flex items-center gap-2"
                                        >
                                            + Add Contact
                                        </Button>
                                    </div>
                                )}

                                {contacts.length > 0 ? (
                                    contacts.map((contact, index) => (
                                        <motion.div
                                            key={index}
                                            className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
                                            whileHover={{ scale: 1.01 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <Tag
                                                    color={contact.office === 'Primary' ? 'green' : 'blue'}
                                                    className="rounded-full px-3 py-1 font-medium"
                                                >
                                                    {contact.office}
                                                </Tag>
                                                {userRole?.role === "ADMIN" && (
                                                    <Button
                                                        onClick={() => handleDeleteItem(contact)}
                                                        type="text"
                                                        danger
                                                        shape="circle"
                                                        icon={<DeleteOutlined />}
                                                        className="hover:bg-red-50"
                                                    />
                                                )}
                                            </div>
                                            <div className='flex items-center justify-between'>
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                                    <div className="flex items-center gap-3 col-span-4">
                                                        <div className="p-2 bg-blue-100 rounded-full">
                                                            <Phone className="text-blue-600 text-lg" />
                                                        </div>
                                                        <span className="text-gray-700 font-medium">{contact.phone_number}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 col-span-4">
                                                        <div className="p-2 bg-purple-100 rounded-full">
                                                            <Mail className="text-purple-600 text-lg" />
                                                        </div>
                                                        <span className="text-gray-700 font-medium truncate">{contact.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 col-span-4">
                                                        <div className="p-2 bg-amber-100 rounded-full">
                                                            {contact.type === 'Home' ? (
                                                                <Home className="text-amber-600 text-lg" />
                                                            ) : (
                                                                <Work className="text-amber-600 text-lg" />
                                                            )}
                                                        </div>
                                                        <span className="text-gray-700 font-medium">{contact.type}</span>
                                                    </div>
                                                </div>
                                                <Popover
                                                    open={openIndex === index}
                                                    onOpenChange={(visible) => setOpenIndex(visible ? index : null)}
                                                    content={
                                                        <div className="w-72 p-4">
                                                            <Form
                                                                layout="vertical"
                                                                form={form}
                                                                onFinish={(values) => handleFormFinish(values, contact, index)}
                                                            >
                                                                <Form.Item
                                                                    label="Recipient Email"
                                                                    name="email"
                                                                    rules={[{
                                                                        required: true,
                                                                        message: 'Please enter a valid email',
                                                                        type: 'email'
                                                                    }]}
                                                                >
                                                                    <Input
                                                                        placeholder="name@company.com"
                                                                        className="rounded-lg h-10"
                                                                        disabled={sendingIndex === index}
                                                                    />
                                                                </Form.Item>
                                                                <Button
                                                                    type="primary"
                                                                    htmlType="submit"
                                                                    block
                                                                    loading={sendingIndex === index}
                                                                    className="flex items-center justify-center gap-2 font-medium h-10"
                                                                    size="middle"
                                                                >
                                                                    <Send fontSize="small" />
                                                                    {sendingIndex === index ? 'Sending...' : 'Send Contact'}
                                                                </Button>
                                                            </Form>
                                                        </div>
                                                    }
                                                    trigger="click"
                                                    placement="left"
                                                    overlayClassName="popover-shadow"
                                                >
                                                    <Button
                                                        shape="circle"
                                                        icon={<Send className="text-blue-500" />}
                                                        className="hover:!border-blue-500 hover:!bg-blue-50"
                                                        style={{ width: 36, height: 36 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handlePopoverToggle(index, contact);
                                                        }}
                                                    />
                                                </Popover>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                                        No contact information available
                                    </div>
                                )}
                            </motion.div>
                        ),
                    },
                    {
                        key: 'jobs',
                        label: <span className="font-semibold text-gray-700 text-base">Professional Experience</span>,
                        children: (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {userRole?.role === "ADMIN" && (
                                    <div className='mb-4 flex justify-end'>
                                        <Button
                                            onClick={() => setJobModalVisible(true)}
                                            type="primary"
                                            ghost
                                            className="flex items-center gap-2"
                                        >
                                            + Add Experience
                                        </Button>
                                    </div>
                                )}

                                {jobs.length > 0 ? (
                                    jobs.map((job, index) => (
                                        <motion.div
                                            key={index}
                                            className="p-4 bg-gray-50 rounded-xl border border-gray-200 mb-3"
                                            whileHover={{ scale: 1.01 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-100 rounded-full">
                                                    <Work className="text-blue-600 text-xl" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{job.workPlace}</h3>
                                                    <p className="text-gray-600">{job.job}</p>
                                                    {job.duration && (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {job.duration}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                                        No professional experience added
                                    </div>
                                )}
                            </motion.div>
                        ),
                    }
                ]}
            />

            {/* Hover effect line */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0"
                animate={{ opacity: isHovered ? 1 : 0 }}
            />

            {/* Modals */}
            <AddPersonContactModal
                setModalVisible={setModalVisible}
                data={data}
                modalVisible={modalVisible}
                onSuccess={(newContact) => setContacts([...contacts, newContact])}
            />
            <JobsModel
                data={data}
                JobModalVisible={jobModalVisible}
                setJobModalVisible={setJobModalVisible}
                onSuccess={(newJob) => setJobs([...jobs, newJob])}
            />
        </motion.div>
    );
};

export default ContactCard;