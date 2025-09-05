import React, { useContext, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import CalendarLegend from "./CalendarLegend";
import timeGridPlugin from '@fullcalendar/timegrid'
import { fetchMatchesByTournament } from "../../service/matchService";
import { LoggedUserContext } from "../../context/LoggedUserContext";
import { fetchOrganizersTournament } from "../../service/tournamentService";
import ShowMatchesByDateModal from "./ShowMatchesByDateModal";

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
  const [matchesByDayWithTime, setMatchesByDayWithTime] = useState({});

  // grupiranje utakmica koje imaju isti datum
  const handleGroupMatchesByDay = () => {
    let groupedMatchesObj = {};

    matches.forEach((match) => {
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
          className: "cursor-pointer py-2 text-center"
        }   
        objectEventsArray.push(eventObj);
    }
    console.log("objectEventsArray: ", objectEventsArray)
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

  return (
    <div className="relative">
      <div className={`flex my-12 mx-20 ${showMatchesModal && 'blur-sm'}`}>
        <CalendarLegend />
        <div className="w-full">
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
            events={
              calendarEvents
            }
            eventClick={
              handleEventClick
            }
          />
        </div>
      </div>

      {showMatchesModal && <ShowMatchesByDateModal matches={clickedDateMatches} onClose={() => setShowMatchesModal(false)} /> }

    </div>
  );
};
