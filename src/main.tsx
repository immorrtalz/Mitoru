import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import './global.scss';
import App from "./App";

import useSettingsLoader from "./hooks/useSettingsLoader";
import useBoardsPersistence from "./hooks/useBoardsPersistence";
import useKanban, { KanbanState } from "./hooks/useKanban";

import { initialSettings, Settings } from "./misc/settings";
import { loadBoardsFromLocalStorage } from "./misc/boards";

import SettingsContext from "./context/SettingsContext";
import BoardsContext from "./context/BoardsContext";
import { DialogProvider } from "./context/DialogContext";
import { ContextMenuProvider } from "./context/ContextMenuContext";
import { TaskViewProvider } from "./context/TaskViewContext";
import { TagsViewProvider } from "./context/TagsViewContext";

export function AppRoot()
{
	const [settings, setSettings] = useState<Settings>(initialSettings);
	const { loadSettings } = useSettingsLoader(setSettings);

	const [initialBoardsState] = useState<KanbanState>(loadBoardsFromLocalStorage);
	const kanban = useKanban(initialBoardsState);

	useBoardsPersistence(kanban.state);

	useEffect(() => { loadSettings() }, []);

	return (
		<React.StrictMode>
			<SettingsContext.Provider value={{ settings, setSettings }}>
				<DialogProvider>
					<ContextMenuProvider>
						<BoardsContext.Provider value={kanban}>
							<TagsViewProvider>
								<TaskViewProvider>
									<App/>
								</TaskViewProvider>
							</TagsViewProvider>
						</BoardsContext.Provider>
					</ContextMenuProvider>
				</DialogProvider>
			</SettingsContext.Provider>
		</React.StrictMode>);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<AppRoot/>);