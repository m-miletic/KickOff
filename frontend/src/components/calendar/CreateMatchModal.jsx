import React, { useContext, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { LoggedUserContext } from "../../context/LoggedUserContext";
import { fetchOrganizersTournament } from "../../service/tournamentService";
import { fetchTeamsByTournament } from "../../service/teamService";
import { createMatch } from "../../service/matchService";
import { fetchStadiums } from "../../service/stadiumService";

export const CreateMatchModal = ({ selectedDate, setIsModalOpen, tournament }) => {
  console.log("Tour here- ", tournament)
  if (!tournament) {
    return <div>Loading tournament data...</div>;
  }

  const [teams, setTeams] = useState([])
  const [errors, setErrors] = useState({});

  const [stadiums, setStadiums] = useState([]);

  const [formData, setFormData] = useState({
    homeTeam: '',
    awayTeam: '',
    matchDate: selectedDate,
    stadium: '',
    tournamentId: tournament.id,
    time: '' // ako korisnik zeli nadodat detaljnije vrime utakmice
  });

  console.log("Selected Date: ", selectedDate)

  // dohvacanje timova po organizatoru na backendu nije moguce er Team nema vezu na User-a(organizatora)

  // backend API zahtjeva String 'ime turnira' zbog toga moram prvo dohvatit turnir po organizatoru 

  // sad mogu dohvatit timove po turniru

  useEffect(() => {
    if (!tournament) {
      console.log("tournament not defined yes wait and then fetch teams")
      return
    }
    const fetchTeams = async () => {
      const fetchTeamsObj = {
        tournamentName: tournament.tournamentName
      }
      try {
        const response = await fetchTeamsByTournament(fetchTeamsObj)
        setTeams(response)
      } catch (error) {
        console.log("error fetchTeams: ", error)
        throw error
      }
    }

    fetchTeams();
  }, [tournament]);


  useEffect(() => {
    const getStadiums = async () => {
      const response = await fetchStadiums();
      setStadiums(response)
    }

    getStadiums();
  }, []);

  console.log("stadiums: ", stadiums);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevValues) => {
      let updated = {
        ...prevValues,
        [name]: value
      };
  
      if (name === 'time' && prevValues.matchDate) {
        const [hours, minutes] = value.split(':');
        const baseDate = prevValues.matchDate.split('T')[0]; // "2025-06-13"
        updated.matchDate = `${baseDate}T${hours}:${minutes}:00`;
      }
  
      return updated;
    });
  };
  
  // prikazat u modalu u vrimenu odma nakon selektiranja an kalendaru t vrime pa ga modificirat po zelji
  const getTimeFromSelectedDate = (dateString) => {
    if (!dateString) return '';
    const timePart = dateString.split('T')[1];
    if (!timePart) return '';
    return timePart.slice(0, 5); 
  };

  const initialTime = getTimeFromSelectedDate(selectedDate);

  console.log("formData: ", formData)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!formData.homeTeam) validationErrors.homeTeam = "Must select a home team";
    if (!formData.awayTeam) validationErrors.awayTeam = "Must select an away team";

    if(formData.homeTeam && formData.awayTeam && formData.homeTeam === formData.awayTeam) validationErrors.awayTeam = "Home and away teams must be different"

    setErrors(validationErrors)

    if(Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await createMatch(formData)
      setIsModalOpen(false)
    } catch (error) {
      console.log("Failed to create match: ", error.message)
      setErrors({ general: error.response.data.message })
    }
  };

  console.log(errors)



  return(
    <div className="relative flex items-center justify-center bg-gray-100 text-black mx-8 px-6 w-[360px] sm:w-[400px] lg:w-[430px] xl:w-[440px] h-[45vh] rounded-md text-sm lg:text-base">

    <div className="flex justify-between items-center absolute top-4 pt-2 left-4 right-4 text-xl">
      <div>Create Match</div>
      <div className="hover:bg-gray-200 rounded-md px-1"><button onClick={() => setIsModalOpen(false)}><IoMdClose /></button></div>
    </div>

    <form onSubmit={handleSubmit} className="space-y-6 mt-12">

      <div>
        <div className="flex items-center">
          <label className="inline-block w-28 text-left mr-2 font-medium">Home Team</label>
          <select
            name="homeTeam"
            className="border border-gray-300 rounded px-2 py-1 text-sm w-56"
            value={formData.homeTeam}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.teamName}</option>
            ))}
          </select>
        </div>
        {errors.homeTeam && (
          <p className="text-red-600 text-xs mt-1 ml-[122px]">{errors.homeTeam}</p>
        )}
      </div>


      <div>
        <div className="flex items-center">
          <label className="inline-block w-28 text-left mr-2 font-medium">Away Team</label>
          <select
            name="awayTeam"
            className="border border-gray-300 rounded px-2 py-1 text-sm w-56"
            value={formData.awayTeam}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.teamName}</option>
            ))}
          </select>
        </div>
        {errors.awayTeam && (
          <p className="text-red-600 text-xs mt-1 ml-[122px]">{errors.awayTeam}</p>
        )}
      </div>

      <div>
        <div className="flex items-center">
          <label className="inline-block w-28 text-left mr-2 font-medium">Stadium</label>
          <select
            name="stadium"
            className="border border-gray-300 rounded px-2 py-1 text-sm w-56"
            value={formData.stadium}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select a stadium</option>
            {stadiums.map((stadium) => (
              <option key={stadium.id} value={stadium.id}>{stadium.stadiumName}</option>
            ))}
          </select>
        </div>
      </div>


      <div className="flex items-center">
        <label className="inline-block w-28 text-left mr-2 font-medium">Time</label>
        <input
          type="time"
          name="time"
          className="border border-gray-300 rounded px-2 py-1 text-sm w-56"
          onChange={handleInputChange}
          defaultValue={initialTime}
        />
      </div>


      <div className="flex justify-between items-center">
        <div>
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 rounded-lg px-2 py-1 text-white mt-4 "
          >
            Create
          </button>
        </div>
        <div className="ml-12">
          {errors.general && (
            <p className="text-red-600 text-xs mt-1">{errors.general}</p>
          )}
        </div>
      </div>

    </form>
    </div>

  );

}