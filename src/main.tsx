import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import './global.scss';

import SettingsContext from "./context/SettingsContext";
import useSettingsLoader from "./hooks/Loaders/useSettingsLoader";
import { initialSettings, Settings } from "./misc/settings";

import App from "./App";
import BoardsContext from "./context/BoardsContext";
import { Board } from "./misc/boards";

export function AppRoot()
{
	const [settings, internal_setSettings] = useState<Settings>(initialSettings);
	const { saveSettingsToFile } = useSettingsLoader();

	const [boards, internal_setBoards] = useState<Board[]>([]);
	//const { saveBoardsToFile } = useSettingsLoader();

	const setSettings = (newSettings: Settings) =>
	{
		internal_setSettings(newSettings);
		saveSettingsToFile(newSettings);
	};

	const setBoards = (newBoards: Board[]) =>
	{
		internal_setBoards(newBoards);
		// saveBoardsToFile(newBoards);
	};

	return (
		<React.StrictMode>
			<SettingsContext.Provider value={{ settings, setSettings }}>
				<BoardsContext.Provider value={{ boards, setBoards }}>
					<App/>
				</BoardsContext.Provider>
			</SettingsContext.Provider>
		</React.StrictMode>);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<AppRoot/>);