
import { useState } from "react";
import { RxCaretDown } from "react-icons/rx";
import { RxCaretUp } from "react-icons/rx";

export const DropdownButton = ({ items, onSelect, type, title }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

/*   console.log("type: ", type);
  {items.map((item) => {
    console.log("item.label: ", item.label);
    console.log("item.value: ", item.value);
  })} */

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <div>
        <button onClick={() => toggleDropdown()} className='text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg px-2 py-1 text-2xs text-center inline-flex items-center'>
          {isDropdownOpen ? (
            <>
              <span className="text-xs">{selectedItem !== "" ? selectedItem : title}</span>
              <RxCaretUp />
            </>
          ) : (
            <>
            <span className="text-xs">{selectedItem !== "" ? selectedItem : title}</span>
            <RxCaretDown />   
          </>
          )}
        </button>
      </div>

      {isDropdownOpen && (
        <div className="text-white text-xs p-2 my-1 rounded-lg bg-[#001E30] w-[150px] absolute z-30">
          {items && items.map((item) => {
            return(
              <div 
                key={item.value}
                onClick={() => {
                  onSelect(type, item.label)
                  setSelectedItem(item.label)
                  toggleDropdown()
                }} 
                className="p-1 hover:bg-[#005571] rounded-md cursor-pointer">
                <span className="">{item.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
