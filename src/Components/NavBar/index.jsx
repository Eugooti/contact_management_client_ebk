import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react';
import dp from '../../assets/dp.jpg';
import {useDispatch} from "react-redux";
import {logout} from "../../Redux/Reducers/AuthSlice.js";
import {message} from "antd";
import {getFromSessionStorage, removeSessionItem} from "../../utils/SessionStorage/sessionStorage.js";
import {useNavigate} from "react-router-dom";

const ProfileDropdown = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const Logout = async () => {
        await dispatch(logout()).then((action) => {
            action.error?
                messageApi.error(action.payload.message):
                messageApi.success(action.payload.message).then(() => {
                    removeSessionItem('user')
                    removeSessionItem('authToken')
                    removeSessionItem('refreshToken')
                    navigate('/login')
                })
        })
    }

    const userRole = getFromSessionStorage('user')?.responseData

    const userNavigation = userRole.role==="ADMIN"? [
        { label: "Profile", onclick: () => console.log("Profile Clicked") },
        { label: "Manage Users", onclick: () => navigate('/manage_users') },
        { label: "Sign out", onclick: () => Logout() },
    ]:[
        { label: "Profile", onclick: () => console.log("Profile Clicked") },
        { label: "Sign out", onclick: () => Logout() },
    ]

    return (
        <div className="relative flex h-16 items-center justify-end">
            {contextHolder}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Menu as="div" className="relative">
                    <div>
                        <MenuButton className="relative flex cursor-pointer rounded-full bg-green-200 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <img
                                alt=""
                                src={dp}
                                className="size-10 rounded-full"
                            />
                        </MenuButton>
                    </div>
                    <MenuItems
                        transition
                        className="absolute bg-white right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                        {userNavigation.map((item, index) => (
                            <MenuItem key={index}>
                                <label
                                    onClick={item.onclick}
                                    className="block px-4 py-2 cursor-pointer rounded-lg text-sm text-gray-700 hover:bg-green-500 hover:text-white data-[focus]:outline-none"
                                >
                                    {item.label}
                                </label>
                            </MenuItem>
                        ))}
                    </MenuItems>
                </Menu>
            </div>
        </div>

    );
};

export default ProfileDropdown;
