const SectionHeader = ({ title, description }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
    </div>
);

export default SectionHeader;