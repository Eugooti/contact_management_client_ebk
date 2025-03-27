import {Avatar, Dropdown, Menu, Tabs} from "antd";
import {AndroidOutlined, AppleOutlined, TeamOutlined} from "@ant-design/icons";
import {LocationOn} from "@mui/icons-material";

const mockData = {
    name:"Ministry of Land",
    sector:"Natural Resources",
    mandate:"To manage and provide policies that could manage land resources of the citizens."
}

const ContactsDetails = () => {


  return (
      <>
          <div className='flex flex-row'>
              <div style={{height:'87vh'}} className="shadow-2xl w-56 rounded-xl ml-5 pt-5 bg-gray-400">
                  <div className='flex align-middle justify-between'>
                      <button className='bg-blue-700 w-20 h-8 text-white cursor-pointer rounded-r-2xl'>Back</button>
                      <Dropdown
                          overlay={
                              <Menu>
                                  <Menu.Item>
                                      <a
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          href="https://www.antgroup.com"
                                      >
                                          Add Contact
                                      </a>
                                  </Menu.Item>
                                  <Menu.Item>
                                      <a
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          href="https://www.aliyun.com"
                                      >
                                          Add Address
                                      </a>
                                  </Menu.Item>
                              </Menu>
                          }
                          trigger={["click"]}
                      >
                          <button className='border-2 border-blue-800 w-20 h-8 text-white cursor-pointer rounded-l-2xl'>Action</button>
                      </Dropdown>

                  </div>
                  <div className='flex align-middle justify-center'>
                      <Avatar size={80} icon={<TeamOutlined/>}/>
                  </div>
                  <div className='gap-3 pt-5 flex flex-col text-center align-middle justify-center'>
                      <label className='font-bold font-serif'>{mockData.name}</label>
                      <label className='font-medium font-serif'>{mockData.sector}</label>
                  </div>
                  <div className='pt-3 mx-4'>
                      <label className='font-bold font-serif'>Mandate:</label>
                      <p className='font-serif text-start'>{mockData.mandate}</p>
                  </div>
              </div>

              <div className='border-2 border-blue-800 w-full'>

                  <Tabs centered>
                      <Tabs.TabPane
                          tab={
                              <span>
                                Contacts
                              </span>
                          }
                          key="1"
                      >
                          Tab 1
                      </Tabs.TabPane>
                      <Tabs.TabPane
                          tab={
                              <span>
                                Addresses
                              </span>
                          }
                          key="2"
                      >
                          Tab 2
                      </Tabs.TabPane>
                  </Tabs>
              </div>

          </div>
      </>
  )
}

export default ContactsDetails;