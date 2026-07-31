import { useParams } from "react-router";
import { useBoardsContext } from "../context/BoardsContext";
import { Id } from "./useKanban";

export default function useBoardFromRoute()
{
	const { boardId } = useParams<{ boardId: Id }>();
	const { state } = useBoardsContext();

	const board = boardId ? state.boards[boardId] : undefined;

	return { boardId, board };
}