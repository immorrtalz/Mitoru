import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import './global.scss';
import App from "./App";

import useSettingsLoader from "./hooks/Loaders/useSettingsLoader";
import useBoardsLoader from "./hooks/Loaders/useBoardsLoader";

import { initialSettings, Settings } from "./misc/settings";
import { Board } from "./misc/boards";

import SettingsContext from "./context/SettingsContext";
import BoardsContext from "./context/BoardsContext";

export function AppRoot()
{
	const [settings, internal_setSettings] = useState<Settings>(initialSettings);
	const { saveSettingsToFile } = useSettingsLoader();

	const [boards, internal_setBoards] = useState<Board[]>([]);
	const [currentBoardId, setCurrentBoardId] = useState(NaN);
	const { saveBoardsToLocalStorage } = useBoardsLoader();

	const setSettings = (newSettings: Settings) =>
	{
		internal_setSettings(newSettings);
		saveSettingsToFile(newSettings);
	};

	const setBoards = (newBoards: Board[]) =>
	{
		internal_setBoards(newBoards);
		saveBoardsToLocalStorage(newBoards);
	};

	return (
		<React.StrictMode>
			<SettingsContext.Provider value={{ settings, setSettings }}>
				<BoardsContext.Provider value={{ boards, setBoards, currentBoardId, setCurrentBoardId }}>
					<App/>
				</BoardsContext.Provider>
			</SettingsContext.Provider>
		</React.StrictMode>);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<AppRoot/>);