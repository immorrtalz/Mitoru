import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

import useSettingsLoader from "./hooks/Loaders/useSettingsLoader";

import Home from "./pages/Home";
import Kanban from "./pages/Kanban";
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
		{
			path: "kanban/:boardId",
			Component: Kanban
		},
		/* {
			path: "settings",
			Component: SettingsPage
		} */
	]);

	return <RouterProvider router={router}/>;
}

export default App;