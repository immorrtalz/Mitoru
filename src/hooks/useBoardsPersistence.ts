import { useEffect, useRef } from "react";

import { KanbanState } from "./useKanban";
import { saveBoardsToLocalStorage } from "../misc/boards";

export default function useBoardsPersistence(state: KanbanState)
{
	const hasHydratedRef = useRef(false);

	useEffect(() =>
	{
		if (!hasHydratedRef.current)
		{
			hasHydratedRef.current = true;
			return;
		}

		saveBoardsToLocalStorage(state);
	}, [state]);
}