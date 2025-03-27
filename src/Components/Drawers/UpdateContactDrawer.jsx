import {Button, Drawer, Space} from "antd";

// eslint-disable-next-line react/prop-types
const UpdateContactDrawer = ({data,open,setOpen}) => {
  return (
      <>
          <Drawer
              open={open}
              onClose={() => setOpen(false)}
              width={500}
              placement="top"
              extra={
                  <Space>
                      <Button onClick={() => setOpen(false)}>Cancel</Button>
                      <Button type="primary" onClick={() => console.log(data)}>
                          OK
                      </Button>
                  </Space>
              }
          >

              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>

          </Drawer>
      </>
  )
}

export default UpdateContactDrawer;