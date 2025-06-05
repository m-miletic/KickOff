// ode bi triba neki key value pair
import { LuLayoutDashboard } from "react-icons/lu";
import { HiInboxArrowDown } from "react-icons/hi2";
import { ImUsers } from "react-icons/im";
import { PiMicrosoftTeamsLogo } from "react-icons/pi";
import { TbTournament } from "react-icons/tb";
import { MdOutlineLogout } from "react-icons/md";

export const ITEMS = [
  {
    label: "Dashboard",
    value: "dashboard",
    icon: (
      <LuLayoutDashboard className="text-gray-400 w-5 h-5" />
    ),  
  },
  {
    label: "Pending Requests",
    value: "recievedRequests",
    icon: (
      <HiInboxArrowDown className="text-gray-400 w-5 h-5" />
    ),  
  },
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
    label: "Tournaments",
    value: "tournaments",
    icon: (
      <TbTournament className="text-gray-400 w-5 h-5" />
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