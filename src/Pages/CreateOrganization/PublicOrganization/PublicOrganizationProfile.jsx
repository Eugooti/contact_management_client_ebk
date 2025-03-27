import {useEffect, useState} from "react";
import {Button, Form, Input, Select, Tooltip, AutoComplete} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import {getFromSessionStorage, setSessionStorage} from "../../../utils/SessionStorage/sessionStorage.js";
import { useForm } from "antd/es/form/Form.js";
import TextArea from "antd/es/input/TextArea.js";
import {countiesOfKenya,headSalutation,headTitle,institutionHead,tertiaryInstitutions,organization,officeType} from "../../../utils/StaticData.js";
import SectionHeader from "../../../Components/Headings/SectionHeading.jsx";
import {useDispatch, useSelector} from "react-redux";
import {readMinistries} from "../../../Redux/Reducers/ministrySlice.js";
import {readStateDepartment} from "../../../Redux/Reducers/stateDepartmentSlice.js";


// eslint-disable-next-line react/prop-types
const ContactInputGroup = ({ rules, prefix, initial = false, remove }) => (
    <div className="grid md:grid-cols-12 gap-4">
        <Form.Item
             // eslint-disable-next-line react/prop-types
            rules={rules.required}
            className="md:col-span-4"
            label="Phone Number"
            name={initial ? "phoneNumber" : [prefix, "phoneNumber"]}
        >
            <Input size="large" placeholder="+254 712 345678" />
        </Form.Item>
        <Form.Item
            // eslint-disable-next-line react/prop-types
            rules={rules.emails}
            className="md:col-span-4"
            label="Email"
            name={initial ? "email" : [prefix, "email"]}
        >
            <Input size="large" placeholder="name@organization.com" type="email" />
        </Form.Item>
        <Form.Item
            // eslint-disable-next-line react/prop-types
            rules={rules.required}
            className="md:col-span-3"
            label="Contact Type"
            name={initial ? "type" : [prefix, "type"]}
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

// eslint-disable-next-line react/prop-types
const PublicOrganizationProfile = ({ nextStep }) => {
    const [form] = useForm();
    const [options, setOptions] = useState([]);

    const handleSearch = (value) => {
        if (!value) {
            setOptions([]);
            return;
        }
        const filteredOptions = countiesOfKenya
            .filter(({ county }) => county.toLowerCase().includes(value.toLowerCase()))
            .map(({ county }) => ({ value: county }));
        setOptions(filteredOptions);
    };

    const onFormFinish = (values) => {

        switch (values.contactType) {
            case "Presidency":
                values.organizationData = {
                    name: `Office of The ${values.OfficeType}`,
                    sector: "Executive",
                    mandate: "Country Governance",
                    contactType: values.contactType,
                    head_position: values.OfficeType,
                    headName:values.headName,
                    headTitle:values.OfficeType
                };
                break;

            case "County":
                { const county = countiesOfKenya.find(item => item.county === values.county);
                values.organizationData = {
                    ...county,
                    county: `County Government of ${county.county}`,
                    mandate: "County Governance",
                    contactType: values.contactType,
                    head_position: "Governor",
                    headName:values.headName,
                    headTitle:"County Governor",
                    name:`County Government of ${county.county}`
                };
                break; }

            case "Ministry":
                values.organizationData = {
                    name: `Ministry of ${values.ministry}`,
                    sector: values.sector,
                    mandate: values.mandate,
                    contactType: values.contactType,
                    head_position: "Cabinet Secretary",
                    headTitle: "Cabinet Secretary",
                    headName:values.headName
                };
                break;

            case "State Department":
                values.organizationData = {
                    name: `State Department of ${values.name}`,
                    mandate: values.mandate,
                    ministry: values.ministry,
                    contactType: values.contactType,
                    head_position: "Principle Secretary",
                    headTitle: "Principle Secretary",
                    headName:values.headName
                };
                break;

            case "Parastatal":
                values.organizationData = {
                    name: values.name,
                    mandate: values.mandate,
                    stateDepartment: values.stateDepartment,
                    head_position: values.headTitle,
                    headTitle: values.headTitle,
                    contactType: values.contactType,
                    headName:values.headName,
                };
                break;

            case "Commission":
                values.organizationData = {
                    name: values.name,
                    acronym: values.acronym,
                    mandate: values.mandate,
                    contactType: values.contactType,
                    head_position: values.headTitle,
                    headTitle: values.headTitle,
                    headName:values.headName
                };
                break;

            case "Board":
                values.organizationData = {
                    name: values.name,
                    contactType: values.contactType,
                    stateDepartment: values.stateDepartment,
                    mandate: values.mandate,
                    head_position: values.headTitle,
                    headTitle: values.headTitle,
                    headName:values.headName
                };
                break;

            case "Learning Institution":
                values.organizationData = {
                    name: values.name,
                    institutionType: values.institutionType,
                    type: "Public",
                    head_position: values.headTitle,
                    headTitle: values.headTitle,
                    contactType: values.contactType,
                    headName:values.headName
                };
                break;

            default:
                values.organizationData = {};
                break;
        }


        values.HeadContacts = values.CSContact
            ? [{ phoneNumber: values.phoneNumber, email: values.email, type: values.type }, ...values.CSContact]
            : [{ phoneNumber: values.phoneNumber, email: values.email, type: values.type }];

        setSessionStorage("public", values);
        console.log(values)
        nextStep();
    };

    useEffect(() => {
        form.setFieldsValue(getFromSessionStorage('public'));
    }, [form]);

    const rules = {
        required: [{ required: true, message: "This field is required" }],
        emails: [
            { required: true, message: "Email is required" },
            { type: "email", message: "Please enter a valid email address" },
        ],
    };

    if (!organization.some(org => org.value === "Learning Institution")) {
        organization.push({ label: "Public Learning Institution", value: "Learning Institution" });
    }


    const dispatch = useDispatch();
    const {ministries} = useSelector((state) => state.ministry);
    const {stateDepartments} = useSelector((state) => state.stateDepartment);


    useEffect(() => {
        dispatch(readMinistries())
        dispatch(readStateDepartment())
    }, [dispatch]);


    const [stateDepartmentsList, setStateDepartmentsList] = useState();
    const [ministriesList, setMinistriesList] = useState();


    useEffect(() => {
        if (ministries&&stateDepartments){
            const formatMinistry = ministries?.result.map(item=>({
                label: item.name,
                value: item.id,
            }))

            const formatStateDepartment = stateDepartments.result.map(item=>({
                label: item.name,
                value: item.id,
            }))
            
            setMinistriesList(formatMinistry)
            setStateDepartmentsList(formatStateDepartment)
        }
    }, [ministries, stateDepartments]);


    return (
        <motion.div
            key="step0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <div>
                <Form form={form} layout="vertical" onFinish={onFormFinish}>
                    <SectionHeader
                        title="Organization Type"
                        description="Select the type of organization you're registering"
                    />

                    <div className='pb-4'>
                        <Form.Item rules={rules.required}  name="contactType">
                            <Select size="large" options={organization} />
                        </Form.Item>
                    </div>
                    <Form.Item shouldUpdate>
                        {({ getFieldValue }) => (
                            <AnimatePresence>
                                {getFieldValue("contactType") === "Ministry" && (
                                    <>
                                        <motion.div
                                            key="ministry-form"
                                            variants={formSectionVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="space-y-6 mt-6">
                                                <SectionHeader
                                                    title="Ministry Details"
                                                    description="Basic information about the ministry"
                                                />
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <Form.Item rules={rules.required} label="Ministry" name="ministry">
                                                        <Input size="large" />
                                                    </Form.Item>
                                                    <Form.Item rules={rules.required} label="Sector" name="sector">
                                                        <Input size="large" />
                                                    </Form.Item>
                                                    <Form.Item rules={rules.required} className="col-span-2" label="Ministry Mandate" name="mandate">
                                                        <TextArea rows={4} />
                                                    </Form.Item>
                                                </div>

                                                <SectionHeader
                                                    title="C.S Contact Information"
                                                    description="Contact details for the Cabinet Secretary"
                                                />
                                                <div className="grid md:grid-cols-3 gap-4">
                                                    <Form.Item rules={rules.required} label="C.S Salutation" name="headSalutation">
                                                        <Select size="large" options={headSalutation} mode="tags" />
                                                    </Form.Item>
                                                    <Form.Item rules={rules.required} label="C.S Name" name="headName">
                                                        <Input size="large" />
                                                    </Form.Item>
                                                    <Form.Item rules={rules.required} label="Profession" name="profession">
                                                        <Input size="large" />
                                                    </Form.Item>
                                                </div>
                                                <ContactInputGroup rules={rules} initial />

                                                <Form.List name="CSContact">
                                                    {(fields, { add, remove }) => (
                                                        <div className="space-y-4">
                                                            {fields.map(({ key, name, ...rest }) => (
                                                                <div key={key}>
                                                                    <ContactInputGroup
                                                                        rules={rules}
                                                                        prefix={name}
                                                                        remove={remove}
                                                                        rest={rest}
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
                                                                Add Cabinet Secretary Contact
                                                            </Button>
                                                        </div>
                                                    )}
                                                </Form.List>
                                            </div>
                                        </motion.div>
                                    </>

                                )}
                                
                                {getFieldValue("contactType") === "County" && (
                                    <>
                                        <motion.div
                                            key="ministry-form"
                                            variants={formSectionVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            transition={{ duration: 0.3 }}
                                        >

                                            <SectionHeader
                                                title="County Details"
                                                description="Basic information about the county"
                                            />

                                            <div className='pb-7'>
                                                <Form.Item
                                                    name="county"
                                                    label="County"
                                                    rules={[{ required: true, message: "Please select a county!" }]}
                                                >
                                                    <AutoComplete
                                                        options={options}
                                                        onSearch={handleSearch}
                                                        placeholder="Type a county name..."
                                                        style={{ width: "100%" }}
                                                    >
                                                        <Input size={"large"}/>
                                                    </AutoComplete>
                                                </Form.Item>
                                            </div>


                                            <SectionHeader
                                                title="Governor Contact Information"
                                                description="Contact details for the Governor"
                                            />
                                            <div className="grid md:grid-cols-3 gap-4">
                                                <Form.Item rules={rules.required} label="Governor's Salutation" name="headSalutation">
                                                    <Select size="large" options={headSalutation} mode="tags" />
                                                </Form.Item>
                                                <Form.Item rules={rules.required} label="Governor's Name" name="headName">
                                                    <Input size="large" />
                                                </Form.Item>
                                                <Form.Item rules={rules.required} label="Profession" name="profession">
                                                    <Input size="large" />
                                                </Form.Item>
                                            </div>
                                            <ContactInputGroup rules={rules} initial />
                                            <SectionHeader
                                                title="Additional Contacts"
                                                description="Optional secondary contact information"
                                                className="mt-8"
                                            />
                                            <Form.List name="CSContact">
                                                {(fields, { add, remove }) => (
                                                    <div className="space-y-4">
                                                        {fields.map(({ key, name, ...rest }) => (
                                                            <div key={key}>
                                                                <ContactInputGroup
                                                                    rules={rules}
                                                                    prefix={name}
                                                                    remove={remove}
                                                                    rest={rest}
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
                                                            Add Governor&#39;s Contact
                                                        </Button>
                                                    </div>
                                                )}
                                            </Form.List>

                                        </motion.div>
                                    </>

                                )}

                                {getFieldValue("contactType")==="State Department" && (
                                    <>
                                        <SectionHeader
                                            description="Basic information about the State Department"
                                            title='State Department Details'/>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Form.Item rules={rules.required} label="State Department" name="name">
                                                <Input size={'large'}/>
                                            </Form.Item>
                                            <Form.Item rules={rules.required} label="Ministry" name="ministry">
                                                <Select size={"large"} options={ministriesList}/>
                                            </Form.Item>
                                            <Form.Item rules={rules.required} className="md:col-span-2" label="State Department Mandate" name="mandate">
                                                <TextArea rows={4} />
                                            </Form.Item>
                                        </div>
                                        <div className='pt-5'>
                                            <SectionHeader
                                                description="Contact details for the Principle Secretary"
                                                title="Principle Secretary's Information"/>
                                            <div className="grid md:grid-cols-3 gap-4">
                                                <Form.Item rules={rules.required} label="Salutation" name="headSalutation">
                                                    <Select size="large" options={headSalutation} mode="tags" />
                                                </Form.Item>
                                                <Form.Item rules={rules.required} label="Name" name="headName">
                                                    <Input size="large" />
                                                </Form.Item>
                                                <Form.Item rules={rules.required} label="Profession" name="profession">
                                                    <Input size="large" />
                                                </Form.Item>
                                            </div>
                                            <ContactInputGroup rules={rules} initial />
                                            <SectionHeader
                                                title="Additional Contacts"
                                                description="Optional secondary contact information"
                                                className="mt-8"
                                            />
                                            <Form.List name="CSContact">
                                                {(fields, { add, remove }) => (
                                                    <div className="space-y-4">
                                                        {fields.map(({ key, name, ...rest }) => (
                                                            <div key={key}>
                                                                <ContactInputGroup
                                                                    rules={rules}
                                                                    prefix={name}
                                                                    remove={remove}
                                                                    rest={rest}
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
                                                            Add Principle Secretary&#39;s Contact
                                                        </Button>
                                                    </div>
                                                )}
                                            </Form.List>

                                        </div>


                                    </>
                                )}

                                {getFieldValue('contactType')==="Parastatal" && (
                                    <>
                                        <SectionHeader
                                            description="Basic information about the Parastatal"
                                            title='Parastatal Details'/>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Form.Item rules={rules.required} label="Parastatal Name" name="name">
                                                <Input size={'large'}/>
                                            </Form.Item>
                                            <Form.Item rules={rules.required} label="State Department" name="stateDepartment">
                                                <Select size={"large"} options={stateDepartmentsList}/>
                                            </Form.Item>
                                            <Form.Item rules={rules.required} className="md:col-span-2" label="Parastatal Mandate" name="mandate">
                                                <TextArea rows={4} />
                                            </Form.Item>
                                        </div>
                                        <div className='pt-5'>
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
                                                        options={headTitle}
                                                        placeholder="Select title"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    className="md:col-span-3"
                                                    label="Profession"
                                                    name="profession"
                                                    rules={rules.required}
                                                >
                                                    <Input size="large" placeholder="e.g., Engineer" />
                                                </Form.Item>
                                            </div>

                                            <ContactInputGroup rules={rules} initial />
                                            <SectionHeader
                                                title="Additional Contacts"
                                                description="Optional secondary contact information"
                                                className="mt-8"
                                            />
                                            <Form.List name="CSContact">
                                                {(fields, { add, remove }) => (
                                                    <div className="space-y-4">
                                                        {fields.map(({ key, name, ...rest }) => (
                                                            <div key={key}>
                                                                <ContactInputGroup
                                                                    rules={rules}
                                                                    prefix={name}
                                                                    remove={remove}
                                                                    rest={rest}
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
                                                            Add Principle Secretary&#39;s Contact
                                                        </Button>
                                                    </div>
                                                )}
                                            </Form.List>

                                        </div>


                                    </>

                                )}

                                {getFieldValue("contactType") === "Presidency" && (
                                    <>
                                        <motion.div
                                            key="presidency-form"
                                            variants={formSectionVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Form.Item rules={rules.required} label="Office" name="OfficeType">
                                                <Select size="large" options={officeType} />
                                            </Form.Item>

                                            {getFieldValue("OfficeType") === "President" && (
                                                <>
                                                    <SectionHeader
                                                        title="President's Information"
                                                        description="Contact details for the President"
                                                    />
                                                    <div className="grid md:grid-cols-3 gap-4">
                                                        <Form.Item rules={rules.required} label="President's Salutation" name="headSalutation">
                                                            <Select size="large" options={headSalutation} mode="tags" />
                                                        </Form.Item>
                                                        <Form.Item rules={rules.required} label="President's Name" name="headName">
                                                            <Input size="large" />
                                                        </Form.Item>
                                                        <Form.Item rules={rules.required} label="Profession" name="profession">
                                                            <Input size="large" />
                                                        </Form.Item>
                                                    </div>
                                                    <ContactInputGroup rules={rules} initial />

                                                    <SectionHeader
                                                        title="Additional Contacts"
                                                        description="Optional secondary contact information"
                                                        className="mt-8"
                                                    />
                                                    <Form.List name="CSContact">
                                                        {(fields, { add, remove }) => (
                                                            <div className="space-y-4">
                                                                {fields.map(({ key, name, ...rest }) => (
                                                                    <div key={key}>
                                                                        <ContactInputGroup
                                                                            rules={rules}
                                                                            prefix={name}
                                                                            remove={remove}
                                                                            rest={rest}
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
                                                                    Add President&#39;s Contact
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </Form.List>
                                                </>
                                            )}

                                            {getFieldValue("OfficeType") === "Deputy President" && (
                                                <>
                                                    <SectionHeader
                                                        title="Deputy President's Information"
                                                        description="Contact details for the Deputy President"
                                                    />
                                                    <div className="grid md:grid-cols-3 gap-4">
                                                        <Form.Item rules={rules.required} label="Deputy President's Salutation" name="headSalutation">
                                                            <Select size="large" options={headSalutation} mode="tags" />
                                                        </Form.Item>
                                                        <Form.Item rules={rules.required} label="Deputy President's Name" name="headName">
                                                            <Input size="large" />
                                                        </Form.Item>
                                                        <Form.Item rules={rules.required} label="Profession" name="profession">
                                                            <Input size="large" />
                                                        </Form.Item>
                                                    </div>
                                                    <ContactInputGroup rules={rules} initial />

                                                    <SectionHeader
                                                        title="Additional Contacts"
                                                        description="Optional secondary contact information"
                                                        className="mt-8"
                                                    />
                                                    <Form.List name="CSContact">
                                                        {(fields, { add, remove }) => (
                                                            <div className="space-y-4">
                                                                {fields.map(({ key, name, ...rest }) => (
                                                                    <div key={key}>
                                                                        <ContactInputGroup
                                                                            rules={rules}
                                                                            prefix={name}
                                                                            remove={remove}
                                                                            rest={rest}
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
                                                                    Add Deputy President&#39;s Contact
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </Form.List>
                                                </>
                                            )}
                                        </motion.div>
                                    </>

                                )}

                                {getFieldValue("contactType")==="Commission"&&(
                                    <>
                                        <SectionHeader
                                            description="Basic information about the Commission"
                                            title='Commission Details'/>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Form.Item rules={rules.required} label="Commission Name" name="name">
                                                <Input size={'large'}/>
                                            </Form.Item>
                                            <Form.Item label="Acronym" name="acronym">
                                                <Input size={"large"} />
                                            </Form.Item>
                                            <Form.Item rules={rules.required} className="md:col-span-2" label="Commission Mandate" name="mandate">
                                                <TextArea rows={4} />
                                            </Form.Item>
                                        </div>
                                        <div className='pt-5'>
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
                                                        options={headTitle}
                                                        placeholder="Select title"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    className="md:col-span-3"
                                                    label="Profession"
                                                    name="profession"
                                                    rules={rules.required}
                                                >
                                                    <Input size="large" placeholder="e.g., Engineer" />
                                                </Form.Item>
                                            </div>

                                            <ContactInputGroup rules={rules} initial />
                                            <SectionHeader
                                                title="Additional Contacts"
                                                description="Optional secondary contact information"
                                                className="mt-8"
                                            />
                                            <Form.List name="CSContact">
                                                {(fields, { add, remove }) => (
                                                    <div className="space-y-4">
                                                        {fields.map(({ key, name, ...rest }) => (
                                                            <div key={key}>
                                                                <ContactInputGroup
                                                                    rules={rules}
                                                                    prefix={name}
                                                                    remove={remove}
                                                                    rest={rest}
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
                                                            Add Principle Secretary&#39;s Contact
                                                        </Button>
                                                    </div>
                                                )}
                                            </Form.List>

                                        </div>


                                    </>

                                )}

                                {getFieldValue("contactType")==="Board"&&(
                                    <>
                                        <SectionHeader
                                            description="Basic information about the Board"
                                            title='Board Details'/>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Form.Item rules={rules.required} label="Board Name" name="name">
                                                <Input size={'large'}/>
                                            </Form.Item>
                                            <Form.Item rules={rules.required} label="State Department" name="stateDepartment">
                                                <Input size={"large"} />
                                            </Form.Item>
                                            <Form.Item rules={rules.required} className="md:col-span-2" label="Board Mandate" name="mandate">
                                                <TextArea rows={4} />
                                            </Form.Item>
                                        </div>
                                        <div className='pt-5'>
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
                                                        options={headTitle}
                                                        placeholder="Select title"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    className="md:col-span-3"
                                                    label="Profession"
                                                    name="profession"
                                                    rules={rules.required}
                                                >
                                                    <Input size="large" placeholder="e.g., Engineer" />
                                                </Form.Item>
                                            </div>

                                            <ContactInputGroup rules={rules} initial />
                                            <SectionHeader
                                                title="Additional Contacts"
                                                description="Optional secondary contact information"
                                                className="mt-8"
                                            />
                                            <Form.List name="CSContact">
                                                {(fields, { add, remove }) => (
                                                    <div className="space-y-4">
                                                        {fields.map(({ key, name, ...rest }) => (
                                                            <div key={key}>
                                                                <ContactInputGroup
                                                                    rules={rules}
                                                                    prefix={name}
                                                                    remove={remove}
                                                                    rest={rest}
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
                                                            Add Principle Secretary&#39;s Contact
                                                        </Button>
                                                    </div>
                                                )}
                                            </Form.List>

                                        </div>


                                    </>

                                )}

                                {getFieldValue("contactType") === "Learning Institution" && (
                                    <>
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
                                            <div className='pt-5'>
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
                                                            options={institutionHead}
                                                            placeholder="Select title"
                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        className="md:col-span-3"
                                                        label="Profession"
                                                        name="profession"
                                                        rules={rules.required}
                                                    >
                                                        <Input size="large" placeholder="e.g., Engineer" />
                                                    </Form.Item>
                                                </div>

                                                <ContactInputGroup rules={rules} initial />
                                                <SectionHeader
                                                    title="Additional Contacts"
                                                    description="Optional secondary contact information"
                                                    className="mt-8"
                                                />
                                                <Form.List name="CSContact">
                                                    {(fields, { add, remove }) => (
                                                        <div className="space-y-4">
                                                            {fields.map(({ key, name, ...rest }) => (
                                                                <div key={key}>
                                                                    <ContactInputGroup
                                                                        rules={rules}
                                                                        prefix={name}
                                                                        remove={remove}
                                                                        rest={rest}
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
                                                                Add Principle Secretary&#39;s Contact
                                                            </Button>
                                                        </div>
                                                    )}
                                                </Form.List>

                                            </div>

                                        </motion.div>
                                    </>
                                )}

                            </AnimatePresence>
                        )}
                    </Form.Item>

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

export default PublicOrganizationProfile;