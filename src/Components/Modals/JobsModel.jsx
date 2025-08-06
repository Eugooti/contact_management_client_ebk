import {Divider, Form, Input, message, Modal, Tooltip} from "antd";
import {getFromSessionStorage, removeSessionItem} from "../../utils/SessionStorage/sessionStorage.js";
import {useForm} from "antd/es/form/Form.js";
import Button from "antd/es/button/index.js";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import SectionHeader from "../Headings/SectionHeading.jsx";
import {addJob} from "../../Redux/Reducers/JobsSlice.js";

// eslint-disable-next-line react/prop-types
const JobsModel = ({JobModalVisible,setJobModalVisible,data}) => {
    const onCancel = () => {
        removeSessionItem('contact')
        setJobModalVisible(false);
    }
    const [form] = useForm();

    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();

    const navigate = useNavigate();
    const onFormFinish = (values) => {
        // todo handle form finish
        // eslint-disable-next-line react/prop-types
        const person_id = data.person.id



        const newJobs = values.jobs.map((job) => ({
            ...job,
            personId: person_id,
        }))


        dispatch(addJob(newJobs)).then(action=>{
            console.log(action)
            action.error?
                messageApi.error(action.payload.message):
                messageApi.success(action.payload.message).then(()=>{
                    navigate('/')
                    setJobModalVisible(false);
                })

        })

    };
    const rules = {
        required:[{required:true,message:"Required Field"}],
        emails:[{required:true,message:"Required Field"},{type:"email",message:"Enter a valid email address"}],
    }


    const userRole = getFromSessionStorage('user')?.responseData



    return(
        <>
            {contextHolder}
            {userRole.role==="ADMIN"&&(
                <Modal
                    open={JobModalVisible}
                    title={(
                        <SectionHeader
                            description={`${data.salutations.join(', ')} ${data.person.full_name} Job.`}
                            title={`Add Another ${data.contacts[0].office}'s Job.`}/>
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
                        <Form.List name="jobs">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restFields }) => (
                                        <div key={key}>
                                            <div className="grid md:grid-cols-12 gap-4">
                                                <div className="md:col-span-11">
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <Form.Item
                                                            label="Job Title"
                                                            rules={rules.required}
                                                            name={[name, 'job']}
                                                            {...restFields}
                                                        >
                                                            <Input size="large" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            label="Work Place"
                                                            rules={rules.required}
                                                            name={[name, 'workPlace']}
                                                            {...restFields}
                                                        >
                                                            <Input size="large" />
                                                        </Form.Item>
                                                    </div>

                                                </div>
                                                <div className="flex justify-center items-center">
                                                    <Tooltip title="Remove Job">
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
                                            Add Job
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>

                        <div className="flex justify-end">
                            <button
                                type={"submit"}
                                className="h-9 bg-red-600 hover:bg-red-950 w-36 rounded-lg text-lg text-white">
                                Add Jobs
                            </button>
                        </div>

                    </Form>
                </Modal>
            )}

        </>
    )
}

export default JobsModel;