import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

const fetchEuropeCountries = async (): Promise<string[]> => {
	const europeAPIUrl = 'http://worldtimeapi.org/api/timezone/Europe';

	return new Promise(async (resolve, reject) => {
		const europeCountries = await fetch(europeAPIUrl);
		const europeCountriesJSON = await europeCountries.json();
		resolve(europeCountriesJSON);
	});
}

interface TimeZoneObj {
	[key: string]: string | number;
}

const fetchTimeZone = (country: string): Promise<TimeZoneObj> => {
	const timeZoneUrl = `http://worldtimeapi.org/api/timezone/${country}.json`;
	
	return new Promise(async (resolve, reject) => {
		const timeZone = await fetch(timeZoneUrl);
		const timeZoneJSON = await timeZone.json();
		resolve(timeZoneJSON);
	});
};

interface CountriesDropdownProps {
	options: string[]
}

const CountriesDropdown: React.FC<CountriesDropdownProps> = ({
	options
}) => {
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [timeZone, setTimeZone] = useState<TimeZoneObj>({});
	let interval: any;
	const interValTime = 5000;
	
	const updateTimeZone = async () => {
		if (selectedOption === null) return;
		const timeZone = await fetchTimeZone(selectedOption);
		setTimeZone(timeZone);
	}

	useEffect(() => {
		updateTimeZone();
		clearInterval(interval);
		interval = setInterval(updateTimeZone, interValTime);
	}, [selectedOption]);
	
	const onChange = (e: any) => {
		const country = e.target[e.target.selectedIndex].text;
		setSelectedOption(country);
		updateTimeZone();
	};

	const _options = options.map((option: string) => (
		<option key={ option }>{ option }</option>
	));

	return (
		<div>
			<select onChange={ onChange }>
				{ _options }
			</select>

			<div>
				{Object.keys(timeZone).map(key => 
					<div key={ key }>
						<p><b>{ key }</b>: { timeZone[key] }</p>
					</div>
				)}
			</div>
		</div>
	);
};

const App = () => {
	const [europeCountries, setEuropeCountries] = useState<string[]>([]);
	
	useEffect(() => {
		const x = async () => {
			const europeCountries = await fetchEuropeCountries();
			setEuropeCountries(europeCountries);
		}
	x();
}, []);

return (
	<div className="App">
		<div className="countries-dropdown-container">
			<CountriesDropdown options={ europeCountries }></CountriesDropdown>
		</div>
    </div>
  );
}

export default App;
