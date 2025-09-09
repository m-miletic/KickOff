 import React, { useEffect, useState } from "react";
import { editMatch } from "../../../../service/matchService";

 const EditMatchForm = ({ match, closeEditForm, currentDateTime={currentDateTime} }) => {
  const [formData, setFormData] = useState({
    matchDate: match.matchDate,
    stadium: match.stadium.stadiumName || "",
    homeTeamGoals: match.homeTeamGoals ?? "",
    awayTeamGoals: match.awayTeamGoals ?? "",
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam
  });

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    const response = await editMatch(match.id, formData);
  };

  const handleChange = (e) => {
    const {name, value} = e.target;    
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  return(
    <div className="pb-8 mx-10">
      <h2 className="font-bold text-center pt-1 pb-3">Edit {match.name} match</h2>
      <form onSubmit={handleSubmitForm} className="space-y-2">

        <div>
          <label className="inline-block w-[150px] text-left">Date and Time</label>
          <input 
            type="datetime-local"
            name="matchDate"
            value={formData.matchDate}
            onChange={handleChange}
            className="border-gray-300 w-[200px] ml-5"
          />
        </div>

        {/* ode bi mora ic select */}
        <div>
          <label className="inline-block w-[150px] text-left">Stadium</label>
          <input 
            type="text"
            name="stadium"
            value={formData.stadium}
            onChange={handleChange}
            className="border-gray-300 w-[200px] ml-5"
          />
        </div>

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