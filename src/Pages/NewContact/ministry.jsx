import {useEffect, useState} from "react";
import Heading from "../../Components/Headings/Heading.jsx";
import {useForm} from "antd/es/form/Form.js";
import {Button, Collapse, Divider, Form, Input, message, Select, Tooltip} from "antd";
import {CaretRightOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {Step, StepLabel, Stepper} from "@mui/material";
import {
    getFromSessionStorage,
    removeSessionItem,
    setSessionStorage
} from "../../utils/SessionStorage/sessionStorage.js";
import {
    Email,
    Home,
    LocalPostOffice,
    LocationCity,
    LocationOn,
    Person,
    PhoneAndroidRounded,
    StreetviewTwoTone,
    Work,
    WorkOutline,
} from "@mui/icons-material";
import TextArea from "antd/es/input/TextArea.js";
import {AnimatePresence, motion} from "framer-motion";
import {useDispatch} from "react-redux";
import {createMinistry} from "../../Redux/Reducers/contactsSlice.js";
import {useNavigate} from "react-router-dom";

const Ministry = () => {
    const [form] = useForm();
    const [form1] = useForm();
    const [form2] = useForm();

    const ministry = getFromSessionStorage("ministry");
    const contacts = getFromSessionStorage("contacts");
    const address = getFromSessionStorage("address");

    useEffect(() => {
        form.setFieldsValue(ministry);
        form1.setFieldsValue(
            contacts || {
                contacts: [
                    {
                        name: null,
                        Office: null,
                        salutation: null,
                        contactDetails:[{phoneNumber:null,email:null,type:null}]
                    },
                ],
            }
        );
        form2.setFieldsValue(address);
    }, [form, form1, form2, ministry, contacts, address]);

    const [currentStep, setCurrentStep] = useState(0);
    const prevStep = () => setCurrentStep((prev) => prev - 1);
    const nextStep = () => setCurrentStep((prev) => prev + 1);

    const onFormFinish = (values) => {
        if (values.types==='Ministry') {
            values.ministryData ={
                name:`Ministry of ${values.ministry}`,
                sector:values.sector,
                mandate:values.mandate,
                type:values.types
            }
        }else {
            values.ministryData ={
                name:`Office of The ${values.OfficeType}`,
                sector:"Executive",
                mandate:'Country Governance',
                type:values.types
            }
        }

        values.CsContatcs=values.CSContact?[{phoneNumber: values.phoneNumber, email: values.email, type: values.type},...values.CSContact]:
            [{phoneNumber: values.phoneNumber, email: values.email, type: values.type}]
        setSessionStorage("ministry", values);
        nextStep();
    };

    const onFormFinish1 = (values) => {
        values.ministryContact = values.contacts.flatMap((contact)=>{
            return contact.contactDetails.map(item=>({
                name:contact.name,
                office:contact.Office,
                profession:contact.profession,
                salutation:contact.salutation,
                phoneNumber:item.phoneNumber,
                email:item.email,
                type:item.type,
            }))
        })
        setSessionStorage("contacts", values);
        nextStep();
    };

    const onFormFinish2 = (values) => {
        values.Address =values.address? [{building:values.hqbuilding,city:values.hqcity,state:values.hqcountry,postalCode:values.hqpostalCode,street:values.hqstreet},...values.address]:
            [{building:values.hqbuilding,city:values.hqcity,state:values.hqcountry,postalCode:values.hqpostalCode,street:values.hqstreet}]
        values.headquarters={building:values.hqbuilding,city:values.hqcity,country:values.hqcountry,postalCode:values.hqpostalCode,street:values.hqstreet}
        setSessionStorage("address", values);
        nextStep();
    };

    const type = ["Home", "Work"].map((item) => ({
        label: item,
        value: item,
    }));

    const steps = [
        { title: "Ministry Profile", content: "ministry_profile" },
        { title: "Ministry Contacts", content: "ministry_contacts" },
        { title: "Ministry Addresses", content: "ministry_address" },
        { title: "Confirm Details", content: "confirm_details" },
    ].map((step, index) => ({
        ...step,
        key: index,
    }));

    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate()
    const handleSubmit = async () => {
        const CSDetails = ministry?.CsContatcs.map((item) => ({
            name:ministry.name,
            office:ministry?.types ==="Ministry"?"Cabinet Secretary":ministry.OfficeType,
            profession:ministry.profession,
            salutation:ministry.salutation,
            ...item
        }))

        contacts.ministryContact.push(...CSDetails);
        const people = [...new Map(contacts.ministryContact.map((item)=>[item.name,item])).values(),
        ].map((person)=>({
            full_name: person.name,
            profession:person.profession,
            salutation:person.salutation,
            office:person.office
        }))

        const formatData = {
            ministryContact:contacts.ministryContact,
            headquarters:address.headquarters,
            ministryData:ministry.ministryData,
            address:address.address,
            people,
        };

        await dispatch(createMinistry(formatData)).then(action=>{
            action.error?
                messageApi.error(action.payload.message):
                messageApi.success(action.payload.message).then(()=>{
                    removeSessionItem('address')
                    removeSessionItem('contacts')
                    removeSessionItem('ministry')
                    navigate('/')
                })
        })
    };

    // Framer Motion animation variants
    const variants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    const headSalutation = ['Mr.','Mrs.','Miss.','Ms.','Prof.','Dr.','Eng.','EGH', 'H.E.','Hon.','Capt.','Col.',
        'Maj.','Rev.','Bishop','Sheikh','Sir','Dame'
    ].map(item => ({
        label: item.toUpperCase(),
        value: item.toUpperCase(),
    }))

    const rules = {
        required:[{required: true,message:"Required Field"}]
    }

    const ministryType = ["Ministry",'Presidency'].map(item=>({
        label: item,
        value: item,
    }))

    const officeType = ["President",'Deputy President'].map(item=>({
        label: item,
        value: item,
    }))

    const ministryProfile = () => {
      return (
          <motion.div
              key="step0"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
          >
              <Form form={form} name="ministry" layout="vertical" initialValues={{ remember: true }} onFinish={onFormFinish}>
                  <div>
                      <Form.Item rules={rules.required} label="Select Type" name='types'>
                          <Select
                              size={"large"}
                              options={ministryType}
                          />
                      </Form.Item>
                  </div>
                  <Form.Item shouldUpdate>
                      {({getFieldValue})=>(
                          <>

                              {getFieldValue('types')==='Ministry'&&(
                                  <>
                                      <div className="grid md:grid-cols-2 gap-4">
                                          <Form.Item rules={rules.required} label="Ministry" name="ministry">
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <Form.Item rules={rules.required} label="Sector" name="sector">
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <Form.Item rules={rules.required} className="col-span-2" label="Ministry Mandate" name="mandate">
                                              <TextArea rows={4} />
                                          </Form.Item>
                                      </div>
                                      <div className="pt-5 pb-3">
                                          <label className="text-lg font-bold font-sans">C.S Contact Information</label>
                                      </div>
                                      <div className="grid md:grid-cols-3 gap-4">
                                          <Form.Item rules={rules.required} label="C.S Salutation" name="salutation">
                                              <Select
                                                  size={"large"}
                                                  options={headSalutation}
                                                  tokenSeparators={[',']}
                                                  mode={"tags"}
                                              />
                                          </Form.Item>
                                          <Form.Item rules={rules.required} label="C.S Name" name="name">
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <Form.Item rules={rules.required} label="Profession" name="profession">
                                              <Input size={"large"} />
                                          </Form.Item>

                                      </div>
                                      <div className="grid md:grid-cols-3 gap-4">
                                          <Form.Item rules={rules.required} label="Phone Number" name="phoneNumber">
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <Form.Item rules={rules.required} label="Email" name="email">
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <Form.Item rules={rules.required} label="Contact Type" name="type">
                                              <Select size={"large"} options={type} />
                                          </Form.Item>
                                      </div>
                                      <Form.List name={"CSContact"}>
                                          {(fields, { add, remove }) => (
                                              <>
                                                  {fields.map(({ key, name, ...restFields }) => (
                                                      <div key={key}>
                                                          <div className="grid md:grid-cols-12 gap-4">
                                                              <Form.Item rules={rules.required} className="md:col-span-4" {...restFields} label="Phone Number" name={[name, "phoneNumber"]}>
                                                                  <Input size={"large"} />
                                                              </Form.Item>
                                                              <Form.Item rules={rules.required} className="md:col-span-4" {...restFields} label="Email" name={[name, "email"]}>
                                                                  <Input size={"large"} />
                                                              </Form.Item>
                                                              <Form.Item rules={rules.required} className="md:col-span-3" {...restFields} label="Contact Type" name={[name, "type"]}>
                                                                  <Select size={"large"} options={type} />
                                                              </Form.Item>
                                                              <div className="flex justify-center items-center">
                                                                  <Tooltip title="Remove Contact">
                                                                      <MinusCircleOutlined onClick={() => remove(name)} />
                                                                  </Tooltip>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  ))}
                                                  <Form.Item>
                                                      <Button className="mt-4" type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                          Add Cabinet Secretary Contact
                                                      </Button>
                                                  </Form.Item>
                                              </>
                                          )}
                                      </Form.List>
                                  </>
                              )}
                              {getFieldValue('types')==='Presidency'&&(
                                  <>
                                      <Form.Item rules={rules.required} label="Office" name='OfficeType'>
                                          <Select
                                              options={officeType}
                                              size={"large"}
                                          />
                                      </Form.Item>
                                      {getFieldValue('OfficeType')==='President'&&(
                                          <>
                                              <div className="pt-5 pb-3">
                                                  <label className="text-lg font-bold font-sans">{"President's Information"}</label>
                                              </div>
                                              <div className="grid md:grid-cols-3 gap-4">
                                                  <Form.Item rules={rules.required} label="President's Salutation" name="salutation">
                                                      <Select
                                                          size={"large"}
                                                          options={headSalutation}
                                                          tokenSeparators={[',']}
                                                          mode={"tags"}
                                                      />
                                                  </Form.Item>
                                                  <Form.Item rules={rules.required} label="President's Name" name="name">
                                                      <Input size={"large"} />
                                                  </Form.Item>
                                                  <Form.Item rules={rules.required} label="Profession" name="profession">
                                                      <Input size={"large"} />
                                                  </Form.Item>
                                              </div>
                                              <div className="grid md:grid-cols-3 gap-4">
                                                  <Form.Item rules={rules.required} label="Phone Number" name="phoneNumber">
                                                      <Input size={"large"} />
                                                  </Form.Item>
                                                  <Form.Item rules={rules.required} label="Email" name="email">
                                                      <Input size={"large"} />
                                                  </Form.Item>
                                                  <Form.Item rules={rules.required} label="Contact Type" name="type">
                                                      <Select size={"large"} options={type} />
                                                  </Form.Item>
                                              </div>
                                              <Form.List name={"CSContact"}>
                                                  {(fields, { add, remove }) => (
                                                      <>
                                                          {fields.map(({ key, name, ...restFields }) => (
                                                              <div key={key}>
                                                                  <div className="grid md:grid-cols-12 gap-4">
                                                                      <Form.Item rules={rules.required} className="md:col-span-4" {...restFields} label="Phone Number" name={[name, "phoneNumber"]}>
                                                                          <Input size={"large"} />
                                                                      </Form.Item>
                                                                      <Form.Item rules={rules.required} className="md:col-span-4" {...restFields} label="Email" name={[name, "email"]}>
                                                                          <Input size={"large"} />
                                                                      </Form.Item>
                                                                      <Form.Item rules={rules.required} className="md:col-span-3" {...restFields} label="Contact Type" name={[name, "type"]}>
                                                                          <Select size={"large"} options={type} />
                                                                      </Form.Item>
                                                                      <div className="flex justify-center items-center">
                                                                          <Tooltip title="Remove Contact">
                                                                              <MinusCircleOutlined onClick={() => remove(name)} />
                                                                          </Tooltip>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          ))}
                                                          <Form.Item>
                                                              <Button className="mt-4" type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                                  {"Add President's Contact"}
                                                              </Button>
                                                          </Form.Item>
                                                      </>
                                                  )}
                                              </Form.List>

                                          </>
                                      )}

                                      {getFieldValue('OfficeType')==='Deputy President'&&(
                                          <>
                                              <div className="pt-5 pb-3">
                                                  <label className="text-lg font-bold font-sans">{"Deputy President's Information"}</label>
                                              </div>
                                              <div className="grid md:grid-cols-3 gap-4">
                                                  <Form.Item rules={rules.required} label="Deputy President's Salutation" name="salutation">
                                                      <Select
                                                          size={"large"}
                                                          options={headSalutation}
                                                          tokenSeparators={[',']}
                                                          mode={"tags"}
                                                      />
                                                  </Form.Item>
                                                  <Form.Item rules={rules.required} label="Deputy President's Name" name="name">
                                                      <Input size={"large"} />
                                                  </Form.Item>
                                                  <Form.Item rules={rules.required} label="Profession" name="profession">
                                                      <Input size={"large"} />
                                                  </Form.Item>
                                              </div>
                                              <div className="grid md:grid-cols-3 gap-4">
                                                  <Form.Item rules={rules.required} label="Phone Number" name="phoneNumber">
                                                      <Input size={"large"} />
                                                  </Form.Item>
                                                  <Form.Item rules={rules.required} label="Email" name="email">
                                                      <Input size={"large"} />
                                                  </Form.Item>
                                                  <Form.Item rules={rules.required} label="Contact Type" name="type">
                                                      <Select size={"large"} options={type} />
                                                  </Form.Item>
                                              </div>
                                              <Form.List name={"CSContact"}>
                                                  {(fields, { add, remove }) => (
                                                      <>
                                                          {fields.map(({ key, name, ...restFields }) => (
                                                              <div key={key}>
                                                                  <div className="grid md:grid-cols-12 gap-4">
                                                                      <Form.Item rules={rules.required} className="md:col-span-4" {...restFields} label="Phone Number" name={[name, "phoneNumber"]}>
                                                                          <Input size={"large"} />
                                                                      </Form.Item>
                                                                      <Form.Item rules={rules.required} className="md:col-span-4" {...restFields} label="Email" name={[name, "email"]}>
                                                                          <Input size={"large"} />
                                                                      </Form.Item>
                                                                      <Form.Item rules={rules.required} className="md:col-span-3" {...restFields} label="Contact Type" name={[name, "type"]}>
                                                                          <Select size={"large"} options={type} />
                                                                      </Form.Item>
                                                                      <div className="flex justify-center items-center">
                                                                          <Tooltip title="Remove Contact">
                                                                              <MinusCircleOutlined onClick={() => remove(name)} />
                                                                          </Tooltip>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          ))}
                                                          <Form.Item>
                                                              <Button className="mt-4" type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                                  {"Add Deputy President's Contact"}
                                                              </Button>
                                                          </Form.Item>
                                                      </>
                                                  )}
                                              </Form.List>

                                          </>

                                      )}
                                  </>
                              )}

                          </>
                      )}
                  </Form.Item>
                  <div className="flex justify-end items-center">
                      <Button className="w-36" htmlType={"submit"} type="primary">
                          Next
                      </Button>
                  </div>
              </Form>
          </motion.div>
      )
    }

    const ministryContacts = () => {
        return (
            <motion.div
                key="step1"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
            >
                <Form
                    form={form1}
                    name="Contacts"
                    layout="vertical"
                    initialValues={{remember: true,contacts: [{ contactDetails: [{}] }]}}
                    onFinish={onFormFinish1}
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
                                                        label="Office/Title"
                                                        rules={rules.required}
                                                        className='w-full md:col-span-3'
                                                        name={[name, 'Office']}
                                                        {...restFields}
                                                    >
                                                        <Input size="large" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label="Contact Name"
                                                        rules={rules.required}
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
                                                        />                                                    </Form.Item>
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
                    <div className='flex justify-end align-middle gap-3'>
                        <Button className='w-24' onClick={prevStep} danger type="dashed">Back</Button>
                        <Button className='w-24' htmlType={"submit"} type="primary">Next</Button>

                    </div>
                </Form>
            </motion.div>
        );
    };

    const ministryAddress = () => {
      return (
          <motion.div
              key="step2"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
          >
              <Form form={form2} name="address" layout="vertical" initialValues={{ remember: true }} onFinish={onFormFinish2}>
                  <div className="mt-4">
                      <label className="text-lg font-sans font-semibold">Head Office Address</label>
                      <div className="grid md:grid-cols-12 gap-4">
                          <Form.Item rules={rules.required} className="md:col-span-3" label="Street" name="hqstreet">
                              <Input size={"large"} />
                          </Form.Item>
                          <Form.Item rules={rules.required} className="md:col-span-3" label="City" name="hqcity">
                              <Input size={"large"} />
                          </Form.Item>
                          <Form.Item  rules={rules.required} className="md:col-span-2" label="Country" name="hqcountry">
                              <Input size={"large"} />
                          </Form.Item>
                          <Form.Item rules={rules.required} className="md:col-span-2" label="Building" name="hqbuilding">
                              <Input size={"large"} />
                          </Form.Item>
                          <Form.Item rules={rules.required} className="md:col-span-2" label="Potal Code" name="hqpostalCode">
                              <Input size={"large"} />
                          </Form.Item>
                      </div>
                  </div>

                  <div>
                      <label className="text-lg font-sans font-semibold">Other Address</label>
                  </div>

                  <Form.List name={"address"}>
                      {(fields, { add, remove }) => (
                          <>
                              {fields.map(({ key, name, ...restFields }) => (
                                  <div key={key}>
                                      <div className="grid md:grid-cols-12 gap-4">
                                          <Form.Item rules={rules.required} className="md:col-span-2" {...restFields} label="Street" name={[name, "street"]}>
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <Form.Item rules={rules.required} className="md:col-span-3" {...restFields} label="City" name={[name, "city"]}>
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <Form.Item rules={rules.required} className="md:col-span-2" {...restFields} label="Country" name={[name, "state"]}>
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <Form.Item rules={rules.required} className="md:col-span-2" {...restFields} label="Building" name={[name, "building"]}>
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <Form.Item rules={rules.required} className="md:col-span-2" {...restFields} label="Potal Code" name={[name, "postalCode"]}>
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <div className="flex justify-center items-center">
                                              <Tooltip title="Remove Address">
                                                  <MinusCircleOutlined onClick={() => remove(name)} />
                                              </Tooltip>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                              <Form.Item>
                                  <Button className="mt-4" type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                      Add Address
                                  </Button>
                              </Form.Item>
                          </>
                      )}
                  </Form.List>

                  <div className="flex justify-end items-center gap-3">
                      <Button className="w-24" onClick={prevStep} danger type="dashed">
                          Back
                      </Button>
                      <Button className="w-24" htmlType={"submit"} type="primary">
                          Next
                      </Button>
                  </div>
              </Form>
          </motion.div>
      )
    }

    const ministryReview = () => {
      return(
          <motion.div
              key="step3"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
          >
              <div className="pt-5">
                  <Collapse
                      accordion
                      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                  >
                      <Collapse.Panel header={ministry.types ==="Ministry"?"Ministry Details":`Office of the ${ministry.OfficeType} details.`} key="1">
                          <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-row gap-2">
                                  <h2 className="text-lg font-bold">{ministry.types ==="Ministry"?'Ministry:':"Office: "}</h2>
                                  <h2 className="text-lg font-semibold">{ministry?.ministryData.name}</h2>
                              </div>
                              <div className="flex flex-row gap-2">
                                  <h2 className="text-lg font-bold">Sector:</h2>
                                  <h2 className="text-lg font-semibold">{ministry?.ministryData.sector}</h2>
                              </div>
                          </div>
                          <div className="flex flex-row gap-2">
                              <h2 className="text-lg font-bold">Mandate:</h2>
                              <h2 className="text-lg font-semibold">{ministry?.ministryData.mandate}</h2>
                          </div>
                          <div className="flex justify-end items-center">
                              <Button onClick={() => setCurrentStep(0)} type="link">
                                  Update
                              </Button>
                          </div>
                      </Collapse.Panel>
                      <Collapse.Panel header={ministry.types ==="Ministry"?"Cabinet Secretary Details":`${ministry.OfficeType}'s details.`} key="2">
                          <div className="grid gap-2">
                              <div className='grid grid-cols-2'>
                                  <div className="flex flex-row gap-2">
                                      <h2 className="text-lg font-bold">{ministry.types ==="Ministry"?"Cabinet Secretary Name:":`${ministry.OfficeType}'s Name:`}</h2>
                                      <h2 className="text-lg font-semibold">{ministry?.salutation.join(', ') + " " + ministry?.name.toUpperCase()}</h2>
                                  </div>
                                  <div className="flex flex-row gap-2">
                                      <h2 className="text-lg font-bold">Profession:</h2>
                                      <h2 className="text-lg font-semibold">{ministry?.profession}</h2>
                                  </div>

                              </div>

                              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
                                  {ministry?.CsContatcs?.map((item, index) => (
                                      <div key={index}>
                                          <div className="shadow-2xl bg-gray-400 rounded-lg p-3">
                                              <div className="flex gap-2 flex-row items-center">
                                                  <PhoneAndroidRounded />
                                                  <h2 className="text-md font-semibold font-sans">{item?.phoneNumber}</h2>
                                              </div>
                                              <div className="flex gap-2 flex-row items-center">
                                                  <Email />
                                                  <h2 className="text-md font-semibold font-sans">{item?.email}</h2>
                                              </div>
                                              <div className="flex gap-2 flex-row items-center">
                                                  {item.type === "Home" ? <Home /> : <Work />}
                                                  <h2 className="text-md font-semibold font-sans">{item?.type}</h2>
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                          <div className="flex justify-end items-center">
                              <Button onClick={() => setCurrentStep(0)} type="link">
                                  Update
                              </Button>
                          </div>
                      </Collapse.Panel>
                      <Collapse.Panel header={ministry.types ==="Ministry"?"Ministry Contacts":`Office of the ${ministry.OfficeType} contacts.`} key="3">
                          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-5">
                              {contacts?.ministryContact?.map((item, index) => (
                                  <div key={index}>
                                      <div className="bg-gray-400 rounded-lg p-3">
                                          <div className="flex gap-2 flex-row items-center">
                                              <Person />
                                              <h2 className="text-md font-semibold font-sans">{item?.name}</h2>
                                          </div>
                                          <div className="flex gap-2 flex-row items-center">
                                              <WorkOutline />
                                              <h2 className="text-md font-semibold font-sans">{item?.office}</h2>
                                          </div>
                                          <div className="flex gap-2 flex-row items-center">
                                              <PhoneAndroidRounded />
                                              <h2 className="text-md font-semibold font-sans">{item?.phoneNumber}</h2>
                                          </div>
                                          <div className="flex gap-2 flex-row items-center">
                                              <Email />
                                              <h2 className="text-md font-semibold font-sans">{item?.email}</h2>
                                          </div>
                                          <div className="flex gap-2 flex-row items-center">
                                              {item.type === "Home" ? <Home /> : <Work />}
                                              <h2 className="text-md font-semibold font-sans">{item?.type}</h2>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                          <div className="flex justify-end items-center">
                              <Button onClick={() => setCurrentStep(1)} type="link">
                                  Update
                              </Button>
                          </div>
                      </Collapse.Panel>
                      <Collapse.Panel header="Addresses" key="4">
                          <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-6">
                              {address?.Address?.map((item, index) => (
                                  <div key={index}>
                                      <div className="bg-gray-400 rounded-lg p-3">
                                          <div className="flex gap-2 flex-row items-center">
                                              <StreetviewTwoTone />
                                              <h2 className="text-md font-semibold font-sans">{item?.street}</h2>
                                          </div>
                                          <div className="flex gap-2 flex-row items-center">
                                              <LocationCity />
                                              <h2 className="text-md font-semibold font-sans">{item?.city}</h2>
                                          </div>
                                          <div className="flex gap-2 flex-row items-center">
                                              <LocationOn />
                                              <h2 className="text-md font-semibold font-sans">{item?.state}</h2>
                                          </div>
                                          <div className="flex gap-2 flex-row items-center">
                                              <LocalPostOffice />
                                              <h2 className="text-md font-semibold font-sans">{item?.postalCode}</h2>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                          <div className="flex justify-end items-center">
                              <Button onClick={() => setCurrentStep(2)} type="link">
                                  Update
                              </Button>
                          </div>
                      </Collapse.Panel>
                  </Collapse>
                  <div className="flex justify-end items-center pt-5 gap-3">
                      <Button className="w-24" onClick={handleSubmit} type="primary">
                          Submit
                      </Button>
                  </div>
              </div>
          </motion.div>
      )
    }



    return (
        <div className="p-8">
            {contextHolder}
            <Heading title={"New Ministry"} subtitle={"Add a new government ministry"} />

            <Stepper activeStep={currentStep} alternativeLabel>
                {steps.map((item) => (
                    <Step key={item.key}>
                        <StepLabel>
                            <label className="text-lg font-sans">{item.title}</label>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            <AnimatePresence exitBeforeEnter>
                {currentStep===0 && ministryProfile()}
                {currentStep===1 && ministryContacts()}
                {currentStep===2 && ministryAddress()}
                {currentStep===3 && ministryReview()}
            </AnimatePresence>
        </div>
    );
};

export default Ministry;
