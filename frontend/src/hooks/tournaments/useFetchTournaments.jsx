import { useEffect, useState } from "react"
import { fetchAllTournaments } from "../../service/tournamentService";

export const useFetchTournaments = () => {
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
        const response = await fetchAllTournaments();
        setTournaments(response.data);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    
    getTournaments();
  }, []);

  return { tournaments, setTournaments, loading, error };
};
