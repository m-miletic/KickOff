import { useEffect, useState } from "react"
import { deleteTeamById, fetchAllTeams, fetchTeamsByTournament, getTeamByTeamRepresentative } from "../../service/teamService"
import { jwtDecode } from "jwt-decode";

export const useFetchTeams = ( filters ) => {
  const [teams, setTeams] = useState({
    teamsList: [],
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTeams = async () => {
      setLoading(true); // zbog mogućnosti promjene filtera, s obzirom da u finally bloku setam na false pa ako opet krene fetcha-at neće mi prikazivat "loading...""
      try {
        const response = await fetchAllTeams(filters);
        setTeams(response.data);
        setError(null);
      } catch (error) {
        console.error("useFetchTeamsHook Error -> Couldn't fetch teams");
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    getTeams();
  }, [filters]);

  return { teams, setTeams, loading, error };
};

export const useFetchTeamsByTournament = (tournamentId, page) => {
  console.log("CHECK: ", tournamentId)
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTeams = async () => {
      setLoading(true); // zbog mogućnosti promjene filtera, s obzirom da u finally bloku setam na false pa ako opet krene fetcha-at neće mi prikazivat "loading...""
      try {
        const response = await fetchTeamsByTournament(tournamentId, page);
        setTeams(response.data);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    getTeams();
  }, [tournamentId, page]);

  return { teams, loading, error };
};

export const useFetchTeamByTeamRepresentative = (representativeId) => {
  console.log("I'm in useFetchTeamByTeamRepresentative")
  const [team, setTeam] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if(!representativeId) {
      return
    }
    const getTeam = async () => {
      try {
        const response = await getTeamByTeamRepresentative(representativeId)
        setTeam(response.data)
      } catch (error) {
        console.log("Testing out - ", error.data.message)
        setErrorMessage(error.data.message)
      } 
    }

    getTeam()
  }, [representativeId])

  return { team, setTeam, errorMessage }
};




  export const useDeleteTeam = (id) => {
    useEffect(() => {
      const deleteTeam = async () => {
        try {
          const response = deleteTeamById(id);
        } catch (error) {
          console.error("useDeleteTeamHook Error -> Couldn't delete team")
        }
      }
      deleteTeam();
    }, []);
  }

  export const useCreateTeam = (teamObject) => {
    useEffect(() => {
      const createTeam = async () => {
        try {
          const response = createTeam(teamObject);
        } catch (error) {
          console.log("useCreateTeam hook Error -> Couldn't create a team")
        }
      }
      createTeam();
    }, []);
  } 
  