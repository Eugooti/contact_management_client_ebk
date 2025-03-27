import React from "react";
import { Form, Input, Select, Button } from "antd";

const { Option } = Select;

const RegistrationForm = () => {
    const [form] = Form.useForm();

    return (
        <Form form={form} layout="vertical">
            <Form.Item label="Select Category" name="category" rules={[{ required: true, message: "Please select a category!" }]}>
                <Select placeholder="Select...">
                    <Option value="adult">Adult</Option>
                    <Option value="child">Child</Option>
                </Select>
            </Form.Item>

            <Form.Item label="Name" name="name" rules={[{ required: true, message: "Name is required!" }]}>
                <Input placeholder="Enter Name" />
            </Form.Item>

            {/* Conditionally Render Fields Based on `category` */}
            <Form.Item shouldUpdate>
                {({ getFieldValue }) =>
                    getFieldValue("category") === "adult" && (
                        <>
                            <Form.Item label="National ID" name="nationalId" rules={[{ required: true, message: "National ID is required!" }]}>
                                <Input placeholder="Enter National ID" />
                            </Form.Item>
                            <Form.Item label="Occupation" name="occupation">
                                <Input placeholder="Enter Occupation" />
                            </Form.Item>
                        </>
                    )
                }
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
        </Form>
    );
};

export default RegistrationForm;
