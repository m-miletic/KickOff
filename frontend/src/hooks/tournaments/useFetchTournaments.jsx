import { useEffect, useState } from "react"
import { fetchAllActiveTournaments, fetchAllUpcomingTournaments } from "../../service/tournamentService";


export const useFetchUpcomingTournaments = (pageNumber) => {

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
        const response = await fetchAllUpcomingTournaments(pageNumber);
        setTournaments(response.data);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    
    getTournaments();
  }, [pageNumber]);

  return { tournaments, setTournaments, loading, error };
};

export const useFetchActiveTournaments = (pageNumber) => {

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
        const response = await fetchAllActiveTournaments(pageNumber);
        setTournaments(response.data);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    
    getTournaments();
  }, [pageNumber]);

  return { tournaments, setTournaments, loading, error };
};




