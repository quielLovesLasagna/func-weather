import React from "react";
import { useFetchWeather } from "./useFetchWeather";

function getWeatherIcon(wmoCode) {
	const icons = new Map([
		[[0], "☀️"],
		[[1], "🌤"],
		[[2], "⛅️"],
		[[3], "☁️"],
		[[45, 48], "🌫"],
		[[51, 56, 61, 66, 80], "🌦"],
		[[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
		[[71, 73, 75, 77, 85, 86], "🌨"],
		[[95], "🌩"],
		[[96, 99], "⛈"],
	]);
	const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
	if (!arr) return "NOT FOUND";
	return icons.get(arr);
}

function formatDay(dateStr) {
	return new Intl.DateTimeFormat("en", {
		weekday: "short",
	}).format(new Date(dateStr));
}

export default function App() {
	const { location, setLocation, isLoading, displayLocation, weather } =
		useFetchWeather();

	return (
		<div className="app">
			<h1>Class Weather</h1>
			<Input location={location} onSetLocation={setLocation} />

			{isLoading && <p className="loader">Loading...</p>}

			{weather.weathercode && (
				<Weather weather={weather} location={displayLocation} />
			)}
		</div>
	);
}

function Input({ location, onSetLocation }) {
	return (
		<div>
			<input
				type="text"
				placeholder="Search location"
				value={location}
				onChange={(e) => onSetLocation(e.target.value)}
			/>
		</div>
	);
}

function Weather({ weather, location }) {
	const {
		temperature_2m_max: max,
		temperature_2m_min: min,
		time: dates,
		weathercode: codes,
	} = weather;

	return (
		<div>
			<h2>Weather {location}</h2>
			<ul className="weather">
				{dates.map((date, i) => (
					<Day
						date={date}
						max={max.at(i)}
						min={min.at(i)}
						code={codes.at(i)}
						key={date}
						isToday={i === 0}
					/>
				))}
			</ul>
		</div>
	);
}

function Day({ date, max, min, code, isToday }) {
	return (
		<li className="day">
			<span>{getWeatherIcon(code)}</span>
			<p>{isToday ? "Today" : formatDay(date)}</p>
			<p>
				{Math.floor(min)} &deg; &mdash; <strong>{Math.ceil(max)}&deg;</strong>
			</p>
		</li>
	);
}
