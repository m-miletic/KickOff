import { ImUsers } from "react-icons/im";
import { PiMicrosoftTeamsLogo } from "react-icons/pi";
import { MdOutlineLogout } from "react-icons/md";

export const adminSidebarItems = [
  {
    label: "Users",
    value: "users",
    icon: (
      <ImUsers className="text-gray-400 w-5 h-5" />
    ),  
  },
  {
    label: "Teams",
    value: "teams",
    icon: (
      <PiMicrosoftTeamsLogo className="text-gray-400 w-5 h-5" />
    ),  
  },
  {
    label: "Log Out",
    value: "logout",
    icon: (
      <MdOutlineLogout className="text-gray-400 w-5 h-5" />
    ),  
  }
];