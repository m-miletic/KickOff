import React, { useContext, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CreateMatchModal } from "./CreateMatchModal";
import { fetchOrganizersTournament } from "../../service/tournamentService";
import { LoggedUserContext } from "../../context/LoggedUserContext";
import { deleteMatch, fetchMatchesByTournament } from "../../service/matchService";

import { IoCloseSharp } from "react-icons/io5";
import EditMatchModal from "../ui/match/form/EditMatchModal";
import DeleteMatchModal from "../ui/match/form/DeleteMatchModal";
import WeatherWidget from "../weather/WeatherWidget";
import CalendarLegend from "./CalendarLegend";

export const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [isCreateMatchModalOpen, setIsCreateMatchModalOpen] = useState(false);

  const { decodedJwt } = useContext(LoggedUserContext);

  const [loadingTournament, setLoadingTournament] = useState(true);
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState()

  const [events, setEvents] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  const [selectedMatches, setSelectedMatches] = useState([]);
  const [isMatchesModalOpen, setIsMatchesModalOpen] = useState(false);

  const [matchToEdit, setMatchToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState(null);

  const [individualMatchEvents, setIndividualMatchEvents] = useState([]);

  const [currentView, setCurrentView] = useState("dayGridMonth");


  const handleDatesSet = (arg) => {
    setCurrentView(arg.view.type);
  };
  
  const handleEditClick = (match) => {
    setMatchToEdit(match);
    setIsEditModalOpen(true);
  };

  // Replace this function in your code:
  const handleDeleteClick = (match) => {
    setMatchToDelete(match);  // <-- You need this state to hold the match to delete
    setIsDeleteModalOpen(true);  // <-- open the delete modal correctly
    setIsMatchesModalOpen(false); // optionally close the list modal when deleting
  };


  const handleEventClick = (clickInfo) => {
    const { matches, match } = clickInfo.event.extendedProps;
  
    if (matches) {
      // Multiple matches (dayGridMonth view)
      setSelectedMatches(matches);
      setIsMatchesModalOpen(true);
    } else if (match) {
      // Single match (week/day views)
      setSelectedMatches([match]); // wrap single match in an array
      setIsMatchesModalOpen(true);
    } else {
      setSelectedMatches([]);
      setIsMatchesModalOpen(false);
    }
  };
  

  const handleDateClick = (arg) => {
    if (loadingTournament) {
      alert("Tournament data is loading, please wait");
      return;
    }
    const now = new Date()
    const clickedDate = new Date(arg.date)

    if (clickedDate < now) {
      alert("You can create a match on day of the match or in the past.");
      return;
    }

    const dateObj = arg.date;
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = "00";

    const localDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    setSelectedDate(localDateTimeString);
    setIsCreateMatchModalOpen(true);
  };


  // Fetch tournament by organizer
  useEffect(() => {
    if (!decodedJwt) return;

    const fetchTournament = async () => {
      try {
        setLoadingTournament(true);
        const response = await fetchOrganizersTournament(decodedJwt.userId);
        console.log("fetchTournament Response: ", response)
        setTournament(response.data);
        setTeams(response.data.teams)
      } catch (error) {
        console.error("Error fetching tournament:", error);
      } finally {
        setLoadingTournament(false);
      }
    };

    fetchTournament();
  }, [decodedJwt]); // jer ce na prvi load stranice decodedJwt iz LocalStorage-a bit null

  // Fetch matches after tournament loads
  // prikazivanje meceva u kalendaru *************************** !!!
  useEffect(() => {
    if (!tournament) return;

    const loadMatches = async () => {
      try {
        setLoadingMatches(true);
        const response = await fetchMatchesByTournament(tournament.id);

        if (response.success && response.data) {
          const grouped = {}; // za grupirat Match objekte po date-u

          response.data.map((match) => {
            const dateKey = match.matchDate.slice(0, 10); // "YYYY-MM-DD" // micem ure jer cu grupirat po cilom danu a ne po satima, minutama...
            if (!grouped[dateKey]) {  // provjerava postoji li grouped array s ovim key-om, dakle array di cu pohranit sve meceve od tog datuma
              grouped[dateKey] = [] // ako nema stvori ga s tm datumom
            };
            grouped[dateKey].push(match); // nadodajem mec odgovarajucoj grupi meceva
          });


          const mappedGroupedEvents = Object.entries(grouped).map(([date, matches]) => ({ // Object.entries pretvara grouped objekt u key(date):value(matches) parove
            title: "See Matches",
            start: date,
            allDay: true,
            extendedProps: { matches },
          }));

          const mappedIndividualEvents = response.data.map((match) => ({
            id: match.id,
            title: match.name, 
            start: match.matchDate, // ode ne slice-am ko gore jer ocu grzpirat bas po uri
            allDay: false,
            extendedProps: { match },
          }));

          setEvents(mappedGroupedEvents);
          setIndividualMatchEvents(mappedIndividualEvents);
        } else {
          console.error("Failed to fetch matches:", response.message);
          setEvents([]);
          setIndividualMatchEvents([])
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
        setEvents([]);
        setIndividualMatchEvents([])
      } finally {
        setLoadingMatches(false);
      }
    };

    loadMatches();
  }, [tournament]);

  const today = new Date();
  today.setHours(0, 0, 0, 0); 


  return (
    
    <div className="relative flex mx-2 my-6 sm:mx-10 sm:my-10 lg:mx-16 xl:mx-20 2xl:mx-50 transition-all text-[9px] sm:text-xs 2xl:text-sm min-h-[85vh]">

      <CalendarLegend />
      <div className={`${isCreateMatchModalOpen ? 'blur-sm pointer-events-none' : ''} w-full`}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height={"85vh"}
          dateClick={handleDateClick}
          events={currentView === "dayGridMonth" ? events : individualMatchEvents}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          headerToolbar={{
            start: "dayGridMonth timeGridWeek timeGridDay",
            end: "today prev next"
          }}
          eventContent={(eventInfo) => {
            if (currentView === "dayGridMonth") {
              const matches = eventInfo.event.extendedProps.matches || [];
              return (
                <div className="flex flex-col items-center justify-center text-xs sm:text-sm bg-blue-400 p-1 rounded cursor-pointer">
                  <span className="font-bold">See Matches</span>
                  <span className="text-[10px] mt-1">{matches.length} match{matches.length > 1 ? "es" : ""}</span>
                </div>
              );
            } else {
              return (
                <div className="text-[9px] cursor-pointer">
                  <strong>{eventInfo.event.title}</strong>
                </div>
              );
            }
          }}
        />

        <div className="flex justify-center" id="weather-widget">
          <WeatherWidget city="Split" style="p-4 mt-8 bg-sky-100 rounded-lg shadow w-full text-center" />
        </div>
      </div>

      {isCreateMatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <CreateMatchModal selectedDate={selectedDate} setIsCreateMatchModalOpen={setIsCreateMatchModalOpen} tournament={tournament} />
        </div>
      )}

      {isMatchesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold mb-2">Matches on this day</h2>
              <button onClick={() => setIsMatchesModalOpen(false)} className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-md mb-2 mr-2"> <IoCloseSharp /></button>
            </div>
            <ul className="space-y-2">
              {selectedMatches.map((match) => (
                <li key={match.id} className="border p-2 rounded">
                  <div className="flex justify-start items-center">
                    <div>{match.name}</div>
                    {new Date() >= new Date(match.matchDate) ? (
                      <div className="ml-2">{match.homeTeamGoals} : {match.awayTeamGoals}</div>
                    ) : (
                      <div className="text-2xs text-gray-500 ml-2">No results yet</div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{new Date(match.matchDate).toLocaleString()}</div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div>Stadium:</div>
                    <div className="ml-2">{match.stadium.stadiumName}</div>
                  </div>
                  
                  {/* mogu minjat samo one koji su prosli */}
                  {new Date(match.matchDate) < today && (
                    <button
                      className="px-2 py-1 mt-2 bg-blue-500 text-white rounded"
                      onClick={() => handleEditClick(match)}
                    >
                      Edit
                    </button>
                  )}

                  {new Date(match.matchDate) > new Date() && (
                    <button
                      className="px-2 py-1 mt-2 ml-2 bg-red-600 text-white rounded"
                      onClick={() => handleDeleteClick(match)}
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>

          </div>
        </div>
      )}

    {isEditModalOpen && (
      <EditMatchModal
        match={matchToEdit}
        onClose={() => setIsEditModalOpen(false)}
        setSelectedMatches={setSelectedMatches}
        setEvents={setEvents}
      />
    )}


    {isDeleteModalOpen && (
      <DeleteMatchModal
        match={matchToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={async (id) => {
          try {
            await deleteMatch(id);

            setSelectedMatches((prev) => prev.filter((m) => m.id !== id));

            setEvents((prev) =>
              prev.map((event) => {
                if (!event.extendedProps.matches) return event;
                return {
                  ...event,
                  extendedProps: {
                    ...event.extendedProps,
                    matches: event.extendedProps.matches.filter((m) => m.id !== id),
                  },
                };
              })
            );
          } catch (err) {
            alert("Failed to delete match. Try again.");
            console.error(err);
          }
        }}
      />
    )}
    </div>
  );
};
