import { useEffect, useState } from 'react';
import { Table, Input, Select, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { readMailMergeList } from "../../Redux/Reducers/mailMergeSlice.js";
import { downloadContactsAsCSV } from "../../utils/CSV/DownloadContact.js";

const { Option } = Select;

const MailMerge = () => {
    const dispatch = useDispatch();
    const { mailMergeList } = useSelector(state => state.mailMerge);
    const [dataSource, setDataSource] = useState([]);
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [filters, setFilters] = useState({
        contactType: null,
        position: null,
        searchText: '',
    });
    const [tableFilters, setTableFilters] = useState({});

    useEffect(() => {
        const formattedList = mailMergeList?.result?.data?.map((item) => ({
            key: item.no.toString(),
            ...item
        })) || [];
        setDataSource(formattedList);
    }, [mailMergeList]);

    useEffect(() => {
        dispatch(readMailMergeList());
    }, [dispatch]);

    // Handle table filter changes
    const handleTableChange = (pagination, filters, sorter) => {
        setTableFilters(filters);
    };

    // Get unique values for filter dropdowns
    const contactTypes = [...new Set(dataSource.map(item => item.contactType))];
    const positions = [...new Set(dataSource.map(item => item.position))];

    useEffect(() => {
        // Apply both form filters and table column filters
        const filtered = dataSource.filter(item => {
            // Apply form filters
            const formFilterMatch = (
                (filters.contactType ? item.contactType === filters.contactType : true) &&
                (filters.position ? item.position === filters.position : true) &&
                (filters.searchText ?
                    Object.values(item).some(val =>
                        val?.toString().toLowerCase().includes(filters.searchText.toLowerCase())
                    )
                    : true)
            );

            // Apply table column filters
            const tableFilterMatch = Object.entries(tableFilters).every(([key, value]) => {
                if (!value || value.length === 0) return true;
                return value.includes(item[key]);
            });

            return formFilterMatch && tableFilterMatch;
        });

        setFilteredDataSource(filtered);
    }, [dataSource, filters, tableFilters]);

    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
            sorter: (a, b) => a.no - b.no,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            filters: positions.map(pos => ({ text: pos, value: pos })),
            onFilter: (value, record) => record.position === value,
        },
        {
            title: 'Organization',
            dataIndex: 'organization',
            key: 'organization',
        },
        {
            title: 'Contact Type',
            dataIndex: 'contactType',
            key: 'contactType',
            filters: contactTypes.map(type => ({ text: type, value: type })),
            onFilter: (value, record) => record.contactType === value,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Postal Address',
            dataIndex: 'postalAddress',
            key: 'postalAddress',
        },
    ];

    return (
        <div className="p-4">
            <div className="flex flex-wrap gap-4 mb-4">
                <Select
                    placeholder="Filter by Contact Type"
                    allowClear
                    style={{ width: 200 }}
                    onChange={value => setFilters({...filters, contactType: value})}
                >
                    {contactTypes.map(type => (
                        <Option key={type} value={type}>{type}</Option>
                    ))}
                </Select>

                <Select
                    placeholder="Filter by Position"
                    allowClear
                    style={{ width: 200 }}
                    onChange={value => setFilters({...filters, position: value})}
                >
                    {positions.map(pos => (
                        <Option key={pos} value={pos}>{pos}</Option>
                    ))}
                </Select>

                <Input
                    placeholder="Search contacts..."
                    prefix={<SearchOutlined />}
                    style={{ width: 250 }}
                    onChange={e => setFilters({...filters, searchText: e.target.value})}
                />

                <Button
                    type="primary"
                    onClick={() => downloadContactsAsCSV(filteredDataSource)}
                >
                    Download Contacts
                </Button>
            </div>

            <Table
                dataSource={filteredDataSource}
                columns={columns}
                bordered
                pagination={{ pageSize: 10 }}
                rowKey="no"
                onChange={handleTableChange}
            />
        </div>
    );
};

export default MailMerge;