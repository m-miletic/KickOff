import React, { useEffect, useState } from "react";
import Pagination from "../../common/navigation/Pagination";
import TeamCard from "./card/TeamCard";
import { fetchTeams } from "../../../service/teamService";

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    size: 4
  });
  const [totalPages, setTotalPages] = useState(null);

  const handleSelectFilter = (type, value) => {
    setFilters((prevValues) => ({
      ...prevValues,
      [type]: value
    }));
  };

  useEffect(() => {
    const getTeams = async () => {
      try {
        const response = await fetchTeams(filters);
        console.log("response: ", response)
        setTeams(response.data);
        setTotalPages(response.data.totalPages)
      } catch (error) {
        console.error("Error while fetching teams: ", error);
      }
    }

    getTeams();
  }, [filters]); 




  return (
    <div className="px-20 py-6">
      <div className="max-w-[750px] mx-auto">
        <div className="grid grid-cols-2 gap-6 mt-6">
          {teams?.content?.length > 0 &&
            teams?.content.map((team) => (
              <div key={team.id}>
                <TeamCard team={team} setTeams={setTeams} filters={filters} setTotalPages={setTotalPages} />
              </div>
            ))}
        </div>
  
        {teams?.content?.length > 0 ? (
          <div className="text-center mt-6">
            <Pagination
              totalPages={totalPages}
              handleSelectFilter={handleSelectFilter}
              navButtonStyle="text-black w-5 h-5 px-4 text-xl"
              totalPagesStyle="text-black mr-8"
            />
          </div>
        ) : (
          <div className="mt-6 text-lg">There is no created teams yet.</div>
        )}
      </div>
    </div>
  );
  
}
export default TeamList;