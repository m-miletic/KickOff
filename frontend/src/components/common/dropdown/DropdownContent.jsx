import React from "react";

const DropdownContent = ({ values, onSelect }) => {
  return(
    <div className="text-white text-sm bg-[#001E28] rounded-lg py-2 mt-2 w-52 absolute z-30">
      <ul>
        {values.map((value) => {
          return(
            <li
              key={value.value}
              className="py-1 hover:bg-[#005571] cursor-pointer rounded-lg px-2 ml-1"
              onClick={() => onSelect(value.value)}
            >
              {value.label}
            </li>
          );
        })}
      </ul>
    </div>  
  )
}
export default DropdownContent;