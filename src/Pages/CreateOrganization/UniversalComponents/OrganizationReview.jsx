import {Button, Collapse, message} from "antd";
import {
    CaretRightOutlined,
    EnvironmentOutlined,
    HomeOutlined,
    MailOutlined,
    PhoneOutlined,
    ToolOutlined,
    UserOutlined
} from "@ant-design/icons";
import {motion} from "framer-motion";
import {getFromSessionStorage, removeSessionItem} from "../../../utils/SessionStorage/sessionStorage.js";
import SectionHeader from "../../../Components/Headings/SectionHeading.jsx";
import {useDispatch} from "react-redux";
import {createOrganization} from "../../../Redux/Reducers/contactsSlice.js";
import {useNavigate} from "react-router-dom";


// eslint-disable-next-line react/prop-types
const OrganizationReview = ({setCurrentStep}) => {
    const variants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    const organization = getFromSessionStorage("public")?getFromSessionStorage("public"):getFromSessionStorage("private")
    const Contacts = getFromSessionStorage("contacts")
    const Address = getFromSessionStorage("address")

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const handleSubmit = () => {
        const headOfficeContacts = organization?.HeadContacts.map((item) => ({
            name:organization.headName,
            Office:organization.organizationData.headTitle,
            profession:organization.profession,
            salutation:organization.headSalutation,
            ...item
        }))


        const cont=[...Contacts.organizationContact,...headOfficeContacts]

        // console.log(cont)

        const people = [...new Map(cont.map((item)=>[item.name,item])).values(),
        ].map((person)=>({
            full_name: person.name,
            profession:person.profession,
            salutation:person.salutation,
            Office:person.Office
        }))


        const formatData = {
            headquarters:Address.headquarters,
            organizationData:organization.organizationData,
            address:Address.address,
            people,
            Contact:cont
        }
        console.log(people);

        dispatch(createOrganization(formatData)).then(action=>{
            action.error?
                messageApi.error(action.payload.message):
                messageApi.success(action.payload.message).then(()=>{
                    removeSessionItem("public")
                    removeSessionItem("private")
                    removeSessionItem("address")
                    removeSessionItem("contacts")
                    navigate('/')
                })
        })

    }
    let title = "Unknown Organization"; // Default value

    switch (organization?.contactType) {
        case "Presidency":
            title = "Presidency Details";
            break;
        case "County":
            title = "County";
            break;
        case "Ministry":
            title = "Ministry";
            break;
        case "State Department":
            title = "State Department";
            break;
        case "Parastatal":
            title = "Parastatal";
            break;
        case "Commission":
            title = "Commission";
            break;
        case "Board":
            title = "Board";
            break;
        case "Learning Institution": // Fixed typo
            title = "Learning Institution";
            break;
        case "Private":
            title = "Private Organization";
            break;
        default:
            console.warn(`Unknown contactType: ${organization?.contactType}`);
    }

    // eslint-disable-next-line react/prop-types
    const DetailItem = ({ label, value }) => (
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
            <span className="text-lg font-bold text-gray-700">{label}</span>
            <span className="text-lg font-semibold text-gray-900">{value}</span>
        </div>
    );

    // Render institution-specific details if the title is "Learning Institution"
    const renderInstitutionDetails = () => {
        if (title === "Learning Institution") {
            return (
                <>
                    <DetailItem label={"Institution"} value={organization?.organizationData.name}/>
                    <DetailItem label="Institution Level" value={organization?.organizationData.institutionType} />
                    <DetailItem label="Institution Type" value={organization?.organizationData.type} />
                    <DetailItem label="Leadership Title" value={organization?.organizationData.head_position} />
                </>
            )
        }
        else if (title === "Presidency Details") {
            return (
                <>
                    <DetailItem label="Office" value={organization?.organizationData.name} />
                    <DetailItem label="Sector" value={organization?.organizationData.sector} />
                    <DetailItem label="Mandate" value={organization?.organizationData.mandate} />
                    <DetailItem label="Leadership Title" value={organization?.organizationData.head_position} />
                </>
            )
        }
        else if (title === "County") {
            return (
                <>
                    <DetailItem label="County" value={organization?.organizationData.county} />
                    <DetailItem label="Capital" value={organization?.organizationData.capital} />
                    <DetailItem label="County Code" value={organization?.organizationData.countyCode} />
                    <DetailItem label="Mandate" value={organization?.organizationData.mandate} />
                    <DetailItem label="Leadership Title" value={organization?.organizationData.head_position} />
                </>
            )
        }
        else if (title === "Ministry") {
            return (
                <>
                    <DetailItem label="Ministry" value={organization?.organizationData.name} />
                    <DetailItem label="Sector" value={organization?.organizationData.sector} />
                    <DetailItem label="Mandate" value={organization?.organizationData.mandate} />
                    <DetailItem label="Leadership Title" value={organization?.organizationData.head_position} />
                </>
            )
        }
        else if (title === "State Department") {
            return (
                <>
                    <DetailItem label="State Department" value={organization?.organizationData.name} />
                    <DetailItem label="Ministry" value={organization?.organizationData.ministry} />
                    <DetailItem label="Mandate" value={organization?.organizationData.mandate} />
                    <DetailItem label="Leadership Title" value={organization?.organizationData.head_position} />
                </>
            )
        }

        else if (title === "Parastatal") {
            return (
                <>
                    <DetailItem label="Parastatal" value={organization?.organizationData.name} />
                    <DetailItem label="State Department" value={organization?.organizationData.stateDepartment} />
                    <DetailItem label="Mandate" value={organization?.organizationData.mandate} />
                    <DetailItem label="Leadership Title" value={organization?.organizationData.head_position} />
                </>
            )
        }

        else if (title === "Commission") {
            return (
                <>
                    <DetailItem label="Commission" value={organization?.organizationData.name} />
                    <DetailItem label="Acronym" value={organization?.organizationData.acronym||"N/A"} />
                    <DetailItem label="Mandate" value={organization?.organizationData.mandate} />
                    <DetailItem label="Leadership Title" value={organization?.organizationData.head_position} />
                </>
            )
        }

        else if (title === "Board") {
            return (
                <>
                    <DetailItem label="Board" value={organization?.organizationData.name} />
                    <DetailItem label="State Department" value={organization?.organizationData.stateDepartment} />
                    <DetailItem label="Mandate" value={organization?.organizationData.mandate} />
                    <DetailItem label="Leadership Title" value={organization?.organizationData.head_position} />
                </>
            )
        }

        else if (title === "Private Organization"){
            return (
                <>
                    <DetailItem label="Organization Name" value={organization?.organizationData.name} />
                    <DetailItem label="Acronym" value={organization?.organizationData.acronym||"N/A"} />
                    <DetailItem label="Sector" value={organization?.organizationData.sector} />
                    <DetailItem label="Organization Type" value={organization?.organizationData.business} />
                    <DetailItem label="Leadership Title" value={organization?.organizationData.head_position} />
                </>
            )
        }

    };

    // eslint-disable-next-line react/prop-types
    const ContactCard = ({ item, index }) => (
        <div key={index} className="p-3 bg-white border rounded-lg hover:border-blue-200 transition-colors">
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                    <PhoneOutlined className="text-gray-400 text-sm" />
                    {/* eslint-disable-next-line react/prop-types */}
                    <span className="text-sm font-medium truncate">{item.phoneNumber}</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <MailOutlined className="text-gray-400 text-sm" />
                    {/* eslint-disable-next-line react/prop-types */}
                    <span className="text-sm font-medium truncate">{item.email}</span>
                </div>

                <div className="flex items-center gap-1.5 mt-1">
                    {/* eslint-disable-next-line react/prop-types */}
                    {item.type === "Home" ? (
                        <HomeOutlined className="text-gray-400 text-sm" />
                    ) : (
                        <ToolOutlined className="text-gray-400 text-sm" />
                    )}
                    {/* eslint-disable-next-line react/prop-types */}
                    <span className="text-xs text-gray-500 font-medium">{item.type}</span>
                </div>
            </div>
        </div>
    );

    const organizationHead = () => {

        return (
            <div className="space-y-4">
                {/* Compact Leadership Section */}
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <UserOutlined className="text-blue-600 text-lg" />
                    <div>
                        <p className="text-sm font-semibold">
                            {organization?.headSalutation?.join(', ')} {organization?.headName}
                        </p>
                        <p className="text-xs text-gray-500">{organization?.profession}</p>
                    </div>
                </div>

                {/* Dense Contact Grid */}
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2">
                    {organization?.HeadContacts?.map((item, index) => (
                        <ContactCard key={index} item={item} />
                    ))}
                </div>
            </div>
        );
    };

    const otherContacts = () => {
        return (
            <>
                <div className='grid md:grid-cols-2 gap-2'>
                    {Contacts.contacts.map((item, index) => (
                        <div className='flex flex-col bg-blue-50 p-2 gap-2 rounded-lg' key={index}>
                            <div  className="flex items-center gap-2 outline-1 outline-gray-300 rounded-lg p-2">
                                <UserOutlined className="text-blue-600 text-lg" />
                                <div>
                                    <p className="text-sm font-semibold">
                                        {/* eslint-disable-next-line react/prop-types */}
                                        {item?.salutation?.join(', ')} {item?.name}
                                    </p>
                                    {/* eslint-disable-next-line react/prop-types */}
                                    <p className="text-xs text-gray-500">{item?.Office}</p>
                                </div>
                            </div>
                            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-2 mb-3'>
                                {/* eslint-disable-next-line react/prop-types */}
                                {item.contactDetails.map((item, index) => (
                                    <div key={index}>
                                        <ContactCard item={item} index={index} />
                                    </div>
                                ))}
                            </div>
                        </div>

                    ))}
                </div>
            </>
        )
    }


    // eslint-disable-next-line react/prop-types
    const OfficeAddress = ({ address }) => {
        return (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors">
                <div className="flex items-start gap-3 mb-2">
                    <EnvironmentOutlined className="text-blue-600 text-lg mt-1" />
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            {/* eslint-disable-next-line react/prop-types */}
                            <h3 className="text-base font-semibold">{address.name}</h3>
                            {/* eslint-disable-next-line react/prop-types */}
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{address.isHeadquarters?"Headquarters":"Branch"}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mt-2">
                            <div className="space-y-1">
                                {/* eslint-disable-next-line react/prop-types */}
                                <p className="text-sm font-medium">{address.city}</p>
                                <p className="text-sm text-gray-600">
                                    {/* eslint-disable-next-line react/prop-types */}
                                    {address.street}, {address.postalCode}
                                </p>
                                {/* eslint-disable-next-line react/prop-types */}
                                <p className="text-sm text-gray-600">{address.country}</p>
                                {/* eslint-disable-next-line react/prop-types */}
                                <p className="text-sm text-gray-600">{address.building}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
  return (
      <>
          {contextHolder}
          <motion.div
              key="step3"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
          >
              <div className="pt-5">
                  <SectionHeader
                      title="Organizations Review"
                      description="Review the organization Profile and Contact Information."
                  />
                  <Collapse
                      accordion
                      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                  >
                      <Collapse.Panel header={`${title}'s Details`} key="1">
                          <div className="grid md:grid-cols-2 gap-2">
                              {renderInstitutionDetails()}
                          </div>
                          <div className="flex justify-end items-center">
                              <Button onClick={() => setCurrentStep(0)} type="link">
                                  Update
                              </Button>
                          </div>
                      </Collapse.Panel>
                      <Collapse.Panel header={`${organization?.organizationData.head_position}'s Details`} key="2">
                          {organizationHead()}
                          <div className="flex justify-end items-center">
                              <Button onClick={() => setCurrentStep(0)} type="link">
                                  Update
                              </Button>
                          </div>
                      </Collapse.Panel>
                      <Collapse.Panel header={`Other ${title}'s Contacts`} key="3">
                          {otherContacts()}
                          <div className="flex justify-end items-center">
                              <Button onClick={() => setCurrentStep(1)} type="link">
                                  Update
                              </Button>
                          </div>
                      </Collapse.Panel>

                      <Collapse.Panel header={`${title}'s Address`} key="4">
                          <div className='grid md:grid-cols-4 gap-3'>
                              {Address.Address.map((address, index) => (
                                  <div key={index}>
                                      <OfficeAddress address={address} />
                                  </div>
                              ))}
                          </div>

                          <div className="flex justify-end items-center">
                              <Button onClick={() => setCurrentStep(2)} type="link">
                                  Update
                              </Button>
                          </div>
                      </Collapse.Panel>


                  </Collapse>
                  <div className="flex justify-end items-center pt-5 gap-3">
                      <Button className="w-24" onClick={handleSubmit} type="primary">
                          Submit
                      </Button>
                  </div>
              </div>
          </motion.div>
      </>
  )
}
export default OrganizationReview