
import { RxCaretDown } from "react-icons/rx";
import { RxCaretUp } from "react-icons/rx";

export const DropdownButton = ({ title, isDropdownOpen, toggleDropdown }) => {

  return (
    <div>
      <div>
        <button onClick={() => toggleDropdown()} className='text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg px-2 py-1 text-2xs text-center inline-flex items-center'>
          {isDropdownOpen ? (
            <span className="flex items-center justify-between space-x-2">
              <span className="text-white w-32 text-xs">{title}</span>
              <span><RxCaretUp /></span>
            </span>
          ) : (
            <span className="flex items-center justify-between space-x-2">
              <span className="text-white w-32 text-xs">{title}</span>
              <RxCaretDown />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
