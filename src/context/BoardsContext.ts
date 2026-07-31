import { createContext, useContext } from "react";
import useKanban from "../hooks/useKanban";

type KanbanApi = ReturnType<typeof useKanban>;

const BoardsContext = createContext<KanbanApi | null>(null);

export function useBoardsContext(): KanbanApi
{
	const value = useContext(BoardsContext);
	if (value === null) throw new Error("useBoardsContext must be used within <BoardsContext.Provider>");
	return value;
}

export default BoardsContext;