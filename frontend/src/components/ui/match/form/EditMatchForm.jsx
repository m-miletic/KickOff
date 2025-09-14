 import React, { useEffect, useState, useTransition } from "react";
import { editMatch } from "../../../../service/matchService";
import { getStadiums } from "../../../../service/stadiumService";
import { toast } from "react-toastify";

 const EditMatchForm = ({ match, setClickedDateMatches, closeEditForm, currentDateTime }) => {
  const [formData, setFormData] = useState({
    matchDate: match.matchDate,
    stadiumId: match.stadium.id || "",
    homeTeamGoals: match.homeTeamGoals ?? "",
    awayTeamGoals: match.awayTeamGoals ?? "",
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam
  });
  const [stadiums, setStadiums] = useState([]);
  const [validationErrors, setValidationErrors] = useState("");

  console.log("formData: ", formData);

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    try {
      const response = await editMatch(match.id, formData);
      setClickedDateMatches((prevValues) => 
        prevValues.map((m) => 
          m.id === match.id ? { ...m, ...response.data} : m
        )
      );
      if (response.success) {
        toast.success("Match edited!", {
          autoClose: 2500,
        });
      }
      closeEditForm();
      setValidationErrors("");
    } catch (error) {
      console.error(error);
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

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const response = await getStadiums();
        setStadiums(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStadiums();
  }, []);

  console.log("validationErrors: ", validationErrors);


  return(
    <div className="pb-8 mx-10">
      <h2 className="font-bold text-center pt-1 pb-3">Edit {match.name} match</h2>
      <form onSubmit={handleSubmitForm} className="space-y-2">

        <div className={`${ currentDateTime > match.matchDate ? "text-gray-400" : "" }`}>
          <label className="inline-block w-[150px] text-left">Date and Time</label>
          <input 
            type="datetime-local"
            name="matchDate"
            value={formData.matchDate}
            onChange={handleChange}
            className="border-gray-300 w-[200px] ml-5 cursor-pointer"
            disabled={currentDateTime > match.matchDate}
          />
        </div>

        <div className={`${ currentDateTime > match.matchDate ? "text-gray-400" : "" }`}>
          <label className="inline-block w-[150px] text-left">Stadium</label>
          <select
            name="stadiumId"
            type="number"
            value={formData.stadiumId}
            onChange={handleChange}
            className="border-gray-300 w-[200px] ml-5 cursor-pointer"
            disabled={currentDateTime > match.matchDate}
          >
            <option value="" disabled>Select stadium</option>
            {stadiums.map((stadium) => (
              <option key={stadium.id} value={stadium.id}>{stadium.stadiumName}</option>
            ))};

          </select>
        </div>

        {validationErrors && (
          <div>
            <p className="text-red-600 text-base">{validationErrors}</p>
          </div>
        )}

        <div className={`${ currentDateTime < match.matchDate ? "text-gray-400" : "" }`}>
          <label className="inline-block w-[150px] text-left">Home Team Goals</label>
          <input 
            type="number"
            name="homeTeamGoals"
            value={formData.homeTeamGoals}
            onChange={handleChange}
            className="border-gray-300 w-[75px] ml-5"
            disabled={currentDateTime < match.matchDate}
          /> 
        </div>

        <div className={`${ currentDateTime < match.matchDate ? "text-gray-400" : "" }`}>
          <label className="inline-block w-[150px] text-left">Away Team Goals</label>
          <input 
            type="number"
            name="awayTeamGoals"
            value={formData.awayTeamGoals}
            onChange={handleChange}
            className="border-gray-300 w-[75px] ml-5"
            disabled={currentDateTime < match.matchDate}
          /> 
          <button type="submit" className="ml-8 bg-blue-600 hover:bg-blue-700 px-4 py-1 text-white font-semibold mt-1 rounded-md">Submit</button>
          <button onClick={closeEditForm} className="ml-4 bg-gray-500 hover:bg-gray-600 px-4 py-1 text-white font-semibold mt-1 rounded-md">Cancel</button>
        </div>

        {currentDateTime < match.matchDate && (
          <div className="text-gray-400 text-sm">
            Can't edit match results until game has started
          </div>
        )}

      </form>
    </div>
  );
 }
 export default EditMatchForm;