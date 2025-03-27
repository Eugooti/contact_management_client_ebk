import  { useEffect } from "react";
import { Button, Form, Input, Select, Tooltip } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "antd/es/form/Form.js";
import {getFromSessionStorage, setSessionStorage} from "../../../utils/SessionStorage/sessionStorage.js";
import {
    businessType,
    headSalutation,
    headTitle,
    institutionHead,
    tertiaryInstitutions
} from "../../../utils/StaticData.js";
import SectionHeader from "../../../Components/Headings/SectionHeading.jsx";


// eslint-disable-next-line react/prop-types
const ContactInputGroup = ({ rules, prefix, initial = false, remove }) => (
    <div className="grid md:grid-cols-12 gap-4">
        <Form.Item
             // eslint-disable-next-line react/prop-types
            rules={rules.required}
            className="md:col-span-4"
            label="Phone Number"
            name={initial ? "headPhone" : [prefix, "phoneNumber"]}
        >
            <Input size="large" placeholder="+254 712 345678" />
        </Form.Item>
        <Form.Item
            // eslint-disable-next-line react/prop-types
            rules={rules.emails}
            className="md:col-span-4"
            label="Email"
            name={initial ? "headmail" : [prefix, "email"]}
        >
            <Input size="large" placeholder="name@organization.com" type="email" />
        </Form.Item>
        <Form.Item
            // eslint-disable-next-line react/prop-types
            rules={rules.required}
            className="md:col-span-3"
            label="Contact Type"
            name={initial ? "headType" : [prefix, "type"]}
        >
            <Select
                size="large"
                options={[
                    { label: "Home", value: "Home" },
                    { label: "Work", value: "Work" },
                ]}
                placeholder="Select type"
            />
        </Form.Item>
        {!initial && (
            <div className="flex justify-center items-center">
                <Tooltip title="Remove Contact">
                    <MinusCircleOutlined
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={() => remove(prefix)}
                    />
                </Tooltip>
            </div>
        )}
    </div>
);

// Animation variants for form sections
const formSectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

