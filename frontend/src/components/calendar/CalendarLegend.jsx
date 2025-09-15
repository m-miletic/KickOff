import React, { useEffect, useState } from "react";

const CalendarLegend = ({ tournament }) => {
  const [isDesktopView, setIsDesktopView] = useState(window.innerWidth >= 1100);
  const [showLegend, setShowLegend] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopView(window.innerWidth >= 1100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToForecast = () => {
    const element = document.getElementById("weather-widget")
    element?.scrollIntoView({
      behavior: 'smooth'
    })
  };

  return(
    <>
      {isDesktopView ? (
        <div>
          <aside className="w-80 mr-6 p-4 bg-gray-100 rounded shadow-sm text-gray-700 text-base top-6 self-start">
            <div className="text-xl font-bold pb-6 text-center mx-1">
              <div className="pb-3">{tournament?.tournamentName}</div>
              <div className="text-base flex justify-between">
                <div>Start Date: </div>
                <div>{tournament?.startDate}</div>
              </div>
              <div className="text-base flex justify-between">
                <div>End Date:</div>
                <div>{tournament?.endDate}</div>
              </div>
            </div>

            <h3 className="font-semibold mb-1 text-gray-900 text-lg">Calendar Actions</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Click on the calendars date field to create a new match for that date.</li>
              <li>Two teams can play a max of 2 matches against each other, with each team hosting one match</li>
              <li>Click on the <span className="font-bold">"See Matches"</span> button to preview, edit and delete matches for that day.</li>
              <li> Past matchs can't be deleted.</li>
              <li> Altering match results is available only after the scheduled match time.</li>
              <li className="italic text-red-600">
                Note: Matches can't be created in the past or on the day of playing the match.
              </li>
              <li className="italic text-red-600">
                Note: Matches can't be created outside the tournaments start and end dates.
              </li>
              <li className="italic text-red-600">
                Note: Be advised that match dates may only be modified at least 24 hours before the scheduled start time.
              </li>
              <li className="italic text-red-600">
                Note: A stadium can host multiple matches on the same date, but there must be a 2-hour gap between them.
              </li>
            </ul>
          </aside>

          <div>
            <button onClick={scrollToForecast} className="bg-sky-500 hover:bg-sky-600 px-3 py-2 text-white font-semibold rounded mt-6">Check Weather Forecast</button>
          </div>

        </div>
      ) : (
        // botun za legendu u malom ekranu
        <div className="mr-4">
          <button
            onClick={() => setShowLegend(true)}
            className="mb-4 p-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
          >
            Calendar Actions
          </button>

          {showLegend && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              onClick={() => setShowLegend(false)}
            >
              <div
                className="bg-white p-6 rounded shadow-lg max-w-sm mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-semibold mb-3 text-gray-900 text-xl">Calendar Actions</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Click anywhere on the date to create a new match</li>
                  <li className="font-medium text-gray-800">
                      Two teams can play a max of 2 matches against each other, with each team hosting one match
                  </li>
                  <li>Click on the <span className="font-bold">"See Matches"</span> to preview, edit and delete matches on that day</li>
                  <li>Altering match results is available only after the scheduled match time</li>
                  <li className="italic text-red-600">
                    Note: Matches can't be created in the past or on the day of playing the match
                  </li>
                  <li className="italic text-red-600">
                    Note: Be advised that match dates may only be modified at least 24 hours before the scheduled start time.
                  </li>
                  <li className="italic text-red-600">
                    Note: A stadium can host multiple matches, but there must be a 2-hour gap between them
                  </li>
                </ul>
                <button
                  onClick={() => setShowLegend(false)}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
export default CalendarLegend;