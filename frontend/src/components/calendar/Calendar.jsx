import React, { useContext, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import CalendarLegend from "./CalendarLegend";
import timeGridPlugin from '@fullcalendar/timegrid'
import { fetchMatchesByTournament } from "../../service/matchService";
import { LoggedUserContext } from "../../context/LoggedUserContext";
import { fetchOrganizersTournament } from "../../service/tournamentService";
import ShowMatchesByDateModal from "../ui/match/modal/ShowMatchesByDateModal";
import CreateMatchModal from "../ui/match/modal/CreateMatchModal";
import { toast } from "react-toastify";
import WeatherWidget from "../weather/WeatherWidget";

export const Calendar = () => {
  const [matches, setMatches] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [filters, setFilters] = useState({
    fetchAll: true
  });
  const { decodedJwt } = useContext(LoggedUserContext);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showMatchesModal, setShowMatchesModal] = useState(false);
  const [clickedDateMatches, setClickedDateMatches] = useState([]);
  const [showCreateMatchModal, setShowCreateMatchModal] = useState(false);
  const [tournamentTeams, setTournamentTeams] = useState([]);
  const [clickedDate, setClickedDate] = useState("");
  
  // grupiranje utakmica koje imaju isti datum
  const handleGroupMatchesByDay = () => {
    let groupedMatchesObj = {};

    matches?.forEach((match) => {
      const date = match.matchDate.slice(0,10); // grupirat po danu, zanemarujući vrijeme utakmice

      if (!groupedMatchesObj[date]) {
        groupedMatchesObj[date] = [];
      }
      groupedMatchesObj[date].push(match);
    });

    let res = handleParseToEventObject(groupedMatchesObj);
    setCalendarEvents(res);
  }; 

  // Potrebno parsirat u format koji full calendar moze citat
  const handleParseToEventObject = (groupedMatchesObj) => {
    let eventObj = {};
    let objectEventsArray = [];
    for (const [date, matchesArray] of Object.entries(groupedMatchesObj)) {
      eventObj =
        {
          title: 'See Matches',
          date: date, 
          extendedProps: { 'matches': matchesArray },
          className: "cursor-pointer py-2 text-center hover:bg-blue-700"
        }   
        objectEventsArray.push(eventObj);
    }
    return objectEventsArray;
  };

  const handleEventClick = (info) => {
    setClickedDateMatches(info.event.extendedProps.matches);
    setShowMatchesModal(!showMatchesModal);
  };

  useEffect(() => {

    handleGroupMatchesByDay();
  }, [matches]);

  useEffect(() => {
    const fetchTournamentOfCurentlyLoggedUser = async () => {
      try {
        if (decodedJwt) {
          const response = await fetchOrganizersTournament(decodedJwt.userId);
          setTournament(response.data);
          setTournamentTeams(response.data.teams);
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    }

    fetchTournamentOfCurentlyLoggedUser();
  }, [decodedJwt]);

  useEffect(() => {
    const fetchTournamentMatches = async () => {
      try {
        if (tournament) {
          const response = await fetchMatchesByTournament(tournament.id, filters);
          setMatches(response.data.content);
        }
      } catch (error) {
        console.error("Error: ", error)
      }
    }

    fetchTournamentMatches();
  }, [tournament]);

  const handleDateClick = (arg) => {
    const date = new Date(arg.dateStr);
    const today = new Date();
    let dateString = arg.dateStr+"T"+"12:00";
  
    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      toast.error("Matches cannot be scheduled in the past!", {
        autoClose: 2500
      });
    } else if (arg.dateStr < tournament.startDate) {
      toast.error("Matches cannot be scheduled before tournaments start date!", {
        autoClose: 2500,
      });
    } else if (arg.dateStr > tournament.endDate) {
      toast.error("Matches cannot be scheduled after tournaments end date!", {
        autoClose: 2500,
      });
    } else if (date.getTime() === today.getTime()) {
      toast.error("Matches cannot be scheduled on the same day they are played!", {
        autoClose: 2500,
      });
    } else {
      setShowCreateMatchModal(true);
      setClickedDate(dateString);
    }
  };

  return (
    <div className="relative">
      <div className={`flex my-12 mx-20 ${ (showMatchesModal || showCreateMatchModal) && 'blur-sm'}`}>
        <CalendarLegend tournament={tournament} />
        <div className="w-full overflow-x-auto">
          <FullCalendar 
            plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
            initialView="dayGridMonth"
            headerToolbar={
              {
                start: 'timeGridDay dayGridMonth dayGridYear',
                center: 'title',
                end: 'prev next'
              }
            }
            events={calendarEvents}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
          />
        </div>
      </div>
      
      <div id="weather-widget" className="flex justify-center w-full">
        <WeatherWidget 
            city={"Split"}
            style="px-4 py-8 mt-8 bg-sky-100 rounded-lg shadow text-center w-[1300px] mx-80" 
        />  
      </div>


      {showMatchesModal && <ShowMatchesByDateModal matches={clickedDateMatches} setMatches={setMatches} setClickedDateMatches={setClickedDateMatches} closeModal={() => setShowMatchesModal(false)} /> }
      {showCreateMatchModal && <CreateMatchModal closeModal={() => setShowCreateMatchModal(false)} teams={tournamentTeams} tournamentId={tournament.id} clickedDate={clickedDate} setMatches={setMatches} /> }

    </div>
  );
};
