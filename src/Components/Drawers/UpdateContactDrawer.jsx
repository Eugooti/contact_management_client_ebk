import  { useEffect, useMemo, useState } from "react";
import {
    Button,
    Drawer,
    Form,
    Input,
    message,
    Select,
    Space,
    Spin,
    Card,
    Typography
} from "antd";
import { useForm } from "antd/es/form/Form";
import { LoadingOutlined, CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import SectionHeader from "../Headings/SectionHeading";
import TextArea from "antd/es/input/TextArea";
import {
    readMinistries
} from "../../Redux/Reducers/ministrySlice";
import {
    updateBoard,
    updateCommission,
    updateCounties,
    updateLearningInstitution,
    updateMinistry,
    updateParastatal,
    updatePrivateOrganization,
    updateStateDepartment
} from "../../Redux/Reducers/organizationSlice";
import { businessType, tertiaryInstitutions } from "../../utils/StaticData";
import { readStateDepartment } from "../../Redux/Reducers/stateDepartmentSlice.js";

const { Text } = Typography;

// eslint-disable-next-line react/prop-types
const UpdateContactDrawer = ({ data, open, setOpen }) => {
    const [form] = useForm();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const formData = useMemo(() => ({
        // eslint-disable-next-line react/prop-types
        ...data?.organization,
        // eslint-disable-next-line react/prop-types
        type: data?.type,
        // eslint-disable-next-line react/prop-types
        ministry: data?.organization?.ministry?.id,
        // eslint-disable-next-line react/prop-types
        stateDepartment: data?.organization?.stateDepartment?.id,
        // eslint-disable-next-line react/prop-types
        uniType: data?.organization?.type
    }), [data]);

    const { ministries } = useSelector((state) => state.ministry);
    const { stateDepartments } = useSelector((state) => state.stateDepartment);

    const ministriesList = useMemo(() => ministries?.result?.map(item => ({
        label: item.name,
        value: item.id,
    })) || [], [ministries]);

    const stateDepartmentsList = useMemo(() => stateDepartments?.result?.map(item => ({
        label: item.name,
        value: item.id,
    })) || [], [stateDepartments]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    dispatch(readMinistries()),
                    dispatch(readStateDepartment())
                ]);
                form.setFieldsValue(formData);
            } catch (error) {
                messageApi.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (open && data) {
            fetchData();
        }
    }, [open, dispatch, formData, messageApi, data]);

    const handleSubmit = async (values) => {
        if (!values) {
            messageApi.warning("Please fill all required fields");
            return;
        }

        setSubmitting(true);
        // eslint-disable-next-line react/prop-types
        const id = data?.organization?.id;
        let action = {};

        try {
            switch (values.type) {
                case "Ministry":
                    action = await dispatch(updateMinistry({ id, data: values }));
                    break;
                case "County":
                    action = await dispatch(updateCounties({ id, data: values }));
                    break;
                case "State Department":
                    action = await dispatch(updateStateDepartment({ id, data: values }));
                    break;
                case "Parastatal":
                    action = await dispatch(updateParastatal({ id, data: values }));
                    break;
                case "Learning Institution":
                    values.type = values.uniType
                    action = await dispatch(updateLearningInstitution({ id, data: values }));
                    break;
                case "Private":
                    action = await dispatch(updatePrivateOrganization({ id, data: values }));
                    break;
                case "Board":
                    action = await dispatch(updateBoard({ id, data: values }));
                    break;
                case "Commission":
                    action = await dispatch(updateCommission({ id, data: values }));
                    break;
                default:
                    messageApi.error("Unknown organization type");
                    return;
            }

            if (action.error) {
                messageApi.error(action.payload.message);
            } else {
                messageApi.success("Organization updated successfully").then(()=>{
                    setOpen(false);
                })
            }
        } catch (error) {
            messageApi.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const renderFormSection = (type) => {
        const commonProps = {
            size: "large",
            className: "w-full"
        };

        switch (type) {
            case "Ministry":
                return (
                    <Card title={
                        <SectionHeader
                            title="Ministry Details"
                            description="Basic information about the ministry"/>}
                          bordered={false} className="mb-6 shadow-sm">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Form.Item label="Ministry Name" name="name" rules={[{ required: true }]}>
                                <Input {...commonProps} />
                            </Form.Item>
                            <Form.Item label="Sector" name="sector" rules={[{ required: true }]}>
                                <Input {...commonProps} />
                            </Form.Item>
                            <Form.Item className="md:col-span-2" label="Mandate" name="mandate" rules={[{ required: true }]}>
                                <TextArea rows={4} />
                            </Form.Item>
                        </div>
                    </Card>
                );

            case "County":
                return (
                    <Card title={<SectionHeader
                        title="County Details"
                        description="Basic information about the county"/>}
                          bordered={false} className="mb-6 shadow-sm">
                        <div className="grid md:grid-cols-3 gap-4">
                            <Form.Item name="county" label="County">
                                <Input {...commonProps} disabled />
                            </Form.Item>
                            <Form.Item name="countyCode" label="County Code">
                                <Input {...commonProps} disabled />
                            </Form.Item>
                            <Form.Item name="capital" label="County Capital">
                                <Input {...commonProps} disabled />
                            </Form.Item>
                        </div>
                    </Card>
                );

            case "State Department":
                return (
                    <Card title={<SectionHeader description="Basic information about the State Department"
                        title='State Department Details'/>}
                          bordered={false} className="mb-6 shadow-sm">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Form.Item label="Department Name" name="name" rules={[{ required: true }]}>
                                <Input {...commonProps} />
                            </Form.Item>
                            <Form.Item label="Ministry" name="ministry" rules={[{ required: true }]}>
                                <Select {...commonProps} options={ministriesList} />
                            </Form.Item>
                            <Form.Item className="md:col-span-2" label="Mandate" name="mandate" rules={[{ required: true }]}>
                                <TextArea rows={4} />
                            </Form.Item>
                        </div>
                    </Card>
                );

            case "Parastatal":
                return (
                    <Card title={<SectionHeader description="Basic information about the Parastatal"
                        title='Parastatal Details'/>}
                          bordered={false} className="mb-6 shadow-sm">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Form.Item label="Parastatal Name" name="name" rules={[{ required: true }]}>
                                <Input {...commonProps} />
                            </Form.Item>
                            <Form.Item label="State Department" name="stateDepartment" rules={[{ required: true }]}>
                                <Select {...commonProps} options={stateDepartmentsList} />
                            </Form.Item>
                            <Form.Item className="md:col-span-2" label="Mandate" name="mandate" rules={[{ required: true }]}>
                                <TextArea rows={4} />
                            </Form.Item>
                        </div>
                    </Card>
                );

            case "Commission":
                return (
                    <Card title={<SectionHeader description="Basic information about the Commission"
                        title='Commission Details'/>}
                          bordered={false} className="mb-6 shadow-sm">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Form.Item label="Commission Name" name="name" rules={[{ required: true }]}>
                                <Input {...commonProps} />
                            </Form.Item>
                            <Form.Item label="Acronym" name="acronym" rules={[{ required: true }]}>
                                <Input {...commonProps} />
                            </Form.Item>
                            <Form.Item className="md:col-span-2" label="Mandate" name="mandate" rules={[{ required: true }]}>
                                <TextArea rows={4} />
                            </Form.Item>
                        </div>
                    </Card>
                );

            case "Board":
                return (
                    <Card title={<SectionHeader description="Basic information about the Board"
                        title='Board Details'/>}
                          bordered={false} className="mb-6 shadow-sm">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Form.Item label="Board Name" name="name" rules={[{ required: true }]}>
                                <Input {...commonProps} />
                            </Form.Item>
                            <Form.Item label="State Department" name="stateDepartment" rules={[{ required: true }]}>
                                <Select {...commonProps} options={stateDepartmentsList} />
                            </Form.Item>
                            <Form.Item className="md:col-span-2" label="Mandate" name="mandate" rules={[{ required: true }]}>
                                <TextArea rows={4} />
                            </Form.Item>
                        </div>
                    </Card>
                );

            case "Learning Institution":
                return (
                    <Card title={<SectionHeader title="Institution Details"
                        description="Basic information about your institution"/>}
                          bordered={false} className="mb-6 shadow-sm">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Form.Item label="Institution Name" name="name" rules={[{ required: true }]}>
                                <Input {...commonProps} placeholder="Enter institution name" />
                            </Form.Item>
                            <Form.Item label="Institution Type" name="institutionType" rules={[{ required: true }]}>
                                <Select {...commonProps} options={tertiaryInstitutions} />
                            </Form.Item>
                            <Form.Item label="Institution Category" name="uniType" rules={[{ required: true }]}>
                                <Select
                                    {...commonProps}
                                    options={[
                                        { label: "Public", value: "Public" },
                                        { label: "Private", value: "Private" }
                                    ]}
                                />
                            </Form.Item>
                        </div>
                    </Card>
                );

            case "Private":
                return (
                    <Card title={<SectionHeader title="Company Details"
                          description="Basic information about your company"/>}
                          bordered={false} className="mb-6 shadow-sm">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Form.Item label="Company Name" name="name" rules={[{ required: true }]}>
                                <Input {...commonProps} />
                            </Form.Item>
                            <Form.Item label="Business Type" name="business" rules={[{ required: true }]}>
                                <Select {...commonProps} options={businessType} />
                            </Form.Item>
                            <Form.Item label="Sector" name="sector" rules={[{ required: true }]}>
                                <Input {...commonProps} />
                            </Form.Item>
                            <Form.Item label="Acronym" name="acronym" rules={[{ required: true }]}>
                                <Input {...commonProps} />
                            </Form.Item>
                        </div>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <>
            {contextHolder}
            <Drawer
                open={open}
                onClose={() => !submitting && setOpen(false)}
                width="90%"
                height="90%"
                placement="top"
                closable={false}
                maskClosable={!submitting}
                title={
                    <div className="flex justify-between items-center">
                        <Text strong className="text-xl">
                            Update Organization
                        </Text>
                        <Button
                            type="text"
                            icon={<CloseOutlined />}
                            onClick={() => !submitting && setOpen(false)}
                            disabled={submitting}
                        />
                    </div>
                }
                footer={
                    <div className="flex justify-end">
                        <Space>
                            <Button
                                onClick={() => setOpen(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => form.submit()}
                                loading={submitting}
                                disabled={submitting}
                            >
                                {submitting ? "Updating..." : "Update"}
                            </Button>
                        </Space>
                    </div>
                }
            >
                <Spin
                    spinning={loading}
                    tip="Loading organization data..."
                    indicator={<LoadingOutlined spin />}
                    size="large"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={formData}
                    >
                        <Card bordered={false} className="mb-6">
                            <Form.Item name="type" label="Organization Type">
                                <Input disabled size="large" />
                            </Form.Item>
                        </Card>

                        <Form.Item shouldUpdate>
                            {({ getFieldValue }) => renderFormSection(getFieldValue("type"))}
                        </Form.Item>

                        <SectionHeader
                            title='Organization Main Address'
                            description='Address of the organization headquarters'
                        />

                        <Card bordered={false} className="mb-6 shadow-sm">
                            <div className="grid md:grid-cols-12 gap-4">
                                {["street", "city", "country", "building", "postalCode"].map(field => (
                                    <Form.Item
                                        key={field}
                                        label={field.split(/(?=[A-Z])/).join(" ")}
                                        name={field}
                                        className={`md:${field === "street" || field === "city" ? "col-span-3" : "col-span-2"}`}
                                    >
                                        <Input size="large" />
                                    </Form.Item>
                                ))}
                            </div>
                        </Card>
                    </Form>
                </Spin>
            </Drawer>
        </>
    );
};

export default UpdateContactDrawer;
