
import { RxCaretDown } from "react-icons/rx";
import { RxCaretUp } from "react-icons/rx";

export const DropdownButton = ({ title, isDropdownOpen, toggleDropdown }) => {
  return (
    <div>
      <div className="text-sm">
        <button onClick={() => toggleDropdown()} className='text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg px-2 py-1 text-center inline-flex items-center'>
          <span className="flex items-center justify-between space-x-2">
            <span className="text-white w-32">{title}</span>
            <span>{isDropdownOpen ? <RxCaretUp /> : <RxCaretDown />}</span>
          </span>
        </button>
      </div>
    </div>
  );
};
