import { createBrowserRouter, Outlet, RouterProvider } from "react-router";

import Home from "./pages/Home";
import Kanban from "./pages/Kanban";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { TopBar } from "./components/TopBar";

function App()
{
	const router = createBrowserRouter([
		{
			Component: () =>
				<>
					<TopBar/>
					<Outlet/>
				</>,
			children: [
				{
					index: true,
					Component: Home // aka Boards
				},
				{
					path: "kanban/:boardId",
					Component: Kanban
				},
				{
					path: "settings",
					Component: SettingsPage
				},
				{
					path: "*",
					Component: NotFound
				}
			]
		}
	]);

	return <RouterProvider router={router}/>;
}

export default App;