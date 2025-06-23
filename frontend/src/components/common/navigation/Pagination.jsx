import React, { useEffect, useState } from "react";

const Pagination = ({ totalPages, selectedFilters, handleSelectFilter }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [previousPage, setPreviousPage] = useState();
  const [nextPage, setNextPage] = useState();
  const [navigationNumbers, setNavigationNumbers] = useState([]);

  console.log("Pagination total pages: ", totalPages);

  const pagesArray = (start, stop, step) => {
    return Array.from(
      { length: (stop - start) / step + 1 },
      (value, index) => start + index * step
    );
  }

  const handleNextPrev = (direction) => {
    if (direction === 'next') {
      setPreviousPage(currentPage);
      if (nextPage === totalPages) {
        setNextPage(totalPages);
      } else {
        setNextPage(currentPage + 2);
      }
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev') {
      setNextPage(currentPage);
      if (previousPage === 1) {
        setCurrentPage(1);
      } else {
        setCurrentPage(previousPage);
      }
      setPreviousPage(previousPage - 1);
    } 
  };

  const handleSetNavigatioNumbers = () => {
    if (totalPages < 3) {
      setNavigationNumbers(pagesArray(1, totalPages, 1));
    } else if (previousPage === 1 || previousPage === undefined || previousPage === 0) {
        setNavigationNumbers(pagesArray(1, 3, 1));
    } else if (nextPage >= totalPages) {
        setNavigationNumbers(pagesArray(totalPages - 2, totalPages, 1));
    } else {
        setNavigationNumbers(pagesArray(previousPage, nextPage, 1));
    }
  };

  const handleClickPageNumber = (page) => {
    setCurrentPage(page); // setiranje triggera donji useEffect jer imam currentPage u dependency-u
    setPreviousPage(page - 1);
    setNextPage(page + 1);
  };

  useEffect(() => {
    handleSetNavigatioNumbers();
    handleSelectFilter('pageNumber', currentPage);
  }, [currentPage, selectedFilters.pageNumber, totalPages]);

  useEffect(() => {
    setPreviousPage(0);
    setCurrentPage(1);
    setNextPage(2);
  }, [selectedFilters.status, selectedFilters.timeCreated, selectedFilters.role])

  return(
    <nav>
      <ul className="inline-flex -space-x-px text-2xs sm:text-xs xl:text-sm mt-2">
        <li>
          <button disabled={currentPage === 1} onClick={() => handleNextPrev('prev')} className={`flex items-center justify-center w-12 xl:w-14 h-5 sm:h-6 xl:h-8 px-3 ms-0 leading-tight text-white bg-[#001E28] border border-e-0 border-gray-300 rounded-s-lg 
            ${currentPage === 1 ? 'opacity-50 cursor-default' : 'hover:bg-gray-700 hover:text-white'}
            ${totalPages === 0 && 'hidden'}
            `}>
            Prev
          </button>
        </li>

        {navigationNumbers.map((num, index) => {
          return(
            <li key={index}>
              <button onClick={() => { handleSelectFilter('pageNumber', num); handleClickPageNumber(num); }} className={`flex items-center justify-center w-10 h-5 sm:h-6 xl:h-8 leading-tight text-white bg-[#001E28] border border-gray-300 hover:bg-gray-700 hover:text-white ${currentPage === num && 'bg-gray-700'}`}>
                {num}
              </button>
            </li>
          );
        })}

        <li>
          <button disabled={currentPage === totalPages} onClick={() => handleNextPrev('next')} className={`flex items-center justify-center w-12 xl:w-14 h-5 sm:h-6 xl:h-8 px-4 leading-tight text-white bg-[#001E28] border border-gray-300 rounded-e-lg
           ${currentPage === totalPages ? 'opacity-50 cursor-default' : 'hover:bg-gray-700 hover:text-white'}
           ${totalPages === 0 && 'hidden'}
          `}>
            Next
          </button>
        </li>
      </ul>
      <div className="mt-2 text-black">
        {totalPages > 0 && <span>page {currentPage}/{totalPages}</span>}
      </div>
    </nav>
  );
}
export default Pagination;