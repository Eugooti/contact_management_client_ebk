import { Avatar, Button, Collapse, Form, Input, message, Popover, Tag } from "antd";
import {
    CaretRightOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Home, Mail, Phone, Send, Work } from "@mui/icons-material";
import { useForm } from "antd/es/form/Form.js";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { sendContact } from "../../Redux/Reducers/sendContactSlice.js";
import {getFromSessionStorage} from "../../utils/SessionStorage/sessionStorage.js";
import AddPersonContactModal from "../Modals/AddPersonContactModal.jsx";
import {deleteContact} from "../../Redux/Reducers/contactPersonSlice.js";
import JobsModel from "../Modals/JobsModel.jsx";

// eslint-disable-next-line react/prop-types
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

    // eslint-disable-next-line react/prop-types
    const [contacts, setContacts] = useState(data.contacts);
    // eslint-disable-next-line react/prop-types
    const [jobs, setJobs] = useState(data.jobs);
    // Data destructuring
    // eslint-disable-next-line react/prop-types
    const user = data.person;
    const salutation = data?.salutations;

    // eslint-disable-next-line react/prop-types
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

    const sharingUser = getFromSessionStorage('user')

    const handleFormFinish = async (values, contact, index) => {
        setSendingIndex(index);
        const userId = sharingUser?.responseData?.id
        // eslint-disable-next-line react/prop-types
        const contactId = data.organization.contact_id

        try {
            const contactData = {
                // eslint-disable-next-line react/prop-types
                name: `${salutation.join(', ')} ${user.full_name}`,
                office: contact.office,
                // eslint-disable-next-line react/prop-types
                organization: jobs[0].workPlace,
                // eslint-disable-next-line react/prop-types
                postalCode: organization.postalCode,
                // eslint-disable-next-line react/prop-types
                country: organization.country,
                // eslint-disable-next-line react/prop-types
                city: organization.city,
                phoneNumber: contact.phone_number,
                email: contact.email,
            };

            const action = await dispatch(sendContact({
                to: values.email,
                contact: contactData,
                shareDetails:{
                    userId,
                    contactId,
                }
            }));

            if (action.error) {
                messageApi.error(action.payload.message);
            } else {
                messageApi.success(action.payload.message).then(()=>{
                    setOpenIndex(null);
                    form.resetFields();
                })

            }
        } finally {
            setSendingIndex(null);
        }
    };

    const handleDeleteItem = (contactItem) => {
        dispatch(deleteContact(contactItem.id)).then((action) => {
            action.error?
                messageApi.error(action.payload?.message || "Failed to delete contact"):
                messageApi.success(action.payload?.message || "Contact deleted successfully").then(()=>{
                    setContacts((prevContacts) => prevContacts.filter(contact => contact.id !== contactItem.id));
                })
        });
    };


    const handlePopoverToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Action handlers
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

    return (
        <motion.div
            className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ y: -5 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            {contextHolder}

            {/* Floating Action Buttons */}
            <div className="absolute top-4 left-16 z-10" ref={fabRef}>
                <motion.div className="relative h-24 w-24 -ml-4 -mt-4 p-4">
                    {/* Delete Button */}
                    <motion.div
                        className="absolute"
                        animate={{
                            x: isFabActive ? -28 : 0,
                            y: isFabActive ? -28 : 0,
                            opacity: isFabActive ? 1 : 0,
                            scale: isFabActive ? 1 : 0.5,
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Button
                            shape="circle"
                            icon={<DeleteOutlined className="text-red-500" />}
                            className="shadow-md hover:!border-red-500 hover:!bg-red-50 bg-white"
                            style={{ width: 40, height: 40 }}
                            onClick={handleDelete}
                        />
                    </motion.div>

                    {/* Edit Button */}
                    <motion.div
                        className="absolute"
                        animate={{
                            x: isFabActive ? 28 : 0,
                            y: isFabActive ? -28 : 0,
                            opacity: isFabActive ? 1 : 0,
                            scale: isFabActive ? 1 : 0.5,
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Button
                            shape="circle"
                            icon={<EditOutlined className="text-blue-500" />}
                            className="shadow-md hover:!border-blue-500 hover:!bg-blue-50 bg-white"
                            style={{ width: 40, height: 40 }}
                            onClick={handleEdit}
                        />
                    </motion.div>

                    {/* Main FAB */}
                    <motion.div
                        animate={{ scale: isFabActive ? 0.9 : 1, rotate: isFabActive ? 45 : 0 }}
                    >
                        <Button
                            shape="circle"
                            icon={isFabActive ? <CloseOutlined /> : <EditOutlined />}
                            className="shadow-md hover:!border-blue-500 hover:!bg-blue-50 bg-white text-blue-500"
                            style={{ width: 40, height: 40 }}
                            onClick={toggleFab}
                        />
                    </motion.div>
                </motion.div>
            </div>

            {/* Contact Header */}
            <div className="flex items-start gap-4 mb-4">
                <motion.div
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Avatar
                        size={64}
                        className="border-2 border-blue-600 shadow-md"
                        style={{ backgroundColor: '#3b82f6' }}
                        icon={<UserOutlined className="text-white text-xl" />}
                    />
                </motion.div>

                <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                        <h1 className="text-xl font-bold text-gray-800">
                            {/* eslint-disable-next-line react/prop-types */}
                            {salutation.join(', ')} {user?.full_name}
                        </h1>
                        <Tag color="geekblue" className="rounded-full">
                            {/* eslint-disable-next-line react/prop-types */}
                            {user?.profession}
                        </Tag>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                        {/* eslint-disable-next-line react/prop-types */}
                        {data?.Office}
                    </p>
                </div>
            </div>

            {/* Contact Details Collapse */}
            <Collapse
                bordered={false}
                ghost
                expandIcon={({ isActive }) => (
                    <CaretRightOutlined className="text-blue-500" rotate={isActive ? 90 : 0} />
                )}
                items={[
                    {
                        key: 'contacts',
                        label: <span className="font-semibold text-gray-700">Contact Details</span>,
                        children: (
                            <>
                                <div className='mb-2 flex align-middle justify-end'>
                                    <Button onClick={() => setModalVisible(true)} type="dashed">Add Contact</Button>
                                </div>

                                {contacts.map((contact, index) => (
                                    <div key={index} className="mb-4 p-3 bg-white rounded-lg shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <Tag color="green" className="rounded-full">{contact.office}</Tag>
                                            <Button onClick={()=>handleDeleteItem(contact)} type="primary" danger shape="circle" icon={<DeleteOutlined/>}/>
                                        </div>
                                        <div className='flex align-midle justify-between'>
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                                <div className="flex items-center gap-2 col-span-4">
                                                    <Phone className="text-blue-500 text-lg" />
                                                    <span className="text-gray-700">{contact.phone_number}</span>
                                                </div>
                                                <div className="flex items-center gap-2 col-span-4">
                                                    <Mail className="text-blue-500 text-lg" />
                                                    <span className="text-gray-700 truncate">{contact.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 col-span-4">
                                                    {contact.type === 'Home' ? (
                                                        <Home className="text-blue-500 text-lg" />
                                                    ) : (
                                                        <Work className="text-blue-500 text-lg" />
                                                    )}
                                                    <span className="text-gray-700">{contact.type}</span>
                                                </div>
                                            </div>
                                            <Popover
                                                open={openIndex === index}
                                                onOpenChange={(visible) => setOpenIndex(visible ? index : null)}
                                                content={
                                                    <div className="w-64 p-4">
                                                        <Form
                                                            layout={"vertical"}
                                                            form={form}
                                                            onFinish={(values) => handleFormFinish(values, contact, index)}
                                                        >
                                                            <Form.Item
                                                                label="Recipient Email"
                                                                name="email"
                                                                rules={[{
                                                                    required: true,
                                                                    message: 'Required field',
                                                                    type: 'email'
                                                                }]}
                                                            >
                                                                <Input
                                                                    placeholder="name@company.com"
                                                                    className="rounded-lg"
                                                                    disabled={sendingIndex === index}
                                                                />
                                                            </Form.Item>
                                                            <Button
                                                                type="primary"
                                                                htmlType="submit"
                                                                block
                                                                loading={sendingIndex === index}
                                                                className="flex items-center justify-center gap-2 font-semibold"
                                                            >
                                                                <Send fontSize="small" />
                                                                {sendingIndex === index ? 'Sending...' : 'Send Contact'}
                                                            </Button>
                                                        </Form>
                                                    </div>
                                                }
                                                trigger="click"
                                                placement="left"
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
                                    </div>
                                ))}
                            </>
                        ),
                    },
                    {
                        key: 'jobs',
                        label: <span className="font-semibold text-gray-700">Professional Experience</span>,
                        children: (
                            <>
                                <div className='mb-2 flex align-middle justify-end'>
                                    <Button onClick={() => setJobModalVisible(true)} type="dashed">Add Job</Button>
                                </div>

                                {jobs.map((job, index) => (
                                    <div key={index} className="p-3 bg-white rounded-lg shadow-sm mb-2">
                                        <div className="flex items-center gap-3">
                                            <Work className="text-blue-500" />
                                            <div>
                                                <h3 className="font-semibold">{job.workPlace}</h3>
                                                <p className="text-gray-600">{job.job}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ),
                    }
                ]}
            />

            {/* Hover effect line */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0"
                animate={{ opacity: isHovered ? 1 : 0 }}
            />
            <AddPersonContactModal setModalVisible={setModalVisible} data={data} modalVisible={modalVisible} />
            <JobsModel data={data} JobModalVisible={jobModalVisible} setJobModalVisible={setJobModalVisible} />
        </motion.div>
    );
};

export default ContactCard;