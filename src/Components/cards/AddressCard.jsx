import {
    Edit,
    House,
    LocalPostOfficeOutlined,
    LocationCityOutlined,
    LocationOn,
    Streetview
} from "@mui/icons-material";
import { Button, FloatButton, Tooltip } from "antd";
import { getFromSessionStorage, setSessionStorage } from "../../utils/SessionStorage/sessionStorage.js";
import { useState } from "react";
import AddressModal from "../Modals/AddressModal.jsx";
import { motion } from "framer-motion";

const AddressCard = ({ data }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleEdit = () => {
        setSessionStorage('address', data);
        setModalVisible(true);
    }

    const userRole = getFromSessionStorage('user')?.responseData;

    // Animation variants
    const cardVariants = {
        hover: { y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" },
        initial: { y: 0, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }
    };

    return (
        <>
            <motion.div
                className='bg-gradient-to-br from-blue-50 to-gray-50 h-auto rounded-xl p-4 border border-gray-200'
                initial="initial"
                whileHover="hover"
                variants={cardVariants}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className='flex align-middle justify-between mb-4'>
                    <div className='flex items-center gap-2'>
                        <LocationOn className="text-blue-500 text-2xl" />
                        <h1 className='text-xl font-bold text-gray-800'>{data.country}</h1>
                    </div>

                    {userRole?.role === "ADMIN" && (
                        <Tooltip title="Edit address" placement="top">
                            <motion.div
                                animate={{ opacity: isHovered ? 1 : 0.7 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Button
                                    style={{
                                        width: 40,
                                        height: 40,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: isHovered ? "#3b82f6" : "#e2e8f0",
                                    }}
                                    onClick={handleEdit}
                                    icon={<Edit className={isHovered ? "text-white" : "text-gray-600"} />}
                                    shape="circle"
                                />
                            </motion.div>
                        </Tooltip>
                    )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <div className='flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm'>
                        <div className="p-2 bg-blue-100 rounded-full">
                            <LocationCityOutlined className="text-blue-500" />
                        </div>
                        <div>
                            <p className='text-xs text-gray-500'>City</p>
                            <p className='text-md font-medium text-gray-700'>{data.city}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm'>
                        <div className="p-2 bg-green-100 rounded-full">
                            <Streetview className="text-green-500" />
                        </div>
                        <div>
                            <p className='text-xs text-gray-500'>Street</p>
                            <p className='text-md font-medium text-gray-700'>{data.street}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm'>
                        <div className="p-2 bg-amber-100 rounded-full">
                            <House className="text-amber-500" />
                        </div>
                        <div>
                            <p className='text-xs text-gray-500'>Building</p>
                            <p className='text-md font-medium text-gray-700'>{data.building}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm'>
                        <div className="p-2 bg-purple-100 rounded-full">
                            <LocalPostOfficeOutlined className="text-purple-500" />
                        </div>
                        <div>
                            <p className='text-xs text-gray-500'>Postal Code</p>
                            <p className='text-md font-medium text-gray-700'>{data.postalCode}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <AddressModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                contactId={data?.contact_id}
            />
        </>
    )
}

export default AddressCard;