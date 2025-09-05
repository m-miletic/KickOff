import React from "react";
import { IoMdClose } from "react-icons/io";

const ShowMatchesByDateModal = ({ matches, onClose }) => {
  let matchesFormated = matches.map((match) => ({
    ...match,
    matchDate: `${match.matchDate.slice(8,10)}/${match.matchDate.slice(5,7)}/${match.matchDate.slice(2,4)} ${match.matchDate.slice(11,16)}`
  }));

  console.log("matchesFormated: ", matchesFormated);

  let newDate = new Date();
  let currentDateTime =
  `${String(newDate.getDay()).padStart(2, '0')}/${String(newDate.getMonth() + 1).padStart(2, '0')}/${String(newDate.getFullYear()).slice(2,5)} ${String(newDate.getHours())}:${String(newDate.getMinutes())}`;

  return(
    <div className="absolute bg-gray-50 top-[200px] left-[35%] z-10 rounded-md pb-1">

      <div className="flex justify-between items-center space-x-36 px-4 pt-5">
        <div className="text-2xl font-bold">Matches on this day</div>
        <div onClick={() => onClose()} className="hover:bg-gray-200 p-2 rounded-md cursor-pointer"><IoMdClose /></div>
      </div>

      <div className="border p-2 m-4 max-h-[300px] overflow-y-auto text-lg">
        {matchesFormated.map((match) => (
          <div id={match.id} className="mb-4">

            <div>
              <span className="font-bold">{match.name}</span>
              <span className="text-gray-400 font-semibold mx-5">No results yet</span>
            </div>

            <div>
              <span className="text-gray-400 font-semibold ">{match.matchDate}h</span>
            </div>

            <div>
              <span className="text-gray-400 font-semibold ">Stadion</span>
            </div>

            <div className="space-x-4">
              <button className="bg-red-600 hover:bg-red-700 px-2 py-1 text-white font-semibold mt-1 rounded-md">Delete</button>
              {currentDateTime >= match.matchDate && (
                <button className="bg-blue-600 hover:bg-blue-700 px-2 py-1 text-white font-semibold mt-1 rounded-md">Edit Result</button>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
export default ShowMatchesByDateModal;