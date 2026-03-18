import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

import useSettingsLoader from "./hooks/Loaders/useSettingsLoader";

import Home from "./pages/Home";
import SettingsPage from "./pages/Settings";

function App()
{
	const { loadSettingsFromFile } = useSettingsLoader();

	useEffect(() =>
	{
		loadSettingsFromFile();
	}, []);

	const router = createBrowserRouter([
		{
			index: true,
			Component: Home // aka Boards
		},
		/* {
			path: "kanban",
			Component: KanbanPage
		}, */
		{
			path: "settings",
			Component: SettingsPage
		}
	]);

	return <RouterProvider router={router}/>;
}

export default App;