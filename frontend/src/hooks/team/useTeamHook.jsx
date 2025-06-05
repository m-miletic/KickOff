import { useEffect, useState } from "react"
import { deleteTeamById, fetchAllTeams, fetchTeamsByTournament } from "../../service/teamService"

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

export const useFetchTeamsByTournament = ( filters ) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTeams = async () => {
      setLoading(true); // zbog mogućnosti promjene filtera, s obzirom da u finally bloku setam na false pa ako opet krene fetcha-at neće mi prikazivat "loading...""
      try {
        const response = await fetchTeamsByTournament(filters);
        setTeams(response.data);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    getTeams();
  }, [filters]);

  return { teams, loading, error };
};

/* export const useUpdateTeam = () => {
  useEffect(() => {
    const updateTeam = async () => {
      try {
        console.log("first")
      } catch (error) {
        console.log("useFetchTeamsHook Error -> Couldn't update team")
      }
    }
  }, []);
} */
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
  