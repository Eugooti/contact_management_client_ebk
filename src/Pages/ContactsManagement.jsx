import  { useState, useEffect } from 'react';
import {
    Layout, Table, Drawer, Tag, Tabs, Input, Descriptions, Popover, Avatar,
    Button, Card, Grid, Skeleton, Empty, Space, Typography, Tooltip,
} from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    SearchOutlined,
    PlusOutlined,
    UnorderedListOutlined,
    AppstoreOutlined,
    EditFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { readContacts } from '../Redux/Reducers/contactsSlice';
import ContactCard from '../Components/cards/ContactCard';
import {LocationOn, PersonAdd} from '@mui/icons-material';
import AddressCard from "../Components/cards/AddressCard.jsx";
import AddressModal from "../Components/Modals/AddressModal.jsx";
import ContactModal from "../Components/Modals/ContactModal.jsx";
import UpdateContactDrawer from "../Components/Drawers/UpdateContactDrawer.jsx";

const { Content } = Layout;
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const ContactManagement = () => {
    const [selectedContact, setSelectedContact] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [sortedInfo, setSortedInfo] = useState({});
    const [viewMode, setViewMode] = useState('table');
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const screens = useBreakpoint();
    const [activeFabId, setActiveFabId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);


    const [openUpdateDrawer, setOpenUpdateDrawer] = useState(false);
    const handleFabToggle = (id) => (isActive) => {
        setActiveFabId(isActive ? id : null);
    };

    const { contacts, loading } = useSelector((state) => state.contacts);


    // Fetch contacts on mount
    useEffect(() => {
        dispatch(readContacts());
    }, [dispatch]);

    // Handle window resize for mobile detection
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const findName = (type, organization) => {
        let name;
        switch (type) {
            case 'Ministry':
            case 'Presidency':
            case 'Private':
                name = {
                    name: organization.name,
                    sector: organization.sector,
                };
                break;
            case 'Learning Institution':
                name = {
                    name: organization.name,
                    sector: 'Education',
                };
                break;
            case 'Commission':
                    name = {
                        name: organization.name,
                        sector: 'Government Checker',
                    };
                    break;
            case 'County':
                    name = {
                        name: organization.county,
                        sector: 'County',
                    };
                    break;
            case 'Board':
            case 'Parastatal':
                name = {
                    name: organization.name,
                    sector: organization.stateDepartment.name,
                }
                break;
            case "State Department":
                name = {
                    name: organization.name,
                    sector: 'State Department',
                }
                break;
            default:
                name = { name: organization.name, sector: organization.sector };
        }
        return name;
    };

    // Format contact data with null checks
    const [contactData, setContactData] = useState([]);

    useEffect(() => {
        if (contacts?.result) {
            const data = contacts.result
                .map((item, index) => ({
                    id: index + 1,
                    ...item,
                    type: item.contactType,
                    name: findName(item.contactType, item.organization).name || 'N/A',
                    sector: findName(item.contactType, item.organization).sector || 'N/A',
                    country: item.organization?.country || 'N/A',
                    avatarColor: getAvatarColor(item.contactType),
                    city: item.organization?.city || 'N/A',
                    contactList: item.ContactList.map((cont) => ({
                        id: cont.id,
                        salutation: cont.salutations,
                        name: cont.contactPerson.full_name,
                        profession: cont.contactPerson.profession,
                        Office: cont.office,
                        type: cont.type,
                        email: cont.email,
                        phoneNumber: cont.phone_number,
                        organization: findName(item.contactType, item.organization).name,
                        country: item.organization?.country,
                        city: item.organization?.city,
                        postalCode: item.organization.postalCode
                    })),
                }))
                .sort((a, b) => a.name.localeCompare(b.name));

            setContactData(data)
        }
    }, [contacts]);

    // Get avatar color based on contact type
    const getAvatarColor = (type) => {
        switch (type) {
            case 'Ministry': return '#ee8c1e';
            case 'Presidency': return '#934949';
            case 'Private': return '#ee1ede';
            case 'State Department': return '#79ee1e';
            case 'Parastatal': return '#1eee70';
            case 'County': return '#e1ee1e';
            case 'Learning Institution': return '#7e0a37';
            case 'Commission': return '#8f1eee';
            case 'Board': return '#1eb8ee';
            default: return '#bfbfbf';
        }
    };
    // Filter contacts based on search query and active tab with proper grouping
    const filteredData = contactData.filter((item) => {
        const query = searchQuery.toLowerCase();

        // Check if the name or type matches the query
        const matchesMainFields =
            item.name.toLowerCase().includes(query) ||
            item.type.toLowerCase().includes(query);

        // Check if any contact person's name matches the query
        const matchesContactList = item.contactList.some(contact =>
            contact.name.toLowerCase().includes(query)
        );

        return (activeTab === 'all' || item.type === activeTab) && (matchesMainFields || matchesContactList);
    });


    // Table columns definition
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
            render: (text, record) => (
                <Space>
                    <Avatar
                        style={{ backgroundColor: record.avatarColor }}
                        icon={record.type === 'Ministry' ? <UserOutlined /> : <TeamOutlined />}
                    />
                    <Text strong>{text}</Text>
                </Space>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (text) => (
                <Tag color={getAvatarColor(text)} style={{ borderRadius: '8px' }}>
                    {text.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Sector',
            dataIndex: 'sector',
            key: 'sector',
            render: (text) => <Tag color="geekblue">{text}</Tag>,
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            sorter: (a, b) => a.country.localeCompare(b.country),
        },
        {
            title: 'City',
            dataIndex: 'city',
            key: 'city',
        },
    ];


    // Render contacts based on view mode
    const renderContacts = () => {
        if (loading) {
            return <Skeleton active paragraph={{ rows: 8 }} />;
        }

        if (filteredData.length === 0) {
            return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No contacts found" />;
        }

        if (viewMode === 'table') {
            return (
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    onChange={(pagination, filters, sorter) => setSortedInfo(sorter)}
                    rowKey="id"
                    onRow={(record) => ({ onClick: () => setSelectedContact(record) })}
                    className="rounded-lg shadow-sm border border-gray-100"
                    scroll={{ x: true }}
                    pagination={{ pageSize: screens.xs ? 5 : 10 }}
                />
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredData.map((contact) => (
                    <Card
                        key={contact.id}
                        hoverable
                        onClick={() => setSelectedContact(contact)}
                        className="hover:shadow-lg transition-all duration-300"
                        style={{ padding: '16px' }}
                    >
                        <div className="flex items-center">
                            <Avatar
                                size={48}
                                style={{ backgroundColor: contact.avatarColor }}
                                icon={contact.type === 'Ministry' ? <UserOutlined /> : <TeamOutlined />}
                            />
                            <div className="ml-4 flex-1">
                                <Title
                                    level={5}
                                    className="mb-0"
                                    style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                                >
                                    {contact.name}
                                </Title>
                                <Space size={4} className="mt-2">
                                    <Tag color={'#1890ff'}>{contact.type}</Tag>
                                    {/*<Tag color="blue">{contact.sector}</Tag>*/}
                                </Space>
                            </div>

                        </div>
                        <div className="flex align-middle justify-center mt-4 gap-4">
                            <div className="flex items-center">
                                <LocationOn className="mr-2 text-gray-500" />
                                <Text ellipsis>{contact.country}</Text>
                            </div>
                            <div className="flex items-center">
                                <LocationOn className="mr-2 text-gray-500" />
                                <Text>{contact.city}</Text>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    };


    return (
        <Layout className="min-h-screen">
            <Content className="p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold">
                            Smart Contact Management
                        </h2>
                        <p className="text-blue-100 text-lg">
                            Centralized platform for managing all organizational contacts.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                            <Popover
                                content={
                                    <div className="flex flex-col gap-2">
                                        <Button block icon={<TeamOutlined />} onClick={() => navigate('/public')}>
                                            Public ORG
                                        </Button>
                                        <Button block icon={<TeamOutlined />} onClick={() => navigate('/private')}>
                                            Private ORG
                                        </Button>
                                    </div>
                                }
                                title="Select Contact Type"
                                trigger="click"
                            >
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<PlusOutlined />}
                                    className="h-12 px-8 text-lg shadow-md"
                                >
                                    Add New Contact
                                </Button>
                            </Popover>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <Input
                            size="large"
                            placeholder="Search contacts..."
                            prefix={<SearchOutlined />}
                            className="w-full md:w-96"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            allowClear
                        />
                        <div className="flex items-center gap-2">
                            <Button.Group>
                                <Button
                                    icon={<UnorderedListOutlined />}
                                    type={viewMode === 'table' ? 'primary' : 'default'}
                                    onClick={() => setViewMode('table')}
                                />
                                <Button
                                    icon={<AppstoreOutlined />}
                                    type={viewMode === 'card' ? 'primary' : 'default'}
                                    onClick={() => setViewMode('card')}
                                />
                            </Button.Group>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        className="mt-4"
                        items={[
                            { key: 'all', label: 'All Contacts' },
                            { key: 'Presidency', label: 'Presidency' },
                            { key: 'County', label: 'Counties' },
                            { key: 'Ministry', label: 'Ministries' },
                            { key: 'State Department', label: 'State Departments' },
                            { key: 'Parastatal', label: 'Parastatals' },
                            { key: 'Commission', label: 'Commissions' },
                            { key: 'Board', label: 'Boards' },
                            { key: 'Learning Institution', label: 'Learning Institutions' },
                            { key: 'Private', label: 'Private Institutions' },
                        ]}
                    />
                </div>

                {/* Render Contacts */}
                {renderContacts()}

                {/* Contact Details Drawer */}
                <Drawer
                    title={selectedContact?.name}
                    placement="right"
                    onClose={() => setSelectedContact(null)}
                    open={!!selectedContact}
                    width={isMobile ? '100%' : 600}
                    className="[&_.ant-drawer-header]:border-b-0"
                >
                    {selectedContact && (
                        <div className="space-y-6">
                            <div className='flex align-midle justify-end'>
                                <Tooltip title="Update Contact">
                                    <Button onClick={()=>setOpenUpdateDrawer(true)} color="cyan" variant="outlined" shape="circle" icon={<EditFilled />}/>
                                </Tooltip>
                            </div>
                            <div className="flex items-center mb-4">
                                <Avatar
                                    size={64}
                                    style={{ backgroundColor: selectedContact.avatarColor }}
                                    icon={ <TeamOutlined />}
                                />
                                <Title level={4} className="ml-4 mb-0">{selectedContact.name}</Title>
                            </div>
                            <Tabs
                                defaultActiveKey="profile"
                                items={[
                                    {
                                        key: "profile",
                                        label: "Profile",
                                        children: (
                                            <Descriptions column={1} bordered>
                                                <Descriptions.Item label="Type">
                                                    <Tag color={getAvatarColor(selectedContact.type)}>
                                                        {selectedContact.type.toUpperCase()}
                                                    </Tag>
                                                </Descriptions.Item>
                                                {selectedContact.type === 'Learning Institution'&&(
                                                    <>
                                                        <Descriptions.Item label="University Type">{selectedContact.organization.type}</Descriptions.Item>
                                                    </>
                                                )}
                                                {selectedContact.type === 'Private'&&(
                                                    <>
                                                        <Descriptions.Item label="Business Type">{selectedContact.organization.business}</Descriptions.Item>
                                                        <Descriptions.Item label="Sector">{selectedContact.organization.sector}</Descriptions.Item>
                                                    </>
                                                )}
                                                {selectedContact.type === 'State Department'||selectedContact.type === 'State Department'?(
                                                    <>
                                                        <Descriptions.Item label="Ministry">{selectedContact.organization.ministry.name}</Descriptions.Item>
                                                        <Descriptions.Item label="Mandate">{selectedContact.organization.mandate}</Descriptions.Item>
                                                    </>
                                                ):null}

                                                {selectedContact.type === 'Ministry'&&(
                                                    <>
                                                        <Descriptions.Item label="Sector">{selectedContact.organization.sector}</Descriptions.Item>
                                                        <Descriptions.Item label="Mandate">{selectedContact.organization.mandate}</Descriptions.Item>
                                                    </>
                                                )}
                                                {selectedContact.type === 'Presidency'&&(
                                                    <>
                                                        <Descriptions.Item label="Sector">{selectedContact.organization.sector}</Descriptions.Item>
                                                        <Descriptions.Item label="Mandate">{selectedContact.organization.mandate}</Descriptions.Item>
                                                    </>
                                                )}


                                                <Descriptions.Item label="Country">{selectedContact.country}</Descriptions.Item>
                                                {selectedContact.type === 'County'&&(
                                                    <>
                                                        <Descriptions.Item label="Capital">{selectedContact.organization.capital}</Descriptions.Item>
                                                        <Descriptions.Item label="County Code">{selectedContact.organization.countyCode}</Descriptions.Item>
                                                    </>
                                                )}

                                                <Descriptions.Item label={selectedContact.organization.head_position}>{`${selectedContact.organization.headPerson.salutations.join(',')} ${selectedContact.organization.headPerson.person.full_name}`}</Descriptions.Item>
                                                <Descriptions.Item label="City">{selectedContact.city}</Descriptions.Item>
                                                <Descriptions.Item label="Street">{selectedContact.organization.street}</Descriptions.Item>
                                                <Descriptions.Item label="Building">{selectedContact.organization.building}</Descriptions.Item>
                                                <Descriptions.Item label="Postal Address">{selectedContact.organization.postalCode}</Descriptions.Item>
                                            </Descriptions>
                                        )
                                    },
                                    {
                                        key: "contacts",
                                        label: "Contacts",
                                        children: (
                                            <>
                                                <div className="flex justify-end mb-3">
                                                    <Button onClick={() => setModalVisible2(true)} icon={<PersonAdd />} type="link">
                                                        Add Contact
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {selectedContact.people?.map((item, index) => (
                                                        <div key={index}>
                                                            <ContactCard
                                                                onFabToggle={handleFabToggle(item.id)}
                                                                isFabActive={activeFabId === item.id}
                                                                key={item.id}
                                                                data={item}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )
                                    },
                                    {
                                        key: "address",
                                        label: "Address",
                                        children: (
                                            <>
                                                <div className="flex align-middle justify-end">
                                                    <Button onClick={() => setModalVisible(true)} type="link">New Address</Button>
                                                </div>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {selectedContact?.address.map((item, index) => (
                                                        <div key={index}>
                                                            <AddressCard data={item} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )
                                    },
                                    {
                                        key: "contactPerson",
                                        label: "Contact Persons",
                                        children: <></> // Empty tab for now
                                    }
                                ]}
                            />
                        </div>
                    )}
                </Drawer>
            </Content>
            <AddressModal modalVisible={modalVisible} setModalVisible={setModalVisible} contactId={selectedContact?.id} />
            <ContactModal modalVisible={modalVisible2} setModalVisible={setModalVisible2} data={selectedContact} />
            <UpdateContactDrawer data={selectedContact} open={openUpdateDrawer} setOpen={setOpenUpdateDrawer} />
        </Layout>
    );
};

export default ContactManagement;
