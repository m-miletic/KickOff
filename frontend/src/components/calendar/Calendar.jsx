import React, { useContext, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CreateMatchModal } from "./CreateMatchModal";
import { fetchOrganizersTournament } from "../../service/tournamentService";
import { LoggedUserContext } from "../../context/LoggedUserContext";
import { fetchMatchesByTournament } from "../../service/matchService";
import classNames from "classnames";

export const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1100);
  const [isLegendModalOpen, setIsLegendModalOpen] = useState(false);

  const { decodedJwt } = useContext(LoggedUserContext);

  const [loadingTournament, setLoadingTournament] = useState(true);
  const [tournament, setTournament] = useState(null);

  const [events, setEvents] = useState([]); // FullCalendar events array
  const [loadingMatches, setLoadingMatches] = useState(false);

  const [selectedMatches, setSelectedMatches] = useState([]);
  const [isMatchesModalOpen, setIsMatchesModalOpen] = useState(false);

  const handleEventClick = (clickInfo) => {
    const { matches } = clickInfo.event.extendedProps;
    setSelectedMatches(matches);
    setIsMatchesModalOpen(true);
  };

  const handleDateClick = (arg) => {
    if (loadingTournament) {
      alert("Tournament data is loading, please wait");
      return;
    }

    const now = new Date();
    const clickedDate = new Date(arg.date);

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
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 1100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch tournament by organizer
  useEffect(() => {
    if (!decodedJwt) return;

    const fetchTournament = async () => {
      try {
        setLoadingTournament(true);
        const response = await fetchOrganizersTournament({ organizerId: decodedJwt.userId });
        setTournament(response);
      } catch (error) {
        console.error("Error fetching tournament:", error);
      } finally {
        setLoadingTournament(false);
      }
    };

    fetchTournament();
  }, [decodedJwt]);

  // Fetch matches after tournament loads
  useEffect(() => {
    if (!tournament) return;

    const loadMatches = async () => {
      try {
        setLoadingMatches(true);
        const response = await fetchMatchesByTournament(tournament.id);

        if (response.success && response.data) {
          const grouped = {};

          response.data.forEach((match) => {
            const dateKey = match.matchDate.slice(0, 10); // "YYYY-MM-DD"
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(match);
          });

          const mappedEvents = Object.entries(grouped).map(([date, matches]) => ({
            title: "See Matches",
            start: date,
            allDay: true,
            extendedProps: { matches },
          }));

          setEvents(mappedEvents);
        } else {
          console.error("Failed to fetch matches:", response.message);
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
        setEvents([]);
      } finally {
        setLoadingMatches(false);
      }
    };

    loadMatches();
  }, [tournament]);

  return (
    
    <div className="relative flex mx-2 my-6 sm:mx-10 sm:my-10 lg:mx-24 xl:mx-40 2xl:mx-60 transition-all text-[9px] sm:text-xs 2xl:text-sm min-h-[85vh]">

      {/* Sidebar legend only if wide screen */}
      {isWideScreen ? (
        <aside className="w-64 mr-6 p-4 bg-gray-100 rounded shadow-sm text-gray-700 text-xs sm:text-sm sticky top-6 self-start">
          <h3 className="font-semibold mb-3 text-gray-900">Calendar Actions</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Click anywhere on the date to create a new match</li>
            <li>Click on the <span className="font-bold">"See Matches"</span> to preview matches on that day</li>
            <li className="italic text-red-600">
              Note: Matches can't be created in the past or on the day of playing the match
            </li>
            <li className="italic text-red-600">
              Note: A stadium can host multiple matches, but there must be a 2-hour gap between them.
            </li>
          </ul>
        </aside>
      ) : (
        // Button that opens the legend modal on small screens
        <div className="mr-4">
          <button
            onClick={() => setIsLegendModalOpen(true)}
            className="mb-4 p-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          >
            Calendar Actions
          </button>

          {isLegendModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              onClick={() => setIsLegendModalOpen(false)}
            >
              <div
                className="bg-white p-6 rounded shadow-lg max-w-sm mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-semibold mb-3 text-gray-900 text-xl">Calendar Actions</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-base">
                  <li>Click anywhere on the date to create a new match</li>
                  <li>Click on the <span className="font-bold">"See Matches"</span> to preview matches on that day</li>
                  <li className="italic text-red-600">
                    Note: Matches can't be created in the past or on the day of playing the match
                  </li>
                  <li className="italic text-red-600">
                    Note: A stadium can host multiple matches, but there must be a 2-hour gap between them.
                  </li>
                </ul>
                <button
                  onClick={() => setIsLegendModalOpen(false)}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={`${isModalOpen ? 'blur-sm pointer-events-none' : ''} flex-1`}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height={"85vh"}
          dateClick={handleDateClick}
          events={events}
          eventClick={handleEventClick}
          headerToolbar={{
            start: "dayGridMonth timeGridWeek timeGridDay",
            end: "today prev next"
          }}
          eventContent={(eventInfo) => {
            const matches = eventInfo.event.extendedProps.matches || [];
            return (
              <div className="flex flex-col items-center justify-center text-xs sm:text-sm bg-blue-400 p-1 rounded cursor-pointer">
                <span className="font-bold">See Matches</span>
                <span className="text-[10px] mt-1">{matches.length} match{matches.length > 1 ? "es" : ""}</span>
              </div>
            );
          }}
        />
      </div>

      {/* Modals */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <CreateMatchModal selectedDate={selectedDate} setIsModalOpen={setIsModalOpen} tournament={tournament} />
        </div>
      )}

      {isMatchesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-2">Matches on this day</h2>
            <ul className="space-y-2">
              {selectedMatches.map((match) => (
                <li key={match.id} className="border p-2 rounded">
                  <div>{match.name}</div>
                  <div className="text-sm text-gray-500">{new Date(match.matchDate).toLocaleString()}</div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div>Stadium:</div>
                    <div className="ml-2">{match.stadium.stadiumName}</div>
                  </div>
                </li>
              ))}
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setIsMatchesModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
