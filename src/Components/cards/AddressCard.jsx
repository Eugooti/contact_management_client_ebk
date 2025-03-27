import {Edit, House, LocalPostOfficeOutlined, LocationCityOutlined, LocationOn, Streetview} from "@mui/icons-material";
import {Button, FloatButton} from "antd";
import {setSessionStorage} from "../../utils/SessionStorage/sessionStorage.js";
import {useState} from "react";
import AddressModal from "../Modals/AddressModal.jsx";

// eslint-disable-next-line react/prop-types
const AddressCard = ({data}) => {
    const [modalVisible, setModalVisible] = useState(false);


    const handleEdit = () => {
      setSessionStorage('address',data)
        setModalVisible(true);
    }

  return (
      <>
          <div className='bg-gradient-to-r from-gray-300 to-gray-100 h-auto rounded-lg p-2'>
              <div className='flex align-middle justify-between'>
                  <div className='flex flex-row align-middle justify-start mb-3'>
                      <LocationOn/>
                      {/* eslint-disable-next-line react/prop-types */}
                      <h1 className='text-xl font-bold'>{data.state}</h1>
                  </div>
                  <Button
                      style={{
                          width: 40,
                          height: 40,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                      }}
                      onClick={handleEdit}
                      icon={<Edit/>} shape={"round"}/>
              </div>

              <div className='flex flex-row align-middle justify-around'>
                  <div className='flex gap-2 flex-row align-middle justify-start mb-3'>
                      <LocationCityOutlined/>
                      {/* eslint-disable-next-line react/prop-types */}
                      <h1 className='text-lg font-serif'>{data.city}</h1>
                  </div>

                  <div className='flex gap-2 flex-row align-middle justify-start mb-3'>
                      <Streetview/>
                      {/* eslint-disable-next-line react/prop-types */}
                      <h1 className='text-lg font-serif'>{data.street}</h1>
                  </div>

                  <div className='flex gap-2 flex-row align-middle justify-start mb-3'>
                      <House/>
                      {/* eslint-disable-next-line react/prop-types */}
                      <h1 className='text-lg font-serif'>{data.building}</h1>
                  </div>

                  <div className='flex gap-2 flex-row align-middle justify-start mb-3'>
                      <LocalPostOfficeOutlined/>
                      {/* eslint-disable-next-line react/prop-types */}
                      <h1 className='text-lg font-serif'>{data.postalCode}</h1>
                  </div>

              </div>
          </div>
          {/* eslint-disable-next-line react/prop-types */}
          <AddressModal modalVisible={modalVisible} setModalVisible={setModalVisible} contactId={data?.contact_id} />

      </>
  )
}
export default AddressCard;