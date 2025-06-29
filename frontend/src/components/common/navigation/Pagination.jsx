import React, { useEffect, useState } from "react";

const Pagination = ({ 
  pagesBeforeToday,
  totalPages,
  selectedFilters,
  handleSelectFilter,
  navButtonStyle = 'text-white',
  totalPagesStyle = 'text-white',
  }) => {

    console.log("Pagination pages before today: ", pagesBeforeToday)

  const [currentPage, setCurrentPage] = useState(null);
  const [previousPage, setPreviousPage] = useState();
  const [nextPage, setNextPage] = useState();
  const [navigationNumbers, setNavigationNumbers] = useState([]);

  console.log("currentPage -> ", currentPage)

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


  useEffect(() => {
    if (pagesBeforeToday != null) {
      setCurrentPage(pagesBeforeToday)
      setPreviousPage(pagesBeforeToday-1)
      setNextPage(pagesBeforeToday+1)
    }
  }, [pagesBeforeToday])

  return(
    <nav>
      <ul className="inline-flex text-2xs sm:text-xs xl:text-lg mt-2">
        <li>
          <button disabled={currentPage === 1} onClick={() => handleNextPrev('prev')} className={`${navButtonStyle} flex items-center justify-center hover:text-xl 
          ${totalPages === 0 && 'hidden'}`}>
            Prev
          </button>
        </li>

        {navigationNumbers.map((num, index) => {
          return(
            <li key={index}>
              <button onClick={() => { handleSelectFilter('pageNumber', num); handleClickPageNumber(num); }} className={`${navButtonStyle} flex items-center justify-center bg-transparent
                hover:text-2xl  ${currentPage === num && ''}`}>
                {num}
              </button>
            </li>
          );
        })}

        <li>
          <button disabled={currentPage === totalPages} onClick={() => handleNextPrev('next')} className={`${navButtonStyle} flex items-center justify-center hover:text-xl 
           ${totalPages === 0 && 'hidden'}`}>
            Next
          </button>
        </li>
      </ul>
      <div className={`text-xs ml-1 mt-2`}>
        {totalPages > 0 && <span className={`${totalPagesStyle}`}>{currentPage}/{totalPages}</span>}
      </div>
    </nav>
  );
}
export default Pagination;