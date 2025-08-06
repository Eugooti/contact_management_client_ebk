import  { useEffect, useState } from 'react';
import {
    Form,
    Input,
    Popconfirm,
    Select,
    Table,
    Typography,
    Button,
    Space,
    Tag,
    Card,
    message
} from 'antd';
import {
    EditOutlined,
    SaveOutlined,
    CloseOutlined,
    UserAddOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import SectionHeader from "../../Components/Headings/SectionHeading.jsx";
import {readUsers, updateUser} from "../../Redux/Reducers/usersSlice.js";
import {useNavigate} from "react-router-dom";

// Constants
const ROLE_OPTIONS = [
    { label: 'Administrator', value: 'admin' },
    { label: 'Standard User', value: 'user' },
];

const ROLE_COLORS = {
    admin: 'red',
    user: 'blue',
    // manager: 'green'
};

const TABLE_COLUMNS = [
    {
        title: 'Full Name',
        dataIndex: 'name',
        width: '25%',
        editable: false,
        sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
        title: 'Designation',
        dataIndex: 'designation',
        width: '20%',
        editable: false,
        sorter: (a, b) => a.designation.localeCompare(b.designation)
    },
    {
        title: 'Email',
        dataIndex: 'email',
        width: '20%',
        editable: false,
        render: (email) => <Typography.Link href={`mailto:${email}`}>{email}</Typography.Link>
    },
    {
        title: 'Phone',
        dataIndex: 'phoneNumber',
        width: '15%',
        editable: false,
        render: (phone) => phone || 'N/A'
    },
    {
        title: 'Role',
        dataIndex: 'role',
        width: '15%',
        editable: true,
        render: (role) => (
            <Tag color={ROLE_COLORS[role] || 'default'} style={{ textTransform: 'capitalize' }}>
                {role}
            </Tag>
        ),
        filters: Object.keys(ROLE_COLORS).map(role => ({
            text: role.charAt(0).toUpperCase() + role.slice(1),
            value: role
        })),
        onFilter: (value, record) => record.role === value
    }
];

const EditableCell = ({
                          // eslint-disable-next-line react/prop-types
                          editing,
                          // eslint-disable-next-line react/prop-types
                          dataIndex,
                          // eslint-disable-next-line react/prop-types
                          title,
                          // eslint-disable-next-line react/prop-types
                          inputType,
                          record,
                          children,
                          ...restProps
                      }) => {
    const inputNode = inputType === 'select' ? (
        <Select
            options={ROLE_OPTIONS}
            style={{ width: '100%' }}
            placeholder="Select role"
        />
    ) : (
        <Input />
    );

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            // eslint-disable-next-line react/prop-types
                            message: `Please enter ${title.toLowerCase()}`
                        },
                        dataIndex === 'email' && {
                            type: 'email',
                            message: 'Please enter a valid email'
                        }
                    ].filter(Boolean)}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const ManageUsers = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [searchText, setSearchText] = useState('');
    const { usersList, loading } = useSelector(state => state.users);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fetch users on component mount
    useEffect(() => {
        dispatch(readUsers());
    }, [dispatch]);

    // Format user data when received
    useEffect(() => {
        if (usersList) {
            try {
                const formattedList = usersList.result?.map((user, index) => ({
                    key: user.id || index.toString(),
                    ...user
                })) || [];
                setData(formattedList);
            } catch (err) {
                console.error("Error processing user data:", err);
                message.error('Failed to load user data');
            }
        }
    }, [usersList]);

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex(item => key.key === item.key);

            if (index > -1) {
                console.log(row)
                console.log(key)

                dispatch(updateUser({data:row,id:key.id})).then(action => {
                    action.error?
                        message.error(action.payload.message):
                        message.success(action.payload.message).then(()=>{
                            const item = newData[index];
                            newData.splice(index, 1, { ...item, ...row });
                            setData(newData);
                            setEditingKey('');
                        })
                })
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
                message.success('User added successfully');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
            message.error('Failed to save changes');
        }
    };

    const handleDelete = (key) => {
        const newData = data.filter(item => item.key !== key);
        setData(newData);
        message.success('User deleted successfully');
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const filteredData = data.filter(item =>
        Object.values(item).some(
            val => val?.toString().toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const actionColumn = {
        title: 'Actions',
        dataIndex: 'actions',
        width: '15%',
        fixed: 'right',
        render: (_, record) => {
            const editable = isEditing(record);
            return (
                <Space size="middle">
                    {editable ? (
                        <>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={() => save(record)}
                                size="small"
                            />
                            <Button
                                icon={<CloseOutlined />}
                                onClick={cancel}
                                size="small"
                            />
                        </>
                    ) : (
                        <>
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => edit(record)}
                                size="small"
                                disabled={editingKey !== ''}
                            />
                            <Popconfirm
                                title="Delete this user?"
                                onConfirm={() => handleDelete(record.key)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    icon={<DeleteOutlined />}
                                    danger
                                    size="small"
                                    disabled={editingKey !== ''}
                                />
                            </Popconfirm>
                        </>
                    )}
                </Space>
            );
        },
    };

    const mergedColumns = TABLE_COLUMNS.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'role' ? 'select' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <SectionHeader
                title="User Management"
                description="Manage all platform users and their permissions"
            />

            <Card
                bordered={false}
                className="user-management-card"
                extra={
                    <Space>
                        <Input.Search
                            placeholder="Search users..."
                            onSearch={handleSearch}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ width: 250 }}
                            allowClear
                        />
                        <Button
                            type="primary"
                            icon={<UserAddOutlined />}
                            onClick={() => {navigate('/new_user')}}
                        >
                            Add User
                        </Button>
                    </Space>
                }
            >
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: { cell: EditableCell },
                        }}
                        bordered
                        dataSource={filteredData}
                        columns={[...mergedColumns, actionColumn]}
                        rowClassName="editable-row"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50'],
                            showTotal: (total) => `Total ${total} users`
                        }}
                        scroll={{ x: 1200 }}
                        sticky
                    />
                </Form>
            </Card>
        </div>
    );
};

export default ManageUsers;