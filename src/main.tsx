import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import './global.scss';
import App from "./App";

import useSettingsLoader from "./hooks/Loaders/useSettingsLoader";
import useBoardsPersistence from "./hooks/useBoardsPersistence";
import useKanban, { Id, KanbanState } from "./hooks/useKanban";
import useGistAPI from "./hooks/useGistAPI";

import { initialSettings, Settings } from "./misc/settings";
import { loadBoardsFromLocalStorage } from "./misc/boards";

import SettingsContext from "./context/SettingsContext";
import BoardsContext from "./context/BoardsContext";
import GistAPIContext from "./context/GistAPIContext";
import { DialogProvider } from "./context/DialogContext";

export function AppRoot()
{
	const [settings, internal_setSettings] = useState<Settings>(initialSettings);
	const { saveSettingsToFile } = useSettingsLoader();

	// Lazy initializer: runs exactly once, synchronously, before the first render —
	// so useKanban never starts out empty and there's nothing left to "catch up" on later.
	const [initialBoardsState] = useState<KanbanState>(loadBoardsFromLocalStorage);
	const kanban = useKanban(initialBoardsState);
	const gistAPI = useGistAPI(kanban.state, kanban.loadState);

	useBoardsPersistence(kanban.state);

	const setSettings = (newSettings: Settings) =>
	{
		internal_setSettings(newSettings);
		saveSettingsToFile(newSettings);
	};

	return (
		<React.StrictMode>
			<SettingsContext.Provider value={{ settings, setSettings }}>
				<DialogProvider>
					<BoardsContext.Provider value={kanban}>
						<GistAPIContext.Provider value={gistAPI}>
							<App/>
						</GistAPIContext.Provider>
					</BoardsContext.Provider>
				</DialogProvider>
			</SettingsContext.Provider>
		</React.StrictMode>);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<AppRoot/>);