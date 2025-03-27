import {motion} from "framer-motion";
import {Button, Form, Input, Tooltip} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {getFromSessionStorage, setSessionStorage} from "../../../utils/SessionStorage/sessionStorage.js";
import {useForm} from "antd/es/form/Form.js";
import {useEffect} from "react";
import SectionHeader from "../../../Components/Headings/SectionHeading.jsx";


const AddressForm = ({nextStep, prevStep}) => {
    const [form] = useForm();

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
        values.Address =values.address? [{building:values.hqbuilding,city:values.hqcity,country:values.hqcountry,postalCode:values.hqpostalCode,street:values.hqstreet,isHeadquarters:true},...values.address]:
            [{building:values.hqbuilding,city:values.hqcity,country:values.hqcountry,postalCode:values.hqpostalCode,street:values.hqstreet,isHeadquarters:true}]
        values.headquarters={building:values.hqbuilding,city:values.hqcity,country:values.hqcountry,postalCode:values.hqpostalCode,street:values.hqstreet}
        setSessionStorage("address", values);
        nextStep();
    };

    useEffect(() => {
        form.setFieldsValue(getFromSessionStorage('address'));
    }, [form]);

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
              form={form}
              name="address" layout="vertical" initialValues={{ remember: true }} onFinish={onFormFinish}>
              <div className="mt-4">
                  <SectionHeader
                      title='Organization Main Address'
                      description='Address of the organization headquarters'
                  />
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

              <SectionHeader
                  title='Other Addresses'
                  description='Othere addresses associated with this organization'
              />

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
export default AddressForm