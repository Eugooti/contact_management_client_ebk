import { Collapse, Button } from 'antd';

const { Panel } = Collapse;

// eslint-disable-next-line react/prop-types
const OrganizationDetailsPanel = ({ title, organization, setCurrentStep }) => {
    const renderInstitutionDetails = () => (
        <>
            {/* eslint-disable-next-line react/prop-types */}
            <DetailItem label="Institution Level" value={organization?.organizationData.institutionType} />
            {/* eslint-disable-next-line react/prop-types */}
            <DetailItem label="Institution Type" value={organization?.organizationData.type} />
            {/* eslint-disable-next-line react/prop-types */}
            <DetailItem label="Leadership Title" value={organization?.organizationData.head_position} />
        </>
    );

    return (
        <Panel header={`${title} Details`} key="1">
            <div className="space-y-4">
                {/* eslint-disable-next-line react/prop-types */}
                <DetailItem label="Organization" value={organization?.organizationData.name} />
                {title === "Learning Institution" && renderInstitutionDetails()}
            </div>
            <div className="flex justify-end mt-4">
                <Button onClick={() => setCurrentStep(0)} type="link" className="text-blue-500 hover:text-blue-700">
                    Update
                </Button>
            </div>
        </Panel>
    );
};

// eslint-disable-next-line react/prop-types
const DetailItem = ({ label, value }) => (
    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
        <span className="text-lg font-bold text-gray-700">{label}</span>
        <span className="text-lg font-semibold text-gray-900">{value}</span>
    </div>
);

export default OrganizationDetailsPanel;