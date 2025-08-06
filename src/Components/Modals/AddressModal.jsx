import {Form, Input, message, Modal} from "antd";
import {useForm} from "antd/es/form/Form.js";
import {useDispatch} from "react-redux";
import {createAddress, updateAddress} from "../../Redux/Reducers/addressSlice.js";
import {getFromSessionStorage, removeSessionItem} from "../../utils/SessionStorage/sessionStorage.js";

// eslint-disable-next-line react/prop-types
const AddressModal = ({modalVisible,setModalVisible,contactId}) => {
    const [form] = useForm();

    const onCancel = () => {
        removeSessionItem('address')
      setModalVisible(false);
    }

    const dispatch = useDispatch();

    const initialValues = getFromSessionStorage('address')

    if (initialValues) {
        form.setFieldsValue(initialValues)
    }


    const [messageApi, contextHolder] = message.useMessage();
    const onFormFinish =async (values) => {
        // todo handle form finish
        if (initialValues) {
            dispatch(updateAddress({data:values,id:initialValues.id})).then((action) => {
                action.error?
                    messageApi.error(action.payload.message):
                    messageApi.success(action.payload.message).then(() => {
                        onCancel()
                        window.location.href = '/'
                    })
            })
        }
        else {
            values.contact_id = contactId
            dispatch(createAddress(values)).then((action) => {
                action.error?
                    messageApi.error(action.payload.message):
                    messageApi.success(action.payload.message).then(() => {
                        onCancel()
                        window.location.href = '/'
                    })
            })
        }


    };

    const rules = {
        required:[{required:true,message:'Required Field'}],
    }


    return (
      <>
          {contextHolder}
          <Modal
              title={initialValues?"Update Address":"Add Contact Address"}
              open={modalVisible}
              onCancel={() => onCancel()}
              footer={null}
              className="rounded-lg"
          >


              <Form
                  form={form}
                  name="new-address"
                  layout="vertical"
                  initialValues={{remember: true}}
                  onFinish={onFormFinish}
              >
                  <div className='grid md:grid-cols-2 gap-2'>

                      <Form.Item rules={rules.required} label="Country" name="country">
                          <Input size="large" />
                      </Form.Item>
                      <Form.Item rules={rules.required} label="City" name="city">
                          <Input size="large" />
                      </Form.Item>
                      <Form.Item rules={rules.required} label="Street" name="street">
                          <Input size={'large'} />
                      </Form.Item>
                      <Form.Item rules={rules.required} label="Building" name="building">
                          <Input size={'large'} />
                      </Form.Item>
                      <Form.Item rules={rules.required} label="Postal Code" name="postalCode">
                          <Input size={'large'} />
                      </Form.Item>
                  </div>
                  <div className="flex justify-end">
                      <button
                          type={"submit"}
                          className="h-9 bg-red-600 hover:bg-red-950 w-36 rounded-lg text-lg text-white">
                          {initialValues?'Update Address':"Create Address"}
                      </button>
                  </div>
              </Form>


          </Modal>
      </>
  )
}

export default AddressModal;