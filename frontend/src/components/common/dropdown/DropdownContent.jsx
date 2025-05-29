import React from "react";

const DropdownContent = ({ value, onSelect }) => {

  return(
    <div className="text-white text-xs bg-[#001E28] rounded-lg py-2 mt-2 w-52 absolute">
      <ul>
        {value.map((role, index) => {
          return(
            <li
              key={index}
              className="py-1 hover:bg-[#005571] cursor-pointer rounded-lg px-2 ml-1"
              onClick={() => onSelect('role', role)}
              >
              {role}
            </li>
          );
        })}
      </ul>
    </div>  
  )
}
export default DropdownContent;