import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import './global.scss';

import SettingsContext from "./context/SettingsContext";
import useSettingsLoader from "./hooks/Loaders/useSettingsLoader";
import { initialSettings, Settings } from "./misc/settings";

import App from "./App";

export function AppRoot()
{
	const [settings, internal_setSettings] = useState<Settings>(initialSettings);
	const { saveSettingsToFile } = useSettingsLoader();

	const setSettings = (newSettings: Settings) =>
	{
		internal_setSettings(newSettings);
		saveSettingsToFile(newSettings);
	};

	return (
		<React.StrictMode>
			<SettingsContext.Provider value={{ settings, setSettings }}>
				<App/>
			</SettingsContext.Provider>
		</React.StrictMode>);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<AppRoot/>);