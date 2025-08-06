import {Divider, Form, Input, message, Modal, Select, Tooltip} from "antd";
import {getFromSessionStorage, removeSessionItem} from "../../utils/SessionStorage/sessionStorage.js";
import {useForm} from "antd/es/form/Form.js";
import Button from "antd/es/button/index.js";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";
import {addContacts} from "../../Redux/Reducers/contactPersonSlice.js";
import {useNavigate} from "react-router-dom";
import SectionHeader from "../Headings/SectionHeading.jsx";

// eslint-disable-next-line react/prop-types
const AddPersonContactModal = ({modalVisible,setModalVisible,data}) => {
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
        // eslint-disable-next-line react/prop-types
        const contactId = data.organization.contact_id;
        // eslint-disable-next-line react/prop-types
        const person_id = data.person.id
        // eslint-disable-next-line react/prop-types
        const office = data.contacts[0].office



        const newContacts = values.contacts.map((contact) => ({
            ...contact,
            contact_id: contactId,
            person_id: person_id,
            office
        }))


        dispatch(addContacts(newContacts)).then(action=>{
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

    const userRole = getFromSessionStorage('user')?.responseData


    return(

        <>
            {contextHolder}
            {userRole.role==="ADMIN"&&(
                <Modal
                    open={modalVisible}
                    title={(
                        <SectionHeader
                            description={`${data.salutations.join(', ')} ${data.person.full_name} Contact`}
                            title={`Add Another ${data.contacts[0].office}'s contact`}/>
                    )}
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
                                                            label="Phone Number"
                                                            rules={rules.required}
                                                            className='md:col-span-4'
                                                            name={[name, 'phone_number']}
                                                            {...restFields}
                                                        >
                                                            <Input size="large" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            label="Email"
                                                            rules={rules.emails}
                                                            className='md:col-span-4'
                                                            name={[name, 'email']}
                                                            {...restFields}
                                                        >
                                                            <Input size="large" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            label="Contact Type"
                                                            rules={rules.required}
                                                            className='md:col-span-3'
                                                            name={[name, 'type']}
                                                            {...restFields}
                                                        >
                                                            <Select size="large" options={type} />
                                                        </Form.Item>
                                                    </div>

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
            )}

        </>
    )
}

export default AddPersonContactModal;