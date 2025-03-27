import {Divider, Form, Input, message, Modal, Select, Tooltip} from "antd";
import {removeSessionItem} from "../../utils/SessionStorage/sessionStorage.js";
import {useForm} from "antd/es/form/Form.js";
import Button from "antd/es/button/index.js";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";
import {createContactPerson} from "../../Redux/Reducers/contactPersonSlice.js";
import {headSalutation} from "../../utils/StaticData.js";
import {useNavigate} from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ContactModal = ({modalVisible,setModalVisible,data}) => {
    const onCancel = () => {
        removeSessionItem('contact')
        setModalVisible(false);
    }

    const [form] = useForm();

    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const navigate = useNavigate();
    const onFormFinish = (values) => {
        // todo handle form finish
        const contactId = data.id
        const workPlace = data.organization.name||data.organization.county

        const sendData = {
            contactId,
            workPlace,
            contact:values.contacts,
        }

        dispatch(createContactPerson(sendData)).then(action=>{
            console.log(action)
            action.error?
                messageApi.error(action.payload.message):
                messageApi.success(action.payload.message).then(()=>{
                    removeSessionItem('contact')
                    navigate('/')
                    setModalVisible(false);
                })

        })

    };
    const rules = {
        required:[{required:true,message:"Required Field"}],
        emails:[{required:true,message:"Required Field"},{type:"email",message:"Enter a valid email address"}],
    }

    const type = ['Home','Work'].map(item=>({
        label:item,
        value:item,
    }))


  return(
      <>
          {contextHolder}
          <Modal
              open={modalVisible}
              title="Add Contact"
              onCancel={() => onCancel()}
              footer={null}
              className="rounded-lg"
              width={{
                  xs: '90%',
                  sm: '80%',
                  md: '70%',
                  lg: '80%',
                  xl: '80%',
                  xxl: '40%',
              }}
          >

              <Form
                  form={form}
                  name="contact"
                  layout="vertical"
                  initialValues={{remember: true,contacts:null}}
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

                  <div className="flex justify-end">
                      <button
                          type={"submit"}
                          className="h-9 bg-red-600 hover:bg-red-950 w-36 rounded-lg text-lg text-white">
                          Add Contact
                      </button>
                  </div>

              </Form>
          </Modal>
      </>
  )
}

export default ContactModal;