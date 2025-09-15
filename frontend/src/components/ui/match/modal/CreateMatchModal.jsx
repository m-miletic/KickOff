import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { getStadiums } from "../../../../service/stadiumService";
import { createMatch } from "../../../../service/matchService";
import { toast } from "react-toastify";

const CreateMatchModal = ({ closeModal, teams, tournamentId, clickedDate, setMatches }) => {
  const [formData, setFormData] = useState({
    homeTeam: "",
    awayTeam: "",
    matchDate: clickedDate,
    stadium: "",
    tournamentId: tournamentId
  });
  const [stadiums, setStadiums] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await createMatch(formData);
      if (response.success) {
        setMatches((prevValues) => [
          ...prevValues,
          response.data
        ]);
        closeModal();
        toast.success("Match Created!", {
          autoClose: 2500
        });
      }
    } catch (error) {
      console.log("wd")
      setValidationErrors(error.response.data.message);
    }
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSetTime = (e) => {
    const {name, value} = e.target;
    setFormData((prevValues) => ({
      ...prevValues,
      matchDate: formData.matchDate.slice(0,11) + value
    }));
  };

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const response = await getStadiums();
        setStadiums(response.data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }

    fetchStadiums();
  }, []);

  useEffect(() => {
    const handleErrors = () => {
      let error = "";
      if(formData.homeTeam && formData.awayTeam && formData.homeTeam === formData.awayTeam) error = "Home team and away team must be different";
      setValidationErrors(error);
    }

    handleErrors();
  }, [formData]);

  console.log("ValidationErrors: ", validationErrors);

  return (
    <div className="absolute bg-gray-50 top-[100px] left-[35%] z-10 rounded-md pb-1">

      <div className="flex justify-between items-center space-x-36 px-4 pt-5">
        <div className="text-2xl font-bold">Create new match</div>
        <div onClick={closeModal} className="hover:bg-gray-200 p-2 rounded-md cursor-pointer"><IoMdClose /></div>
      </div>

      <div className="border p-2 m-4 max-h-[350px] min-w-[600px] overflow-y-auto text-lg">
        <form onSubmit={handleSubmitForm} className="space-y-3 py-3">

          <div>
            <label className="inline-block w-[225px] text-left ml-2 py-2">Home Team</label>
            <select 
              className="border-gray-300 w-[275px] ml-5 cursor-pointer"
              name="homeTeam"
              value={formData.homeTeam}
              onChange={handleChange}

            >
              <option>Choose home team</option>
              {teams.map((team) => {
                return (
                  <option key={team.id} value={team.id}>{team.teamName}</option>
                )
              })}
            </select>
          </div>

          <div>
            <label className="inline-block w-[225px] text-left ml-2 py-2">Away Team</label>
            <select 
              className="border-gray-300 w-[275px] ml-5 cursor-pointer"
              name="awayTeam"
              value={formData.awayTeam}
              onChange={handleChange}

            >
              <option>Choose away team</option>
              {teams.map((team) => {
                return (
                  <option key={team.id} value={team.id}>{team.teamName}</option>
                )
              })}
            </select>
          </div>

          <div>
            <label className="inline-block w-[225px] text-left ml-2 py-2">Stadium</label>
            <select 
              className="border-gray-300 w-[275px] ml-5 cursor-pointer"
              name="stadium"
              value={formData.stadium}
              onChange={handleChange}

            >
              <option>Choose a stadium</option>
              {stadiums.map((stadium) => {
                return (
                  <option key={stadium.id} value={stadium.id}>{stadium.stadiumName}</option>
                )
              })}
            </select>
          </div>

          <div>
            <label className="inline-block w-[225px] text-left ml-2 py-2">Time</label>
            <input
              className="border-gray-300 w-[100px] ml-5 cursor-pointer"
              type="time"
              name="matchDate"
              placeholder="Enter"
              value={formData.matchDate.slice(11, 16)}
              onChange={handleSetTime}
              required
            />
          </div>

          <div className="flex justify-between mt-8 ml-2 ">

            <div>
              <button
                type="submit"
                className={`${formData.homeTeam === formData.awayTeam ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"}  rounded-lg px-3 py-2 text-white font-bold`}
                disabled={formData.homeTeam === formData.awayTeam ? true : false}
              >
              Create
              </button>
            </div>
            
            <div>
              {validationErrors && (
                <p className="text-red-600 text-base pt-4 text-end mr-12">{validationErrors}</p>
              )}
            </div>

          </div>
        </form>
      </div>
      
    </div>
  );
}
export default CreateMatchModal;