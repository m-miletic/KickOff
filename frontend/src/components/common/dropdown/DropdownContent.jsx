import React from "react";

const DropdownContent = ({ values, filterType, onSelect }) => {

  // ne smi bit role moze bit item jer se oco vise komponenti koristit
  return(
    <div className="text-white text-xs bg-[#001E28] rounded-lg py-2 mt-2 w-52 absolute">
      <ul>
        {values.map((value, index) => {
          return(
            <li
              key={index}
              className="py-1 hover:bg-[#005571] cursor-pointer rounded-lg px-2 ml-1"
              onClick={() => onSelect(filterType, value.value)}
              >
              {value.value}
            </li>
          );
        })}
      </ul>
    </div>  
  )
}
export default DropdownContent;