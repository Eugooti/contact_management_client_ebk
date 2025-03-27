import Heading from "../../Components/Headings/Heading.jsx";
import {useForm} from "antd/es/form/Form.js";
import {Collapse, Divider, Form, Input, InputNumber, message, Select, Tooltip} from "antd";
import Button from "antd/es/button/index.js";
import TextArea from "antd/es/input/TextArea.js";
import {CaretRightOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {AnimatePresence, motion} from "framer-motion";
import {useEffect, useState} from "react";
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
    WorkOutline
} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {createParasatal} from "../../Redux/Reducers/contactsSlice.js";
import {useNavigate} from "react-router-dom";


const NewParastatal = () => {
    const [form] = useForm();
    const [form1] = useForm();
    const [form2] = useForm();

    const [currentStep, setCurrentStep] = useState(0);
    const prevStep = () => setCurrentStep((prev) => prev - 1);
    const nextStep = () => setCurrentStep((prev) => prev + 1);

    const steps = [
        { title: "Parastatal Profile", content: "parastatal_profile" },
        { title: "Parastatal Contacts", content: "parastatal_contacts" },
        { title: "Parastatal Addresses", content: "parastatal_address" },
        { title: "Confirm Details", content: "confirm_details" },
    ].map((step, index) => ({
        ...step,
        key: index,
    }));

    const headTitle = ['Chief Executive Officer','Director','Manager','Principle Manager'].map(item=>({
        label:item,
        value:item,
    }))
    const headSalutation = ['Mr.','Mrs.','Miss.','Ms.','Prof.','Dr.','Eng.','EGH', 'H.E.','Hon.','Capt.','Col.',
        'Maj.','Rev.','Bishop','Sheikh','Sir','Dame'
    ].map(item => ({
        label: item.toUpperCase(),
        value: item.toUpperCase(),
    }));

    const type = ['Home','Work'].map(item=>({
        label:item,
        value:item,
    }))


    const variants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    const parastatal = getFromSessionStorage("parastatal");
    const contacts = getFromSessionStorage("contacts");
    const address = getFromSessionStorage("address");

    useEffect(() => {
        form.setFieldsValue(parastatal);
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
    }, [form, form1, form2, parastatal, contacts, address]);


    const onFormFinish = (values) => {
        // todo handle form finish

        if (values.types==='State department'||values.types==='Parastatal'){
            values.parastatalData = {
                mandate:values.mandate,
                name:values.name,
                ministry:values.ministry,
                type:values.types

            }
        }
        else if (values.types==='County'){
            values.parastatalData = {
                capital:values.capital,
                name:`County Government of ${values.name}`,
                region:values.region,
                type:values.types,
                countyCode:values.code,
            }
        }
        else if (values.types==='University'){
            values.parastatalData = {
                name:values.name,
                uniType:values.uniType,
                type:values.types,
            }
        }
        values.HeadContact = values.headContacts?[{phoneNumber: values.headPhone, email: values.headmail, type: values.headType},...values.headContacts]:
            [{phoneNumber: values.headPhone, email: values.headmail, type: values.headType}]

        setSessionStorage('parastatal',values)
        nextStep()
    };

    const onFormFinish1 = (values) => {
        // todo handle form finish
        values.parastatalContact = values.contacts.flatMap((contact)=>{
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


    const onFormFinish2 = (values) => {
        // todo handle form finish
        values.Address =values.address? [{building:values.hqbuilding,city:values.hqcity,state:values.hqcountry,postalCode:values.hqpostalCode,street:values.hqstreet},...values.address]:
            [{building:values.hqbuilding,city:values.hqcity,country:values.hqcountry,postalCode:values.hqpostalCode,street:values.hqstreet}]
        values.headquarters={building:values.hqbuilding,city:values.hqcity,country:values.hqcountry,postalCode:values.hqpostalCode,street:values.hqstreet}
        setSessionStorage("address", values);
        nextStep();
    };


    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const handleSubmit = () => {
        const headOfficeContacts = parastatal?.HeadContact.map((item) => ({
            name: parastatal.headName,
            Office:
                parastatal.types === "University" ? "Vice Chancellor" :
                    parastatal.types === "Parastatal" ? parastatal.headTitle :
                        parastatal.types === "County" ? "Governor" :
                            parastatal.types === "State department" ? "Principle Secretary" :
                                null, // Default value if none match
            profession: parastatal.profession,
            salutation: parastatal.headSalutation,
            ...item
        }));

        contacts.parastatalContact.push(...headOfficeContacts);
        const people = [...new Map(contacts.parastatalContact.map((item)=>[item.name,item])).values(),
        ].map((person)=>({
            full_name: person.name,
            profession:person.profession,
            salutation:person.salutation,
            office:person.Office
        }))

        const formatData = {
            parastatalContact:contacts.parastatalContact,
            headquarters:address.headquarters,
            parastatalData:parastatal.parastatalData,
            address:address.address,
            people,
        };
        dispatch(createParasatal(formatData)).then(action=>{
            action.error?
                messageApi.error(action.payload.message):
                messageApi.success(action.payload.message).then(()=>{
                    removeSessionItem('address')
                    removeSessionItem('contacts')
                    removeSessionItem('parastatal')
                    navigate('/')
                })
        })
    };

    const organizationType = ['State department','Parastatal','County','University'].map(item=>({
        label:item,
        value:item,
    }))

    const uniType = ['Public','Private'].map(item=>({
        label:item,
        value:item,
    }))


    const rules = {
        required:[{required:true,message:"Required Field"}],
        emails:[{required:true,message:"Required Field"},{type:"email",message:"Enter a valid email address"}],
    }

    const parastatalProfile = () => {
      return (
          <motion.div
              key="step0"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className='mt-7'
          >

              <Form
                  form={form}
                  name="profile"
                  layout="vertical"
                  initialValues={{remember: true}}
                  onFinish={onFormFinish}
              >
                  <div>
                      <Form.Item rules={rules.required} label="Select Organization" name='types'>
                          <Select
                              size={"large"}
                              options={organizationType}
                          />
                      </Form.Item>
                  </div>

                  <Form.Item shouldUpdate>
                      {({getFieldValue})=>(
                          <>
                              {getFieldValue('types')==='State department'&&(
                                          <>
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  <Form.Item rules={rules.required} label="State Department" name="name">
                                                      <Input size={'large'}/>
                                                  </Form.Item>
                                                  <Form.Item rules={rules.required} label="Ministry" name="ministry">
                                                      <Input size={"large"} />
                                                  </Form.Item>
                                                  <Form.Item rules={rules.required} className="md:col-span-2" label="State Department Mandate" name="mandate">
                                                      <TextArea rows={4} />
                                                  </Form.Item>
                                              </div>

                                              <div className='pt-5 pb-3'>
                                                  <label className='text-lg font-bold font-sans'>Principle Secretary Details</label>
                                              </div>
                                              <div className='grid md:grid-cols-3 gap-4'>
                                                  <Form.Item rules={rules.required}  label="Full Name" name="headName">
                                                      <Input size={"large"}/>
                                                  </Form.Item>
                                                  <Form.Item rules={rules.required} label='Profession'  name='profession'>
                                                      <Input size={"large"}/>
                                                  </Form.Item>
                                                  <Form.Item rules={rules.required} label="Principle Secretary Salutation" name='headSalutation'>
                                                      <Select
                                                          size={"large"}
                                                          options={headSalutation}
                                                          tokenSeparators={[',']}
                                                          mode={"tags"}
                                                      />
                                                  </Form.Item>

                                              </div>

                                              <div className='grid md:grid-cols-3 gap-3'>
                                                  <Form.Item rules={rules.required} label="Phone Number" name='headPhone'>
                                                      <Input size={"large"}/>
                                                  </Form.Item>
                                                  <Form.Item rules={rules.emails} label="Email" name='headmail'>
                                                      <Input size={"large"}/>
                                                  </Form.Item>
                                                  <Form.Item rules={rules.required} label='Contact Type' name='headType'>
                                                      <Select
                                                          size={"large"}
                                                          options={type}
                                                      />
                                                  </Form.Item>
                                              </div>

                                              <Form.List name={'headContacts'}>
                                                  {(fields,{add,remove})=>(
                                                      <>
                                                          {fields.map(({key, name, ...restFields})=>(
                                                              <div key={key}>
                                                                  <div className='grid md:grid-cols-12 gap-4'>
                                                                      <Form.Item rules={rules.required} className='md:col-span-4' {...restFields} label="Phone Number" name={[name,'phoneNumber']}>
                                                                          <Input size={"large"}/>
                                                                      </Form.Item>
                                                                      <Form.Item rules={rules.emails} className='md:col-span-4' {...restFields} label="Email" name={[name,'email']}>
                                                                          <Input size={"large"}/>
                                                                      </Form.Item>
                                                                      <Form.Item rules={rules.required} className='md:col-span-3' {...restFields} label='Contact Type' name={[name,'type']}>
                                                                          <Select
                                                                              size={"large"}
                                                                              options={type}
                                                                          />
                                                                      </Form.Item>
                                                                      <div className='flex justify-center align-middle' >
                                                                          <Tooltip title="Remove Contact">
                                                                              <MinusCircleOutlined onClick={() => remove(name)} />
                                                                          </Tooltip>
                                                                      </div>

                                                                  </div>

                                                              </div>
                                                          ))}
                                                          <Form.Item>
                                                              <Button size={"large"} className='mt-4' type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                                  Add Contact
                                                              </Button>
                                                          </Form.Item>
                                                      </>
                                                  )}
                                              </Form.List>


                                          </>
                                      )

                              }
                              {getFieldValue('types')==='Parastatal'&&(
                                      <>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              <Form.Item rules={rules.required} label="Parastatal Name" name="name">
                                                  <Input size={"large"} />
                                              </Form.Item>
                                              <Form.Item rules={rules.required} label="Ministry" name="ministry">
                                                  <Input size={"large"} />
                                              </Form.Item>
                                              <Form.Item rules={rules.required} className="md:col-span-2" label="Parastatal Mandate" name="mandate">
                                                  <TextArea rows={4} />
                                              </Form.Item>
                                          </div>

                                          <div className='pt-5 pb-3'>
                                              <label className='text-lg font-bold font-sans'>Parastatal Head Contact Information</label>
                                          </div>
                                          <div className='grid md:grid-cols-12 gap-4'>
                                              <Form.Item rules={rules.required} className='md:col-span-3' label="Full Name" name="headName">
                                                  <Input size={"large"}/>
                                              </Form.Item>
                                              <Form.Item rules={rules.required} label='Profession' className='md:col-span-3' name='profession'>
                                                  <Input size={"large"}/>
                                              </Form.Item>
                                              <Form.Item rules={rules.required} className='md:col-span-3' label="Head Office Title" name='headTitle'>
                                                  <Select
                                                      size={"large"}
                                                      options={headTitle}
                                                  />
                                              </Form.Item>
                                              <Form.Item rules={rules.required} className='md:col-span-3' label="Head Office Salutation" name='headSalutation'>
                                                  <Select
                                                      size={"large"}
                                                      options={headSalutation}
                                                      tokenSeparators={[',']}
                                                      mode={"tags"}
                                                  />
                                              </Form.Item>

                                          </div>
                                          <div className='grid md:grid-cols-3 gap-3'>
                                              <Form.Item rules={rules.required} label="Phone Number" name='headPhone'>
                                                  <Input size={"large"}/>
                                              </Form.Item>
                                              <Form.Item rules={rules.emails} label="Email" name='headmail'>
                                                  <Input size={"large"}/>
                                              </Form.Item>
                                              <Form.Item rules={rules.required} label='Contact Type' name='headType'>
                                                  <Select
                                                      size={"large"}
                                                      options={type}
                                                  />
                                              </Form.Item>
                                          </div>

                                          <Form.List name={'headContacts'}>
                                              {(fields,{add,remove})=>(
                                                  <>
                                                      {fields.map(({key, name, ...restFields})=>(
                                                          <div key={key}>
                                                              <div className='grid md:grid-cols-12 gap-4'>
                                                                  <Form.Item rules={rules.required} className='md:col-span-4' {...restFields} label="Phone Number" name={[name,'phoneNumber']}>
                                                                      <Input size={"large"}/>
                                                                  </Form.Item>
                                                                  <Form.Item rules={rules.emails} className='md:col-span-4' {...restFields} label="Email" name={[name,'email']}>
                                                                      <Input size={"large"}/>
                                                                  </Form.Item>
                                                                  <Form.Item rules={rules.required} className='md:col-span-3' {...restFields} label='Contact Type' name={[name,'type']}>
                                                                      <Select
                                                                          size={"large"}
                                                                          options={type}
                                                                      />
                                                                  </Form.Item>
                                                                  <div className='flex justify-center align-middle' >
                                                                      <Tooltip title="Remove Contact">
                                                                          <MinusCircleOutlined onClick={() => remove(name)} />
                                                                      </Tooltip>
                                                                  </div>

                                                              </div>

                                                          </div>
                                                      ))}
                                                      <Form.Item>
                                                          <Button size={"large"} className='mt-4' type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                              Add Contact
                                                          </Button>
                                                      </Form.Item>
                                                  </>
                                              )}
                                          </Form.List>

                                      </>
                                  )
                              }

                              {getFieldValue('types')==='County'&&(
                                      <>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              <Form.Item rules={rules.required} label="County" name="name">
                                                  <Input size={'large'}/>
                                              </Form.Item>
                                              <Form.Item rules={rules.required} label="Capital" name="capital">
                                                  <Input size={"large"} />
                                              </Form.Item>
                                              <Form.Item rules={rules.required} label="Region" name="region">
                                                  <Input size={'large'}/>
                                              </Form.Item>
                                              <Form.Item rules={rules.required} label="County Code" name="code">
                                                  <Input size={"large"} />
                                              </Form.Item>
                                          </div>

                                          <div className='pt-5 pb-3'>
                                              <label className='text-lg font-bold font-sans'>{`Governor's Details`}</label>
                                          </div>
                                          <div className='grid md:grid-cols-3 gap-4'>
                                              <Form.Item rules={rules.required}  label="Full Name" name="headName">
                                                  <Input size={"large"}/>
                                              </Form.Item>
                                              <Form.Item rules={rules.required} label='Profession'  name='profession'>
                                                  <Input size={"large"}/>
                                              </Form.Item>
                                              <Form.Item rules={rules.required} label="Governor's Salutation" name='headSalutation'>
                                                  <Select
                                                      size={"large"}
                                                      options={headSalutation}
                                                      tokenSeparators={[',']}
                                                      mode={"tags"}
                                                  />
                                              </Form.Item>

                                          </div>

                                          <div className='grid md:grid-cols-3 gap-3'>
                                              <Form.Item rules={rules.required} label="Phone Number" name='headPhone'>
                                                  <Input size={"large"}/>
                                              </Form.Item>
                                              <Form.Item rules={rules.emails} label="Email" name='headmail'>
                                                  <Input size={"large"}/>
                                              </Form.Item>
                                              <Form.Item rules={rules.required} label='Contact Type' name='headType'>
                                                  <Select
                                                      size={"large"}
                                                      options={type}
                                                  />
                                              </Form.Item>
                                          </div>

                                          <Form.List name={'headContacts'}>
                                              {(fields,{add,remove})=>(
                                                  <>
                                                      {fields.map(({key, name, ...restFields})=>(
                                                          <div key={key}>
                                                              <div className='grid md:grid-cols-12 gap-4'>
                                                                  <Form.Item rules={rules.required} className='md:col-span-4' {...restFields} label="Phone Number" name={[name,'phoneNumber']}>
                                                                      <Input size={"large"}/>
                                                                  </Form.Item>
                                                                  <Form.Item rules={rules.emails} className='md:col-span-4' {...restFields} label="Email" name={[name,'email']}>
                                                                      <Input size={"large"}/>
                                                                  </Form.Item>
                                                                  <Form.Item rules={rules.required} className='md:col-span-3' {...restFields} label='Contact Type' name={[name,'type']}>
                                                                      <Select
                                                                          size={"large"}
                                                                          options={type}
                                                                      />
                                                                  </Form.Item>
                                                                  <div className='flex justify-center align-middle' >
                                                                      <Tooltip title="Remove Contact">
                                                                          <MinusCircleOutlined onClick={() => remove(name)} />
                                                                      </Tooltip>
                                                                  </div>

                                                              </div>

                                                          </div>
                                                      ))}
                                                      <Form.Item>
                                                          <Button size={"large"} className='mt-4' type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                              Add Contact
                                                          </Button>
                                                      </Form.Item>
                                                  </>
                                              )}
                                          </Form.List>


                                      </>
                              )}

                              {getFieldValue('types')==='University'&&(
                                  <>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <Form.Item rules={rules.required} label="University" name="name">
                                              <Input size={'large'}/>
                                          </Form.Item>
                                          <Form.Item rules={rules.required} label="University Type" name="uniType">
                                              <Select
                                                  options={uniType}
                                                  size={"large"} />
                                          </Form.Item>
                                      </div>

                                      <div className='pt-5 pb-3'>
                                          <label className='text-lg font-bold font-sans'>{`Vice Chancelor's Details`}</label>
                                      </div>
                                      <div className='grid md:grid-cols-3 gap-4'>
                                          <Form.Item rules={rules.required}  label="Full Name" name="headName">
                                              <Input size={"large"}/>
                                          </Form.Item>
                                          <Form.Item rules={rules.required} label='Profession'  name='profession'>
                                              <Input size={"large"}/>
                                          </Form.Item>
                                          <Form.Item rules={rules.required} label="Vice Chancelor's Salutation" name='headSalutation'>
                                              <Select
                                                  size={"large"}
                                                  options={headSalutation}
                                                  tokenSeparators={[',']}
                                                  mode={"tags"}
                                              />
                                          </Form.Item>

                                      </div>

                                      <div className='grid md:grid-cols-3 gap-3'>
                                          <Form.Item rules={rules.required} label="Phone Number" name='headPhone'>
                                              <Input size={"large"}/>
                                          </Form.Item>
                                          <Form.Item rules={rules.emails} label="Email" name='headmail'>
                                              <Input size={"large"}/>
                                          </Form.Item>
                                          <Form.Item rules={rules.required} label='Contact Type' name='headType'>
                                              <Select
                                                  size={"large"}
                                                  options={type}
                                              />
                                          </Form.Item>
                                      </div>

                                      <Form.List name={'headContacts'}>
                                          {(fields,{add,remove})=>(
                                              <>
                                                  {fields.map(({key, name, ...restFields})=>(
                                                      <div key={key}>
                                                          <div className='grid md:grid-cols-12 gap-4'>
                                                              <Form.Item rules={rules.required} className='md:col-span-4' {...restFields} label="Phone Number" name={[name,'phoneNumber']}>
                                                                  <Input size={"large"}/>
                                                              </Form.Item>
                                                              <Form.Item rules={rules.emails} className='md:col-span-4' {...restFields} label="Email" name={[name,'email']}>
                                                                  <Input size={"large"}/>
                                                              </Form.Item>
                                                              <Form.Item rules={rules.required} className='md:col-span-3' {...restFields} label='Contact Type' name={[name,'type']}>
                                                                  <Select
                                                                      size={"large"}
                                                                      options={type}
                                                                  />
                                                              </Form.Item>
                                                              <div className='flex justify-center align-middle' >
                                                                  <Tooltip title="Remove Contact">
                                                                      <MinusCircleOutlined onClick={() => remove(name)} />
                                                                  </Tooltip>
                                                              </div>

                                                          </div>

                                                      </div>
                                                  ))}
                                                  <Form.Item>
                                                      <Button size={"large"} className='mt-4' type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                          Add Contact
                                                      </Button>
                                                  </Form.Item>
                                              </>
                                          )}
                                      </Form.List>


                                  </>

                              )}
                          </>
                      )
                      }
                  </Form.Item>

                  <div className='flex align-middle justify-end'>
                      <Button className='w-36' htmlType={"submit"} type="primary">Next</Button>
                  </div>

              </Form>
          </motion.div>
      )
    }

    const parastatalContacts = () => {
        return (
            <motion.div
                key="step1"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
                className='mt-7'>

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
                                                        <Select size="large" options={headSalutation} />
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
                    <div className='flex justify-end align-middle gap-3'>
                        <Button className='w-24' onClick={prevStep} danger type="dashed">Back</Button>
                        <Button className='w-24' htmlType={"submit"} type="primary">Next</Button>

                    </div>
                </Form>
            </motion.div>
        )
    }

    const parastatalAddress = () => {
      return (
          <motion.div
              key="step2"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
          >

              <Form form={form2}
                    name="address" layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFormFinish2}>
                  <div className="mt-4">
                      <label className="text-lg font-sans font-semibold">Head Office Address</label>
                      <div className="grid md:grid-cols-12 gap-4">
                          <Form.Item rules={rules.required} className="md:col-span-3" label="Street" name="hqstreet">
                              <Input size={"large"} />
                          </Form.Item>
                          <Form.Item rules={rules.required} className="md:col-span-3" label="City" name="hqcity">
                              <Input size={"large"} />
                          </Form.Item>
                          <Form.Item rules={rules.required} className="md:col-span-2" label="Country" name="hqcountry">
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
                                          <Form.Item rules={rules.required}  className="md:col-span-2" {...restFields} label="Street" name={[name, "street"]}>
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <Form.Item rules={rules.required}  className="md:col-span-3" {...restFields} label="City" name={[name, "city"]}>
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <Form.Item rules={rules.required}  className="md:col-span-2" {...restFields} label="Country" name={[name, "state"]}>
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <Form.Item rules={rules.required}  className="md:col-span-2" {...restFields} label="Building" name={[name, "building"]}>
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <Form.Item rules={rules.required}  className="md:col-span-2" {...restFields} label="Potal Code" name={[name, "postalCode"]}>
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
                      <Button onClick={prevStep} className="w-24"  danger type="dashed">
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

    const confirmDetails = () => {
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
                      <Collapse.Panel header="Parastatal Details" key="1">
                          {parastatal.types==="State department"&&(
                              <>
                                  <div className="grid grid-cols-2 gap-2">
                                      <div className="flex flex-row gap-2">
                                          <h2 className="text-lg font-bold">Stata Department:</h2>
                                          <h2 className="text-lg font-semibold">{parastatal?.name}</h2>
                                      </div>
                                      <div className="flex flex-row gap-2">
                                          <h2 className="text-lg font-bold">Ministry:</h2>
                                          <h2 className="text-lg font-semibold">{parastatal?.ministry}</h2>
                                      </div>
                                  </div>

                                  <div className="flex flex-row gap-2">
                                      <h2 className="text-lg font-bold">Mandate:</h2>
                                      <h2 className="text-lg font-semibold">{parastatal?.mandate}</h2>
                                  </div>
                              </>
                          )}
                          {parastatal.types==="Parastatal"&&(
                              <>
                                  <div className="grid grid-cols-2 gap-2">
                                      <div className="flex flex-row gap-2">
                                          <h2 className="text-lg font-bold">Parastatal:</h2>
                                          <h2 className="text-lg font-semibold">{parastatal?.name}</h2>
                                      </div>
                                      <div className="flex flex-row gap-2">
                                          <h2 className="text-lg font-bold">Ministry:</h2>
                                          <h2 className="text-lg font-semibold">{parastatal?.ministry}</h2>
                                      </div>
                                  </div>

                                  <div className="flex flex-row gap-2">
                                      <h2 className="text-lg font-bold">Mandate:</h2>
                                      <h2 className="text-lg font-semibold">{parastatal?.mandate}</h2>
                                  </div>
                              </>
                          )}

                          {parastatal.types==="County"&&(
                              <>
                                  <div className="grid grid-cols-2 gap-2">
                                      <div className="flex flex-row gap-2">
                                          <h2 className="text-lg font-bold">County:</h2>
                                          <h2 className="text-lg font-semibold">{parastatal?.name}</h2>
                                      </div>
                                      <div className="flex flex-row gap-2">
                                          <h2 className="text-lg font-bold">Capital:</h2>
                                          <h2 className="text-lg font-semibold">{parastatal?.capital}</h2>
                                      </div>

                                      <div className="flex flex-row gap-2">
                                          <h2 className="text-lg font-bold">Region:</h2>
                                          <h2 className="text-lg font-semibold">{parastatal?.region}</h2>
                                      </div>

                                      <div className="flex flex-row gap-2">
                                          <h2 className="text-lg font-bold">County Code:</h2>
                                          <h2 className="text-lg font-semibold">{parastatal?.code}</h2>
                                      </div>
                                  </div>

                              </>
                          )}
                          {parastatal.types==='University'&&(
                              <>
                                  <div className="grid grid-cols-2 gap-2">
                                      <div className="flex flex-row gap-2">
                                          <h2 className="text-lg font-bold">University:</h2>
                                          <h2 className="text-lg font-semibold">{parastatal?.name}</h2>
                                      </div>
                                      <div className="flex flex-row gap-2">
                                          <h2 className="text-lg font-bold">University Type:</h2>
                                          <h2 className="text-lg font-semibold">{parastatal?.uniType}</h2>
                                      </div>

                                  </div>
                              </>
                          )}


                          <div className="flex justify-end items-center">
                              <Button onClick={() => setCurrentStep(0)} type="link">
                                  Update
                              </Button>
                          </div>
                      </Collapse.Panel>
                      <Collapse.Panel header="Head Office Details" key="2">
                          <div className="grid gap-2">
                              <div className='grid grid-cols-2 md:grid-cols-3 gap-1'>
                                  <div className="flex flex-row md:gap-1">
                                      <h2 className="md:text-lg font-bold">Office Holder:</h2>
                                      <h2 className="md:text-lg font-semibold">{parastatal?.headSalutation+" "+ parastatal?.headName?.toUpperCase()}</h2>
                                  </div>
                                  <div className="flex flex-row gap-2">
                                      <h2 className="md:text-lg font-bold">Office:</h2>
                                      {parastatal.types==="State department"&&(
                                          <h2 className="md:text-lg font-semibold">Principle Secretary</h2>
                                      )}
                                      {parastatal.types==="County"&&(
                                          <h2 className="md:text-lg font-semibold">Governor</h2>
                                      )}
                                      {parastatal.types==="University"&&(
                                          <h2 className="md:text-lg font-semibold">Vice Chancellor</h2>
                                      )}
                                      {parastatal.types==="Parastatal"&&(
                                          <h2 className="md:text-lg font-semibold">{parastatal?.headTitle}</h2>
                                      )}

                                  </div>
                                  <div className="flex flex-row gap-2">
                                      <h2 className="md:text-lg font-bold">Profession:</h2>
                                      <h2 className="md:text-lg font-semibold">{parastatal?.profession}</h2>
                                  </div>


                              </div>

                              <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-5">
                                  {parastatal?.HeadContact?.map((item, index) => (
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
                      <Collapse.Panel header="Parastatal Contacts" key="3">
                          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-5">
                              {contacts?.parastatalContact?.map((item, index) => (
                                  <div key={index}>
                                      <div className="bg-gray-400 rounded-lg p-3">
                                          <div className="flex gap-2 flex-row items-center">
                                              <Person />
                                              <h2 className="text-md font-semibold font-sans">{item?.name}</h2>
                                          </div>
                                          <div className="flex gap-2 flex-row items-center">
                                              <WorkOutline />
                                              <h2 className="text-md font-semibold font-sans">{item?.Office}</h2>
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
                      <Collapse.Panel header="Parastatal Address" key="4">
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
                                              <h2 className="text-md font-semibold font-sans">{item?.country}</h2>
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

  return(
      <div className='p-7'>
          {contextHolder}
          <Heading title='New Government Parastatall' />

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
              {currentStep===0 && parastatalProfile()}
              {currentStep===1 && parastatalContacts()}
              {currentStep===2 && parastatalAddress()}
              {currentStep===3 && confirmDetails()}
          </AnimatePresence>

      </div>
  )
}
export default NewParastatal;