// Main component
// eslint-disable-next-line react/prop-types
 const OrganizationProfileForm = ({nextStep} ) => {
    const [form] = useForm();



    const onFormFinish = (values) => {
        values.organizationData= values.contactType === "Learning Institution"? {
            name:values.name,
            institutionType:values.institutionType,
            type:"Private",
            head_position:values.headTitle,
            headTitle: values.headTitle,
            contactType:values.contactType,
            headName:values.headName
        }:{
            name:values.name,
            sector:values.sector,
            business:values.businessType,
            acronym:values.acronym,
            head_position:values.headTitle,
            headTitle: values.headTitle,
            contactType:values.contactType,
            headName:values.headName
        }

        values.HeadContacts =values.headContacts
            ? [
                {
                    phoneNumber: values.headPhone,
                    email: values.headmail,
                    type: values.headType,
                },
                ...values.headContacts,
            ]
            : [
                {
                    phoneNumber: values.headPhone,
                    email: values.headmail,
                    type: values.headType,
                },
            ]

        setSessionStorage("private", values);
        console.log(values)
        nextStep();
    };


     useEffect(() => {
         form.setFieldsValue(getFromSessionStorage('private'));
     }, [form]);

    const rules = {
        required: [{ required: true, message: "This field is required" }],
        emails: [
            { required: true, message: "Email is required" },
            { type: "email", message: "Please enter a valid email address" },
        ],
    };


    const privateOrgChoice = [
        { label: "Private Organization", value: "Private" },
        { label: "Private Learning Institution", value: "Learning Institution" },
    ];



    return (
        <motion.div
            key="step0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <div className='p-4'>
                <Form form={form} layout="vertical" onFinish={onFormFinish}>
                    {/* Organization Type Section */}
                    <SectionHeader
                        title="Organization Type"
                        description="Select the type of organization you're registering"
                    />
                    <Form.Item name="contactType" rules={rules.required}>
                        <Select
                            size="large"
                            options={privateOrgChoice}
                            placeholder="Select organization type"
                        />
                    </Form.Item>

                    {/* Dynamic Form Sections */}
                    <Form.Item shouldUpdate>
                        {({ getFieldValue }) => (
                            <AnimatePresence>
                                {/* Company Details Section */}
                                {getFieldValue("contactType") === "Private" && (
                                    <motion.div
                                        key="company-form"
                                        variants={formSectionVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="space-y-6 mt-6">
                                            <SectionHeader
                                                title="Company Details"
                                                description="Basic information about your company"
                                            />
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <Form.Item
                                                    label="Company Name"
                                                    name="name"
                                                    rules={rules.required}
                                                >
                                                    <Input size="large" placeholder="Enter company name" />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Business Type"
                                                    name="businessType"
                                                    rules={rules.required}
                                                >
                                                    <Select
                                                        size="large"
                                                        options={businessType}
                                                        placeholder="Select business type"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Sector"
                                                    name="sector"
                                                    rules={rules.required}
                                                >
                                                    <Input
                                                        size="large"
                                                        placeholder="e.g., Technology, Healthcare"
                                                    />
                                                </Form.Item>
                                                <Form.Item label="Acronym" name="acronym">
                                                    <Input size="large" placeholder="e.g., IBM, NASA" />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Learning Institution Details Section */}
                                {getFieldValue("contactType") === "Learning Institution" && (
                                    <motion.div
                                        key="institution-form"
                                        variants={formSectionVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="space-y-6 mt-6">
                                            <SectionHeader
                                                title="Institution Details"
                                                description="Basic information about your institution"
                                            />
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <Form.Item
                                                    label="Institution Name"
                                                    name="name"
                                                    rules={rules.required}
                                                >
                                                    <Input
                                                        size="large"
                                                        placeholder="Enter institution name"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Institution Type"
                                                    name="institutionType"
                                                    rules={rules.required}
                                                >
                                                    <Select
                                                        size="large"
                                                        options={tertiaryInstitutions}
                                                        placeholder="Select institution type"
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Contact Information Section */}
                                {(getFieldValue("contactType") === "Private" ||
                                    getFieldValue("contactType") === "Learning Institution") && (
                                    <motion.div
                                        key="contact-form"
                                        variants={formSectionVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="space-y-6 mt-8">
                                            <SectionHeader
                                                title="Primary Contact Information"
                                                description="Main contact details for the organization's leadership"
                                            />
                                            <div className="grid md:grid-cols-12 gap-4">
                                                <Form.Item
                                                    className="md:col-span-2"
                                                    label="Salutation"
                                                    name="headSalutation" // Ant Design manages the value
                                                    rules={rules.required}
                                                >
                                                    <Select
                                                        size="large"
                                                        options={headSalutation}
                                                        showSearch
                                                        tokenSeparators={[',']}
                                                        mode="multiple"
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    className="md:col-span-4"
                                                    label="Full Name"
                                                    name="headName"
                                                    rules={rules.required}
                                                >
                                                    <Input size="large" placeholder="John Doe" />
                                                </Form.Item>
                                                <Form.Item
                                                    className="md:col-span-3"
                                                    label="Title"
                                                    name="headTitle"
                                                    rules={rules.required}
                                                >
                                                    <Select
                                                        size="large"
                                                        options={
                                                            getFieldValue("contactType") === "Private"
                                                                ? headTitle
                                                                : institutionHead
                                                        }
                                                        placeholder="Select title"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    className="md:col-span-3"
                                                    label="Profession"
                                                    name="profession"
                                                    rules={rules.required}
                                                >
                                                    <Input size="large" placeholder="e.g., CEO, Director" />
                                                </Form.Item>
                                            </div>

                                            {/* Primary Contact Input Group */}
                                            <ContactInputGroup rules={rules} initial />

                                            {/* Additional Contacts Section */}
                                            <SectionHeader
                                                title="Additional Contacts"
                                                description="Optional secondary contact information"
                                                className="mt-8"
                                            />
                                            <Form.List name="headContacts">
                                                {(fields, { add, remove }) => (
                                                    <div className="space-y-4">
                                                        {fields.map(({ key, name, ...rest }) => (
                                                            <div key={key}>
                                                                <ContactInputGroup
                                                                    rules={rules}
                                                                    prefix={name}
                                                                    rest={rest}
                                                                    remove={remove}
                                                                />
                                                            </div>
                                                        ))}
                                                        <Button
                                                            type="dashed"
                                                            onClick={() => add()}
                                                            block
                                                            icon={<PlusOutlined />}
                                                            className="mt-4"
                                                        >
                                                            Add Additional Contact
                                                        </Button>
                                                    </div>
                                                )}
                                            </Form.List>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </Form.Item>

                    {/* Form Submission */}
                    <div className="flex justify-end gap-4 mt-8">
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            className="w-40 bg-blue-600 hover:bg-blue-700"
                        >
                            Next Step
                        </Button>
                    </div>
                </Form>
            </div>
        </motion.div>
    );
};

 export default OrganizationProfileForm;