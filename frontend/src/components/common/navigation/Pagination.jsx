import React, { useEffect, useState } from "react";

const Pagination = ({ 
  totalPages,
  initialPage,
  handleSelectFilter,
  navButtonStyle = 'text-white',
  totalPagesStyle = 'text-white',
  }) => {

  const [currentPage, setCurrentPage] = useState(1);
  const [paginationNumbers, setPaginationNumbers] = useState([]);

  // Kada se Pagination komponenta prvi put učita, prop initialPage još može biti undefined 
  // jer ga roditeljska komponenta postavlja tek nakon što dođe odgovor s backenda (asinkrono).
  // Zbog toga u dependency array dodajem initialPage – tako da se ovaj useEffect ponovo pokrene 
  // čim se initialPage promijeni i onda postavi currentPage i paginationNumbers na pravu vrijednost.
  useEffect(() => {
    handleSetInitialPagionationNumbers();
    setCurrentPage(initialPage);
    handleSelectFilter('page', initialPage);
  }, [initialPage]);

  const handleSetInitialPagionationNumbers = () => {
    const arrayRange = (start, stop, step) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (value, index) => start +index * step
      );

    let temp = [];
    if (initialPage <= 3 && totalPages <=3) {
      temp = arrayRange(1, totalPages, 1);
    } else if (initialPage < 3 && totalPages > 3) {
      temp = [1,2,3,totalPages];
    } else if (initialPage >= 3) {
      if (initialPage+2 === totalPages) {
        temp = [1, initialPage-1, initialPage, initialPage+1, totalPages];
      } else if (initialPage+3 === totalPages) {
        temp = [1, initialPage, initialPage+1, initialPage+2, totalPages];
      }
      temp = [1, initialPage-1, initialPage, initialPage+1, totalPages];
    }

    setPaginationNumbers(temp);
  };

  useEffect(() => {
    handleSetInitialPagionationNumbers();
  }, []);

  useEffect(() => {
    handleChangePaginationNumbers();
  }, [currentPage])

  const handleChangePaginationNumbers = () => {
    if (currentPage === totalPages) {
      let temp = [1, currentPage-3, currentPage-2, currentPage-1, currentPage];
      setPaginationNumbers(temp);
    } else if (currentPage === 1) {
      let temp = [currentPage, currentPage+1, currentPage+2, currentPage+3, totalPages];
      setPaginationNumbers(temp);
    } else if (currentPage === 2 && totalPages >= 3) {
      let temp = [1,2,3,4,totalPages];
      setPaginationNumbers(temp); 
    }
    else if (currentPage >= 3 && currentPage+2 <= totalPages) {
      let temp = [1, currentPage-1, currentPage, currentPage+1, totalPages];
      setPaginationNumbers(temp);
    }
  };

  const handleClickPaginationNumber = (clickedNumber) => {
    setCurrentPage(clickedNumber);
    handleChangePaginationNumbers();
  };

  const handleClickNextprevButtons = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      handleSelectFilter('page', currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      handleSelectFilter('page', currentPage - 1);
    }
  };

  return(
    <nav>
      <ul className="inline-flex text-2xs sm:text-xs xl:text-lg mt-2 bg-[#2b536c2c] w-96 py-5 px-12 rounded-3xl justify-between">
        <li>
          <button disabled={currentPage === 1} onClick={() => handleClickNextprevButtons('prev') } className={`${navButtonStyle} cursor-pointer flex items-center justify-center hover:text-xl 
          ${totalPages === 0 && 'hidden'}`}>
            Prev
          </button>
        </li>

        {paginationNumbers.map((num, index) => {
          return(
            <li key={index}>
              <button onClick={() => { handleSelectFilter('page', num); handleClickPaginationNumber(num); }} className={`${navButtonStyle} flex items-center justify-center bg-transparent
                hover:text-2xl  ${currentPage === num ? 'text-2xl' : ''}`}>
                {num}
              </button>
            </li>
          );
        })}

        <li>
          <button disabled={currentPage === totalPages} onClick={() => handleClickNextprevButtons('next')} className={`${navButtonStyle} cursor-pointer flex items-center justify-center hover:text-xl 
           ${totalPages === 0 && 'hidden'}`}>
            Next
          </button>
        </li>
      </ul>
      <div className={`text-base ml-1 mt-2`}>
        {totalPages > 0 && <span className={`${totalPagesStyle}`}>{currentPage}/{totalPages}</span>}
      </div>
    </nav>
  );
}
export default Pagination;