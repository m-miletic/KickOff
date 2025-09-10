import { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherWidget = ({ city, style = "" }) => {
  const [weather, setWeather] = useState(null);
  const apiKey = '9dd8473281d540aa81b192822252306'; // my WeatherAPI key

  useEffect(() => {
    axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`)
      .then(res => {
        setWeather(res.data);
      })
      .catch(err => console.error(err));
  }, [city]);
  

  if (!weather) return <p>Loading weather...</p>;

  return (
    <div className={style}>
      <h2 className="text-xl font-bold">Currently</h2>
      <h2 className="text-xl font-bold">{weather.location.name}</h2>
      <p className='text-lg'>{weather.current.condition.text}</p>
      <img src={weather.current.condition.icon} alt="Weather icon" className='block mx-auto' />
      <p className='text-lg'>{weather.current.temp_c}°C</p>

      <h3 className="mt-4 font-semibold">3-day forecast:</h3>
      <div className="flex justify-evenly mt-2">
      {weather.forecast.forecastday.map(day => {
        const dateObj = new Date(day.date);
        const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        return (
          <div key={day.date} className="text-center p-4 bg-white rounded shadow w-40">
            <p className="text-lg">{day.date.slice(5, 10)}</p> 
            <p className="text-lg font-medium">{weekday}</p> 
            <img src={day.day.condition.icon} alt={day.day.condition.text} className="mx-auto" />
            <p>{day.day.avgtemp_c}°C</p>
            <p className="text-base">{day.day.condition.text}</p>
          </div>
        );
      })}

      </div>
    </div>
  );
};

export default WeatherWidget;
