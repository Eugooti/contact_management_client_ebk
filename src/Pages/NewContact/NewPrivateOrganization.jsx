import Heading from "../../Components/Headings/Heading.jsx";
import {useEffect, useState} from "react";
import {Step, StepLabel, Stepper} from "@mui/material";
import {useForm} from "antd/es/form/Form.js";
import {Button, Collapse, Divider, Form, Input, message, Select, Tooltip} from "antd";
import {CaretRightOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
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
import {AnimatePresence, motion} from "framer-motion";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {createPrivate} from "../../Redux/Reducers/contactsSlice.js";


const NewPrivateOrganization = () => {
    const [form] = useForm();
    const [form1] = useForm();
    const [form2] = useForm();

    const company = getFromSessionStorage('company');
    const address = getFromSessionStorage('address');
    const contacts = getFromSessionStorage('contacts');

    useEffect(() => {
        form.setFieldsValue(company)
        form1.setFieldsValue(contacts)
        form2.setFieldsValue(address)
    }, [form,form1,form2,contacts,address,company]);


    const [currentStep, setCurrentStep] = useState(0);
    const prevStep = () => {
        setCurrentStep(prevStep => prevStep - 1);
    }
    const nextStep = () => {
        setCurrentStep(prevStep=>prevStep + 1);
    }
    const steps = [
        {title:"Organization Profile",content:"organization_profile"},
        {title:"Organization Contacts",content:"organization_contacts"},
        {title:"Organization Addresses",content:"organization_address"},
        {title:"Confirm Details",content:"confirm_details"},
    ].map((step,index) => ({
        ...step,
        key: index,
    }))




    const headTitle = ['Chief Executive Officer','Director','Manager'].map(item=>({
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



    const onFormFinish = (values) => {
        // todo handle form finish
        values.companyData = {
            sector:values.sector,
            business:values.businessType,
            name:values.companyName,

        }
        values.HeadContact = values.headContacts?[{phoneNumber: values.headPhone, email: values.headmail, type: values.headType},...values.headContacts]:
            [{phoneNumber: values.headPhone, email: values.headmail, type: values.headType}]

        setSessionStorage('company',values)
        nextStep()
    };

    const onFormFinish1 = (values) => {
        // todo handle form finish
        values.companyContact = values.contacts.flatMap((contact)=>{
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
        values.Address =values.address? [{building:values.hqbuilding,city:values.hqcity,country:values.hqcountry,postalCode:values.hqpostalCode,street:values.hqstreet},...values.address]:
            [{building:values.hqbuilding,city:values.hqcity,country:values.hqcountry,postalCode:values.hqpostalCode,street:values.hqstreet}]
        values.headquarters={building:values.hqbuilding,city:values.hqcity,country:values.hqcountry,postalCode:values.hqpostalCode,street:values.hqstreet}
        setSessionStorage("address", values);
        nextStep();
    };

    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch();
    const handleSubmit = () => {
        const headOfficeContacts = company?.HeadContact.map((item) => ({
            name:company.headName,
            Office:company.headTitle,
            profession:company.profession,
            salutation:company.headSalutation,
            ...item
        }))

        contacts.companyContact.push(...headOfficeContacts);
        const people = [...new Map(contacts.companyContact.map((item)=>[item.name,item])).values(),
        ].map((person)=>({
            full_name: person.name,
            profession:person.profession,
            salutation:person.salutation,
            office:person.Office
        }))

        const formatData = {
            privateContact:contacts.companyContact,
            headquarters:address.headquarters,
            privateData:company.companyData,
            address:address.address,
            people,
        };

        dispatch(createPrivate(formatData)).then(action=>{
            action.error?
                messageApi.error(action.payload.message):
                messageApi.success(action.payload.message).then(()=>{
                    removeSessionItem('address')
                    removeSessionItem('contacts')
                    removeSessionItem('company')
                    navigate('/')
                })
        })
    };


    const businessType = ['Private Limited Company','Public Limited Company','Partnership','Sole Proprietorship',
        'Cooperative Society','Non-Governmental Organization (NGO)','Trust','Association','Limited Liability Partnership (LLP)',
        'Holding Company','Subsidiary Company','Joint Venture','Franchise', 'Charitable Organization'
    ].map(item => ({
        label: item,
        value: item,
    }));

    const variants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    const rules = {
        required:[{required:true,message:"Required Field"}],
        emails:[{required:true,message:"Required Field"},{type:"email",message:"Enter a valid email address"}],
    }

    const companyProfile = () => {
      return (
          <motion.div
              key="step0"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
          >

              <Form
                  form={form}
                  name="profile"
                  layout="vertical"
                  initialValues={{remember: true}}
                  onFinish={onFormFinish}
              >

                  <div className='grid md:grid-cols-2 gap-4 mt-5'>
                      <Form.Item rules={rules.required} label="Company name" name="companyName">
                          <Input size={"large"}/>
                      </Form.Item>
                      <Form.Item rules={rules.required} label="Sector" name="sector">
                          <Input size={"large"}/>
                      </Form.Item>
                      <Form.Item rules={rules.required} label="Business Type" name="businessType">
                          <Select
                              options={businessType}
                              size={"large"}
                          />
                      </Form.Item>
                      <Form.Item label="Acronym" name="acronym">
                          <Input size={"large"}/>
                      </Form.Item>

                  </div>



                  <div className='pt-5 pb-3'>
                      <label className='text-lg font-bold font-sans'>Head Office Contact Information</label>
                  </div>
                  <div className='grid md:grid-cols-12 gap-4'>
                      <Form.Item rules={rules.required} className='md:col-span-4' label="Full Name" name="headName">
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
                      <Form.Item rules={rules.required} className='md:col-span-2' label="Head Office Salutation" name='headSalutation'>
                          <Select
                              size={"large"}
                              options={headSalutation}
                              tokenSeparators={[',']}
                              mode={"tags"}
                          />
                      </Form.Item>

                  </div>
                  <div className='grid grid-cols-3 gap-3'>
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
                  <div className='flex align-middle justify-end'>
                      <Button className='w-36' htmlType={"submit"} type="primary">Next</Button>
                  </div>
              </Form>
          </motion.div>

      )
    }

    const companyContacts = () => {
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
                  name="contacts"
                  layout="vertical"
                  // Setting an initial value for each contact's nested details
                  initialValues={{
                      remember: true,
                      contacts: [{ contactDetails: [{}] }]
                  }}
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

    const companyAddress = () => {
      return (
          <motion.div
              key="step2"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className='mt-6'>

              <Form
                  form={form2}
                  name="address" layout="vertical" initialValues={{ remember: true }} onFinish={onFormFinish2}>
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
                                          <Form.Item rules={rules.required} className="md:col-span-2" {...restFields} label="Street" name={[name, "street"]}>
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <Form.Item rules={rules.required} className="md:col-span-3" {...restFields} label="City" name={[name, "city"]}>
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <Form.Item rules={rules.required} className="md:col-span-2" {...restFields} label="Country" name={[name, "country"]}>
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <Form.Item rules={rules.required} className="md:col-span-2" {...restFields} label="Building" name={[name, "building"]}>
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <Form.Item rules={rules.required} className="md:col-span-2" {...restFields} label="Potal Code" name={[name, "postalCode"]}>
                                              <Input size={"large"} />
                                          </Form.Item>
                                          <div className="flex justify-center py-2 items-center">
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

    const companyReview = () => {
      return (
          <motion.div
              key="step3"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className='pt-5'>

              <div className="pt-5">
                  <Collapse
                      accordion
                      expandIcon={({isActive}) => (
                          <CaretRightOutlined rotate={isActive ? 90 : 0}/>
                      )}
                  >
                      <Collapse.Panel header="Conpany Details" key="1">
                          <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-row gap-2">
                                  <h2 className="text-lg font-bold">Company Name:</h2>
                                  <h2 className="text-lg font-semibold">{company?.companyName}</h2>
                              </div>
                              <div className="flex flex-row gap-2">
                                  <h2 className="text-lg font-bold">Sector:</h2>
                                  <h2 className="text-lg font-semibold">{company?.sector}</h2>
                              </div>
                          </div>
                          <div className="flex flex-row gap-2">
                              <h2 className="text-lg font-bold">Business Type:</h2>
                              <h2 className="text-lg font-semibold">{company?.businessType}</h2>
                          </div>
                          <div className="flex justify-end items-center">
                              <Button onClick={() => setCurrentStep(0)} type="link">
                                  Update
                              </Button>
                          </div>
                      </Collapse.Panel>
                      <Collapse.Panel header="Company Leadership" key="2">
                          <div className="grid gap-2">
                              <div className='grid grid-cols-2 md:grid-cols-3 gap-1'>
                                  <div className="flex flex-row md:gap-1">
                                      <h2 className="md:text-lg font-bold">Office Holder:</h2>
                                      <h2 className="md:text-lg font-semibold">{company?.headSalutation.join(', ')+", "+ company?.headName.toUpperCase()}</h2>
                                  </div>
                                  <div className="flex flex-row gap-2">
                                      <h2 className="md:text-lg font-bold">Office:</h2>
                                      <h2 className="md:text-lg font-semibold">{company?.headTitle}</h2>
                                  </div>
                                  <div className="flex flex-row gap-2">
                                      <h2 className="md:text-lg font-bold">Profession:</h2>
                                      <h2 className="md:text-lg font-semibold">{company?.profession}</h2>
                                  </div>


                              </div>

                              <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-5">
                                  {company?.HeadContact?.map((item, index) => (
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
                      <Collapse.Panel header="Company Contacts" key="3">
                          <div className='grid gap-2 sm:grid-cols-3 md:grid-cols-6'>
                              {contacts?.companyContact?.map((item,index)=>(
                                  <div key={index}>
                                      <div className='bg-gray-400 rounded-lg p-3 '>
                                          <div className='flex gap-2 flex-row align-middle justify-start'>
                                              <Person/><h2 className='text-md font-semibold font-sans'>{item?.name}</h2>
                                          </div>
                                          <div className='flex gap-2 flex-row align-middle justify-start'>
                                              <WorkOutline/><h2 className='text-md font-semibold font-sans'>{item?.Office}</h2>
                                          </div>
                                          <div className='flex gap-2 flex-row align-middle justify-start'>
                                              <PhoneAndroidRounded/><h2 className='text-md font-semibold font-sans'>{item?.phoneNumber}</h2>
                                          </div>
                                          <div className='flex gap-2 flex-row align-middle justify-start'>
                                              <Email/><h2 className='text-md font-semibold font-sans'>{item?.email}</h2>
                                          </div>

                                          <div className='flex gap-2 flex-row align-middle justify-start'>
                                              {item.type ==="Home"?<Home/>:<Work/>}
                                              <h2 className='text-md font-semibold font-sans'>{item?.type}</h2>
                                          </div>
                                      </div>

                                  </div>
                              ))}
                          </div>
                          <div className='flex align-middle justify-end'>

                              <Button onClick={()=>setCurrentStep(1)} type="link">Update</Button>
                          </div>
                      </Collapse.Panel>
                      <Collapse.Panel header="Company Address" key="4">
                          <div className='grid gap-2 sm:grid-cols-3 md:grid-cols-6'>
                              {address?.Address?.map((item,index)=>(
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
                          <div className='flex align-middle justify-end'>
                              <Button onClick={()=>setCurrentStep(2)} type="link">Update</Button>
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
          <Heading title={'New Private Organization'}/>

          <Stepper activeStep={currentStep} alternativeLabel>
              {steps.map((item)=>(
                  <Step key={item.key}>
                      <StepLabel ><label className='text-lg font-sans'>{item.title}</label></StepLabel>
                  </Step>
              ))}
          </Stepper>

          <AnimatePresence exitBeforeEnter>
              {currentStep===0&&companyProfile()}

              {currentStep===1&&companyContacts()}

              {currentStep===2&&companyAddress()}

              {currentStep===3&&companyReview()}
          </AnimatePresence>



      </div>
  )
}

export default NewPrivateOrganization;