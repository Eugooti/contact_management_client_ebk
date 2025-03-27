import {Button, Divider, Form, Input, Select, Tooltip} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {motion} from "framer-motion";
import {getFromSessionStorage, setSessionStorage} from "../../../utils/SessionStorage/sessionStorage.js";
import {useForm} from "antd/es/form/Form.js";
import {useEffect} from "react";
import {headSalutation} from "../../../utils/StaticData.js";
import SectionHeader from "../../../Components/Headings/SectionHeading.jsx";

// eslint-disable-next-line react/prop-types
const ContactsForm = ({nextStep, prevStep}) => {
    const [form] = useForm();



    const type = ['Home','Work'].map(item=>({
        label:item,
        value:item,
    }))

    const variants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    const rules = {
        required:[{required:true,message:"Required Field"}],
        emails:[{required:true,message:"Required Field"},{type:"email",message:"Enter a valid email address"}],
    }

    const onFormFinish = (values) => {
        // todo handle form finish
        values.organizationContact = values.contacts.flatMap((contact)=>{
            return contact.contactDetails.map(item=>({
                name:contact.name,
                Office:contact.Office,
                profession:contact.profession,
                salutation:contact.salutation,
                phoneNumber:item.phoneNumber,
                email:item.email,
                type:item.type,
            }))
        })
        setSessionStorage("contacts", values);

        nextStep()
    };

    useEffect(() => {
        form.setFieldsValue(getFromSessionStorage('contacts'));
    }, [form]);
    return (
        <motion.div
            key="step1"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
            className='mt-6'
        >
            <SectionHeader
                title={"Other Organization Contacts"}
                description={"Add contacts associated with our organization"}
            />

            <Form
                form={form}
                name="contacts"
                layout="vertical"
                // Setting an initial value for each contact's nested details
                initialValues={{
                    remember: true,
                    contacts: [{ contactDetails: [{}] }]
                }}
                onFinish={onFormFinish}
            >
                <Form.List name="contacts">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restFields }) => (
                                <div key={key}>
                                    <div className="grid md:grid-cols-12 gap-4">
                                        <div className="md:col-span-11">
                                            <div className="grid md:grid-cols-12 gap-4">
                                                <Form.Item
                                                    rules={rules.required}
                                                    label="Office/Title"
                                                    className='w-full md:col-span-3'
                                                    name={[name, 'Office']}
                                                    {...restFields}
                                                >
                                                    <Input size="large" />
                                                </Form.Item>
                                                <Form.Item
                                                    rules={rules.required}
                                                    label="Contact Name"
                                                    className='w-full md:col-span-4'
                                                    name={[name, 'name']}
                                                    {...restFields}
                                                >
                                                    <Input size="large" />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Profession"
                                                    rules={rules.required}
                                                    className='w-full md:col-span-3'
                                                    name={[name, 'profession']}
                                                    {...restFields}
                                                >
                                                    <Input size="large" />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Salutation"
                                                    rules={rules.required}
                                                    className='w-full md:col-span-2'
                                                    name={[name, 'salutation']}
                                                    {...restFields}
                                                >
                                                    <Select
                                                        size={"large"}
                                                        options={headSalutation}
                                                        tokenSeparators={[',']}
                                                        mode={"tags"}
                                                    />
                                                </Form.Item>
                                            </div>

                                            <Form.List name={[name, 'contactDetails']}>
                                                {(detailFields, { add: addDetail, remove: removeDetail }) => (
                                                    <>
                                                        {detailFields.map(({ key: detailKey, name: detailName, ...restDetailFields }) => (
                                                            <div
                                                                key={detailKey}
                                                                className="grid md:grid-cols-12 gap-4"
                                                            >
                                                                <Form.Item
                                                                    label="Phone Number"
                                                                    rules={rules.required}
                                                                    className='md:col-span-4'
                                                                    name={[detailName, 'phoneNumber']}
                                                                    {...restDetailFields}
                                                                >
                                                                    <Input size="large" />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    label="Email"
                                                                    rules={rules.emails}
                                                                    className='md:col-span-4'
                                                                    name={[detailName, 'email']}
                                                                    {...restDetailFields}
                                                                >
                                                                    <Input size="large" />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    label="Contact Type"
                                                                    rules={rules.required}
                                                                    className='md:col-span-3'
                                                                    name={[detailName, 'type']}
                                                                    {...restDetailFields}
                                                                >
                                                                    <Select size="large" options={type} />
                                                                </Form.Item>
                                                                <div className="flex justify-center mb-5 items-center">
                                                                    <Tooltip title="Remove Contact">
                                                                        <MinusCircleOutlined onClick={() => removeDetail(detailName)} />
                                                                    </Tooltip>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <Form.Item>
                                                            <Button
                                                                type="dashed"
                                                                onClick={() => addDetail()}
                                                                block
                                                                icon={<PlusOutlined />}
                                                            >
                                                                Add Person Contact
                                                            </Button>
                                                        </Form.Item>
                                                    </>
                                                )}
                                            </Form.List>
                                        </div>
                                        <div className="flex justify-center items-center">
                                            <Tooltip title="Remove Contact">
                                                <MinusCircleOutlined onClick={() => remove(name)} />
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <Divider className="bg-gray-300 h-1" />
                                </div>
                            ))}

                            <Form.Item>
                                <Button
                                    className="mt-4"
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Add Contact
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <div className="flex justify-end items-center gap-3">
                    <Button className="w-24" onClick={prevStep} danger type="dashed">
                        Back
                    </Button>
                    <Button className="w-24" htmlType="submit" type="primary">
                        Next
                    </Button>
                </div>
            </Form>
        </motion.div>
    )
}

export default ContactsForm