import { useEffect, useState } from "react"
import { fetchAllTournaments } from "../../service/tournamentService";

export const useFetchTournaments = ( filters ) => {
  const [tournaments, setTournaments] = useState({
    tournamentsList: [],
    totalPages: 0
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const getTournaments = async () => {
      setLoading(true);
      try {
        const response = await fetchAllTournaments(filters);
        setTournaments(response.data);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    
    getTournaments();
  }, [filters]);

  return { tournaments, setTournaments, loading, error };
};
